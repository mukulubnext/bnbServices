import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/sessions";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(req: NextRequest) {
    const reqBody = z.object({
        website: z.url(),
    })   
    try{
        const {website} = reqBody.parse(await req.json())
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json(
                { status: "failed", message: "Unauthorized" },
                { status: 401 }
            );
        }
        const decrypted = await decrypt(token);
        if (!decrypted) {
            return NextResponse.json(
                { status: "failed", message: "Unauthorized" },
                { status: 401 }
            );
        }
        const id = decrypted.id;
        const user = await prisma.user.findFirst({
            where: { id: id },
            select: {
                role: true,
            }
        });
        if(!user){
            return NextResponse.json(
                { status: "failed", message: "User not found" },
                { status: 404 }
            );
        }
        await prisma.user.update({
            where: { id: id },
            data: {
                companyWebsite: website,
            }
        });
        return NextResponse.json({status: "success", message: "Website updated successfully"}, {status: 200})
    }
    catch(err){
        if(err instanceof z.ZodError){
            return NextResponse.json({status: "error", message: err.issues[0].message}, {status: 400})
        }
        console.error(err)
        return NextResponse.json({status: "error", message: "Internal Server Error"}, {status: 500})
    }
}