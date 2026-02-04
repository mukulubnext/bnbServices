import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/sessions";
import { TransactionType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(req: NextRequest){
    const reqBody = z.object({
        postId: z.number().min(1),
    })
    const { postId } = reqBody.parse(await req.json());
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
    if(user.role === "buyer"){
        return NextResponse.json({status:"failed", message:"You are not authorized to create offers"}, {status:401})
    }
    const post = await prisma.posts.findUnique({
        where:{id: postId, isDeleted: false},
    })
    if(!post){
        return NextResponse.json({status:"failed", message:"Post not found"}, {status:404})
    }
    const alreadyOffered = await prisma.offers.findFirst({
        where:{postId: postId, userId: user.id},
    })
    if(alreadyOffered){
        return NextResponse.json({status:"failed", message:"You already have an offer for this post"}, {status:401})
    }
    if(user.credits < post.price){
        return NextResponse.json({status:"failed", message:"Not enough credits"}, {status:401})
    }
    const transaction = await prisma.transaction.create({
        data: {
            credits: post.price,
            userId: user.id,
            type: TransactionType.OFFER,
        }
        }
    )
    const offer = await prisma.offers.create({
        data:{
            postId: postId,
            userId: user.id,
            transactionId: transaction.id,
        },
        select:{
            id: true,
            postId: true,
            userId: true,
            createdAt: true,
            updatedAt: true,
            post: {
                select:{
                    id: true,
                    userId: true,
                }
            }
        }
    })
    await prisma.user.update({
        where:{id: user.id},
        data:{
            credits: user.credits - post.price,
        },
    })
    return NextResponse.json({status:"success", message:"Offer created successfully", buyerId: post.userId}, {status:200})
}