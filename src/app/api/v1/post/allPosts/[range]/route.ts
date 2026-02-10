import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/sessions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ range: string }> },
) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ status: "failed", message: "No token found" });
  }
  const decrypted = await decrypt(token);
  if (!decrypted) {
    return NextResponse.json({ status: "failed", message: "Invalid token" });
  }
  const userId = decrypted.id;
  const range = Number((await ctx.params).range);
  const PAGE_SIZE = 10;

  const skip = (range - 1) * PAGE_SIZE;
  const take = PAGE_SIZE;

  try {
    const posts = await prisma.posts.findMany({
      where: { userId: userId, isDeleted: false },
      select: {
        id: true,
        title: true,
        isActive: true,
        createdAt: true,
        offers: true,
        isFullfilled: true,
        items: {
          select: {
            id: true,
            quantity: true,
            quantityUnit: true,
            category: {
              select: {
                name: true,
              },
            },
            subCategory:{
              select:{
                name: true,
              }
            },
            units: true,
            budget: true,
            details: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take,
    });
    const total = await prisma.posts.count({
      where: { userId: userId },
    });
    return NextResponse.json({
      status: "success",
      total: total,
      posts: posts,
      hasMore: skip + take < total,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      status: "failed",
      message: "Something went wrong",
    });
  }
}
