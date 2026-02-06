import { renderForgotPasswordTemplate, sendOtpEmail } from "@/lib/mail";
import prisma from "@/lib/prisma";
import { OTPChannel, OTPPurpose } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(req: NextRequest) {
  const reqBody = z.object({
    email: z.email(),
  });
  try {
    const { email } = reqBody.parse(await req.json());

    const user = await prisma.user.findFirst({
      where: { email: email },
      select: { id: true, companyName: true },
    });
    if (!user) {
      return NextResponse.json({
        status: "failed",
        message: "User not found!",
      });
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    const hash = await bcrypt.hash(otp.toString(), 10);
    const html = await renderForgotPasswordTemplate({
      otp: otp.toString(),
      expiry: 5,
      name: user.companyName ?? "user",
      link: `https://bnbservices.vercel.app/reset-password?email=${email}&otp=${otp.toString()}`,
    });
    await prisma.oTP.create({
      data: {
        identifier: email,
        channel: OTPChannel.EMAIL,
        purpose: OTPPurpose.RESET_PASSWORD,
        otpHash: hash,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });
    await sendOtpEmail(email, html, "Reset Password");
    return NextResponse.json({
      status: "success",
      message: "OTP sent successfully.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { status: "failed", message: error.issues[0].message },
        { status: 400 },
      );
    }
    console.log(error);
    return NextResponse.json({
      status: "failed",
      message: "OTP not sent.",
    });
  }
}
