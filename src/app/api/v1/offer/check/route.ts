import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/sessions";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const reqBody = z.object({
    postId: z.number().min(1),
  });
  const { postId } = reqBody.parse(await req.json());
  if (!token) {
    return NextResponse.json(
      { status: "failed", message: "Unauthorized" },
      { status: 401 },
    );
  }
  const decrypted = await decrypt(token);
  if (!decrypted) {
    return NextResponse.json(
      { status: "failed", message: "Unauthorized" },
      { status: 401 },
    );
  }
  const user = await prisma.user.findUnique({
    where: { id: decrypted.id },
  });
  if (!user) {
    return NextResponse.json(
      { status: "failed", message: "Unauthorized" },
      { status: 401 },
    );
  }
  const post = await prisma.posts.findUnique({
    where: { id: postId },
  });
  if (!post) {
    return NextResponse.json({ status: "failed", message: "Post not found" }, {
      status: 404,
    });
  }
  const offer = await prisma.offers.findFirst({
    where: { postId: postId, userId: user.id },
    select:{
        id: true,
        postId: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        post: {
                select:{
                    id: true,
                    userId: true,
                }
            }
    }
  });
  return NextResponse.json({ status: "success", hasOffer: offer !== null, offer });
}
