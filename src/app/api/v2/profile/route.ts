import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/sessions";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(req: NextRequest) {
  const reqBody = z.object({
    companyName: z.string().min(3).max(50),
    address: z.string().min(3).max(100),
    city: z.string().min(3).max(50),
    state: z.string().min(3).max(50),
    zipCode: z.string().min(3).max(50),
    inceptionDate: z.coerce.date(),
    employeeCount: z.string().min(3).max(50),
    pastLegalAction: z.boolean(),
    pastLegalExplanation: z.string().max(50).optional().nullable(),
    gstNumber: z.string().min(15).max(15).optional(),
  });
  try{
    const {
        companyName,
        address,
        city,
        state,
        zipCode,
        inceptionDate,
        employeeCount,
        pastLegalAction,
        pastLegalExplanation,
        gstNumber,
    } = reqBody.parse(await req.json())
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
    if(user.role === "seller" && !gstNumber){
      return NextResponse.json(
        { status: "failed", message: "Please fill GST Number" },
        { status: 400 }
      );
    }
    const updateUser = await prisma.user.update({
      where: { id: id },
      data: {
        companyName,
        address,
        city,
        state,
        zipCode,
        inceptionDate,
        employeeCount,
        pastLegalAction,
        pastLegalExplanation,
        gstNumber,
      },
    })
    return NextResponse.json({status: "success", message: "Profile details added successfully"}, {status: 200})
  }
  catch(err){
    if(err instanceof z.ZodError){
        return NextResponse.json({status: "error", message: err.issues[0].message}, {status: 400})
    }
    console.error(err)
    return NextResponse.json({status: "error", message: "Internal Server Error"}, {status: 500})
  }
}
