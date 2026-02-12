import {
  renderWelcomeBuyerTemplate,
  renderWelcomeSellerTemplate,
  sendEmail,
} from "@/lib/mail";
import prisma from "@/lib/prisma";
import { encrypt } from "@/lib/sessions";
import { TransactionType } from "@prisma/client";
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
    const user = await prisma.user.create({
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
        credits: 100,
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
        companyName: true,
      },
    });
    const res = NextResponse.json({ status: "success" }, { status: 200 });
    let html;
    if (user.role === "buyer") {
      html = await renderWelcomeBuyerTemplate({
        name: user.companyName ?? "user",
        role: user.role,
      });
    } else {
      html = await renderWelcomeSellerTemplate({
        name: user.companyName ?? "user",
        role: user.role,
      });
    }
    if (role === "seller") {
      await prisma.transaction.create({
        data: {
          credits: 100,
          userId: user.id,
          type: TransactionType.SIGNUP_BONUS,
        },
      });
    }
    await sendEmail(user.email, html, "Welcome to Bottles n Boxes");
    const token = await encrypt({ id: user.id, email: user.email, role: user.role });
    res.cookies.set("token", token, {
        path: "/",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7 ,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
      });
      return res;
  } 
  
  catch (err) {
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
