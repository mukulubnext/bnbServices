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
      details: true,
      quantity: true,
      budget: true,
      createdAt: true,
      updatedAt: true,
      category: true,
      offers: {
        select:{
          id: true,
          postId: true,
          createdAt: true,
          updatedAt: true,
          user:{
            select:{
              id: true,
              email: true,
              phone:true,
              companyName: true,
            }
          }
        },
        orderBy: {
          createdAt: "asc",
        }
      }
    },
  });
  if (!post) {
    return NextResponse.json({ status: "failed", message: "Post not found" });
  }
  return NextResponse.json({ status: "success", post: post });
}
