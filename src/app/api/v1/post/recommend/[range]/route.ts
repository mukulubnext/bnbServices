import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/sessions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ range: string }> }
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
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        interestedCategories: {
          select: { id: true },
        },
      },
    });

    if (!user || user.interestedCategories.length === 0) {
      return NextResponse.json({
        status: "success",
        posts: [],
        hasMore: false,
        total: 0,
      });
    }

    const categoryIds = user.interestedCategories.map(c => c.id);

    const posts = await prisma.posts.findMany({
      where: {
        isActive: true,
        isDeleted: false,
        categoryId: {
          in: categoryIds,
        },
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        category: true,
        offers: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take,
    });

    const total = await prisma.posts.count({
      where: {
        isActive: true,
        isDeleted: false,
        categoryId: {
          in: categoryIds,
        },
      },
    });

    return NextResponse.json({
      status: "success",
      posts,
      total,
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
