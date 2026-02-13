import prisma from "@/lib/prisma";
import { withRateLimit } from "@/lib/withRateLimit";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(req: NextRequest) {
  const limited = await withRateLimit(req, "read");
        if (limited) {
          return NextResponse.json({
            status: "failed",
            message: "Too many requests!, try again later",
          });
        }
  try {
    const { postId } = await req.json();
    const postIdZod = z.number("Post ID should be a number").min(1);
    const parsed = postIdZod.parse(postId);
    const post = await prisma.posts.findUnique({
      where: { id: parsed },
      select: {
        userId: true,
      },
    });
    if (!post) {
      return NextResponse.json(
        { status: "failed", message: "Post not found" },
        { status: 400 },
      );
    }
    return NextResponse.json({ status: "success", user: post.userId });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { status: "failed", message: err.issues[0].message },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { status: "failed", message: "Something went wrong" },
      { status: 400 },
    );
  }
}
