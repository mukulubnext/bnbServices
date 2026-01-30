import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/sessions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ postId: string }> }
) {
  const postId = Number((await ctx.params).postId);

  const post = await prisma.posts.findUnique({
    where: { id: postId, isDeleted: false },
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      items: {
        where: { isDeleted: false },
        select: {
          id: true,
          category: {
            select:{
              name: true,
            }
          },
          categoryId: true,
          subCategory: true,
          quantity: true,
          budget: true,
          details: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });
  if (!post) {
    return NextResponse.json({ status: "failed", message: "Post not found" });
  }
  return NextResponse.json({ status: "success", post: post });
}
