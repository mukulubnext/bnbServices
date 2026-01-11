import { NextRequest } from "next/server";
import z from "zod";

export function POST(req: NextRequest){
    const reqBody = z.object({
        email: z.email(),
        password: z.string().min(8).max(20).regex(/[A-Z]/, "One uppercase character required in password").regex(/[0-9]/, "One number required in password")
    })
}