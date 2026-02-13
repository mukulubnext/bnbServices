import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/sessions";
import { withRateLimit } from "@/lib/withRateLimit";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const limited = await withRateLimit(req, "write");
          if (limited) {
            return NextResponse.json({
              status: "failed",
              message: "Too many requests!, try again later",
            });
          }
    const token = req.cookies.get("token")?.value;
    if(!token){
        return NextResponse.json({status:"failed", message:"Unauthorized"}, {status:401})
    }
    const decrypted = await decrypt(token);
    if(!decrypted){
        return NextResponse.json({status:"failed", message:"Unauthorized"}, {status:401})
    }
    const user = await prisma.user.findUnique({
        where:{id: decrypted.id},
    })
    if(!user){
        return NextResponse.json({status:"failed", message:"Unauthorized"}, {status:401})
    }
    const transactions = await prisma.transaction.findMany({
        where:{userId: user.id},
        select:{
            id: true,
            userId: true,
            type: true,
            createdAt: true,
            credits: true,
        },
        orderBy: {
            createdAt: "desc",
        }
    })
    return NextResponse.json({status:"success", transactions: transactions})
}