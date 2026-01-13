import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/sessions";
import { NextRequest, NextResponse } from "next/server";
import z, { ZodError } from "zod";

const reqBody = z.object({
  title: z
    .string()
    .max(100, "Title must be less than 100 characters")
    .min(3, "Title must be at least 3 characters")
    .optional(),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .min(3, "Description must be at least 3 characters")
    .optional(),
  details: z
    .string()
    .max(200, "Details must be less than 200 characters")
    .optional(),
  quantity: z.number().min(1, "Quantity must be at least 1").optional(),
  budget: z.number().min(1, "Budget must be at least 1").optional(),
  image: z.instanceof(File).optional(),
});

export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ postId: number }> }
) {
  const postId = Number((await ctx.params).postId);
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ status: "failed", message: "Unauthroized" });
  }
  const decrypted = await decrypt(token);
  if (!decrypted) {
    return NextResponse.json({ status: "failed", message: "Invalid token" });
  }
  const userId = decrypted.id;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ status: "failed", message: "User not found" });
  }
  try {
    const parsed = reqBody.parse(await req.json());
    const { title, description, details, quantity, budget, image } = parsed;
    const post = await prisma.posts.findUnique({
      where: { id: postId, userId: userId },
    });
    if (!post) {
      return NextResponse.json({ status: "failed", message: "Post not found" });
    }
    const newPost = await prisma.posts.update({
      where: { id: postId, userId: userId },
      data: {
        title: title,
        description: description,
        details: details,
        quantity: quantity,
        budget: budget,
      },
    });
    return NextResponse.json({ status: "success", post: newPost });
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json({
        status: "failed",
        message: e.issues[0].message,
      });
    }
  }
}
