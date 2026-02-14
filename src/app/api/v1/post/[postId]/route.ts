import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/sessions";
import { withRateLimit } from "@/lib/withRateLimit";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ postId: string }> },
) {
  const limited = await withRateLimit(req, "read");
        if (limited) {
          return NextResponse.json({
            status: "failed",
            message: "Too many requests!, try again later",
          });
        }
  const postId = Number((await ctx.params).postId);
  const token = req.cookies.get("token")?.value;
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
  const post = await prisma.posts.findUnique({
    where: { id: postId },
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      price: true,
      isFullfilled: true,
      clicks: true,
      userId: true,
      items: {
        where: { isDeleted: false },
        select: {
          id: true,
          category: {
            select: {
              name: true,
            },
          },
          categoryId: true,
          subCategory: true,
          subCategoryId: true,
          units: true,
          budget: true,
          details: true,
          createdAt: true,
          updatedAt: true,
          quantity: true,
          quantityUnit: true,
        },
      },
    },
  });
  if (user.role === "seller") {
    await prisma.posts.updateMany({
      where: {
        id: postId,
        NOT: {
          clicks: {
            has: Number(userId),
          },
        },
      },
      data: {
        clicks: {
          push: Number(userId),
        },
      },
    });
  }
  if (!post) {
    return NextResponse.json({ status: "failed", message: "Post not found" });
  }
  return NextResponse.json({ status: "success", post: post });
}
