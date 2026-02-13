import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/sessions";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { calculateAmount } from "../../create/route";
import { QuantityUnit } from "@prisma/client";
import { withRateLimit } from "@/lib/withRateLimit";

const reqBody = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(3).max(1000).optional(),
  items: z
    .array(
      z.object({
        categoryId: z.number().min(1),
        details: z.string().max(200).optional(),
        units: z.number().min(1),
        budget: z.number().min(1),
        subCategoryId: z.number().min(1),
        quantity: z.number().min(1),
        quantityUnit: z.enum(QuantityUnit),
      }),
    )
    .min(1),
});

export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ postId: string }> },
) {
  const limited = await withRateLimit(req, "write");
        if (limited) {
          return NextResponse.json({
            status: "failed",
            message: "Too many requests!, try again later",
          });
        }
  try {
    /* ---------- auth ---------- */
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
    const postId = Number((await ctx.params).postId);

    const { title, description, items } = reqBody.parse(await req.json());

    const post = await prisma.posts.findFirst({
      where: {
        id: postId,
        userId,
      },
    });

    if (!post) {
      return NextResponse.json(
        { status: "failed", message: "Post not found" },
        { status: 404 },
      );
    }
    const totalPrice = items.reduce(
      (acc, item) => acc + item.budget * item.units,
      0,
    );
    const updatedPost = await prisma.posts.update({
      where: { id: postId },
      data: {
        title,
        description,
        price: calculateAmount(totalPrice),
      },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        items: {
          select: {
            id: true,
            category: {
              select: {
                name: true,
              },
            },
            units: true,
            subCategory: true,
            subCategoryId: true,
            budget: true,
            details: true,
            categoryId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
    await prisma.item.deleteMany({
      where: { postId },
    });

    await prisma.item.createMany({
      data: items.map((item) => ({
        categoryId: item.categoryId,
        details: item.details,
        units: item.units,
        budget: item.budget,
        postId,
        subCategoryId: item.subCategoryId,
        quantity: item.quantity,
        quantityUnit: item.quantityUnit,
      })),
    });

    return NextResponse.json({
      status: "success",
      post: updatedPost,
    });
  } catch (e) {
    console.error(e);
    if (e instanceof ZodError) {
      return NextResponse.json(
        { status: "failed", message: e.issues[0].message },
        { status: 400 },
      );
    }

    console.error(e);
    return NextResponse.json(
      { status: "failed", message: "Internal server error" },
      { status: 500 },
    );
  }
}
