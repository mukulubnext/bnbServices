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

    // ---------------- USER INTERESTS ----------------
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        interestedCategories: { select: { id: true } },
      },
    });

    const categoryIds = user?.interestedCategories.map(c => c.id) ?? [];

    // ---------------- BASE FILTER ----------------
    const baseWhere = {
      isActive: true,
      isDeleted: false,
    };

    // ---------------- 1️⃣ INTERESTED POSTS ----------------
    const interestedPosts = categoryIds.length
      ? await prisma.posts.findMany({
          where: {
            ...baseWhere,
            items: {
              some: {
                categoryId: { in: categoryIds },
              },
            },
          },
          orderBy: [
            { offers: { _count: "asc" } },
            { createdAt: "desc" },
          ],
          select: { id: true },
        })
      : [];

    const interestedIds = interestedPosts.map(p => p.id);

    // ---------------- 2️⃣ OTHER POSTS ----------------
    const otherPosts = await prisma.posts.findMany({
      where: {
        ...baseWhere,
        ...(interestedIds.length && {
          id: { notIn: interestedIds },
        }),
      },
      orderBy: [
        { offers: { _count: "asc" } },
        { createdAt: "desc" },
      ],
      select: { id: true },
    });

    // ---------------- MERGE + PAGINATE ----------------
    const orderedIds = [
      ...interestedIds,
      ...otherPosts.map(p => p.id),
    ];

    const total = orderedIds.length;
    const pagedIds = orderedIds.slice(skip, skip + PAGE_SIZE);

    if (!pagedIds.length) {
      return NextResponse.json({
        status: "success",
        posts: [],
        total,
        hasMore: false,
      });
    }

    // ---------------- FINAL FETCH ----------------
    const posts = await prisma.posts.findMany({
      where: { id: { in: pagedIds } },
      select: {
        id: true,
        title: true,
        createdAt: true,
        isFullfilled: true,
        clicks: true,
        items: {
          where: { isDeleted: false },
          select: {
            id: true,
            categoryId: true,
            units: true,
            budget: true,
            details: true,
            createdAt: true,
            updatedAt: true,
            quantity: true,
            quantityUnit: true,
            category: { select: { name: true } },
            subCategory: { select: { name: true } },
          },
        },
        offers: {
          select: { id: true },
        },
      },
    });

    // Preserve order
    const postMap = new Map(posts.map(p => [p.id, p]));
    const orderedPosts = pagedIds.map(id => postMap.get(id));

    return NextResponse.json({
      status: "success",
      posts: orderedPosts,
      total,
      hasMore: skip + PAGE_SIZE < total,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { status: "failed", message: "Something went wrong" },
      { status: 500 },
    );
  }
}