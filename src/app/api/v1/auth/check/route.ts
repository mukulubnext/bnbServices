import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(req: NextRequest) {
  try {
    const reqBody = z.object({
      phone: z.string().regex(/^[0-9]{10}$/),
    });
    const { phone } = reqBody.parse(await req.json());
    const exists = await prisma.user.findFirst({
      where: { phone: phone },
      select: { id: true },
    });
    return NextResponse.json({
      status: "success",
      exists: !!exists,
    });
  } catch (err) {
    console.error(err);
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { status: "failed", message: err.issues[0].message },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { status: "failed", message: "Something went wrong" },
      { status: 500 },
    );
  }
}
