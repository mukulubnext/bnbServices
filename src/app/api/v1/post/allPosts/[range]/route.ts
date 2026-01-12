import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/sessions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if(!token){
    return NextResponse.json({status: "failed", message: "No token found"});
  }
  const decrypted = await decrypt(token);
  if (!decrypted) {
    return NextResponse.json({ status: "failed", message: "Invalid token" });
  }
  const userId = decrypted.id;
  const range = Number(req.nextUrl.searchParams.get("range"));
  if (Number.isNaN(range)) {
    return NextResponse.json({ status: "failed", message: "Invalid range" });
  }
  const from = range * 10 - 9;
  const to = range * 10;
  try {
    const posts = await prisma.posts.findMany({
      where: { userId: userId },
      select: {
        id: true,
        title: true,
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: to - from,
    });
    const total = await prisma.posts.count({
      where: { userId: userId },
    });
    console.log({
      status: "success",
      total: total,
      posts: posts,
      hasMore: to < total,
    })
    return NextResponse.json({
      status: "success",
      total: total,
      posts: posts,
      hasMore: to < total,
    });
  } catch {
    return NextResponse.json({
      status: "failed",
      message: "Something went wrong",
    });
  }
}
