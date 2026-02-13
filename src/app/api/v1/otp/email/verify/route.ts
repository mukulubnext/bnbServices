import prisma from "@/lib/prisma";
import { withRateLimit } from "@/lib/withRateLimit";
import { OTPChannel, OTPPurpose } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import z, { email, ZodError } from "zod";

export async function POST(req: NextRequest){
    const limited = await withRateLimit(req, "otp");
          if (limited) {
            return NextResponse.json({
              status: "failed",
              message: "Too many requests!, try again later",
            });
          }
    try{
        const reqBody = z.object({
        email: z.email("Invalid email."),
        otp: z.string("Invalid OTP input").min(6, "OTP must be 6 digits.").max(6, "OTP must be 6 digits.")
    })
    const { email, otp } = reqBody.parse(await req.json())
    const hash = await bcrypt.hash(otp.toString(), 10)

    const otpRecord = await prisma.oTP.findFirst({
        where:{
            identifier: email,
            channel: OTPChannel.EMAIL,
            purpose: OTPPurpose.SIGNUP,
            expiresAt:{
                gt: new Date()
            }
        },
        orderBy: {
            createdAt: "desc",
        },
        select:{
            id: true,
            otpHash: true,
            attemptsLeft: true,
        }
    })
    if(!otpRecord){
        return NextResponse.json({
            status: "failed",
            message: "No OTP found or expired."
        })
    }
    if(otpRecord.attemptsLeft <= 0){
        return NextResponse.json({
            status: "failed",
            message: "OTP attempts exceeded.",
        })
    }
    const isMatch = await bcrypt.compare(otp.toString(), otpRecord.otpHash)
    if(!isMatch){
        const update = await prisma.oTP.update({
            where:{
                id: otpRecord.id
            },
            data:{
                attemptsLeft: otpRecord.attemptsLeft - 1
            }
        })
        return NextResponse.json({
            status: "failed",
            message: "OTP does not match.",
            attempts: update.attemptsLeft,
        })
    }
    await prisma.oTP.delete({
        where:{
            id: otpRecord.id
        }
    })
    return NextResponse.json({
        status: "success",
        message: "OTP verified successfully."
    })
    }
    catch(err){
        if(err instanceof ZodError){
            return NextResponse.json({
                status: "failed",
                message: err.issues[0].message
            })
        }
        return NextResponse.json({
            status: "failed",
            message: "Something went wrong."
        })
    }
}