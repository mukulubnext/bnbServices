import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ status: "failed", message: "Unauthorized!" });
  }
  try {
    const deleted = await prisma.oTP.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
    return NextResponse.json({
      status: "success",
      message: "Deleted successfully!",
    });
  } catch (err: any) {
    return NextResponse.json({ status: "failed", message: err.message });
  }
}
