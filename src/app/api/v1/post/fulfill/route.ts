import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/sessions";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(req: NextRequest){
    const reqBody = z.object({
        postId: z.number(),
    })
    const { postId } = reqBody.parse(await req.json());
    const token = req.cookies.get("token")?.value;
    if(!token){
        return NextResponse.json({status: "failed", message: "Unauthorized"}, {status: 401});
    }
    const decrypted = await decrypt(token);
    if(!decrypted){
        return NextResponse.json({status: "failed", message: "Unauthorized"}, {status: 401});
    }
    const userId = Number(decrypted.id);
    const post = await prisma.posts.findUnique({
        where: {
            id: postId,
            userId: userId,
        }
    })
    if(!post){
        return NextResponse.json({status: "failed", message: "Post not found"}, {status: 404});
    }
    await prisma.posts.update({
        where: {
            id: postId,
            userId: userId,
        },
        data: {
            isFullfilled: true,
        }
    })
    return NextResponse.json({status: "success", message: "Post fulfilled successfully!"});
}