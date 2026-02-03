import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/sessions";
import { NextRequest, NextResponse } from "next/server";

const PAGE_SIZE = 10;

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ range: string }> },
) {
  try {
    // ---------------- AUTH ----------------
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
    const range = Math.max(Number((await ctx.params).range) || 1, 1);

    const skip = (range - 1) * PAGE_SIZE;
    const take = PAGE_SIZE;

    // ---------------- USER INTERESTS ----------------
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        interestedCategories: {
          select: { id: true },
        },
      },
    });

    const categoryIds = user?.interestedCategories.map((c) => c.id) ?? [];

    // ---------------- COMMON SELECT ----------------
    const postSelect = {
      id: true,
      title: true,
      createdAt: true,
      items: {
        where: { isDeleted: false },
        select: {
          id: true,
          categoryId: true,
          quantity: true,
          budget: true,
          details: true,
          createdAt: true,
          updatedAt: true,
          category: {
            select: { name: true },
          },
          subCategory: {
            select: { name: true },
          },
        },
      },
      offers: {
        select: { id: true },
      },
    };

    // ---------------- WHERE CLAUSES ----------------
    const baseWhere = {
      isActive: true,
      isDeleted: false,
    };

    const interestedWhere = {
      ...baseWhere,
      items: {
        some: {
          categoryId: { in: categoryIds },
        },
      },
    };

    const otherWhere = {
      ...baseWhere,
      items: {
        some: {
          categoryId: { notIn: categoryIds },
        },
      },
    };

    // ---------------- FETCH POSTS ----------------
    const [interestedPosts, otherPosts, interestedCount, otherCount] =
      await Promise.all([
        prisma.posts.findMany({
          where: categoryIds.length ? interestedWhere : undefined,
          orderBy:[
            {
              offers: {_count: "asc"}
            },
            {
              createdAt: "desc"
            }
          ],
          skip,
          take,
          select: postSelect,
        }),

        prisma.posts.findMany({
          where: categoryIds.length ? otherWhere : baseWhere,
          orderBy:[
            {
              offers: {_count: "asc"}
            },
            {
              createdAt: "desc"
            }
          ],
          skip,
          take,
          select: postSelect,
        }),

        categoryIds.length
          ? prisma.posts.count({ where: interestedWhere })
          : prisma.posts.count({ where: baseWhere }),

        categoryIds.length ? prisma.posts.count({ where: otherWhere }) : 0,
      ]);

    // ---------------- MERGE (PRIORITY ORDER) ----------------
    const posts = [...interestedPosts, ...otherPosts];
    const total = interestedCount + otherCount;

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
