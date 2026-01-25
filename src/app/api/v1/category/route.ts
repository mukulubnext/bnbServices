import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/sessions";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function GET(req: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return NextResponse.json({ status: "success", categories });
  } catch {
    return NextResponse.json({
      status: "failed",
      message: "Unable to fetch categories",
    });
  }
}

export async function PUT(req: NextRequest){
    const reqBody = z.object({
        interestedCategories: z.array(z.object({
            id: z.number(),
            name: z.string()
        })),
    })
    try{
        const {interestedCategories} = reqBody.parse(await req.json())
        const token = req.cookies.get("token")?.value;
        if(!token){
            return NextResponse.json({status: "failed", message: "Unauthorized"}, {status: 401})
        }
        const decrypted = await decrypt(token);
        const id = decrypted?.id;
        if(!id){
            return NextResponse.json({status: "failed", message: "Unauthorized"}, {status: 401})
        }
        const user = await prisma.user.findUnique({
            where: {id: id},
        })
        if(!user){
            return NextResponse.json({status: "failed", message: "User not found"}, {status: 401})
        }
        await prisma.user.update({
            where: {id: id},
            data: {
                interestedCategories: {
                    set: interestedCategories?.map((cat)=>(
                        {id: cat.id, name: cat.name}
                    ))
                }
            }
        })
        return NextResponse.json({status: "success", message: "Interested Categories updated successfully"})
    }
    catch(err){
        console.error(err);
        return NextResponse.json({status: "failed", message: "Internal Server Error"}, {status: 500})
    }
}