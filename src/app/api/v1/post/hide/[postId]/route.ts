import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/sessions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, ctx: {params: Promise<{postId: string}>}){
    const postId = (await ctx.params).postId;
    const token = req.cookies.get("token")?.value;
    
    if(!token){
        return NextResponse.json({status:"failed", message:"Unauthorized"}, {status:401});
    }

    const decrypted = await decrypt(token);
    if(!decrypted){
        return NextResponse.json({status:"failed", message:"Unauthorized"}, {status:401});
    }

    const userId = decrypted.id;
    const user = await prisma.user.findUnique({
        where:{id: userId}
    })
    if(!user){
        return NextResponse.json({status:"failed", message:"User not found"}, {status:401});
    }
    const post = await prisma.posts.findUnique({
        where: {id: Number(postId)},
    })
    if(!post){
        return NextResponse.json({status:"failed", message:"Post not found"}, {status:401});
    }
    if(post.userId !== userId){
        return NextResponse.json({status:"failed", message:"Unauthorized"}, {status:401});
    }
    const updatedValue = post.isActive ? false : true;
    await prisma.posts.update({
        where:{id: Number(postId)},
        data:{isActive: updatedValue}
    })
    return NextResponse.json({status:"success", message:"Post updated successfully"}, {status:200});
}