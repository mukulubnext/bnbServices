import { NextResponse } from "next/server";
import { renderForgotPasswordTemplate, renderOtpTemplate } from "@/lib/mail";

export async function GET() {
  const html = await renderOtpTemplate({
    otp: "482913",
    expiry: 5,
  });

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
