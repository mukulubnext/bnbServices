import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/sessions";
import { withRateLimit } from "@/lib/withRateLimit";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ token: string }> },
) {
  const limited = await withRateLimit(req,"auth");
  if(limited){
    return NextResponse.json({
      status: "failed",
      message: "Too many requests!, try again later"
    })
  }
  const reqBody = z.object({
    newPassword: z
      .string()
      .min(8)
      .max(20)
      .regex(/[A-Z]/, "One uppercase character required in password")
      .regex(/[0-9]/, "One number required in password"),
    confirmPassword: z
      .string()
      .min(8)
      .max(20)
      .regex(/[A-Z]/, "One uppercase character required in password")
      .regex(/[0-9]/, "One number required in password"),
  });
  const token = (await ctx.params).token;
  const decrypted = await decrypt(token);
  if(!decrypted){
    return NextResponse.json({
      status: "failed",
      message: "Invalid token!"
    })
  }
  const id = Number(decrypted.id);
  try{
    const { newPassword, confirmPassword } = reqBody.parse(await req.json());
    if(newPassword !== confirmPassword){
        return NextResponse.json({
            status: "failed",
            message: "Passwords do not match!"
        })
    }
    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    })
    if(!user){
        return NextResponse.json({
            status: "failed",
            message: "User not found!"
        })
    }
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
        where: {
            id: id
        },
        data: {
            password: newPasswordHash
        }
    })
    return NextResponse.json({
        status: "success",
        message: "Password changed successfully!"
    })
  }
  catch(err){
    console.error(err);
    if(err instanceof z.ZodError){
        return NextResponse.json({
            status: "failed",
            message: err.issues[0].message
        })
    }
    return NextResponse.json({
        status: "failed",
        message: "Something went wrong"
    })
  }
}
