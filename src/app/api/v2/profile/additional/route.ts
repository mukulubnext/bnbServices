import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/sessions";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(req: NextRequest) {
  const reqBody = z.object({
    interestedCategories: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
      }),
    ),
    interestedSubCategories: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
      }),
    ),
    companyWebsite: z.string().max(100).optional(),
  });
  try {
    let { interestedCategories, interestedSubCategories, companyWebsite } =
      reqBody.parse(await req.json());
    const token = req.cookies.get("token")?.value;
    if(!companyWebsite?.startsWith("http")){
        companyWebsite = "https://" + companyWebsite;
    }
    if (!token) {
      return NextResponse.json(
        { status: "failed", message: "Unauthorized" },
        { status: 401 },
      );
    }
    const decrypted = await decrypt(token);
    if (!decrypted) {
      return NextResponse.json(
        { status: "failed", message: "Unauthorized" },
        { status: 401 },
      );
    }
    const id = decrypted.id;
    const user = await prisma.user.findFirst({
      where: { id: id },
      select: {
        role: true,
      },
    });
    if (!user) {
      return NextResponse.json(
        { status: "failed", message: "User not found" },
        { status: 404 },
      );
    }
    await prisma.user.update({
      where: { id: id },
      data: {
        interestedCategories: {
          connect: interestedCategories?.map((cat) => ({
            id: cat.id,
            name: cat.name,
          })),
        },
        interestedSubCategories: {
          connect: interestedSubCategories?.map((cat) => ({
            id: cat.id,
            name: cat.name,
          })),
        },
        companyWebsite: companyWebsite,
      },
    });
    return NextResponse.json(
      { status: "success", message: "Profile details added successfully" },
      { status: 200 },
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { status: "error", message: err.issues[0].message },
        { status: 400 },
      );
    }
    console.error(err);
    return NextResponse.json(
      { status: "error", message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
