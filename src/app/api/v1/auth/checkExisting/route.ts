import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import z, { email } from "zod";

export async function POST(req: NextRequest) {
  try {
    const reqBody = z.object({
      email: z.email(),
      phone: z.string().regex(/^[0-9]{10}$/),
    });
    try {
      const { email, phone } = reqBody.parse(await req.json());
      const existingUser = await prisma.user.findFirst({
        where: { OR: [{ email: email }, { phone: phone }] },
      });
      if (existingUser) {
        return NextResponse.json({ status: "success", exists: true });
      } else {
        return NextResponse.json({ status: "success", exists: false });
      }
    } catch (e) {
      return NextResponse.json(
        { status: "failed", message: "Invalid request body!" },
        { status: 400 }
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      { status: "error", message: err.message },
      { status: 500 }
    );
  }
}
