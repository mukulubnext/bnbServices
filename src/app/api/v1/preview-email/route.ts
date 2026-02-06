import { NextResponse } from "next/server";
import { renderForgotPasswordTemplate } from "@/lib/mail";

export async function GET() {
  const html = await renderForgotPasswordTemplate({
    otp: "482913",
    expiry: 5,
    name: "Mukal",
    link: "https://bnbservices.vercel.app/forgot-password",
  });

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
