import { NextRequest, NextResponse } from "next/server";
import { rateLimiters } from "./rateLimit";

export async function withRateLimit(
  req: NextRequest,
  type: keyof typeof rateLimiters
) {
  const ip =
    req.headers.get("x-forwarded-for") ??
    req.headers.get("x-real-ip") ??
    "anonymous";

  const { success, reset } = await rateLimiters[type].limit(ip);

  if (!success) {
    return NextResponse.json(
      {
        error: "Too many requests",
        retryAfter: Math.ceil((reset - Date.now()) / 1000),
      },
      { status: 429 }
    );
  }

  return null;
}
