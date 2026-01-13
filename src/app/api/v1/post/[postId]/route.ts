import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/sessions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ postId: string }> }
) {
  const postId = Number((await ctx.params).postId);
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ status: "failed", message: "Unauthroized" });
  }
  const decrypted = await decrypt(token);
  if (!decrypted) {
    return NextResponse.json({ status: "failed", message: "Invalid token" });
  }
  const userId = decrypted.id;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ status: "failed", message: "User not found" });
  }
  const post = await prisma.posts.findUnique({
    where: { id: postId, userId: userId, isDeleted: false },
    select: {
      id: true,
      title: true,
      description: true,
      details: true,
      quantity: true,
      budget: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!post) {
    return NextResponse.json({ status: "failed", message: "Post not found" });
  }
  return NextResponse.json({ status: "success", post: post });
}
