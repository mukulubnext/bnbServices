import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { renderOtpTemplate, sendEmail } from "@/lib/mail";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { OTPChannel, OTPPurpose } from "@prisma/client";
import { withRateLimit } from "@/lib/withRateLimit";

export async function POST(req: NextRequest) {
  const limited = await withRateLimit(req, "otp");
        if (limited) {
          return NextResponse.json({
            status: "failed",
            message: "Too many requests!, try again later",
          });
        }
  const reqBody = z.object({
    email: z.email(),
  });

  const { email } = reqBody.parse(await req.json());

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
    },
  });

  if (user) {
    return NextResponse.json({
      status: "failed",
      message: "Email already exists.",
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  const html = await renderOtpTemplate({
    otp: otp.toString(),
    expiry: 5,
  });
  const hash = await bcrypt.hash(otp.toString(), 10);
  try {
    await prisma.oTP.create({
      data: {
        identifier: email,
        channel: OTPChannel.EMAIL,
        purpose: OTPPurpose.SIGNUP,
        otpHash: hash,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });
    await sendEmail(email, html);
    return NextResponse.json({
      status: "success",
      message: "Email sent successfully.",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: "failed", message: "Email not sent." });
  }
}
