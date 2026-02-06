import { NextResponse } from "next/server";
import { renderForgotPasswordTemplate, renderOtpTemplate, renderWelcomeBuyerTemplate, renderWelcomeSellerTemplate } from "@/lib/mail";

export async function GET() {
  const html = await renderWelcomeSellerTemplate({
    name: "Mukal Markanda Coorp.",
    role: "Buyer"
  });

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
