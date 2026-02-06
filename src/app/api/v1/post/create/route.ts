import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/sessions";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

const schema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(3).max(1000),
  itemsData: z
    .array(
      z.object({
        categoryId: z.number().min(1),
        subCategoryId: z.number().min(1),
        details: z.string().max(200),
        quantity: z.number().min(1),
        budget: z.number().min(1),
      }),
    )
    .min(1),
});

function calculateAmount(amount: number) {
  const randomValue = Math.floor(Math.random() * 10);

  let finalAmount = 0;

  if (amount >= 0 && amount <= 10000) {
    finalAmount = 77 + randomValue;
  } else if (amount > 10000) {
    const percentageValue = amount * 0.0099;
    finalAmount = Math.floor(percentageValue + randomValue);
  }
  return finalAmount;
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const decrypted = await decrypt(token);

    if (!decrypted) {
      return NextResponse.json(
        { status: "failed", message: "Unauthorized" },
        { status: 401 },
      );
    }
    const user = await prisma.user.findUnique({
      where: { id: decrypted.id },
      select: { id: true, role: true },
    });

    if (!user || user.role !== "buyer") {
      return NextResponse.json(
        { status: "failed", message: "Unauthorized" },
        { status: 401 },
      );
    }
    const { title, description, itemsData } = schema.parse(await req.json());

    const totalPrice = itemsData.reduce((acc, item) => acc + (item.budget * item.quantity), 0);

    const post = await prisma.posts.create({
      data: {
        title,
        description,
        userId: decrypted.id,
        price: calculateAmount(totalPrice),
      },
    });
    await prisma.item.createMany({
      data: itemsData.map((item) => ({
        categoryId: item.categoryId,
        details: item.details,
        quantity: item.quantity,
        budget: item.budget,
        postId: post.id,
        subCategoryId: item.subCategoryId,
      })),
    });

    return NextResponse.json({ status: "success" });
  } catch (e) {
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
