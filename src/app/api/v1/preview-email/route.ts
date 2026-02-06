import { NextResponse } from "next/server";
import { renderForgotPasswordTemplate, renderOtpTemplate, renderWelcomeBuyerTemplate } from "@/lib/mail";

export async function GET() {
  const html = await renderWelcomeBuyerTemplate({
    name: "Mukal Markanda Coorp.",
    role: "Buyer"
  });

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
