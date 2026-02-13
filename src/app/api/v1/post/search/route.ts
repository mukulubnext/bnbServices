import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withRateLimit } from "@/lib/withRateLimit";

export async function POST(req: NextRequest) {
  const limited = await withRateLimit(req, "read");
        if (limited) {
          return NextResponse.json({
            status: "failed",
            message: "Too many requests!, try again later",
          });
        }
  try {
    const { q }= await req.json();

    if (!q || q.trim().length < 2) {
      return NextResponse.json(
        { status: "error", message: "Search query too short" },
        { status: 400 }
      );
    }

    const search = q.trim();

    const posts = await prisma.posts.findMany({
      where: {
        isDeleted: false,
        OR: [
          // Post title
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },

          // Post description
          {
            description: {
              contains: search,
              mode: "insensitive",
            },
          },

          // Item details
          {
            items: {
              some: {
                details: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          },

          // Item category name
          {
            items: {
              some: {
                category: {
                  name: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
            },
          },

          // Item subcategory name
          {
            items: {
              some: {
                category: {
                  subCategories: {
                    some: {
                      name: {
                        contains: search,
                        mode: "insensitive",
                      },
                    }
                  }
                },
              },
            },
          },
          {
            items: {
              some: {
                AND: [
                  {
                    category: {
                      name: {
                        contains: search,
                        mode: "insensitive",
                      },
                    },
                  },
                  {
                    details: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                ],
              },
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        isFullfilled: true,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      status: "success",
      count: posts.length,
      data: posts,
    });
  } catch (err) {
    console.error("POST SEARCH ERROR:", err);
    return NextResponse.json(
      { status: "error", message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
