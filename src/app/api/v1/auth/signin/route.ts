import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { SignJWT } from "jose";
import { encrypt } from "@/lib/sessions";

export async function POST(req: NextRequest) {
  const reqBody = z.object({
    email: z.email(),
    password: z
      .string()
      .min(8)
      .max(20)
      .regex(/[A-Z]/, "One uppercase character required in password")
      .regex(/[0-9]/, "One number required in password"),
    rememberMe: z.boolean(),
  });
  try {
    try {
      const { email, password, rememberMe } = reqBody.parse(await req.json());
      const user = await prisma.user.findFirst({ where: { email: email } });
      if (!user) {
        return NextResponse.json(
          { status: "failed", message: "User not found!" },
          { status: 404 }
        );
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return NextResponse.json(
          { status: "failed", message: "Incorrect Password!" },
          { status: 400 }
        );
      }
      const token = await encrypt({ id: user.id });
      const res = NextResponse.json({ status: "success" }, { status: 200 });
      res.cookies.set("token", token, {
        path: "/",
        httpOnly: true,
        maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 1,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
      });
      return res;
    } catch (e) {
      return NextResponse.json(
        { status: "failed", message: "Invalid request body!" },
        { status: 400 }
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      { status: "failed", message: err.message },
      { status: 500 }
    );
  }
}
