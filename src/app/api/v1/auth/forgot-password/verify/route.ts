import prisma from "@/lib/prisma";
import { encrypt } from "@/lib/sessions";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(req: NextRequest) {
  const reqBody = z.object({
    email: z.email(),
    otp: z.string().min(6).max(6),
  });
  try {
    const { email, otp } = reqBody.parse(await req.json());
    const otpRecord = await prisma.oTP.findFirst({
      where: {
        identifier: email,
        channel: "EMAIL",
        purpose: "RESET_PASSWORD",
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      }
    });
    if (!otpRecord) {
      return NextResponse.json({
        status: "failed",
        message: "OTP not found or expired.",
      });
    }
    const isMatch = await bcrypt.compare(otp.toString(), otpRecord.otpHash);
    if (!isMatch) {
      return NextResponse.json({
        status: "failed",
        message: "Incorrect OTP",
      });
    }
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
      }
    });
    if(!user){
      return NextResponse.json({
        status: "failed",
        message: "User not found."
      })
    }
    const jwt = await encrypt({id: user.id.toString()}, "15m");
    await prisma.oTP.delete({
      where: {
        id: otpRecord.id,
      },
    });
    return NextResponse.json({
      status: "success",
      message: "OTP verified successfully.",
      token: jwt
    });
  } catch (err) {
    console.error(err);
    if (err instanceof z.ZodError) {
      return NextResponse.json({
        status: "failed",
        message: err.issues[0].message,
      });
    }
    return NextResponse.json({
      status: "failed",
      message: "Something went wrong.",
    });
  }
}
