import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/sessions";
import { NextRequest, NextResponse } from "next/server";
import z, { ZodError } from "zod";

export async function POST(req: NextRequest) {
  const reqBody = z.object({
    title: z
      .string()
      .max(100, "Title must be less than 100 characters")
      .min(3, "Title must be at least 3 characters"),
    description: z
      .string()
      .max(1000, "Description must be less than 1000 characters")
      .min(3, "Description must be at least 3 characters"),
    details: z.string().max(200, "Details must be less than 200 characters"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    budget: z.number().min(1, "Budget must be at least 1"),
    category: z.number().min(1, "Category must be at least 1"),
  });
  const token = req.cookies.get("token")?.value;
  const decrypted = await decrypt(token);
  if (!decrypted) {
    return NextResponse.json({ status: "failed", message: "Invalid token" });
  }
  const userId = decrypted.id;
  try {
    const { title, description, details, quantity, budget, category } =
      reqBody.parse(await req.json());

    try {
      const post = await prisma.posts.create({
        data: {
          title: title,
          description: description,
          details: details,
          quantity: quantity,
          budget: budget,
          userId: userId,
          categoryId: category,
        },
      });
      return NextResponse.json({ status: "success" });
    } catch (e) {
      return NextResponse.json({
        status: "failed",
        message: "Failed to create post",
      });
    }
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json({
        status: "failed",
        message: e.issues[0].message,
      });
    }
  }
}
