import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/sessions";
import { withRateLimit } from "@/lib/withRateLimit";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, ctx: { params: Promise<{ userId: string }> }) {
  const limited = await withRateLimit(req, "read");
        if (limited) {
          return NextResponse.json({
            status: "failed",
            message: "Too many requests!, try again later",
          });
        }
  const token = req.cookies.get("token")?.value;
  const buyerId = Number((await ctx.params).userId);
  if (!token) {
    return NextResponse.json(
      { status: "failed", message: "Unauthorized" },
      { status: 401 }
    );
  }

  let payload;
  
  try {
    payload = await decrypt(token);
  } catch {
    return NextResponse.json(
      { status: "failed", message: "Invalid or expired token" },
      { status: 401 }
    );
  }

  if (!payload?.id) {
    return NextResponse.json(
      { status: "failed", message: "Invalid token payload" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: {
        id: true,
        email: true,
        phone: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        role: true,
        companyName: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        inceptionDate: true,
        employeeCount: true,
        pastLegalAction: true,
        pastLegalExplanation: true,
        gstNumber: true,
        interestedCategories: true,
        companyWebsite: true,
        isVerified: true,
    }
  });

  if (!user) {
    return NextResponse.json(
      { status: "failed", message: "User not found" },
      { status: 404 }
    );
  }

  const buyer = await prisma.user.findUnique({
    where: { id: buyerId },
    select: {
        id: true,
        email: true,
        phone: true,
        companyName: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        interestedCategories: true,
        companyWebsite: true,
        isVerified: true,
    }
  });

  return NextResponse.json({ status: "success", buyer });
}
