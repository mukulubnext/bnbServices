import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/sessions";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(req: NextRequest)
{
    const reqBody = z.object({
        oldPassword: z
              .string()
              .min(8)
              .max(20)
              .regex(/[A-Z]/, "One uppercase character required in password")
              .regex(/[0-9]/, "One number required in password"),
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
    })
    const { oldPassword, newPassword, confirmPassword } = reqBody.parse(await req.json());

    const token = req.cookies.get("token")?.value;
    if(!token){
        return NextResponse.json({
            status: "failed",
            message: "You are not logged in!"
        })
    }
    const decrypted = await decrypt(token);
    if(!decrypted){
        return NextResponse.json({
            status: "failed",
            message: "You are not logged in!"
        })
    }
    const id = decrypted.id;
    
    try{
        const user = await prisma.user.findUnique({
            where: {
                id: id
            }
        })
        if(!user){
            return NextResponse.json({
                status: "failed",
                message: "You are not logged in!"
            })
        }
        if(newPassword !== confirmPassword){
            return NextResponse.json({
                status: "failed",
                message: "Passwords do not match!"
            })
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if(!isMatch){
            return NextResponse.json({
                status: "failed",
                message: "Old password is incorrect!"
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
        if(err instanceof z.ZodError){
            return NextResponse.json({
                status: "failed",
                message: err.issues[0].message
            })
        }
        return NextResponse.json({
            status: "failed",
            message: "Passwords do not match!"
        })
    }
}