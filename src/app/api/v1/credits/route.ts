import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/sessions";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
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
  const id = decrypted?.id;
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  if (!user) {
    return NextResponse.json(
      { status: "failed", message: "Unauthorized" },
      { status: 401 },
    );
  }
  const prices = await prisma.credits.findMany({
    where: {
      isActive: true,
    },
  });
  return NextResponse.json({ status: "success", prices });
}
export function calculatePoints(amount: number): number {
  let remaining = amount;
  let points = 0;
  const slabs = [
    { price: 5000, credits: 8000 },
    { price: 4000, credits: 6000 },
    { price: 2000, credits: 2500 },
    { price: 1000, credits: 1150 },
    { price: 500, credits: 500 },
    { price: 250, credits: 200 },
  ];
  for (const slab of slabs) {
    if (remaining >= slab.price) {
      const times = Math.floor(remaining / slab.price);
      points += times * slab.credits;
      remaining -= times * slab.price;
    }
  }

  // leftover ₹1 = 1 point
  points += remaining;

  return points;
}
export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
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
  const id = decrypted?.id;
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  if (!user) {
    return NextResponse.json(
      { status: "failed", message: "Unauthorized" },
      { status: 401 },
    );
  }
  const reqBody = z.object({
    price: z.number().min(250, "Minimum purchase is 200 credits"),
  });
  const {price} = reqBody.parse(await req.json());
  const credits = calculatePoints(price);

  return NextResponse.json({ status: "success", credits });
}
