// Sessions Helper
// Kindly add your session secret in .env file as shown in .env.example

import "server-only";
import { SignJWT, jwtVerify } from "jose";

import type { JWTPayload } from "jose";

export interface SessionPayload extends JWTPayload {
  id: number;
  email?: string;
}

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any, exp?: string) {   // Function responsible for encrypting an object into JWT
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(exp ?? "7d")
    .sign(encodedKey);
}

export async function decrypt(                                // Function responsible for decrypting JWT into object
  session?: string
): Promise<SessionPayload | null> {
  if (!session) return null;

  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });

    return payload as SessionPayload;
  } catch {
    return null;
  }
}
