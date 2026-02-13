import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/sessions";
import { withRateLimit } from "@/lib/withRateLimit";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const limited = await withRateLimit(req, "read");
        if (limited) {
          return NextResponse.json({
            status: "failed",
            message: "Too many requests!, try again later",
          });
        }
  if (!token) {
    return NextResponse.json(
      { status: "failed", message: "Unauthorized" },
      { status: 401 },
    );
  }
  const decrypted = await decrypt(token);
  if (!decrypted) {
    return NextResponse.json(
      { status: "failed", message: "Invalid token" },
      { status: 401 },
    );
  }
  const userId = decrypted.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    return NextResponse.json(
      { status: "failed", message: "User not found" },
      { status: 404 },
    );
  }
  const offers = await prisma.offers.findMany({
    where: { userId: userId },
    orderBy: { createdAt: "desc"},
    select:{
        id: true,
        postId: true,
        userId: true,
        createdAt: true,
        post:{
            select:{
                id: true,
                userId: true,
                title: true,
                items: true,
            }
        }
    }
  });
  return NextResponse.json({ status: "success", offers });
}
