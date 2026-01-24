import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/sessions";
import { NextRequest, NextResponse } from "next/server";

const PAGE_SIZE = 10;

export async function GET(
  req: NextRequest,
  ctx: { params: { range: string } },
) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { status: "failed", message: "No token found" },
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
    const range = Math.max(Number(ctx.params.range) || 1, 1);

    const skip = (range - 1) * PAGE_SIZE;
    const take = PAGE_SIZE;

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
        total: 0,
        hasMore: false,
      });
    }

    const categoryIds = user.interestedCategories.map((c) => c.id);

    const whereClause = {
      isActive: true,
      isDeleted: false,
      items: {
        some: {
          categoryId: {
            in: categoryIds,
          },
        },
      },
    };

    const [posts, total] = await Promise.all([
      prisma.posts.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip,
        take,
        select: {
          id: true,
          title: true,
          createdAt: true,
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
              quantity: true,
              budget: true,
              details: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          offers: {
            select: {
              id: true,
            },
          },
        },
      }),
      prisma.posts.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      status: "success",
      posts,
      total,
      hasMore: skip + take < total,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { status: "failed", message: "Something went wrong" },
      { status: 500 },
    );
  }
}
