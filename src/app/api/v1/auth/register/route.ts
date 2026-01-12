import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const reqBody = z.object({
    email: z.email(),
    password: z
      .string()
      .min(8)
      .max(20)
      .regex(/[A-Z]/, "One uppercase character required in password")
      .regex(/[0-9]/, "One number required in password"),
    isEmailVerified: z.boolean(),
    isPhoneVerified: z.boolean(),
    phone: z.string().regex(/^[0-9]{10}$/),
    role: z.enum(["buyer", "seller"]),
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
    interestedCategories: z.array(z.string().min(3).max(50)).optional(),
    companyWebsite: z.url().optional(),
  });

  try {
    const {
      email,
      isEmailVerified,
      phone,
      isPhoneVerified,
      password,
      role,
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
      interestedCategories,
      companyWebsite,
    } = reqBody.parse(await req.json());
    if (!isEmailVerified || !isPhoneVerified) {
      return NextResponse.json({
        status: "failed",
        message: "Please verify with OTP first!",
      });
    }
    if (role === "seller" && !gstNumber) {
      return NextResponse.json({
        status: "failed",
        message: "Please fill GST Number!",
      });
    }
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email: email }, { phone: phone }] },
    });
    if (existingUser) {
      return NextResponse.json({
        status: "failed",
        message: "User already exists!",
      });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email: email,
        password: passwordHash,
        phone: phone,
        isEmailVerified: isEmailVerified,
        isPhoneVerified: isPhoneVerified,
        role: role,
        companyName: companyName,
        address: address,
        city: city,
        state: state,
        zipCode: zipCode,
        inceptionDate: inceptionDate,
        employeeCount: employeeCount,
        pastLegalAction: pastLegalAction,
        pastLegalExplanation: pastLegalExplanation,
        gstNumber: gstNumber,
        companyWebsite: companyWebsite,
      },
    });
    console.log(user);
    return NextResponse.json({
      status: "success",
      message: "User created successfully!",
      role: role,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { status: "error", message: err.issues[0].message },
        { status: 400 }
      );
    }

    console.error(err);
    return NextResponse.json(
      { status: "error", message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
