import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
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
        isActive: true,
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

          // Category name + item details combination
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
      select:{
        id: true,
        title: true,
        createdAt: true,
        items:{
            select:{
                id: true,
                category:{
                    select:{
                        id: true,
                        name: true
                    }
                }
            }
        }
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
