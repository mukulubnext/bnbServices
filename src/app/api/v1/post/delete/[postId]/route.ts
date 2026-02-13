import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/sessions";
import { withRateLimit } from "@/lib/withRateLimit";
import { NextRequest, NextResponse } from "next/server";
import z, { ZodError } from "zod";

export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ postId: string }> }
) {
  try {
    const limited = await withRateLimit(req, "write");
          if (limited) {
            return NextResponse.json({
              status: "failed",
              message: "Too many requests!, try again later",
            });
          }
    const postId = Number((await ctx.params).postId);
    if (Number.isNaN(postId)) {
      return NextResponse.json(
        { status: "failed", message: "Invalid postId" },
        { status: 400 }
      );
    }

    const reqBody = z.object({
      reason: z.string().min(1).max(100),
    });

    const { reason } = reqBody.parse(await req.json());

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { status: "failed", message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decrypted = await decrypt(token);
    if (!decrypted) {
      return NextResponse.json(
        { status: "failed", message: "Invalid token" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: decrypted.id },
    });

    if (!user) {
      return NextResponse.json(
        { status: "failed", message: "User not found" },
        { status: 404 }
      );
    }

    const post = await prisma.posts.findFirst({
      where: { id: postId, userId: user.id },
    });

    if (!post) {
      return NextResponse.json(
        { status: "failed", message: "Post not found" },
        { status: 404 }
      );
    }

    await prisma.posts.update({
      where: { id: postId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deleteReason: reason,
      },
    });

    return NextResponse.json({ status: "success" });
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json(
        { status: "failed", message: e.issues[0].message },
        { status: 400 }
      );
    }

    console.error(e);
    return NextResponse.json(
      { status: "failed", message: "Something went wrong" },
      { status: 500 }
    );
  }
}
