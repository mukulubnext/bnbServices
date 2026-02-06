import prisma from "@/lib/prisma";
import { encrypt } from "@/lib/sessions";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(req: NextRequest) {
  const reqBody = z.object({
    email: z.email(),
    password: z
      .string()
      .min(8)
      .max(20)
      .regex(/[A-Z]/, "One uppercase character required in password")
      .regex(/[0-9]/, "One number required in password"),
    phone: z.string().regex(/^[0-9]{10}$/),
    role: z.enum(["buyer", "seller"]),
    sellerType: z.enum(["manufacturer", "supplier"]).optional(),
    isEmailVerified: z.boolean(),
    isPhoneVerified: z.boolean(),
    fireBaseId: z.string(),
  });
  try {
    const {
      email,
      password,
      phone,
      role,
      sellerType,
      isEmailVerified,
      isPhoneVerified,
      fireBaseId,
    } = reqBody.parse(await req.json());
    if (!isEmailVerified || !isPhoneVerified) {
      return NextResponse.json({
        status: "failed",
        message: "Please verify with OTP first!",
      });
    }
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email: email }, { phone: phone }] },
    });
    if (existingUser) {
      return NextResponse.json({
        status: "failed",
        message: "User already exists!",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        phone,
        role,
        sellerType: sellerType || null,
        isEmailVerified,
        isPhoneVerified,
        firebaseId: fireBaseId,
        isVerified: true,
      },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        sellerType: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        firebaseId: true,
      },
    });
    const res = NextResponse.json({ status: "success" }, { status: 200 });
    return res;
  } catch (err) {
    console.error(err);
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { status: "error", message: err.issues[0].message },
        { status: 400 },
      );
    }
    console.error(err);
    return NextResponse.json(
      { status: "error", message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
