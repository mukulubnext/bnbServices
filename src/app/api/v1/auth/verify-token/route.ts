import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/sessions";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
  const reqBody = z.object({
    token: z.string(),
  });

  try {
    const { token } = reqBody.parse(await req.json());

    const decrypted = await decrypt(token);
    if (!decrypted || !decrypted.id) {
      return NextResponse.json({ status: "failed", message: "Invalid token." });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(decrypted.id) },
    });

    if (!user) {
      return NextResponse.json({ status: "failed", message: "User not found." });
    }

    return NextResponse.json({ status: "success" });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ status: "failed", message: err.message });
  }
}
