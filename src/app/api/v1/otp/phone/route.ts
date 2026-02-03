import admin from "@/lib/fireBaseAdmin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();
    if (!idToken)
      return NextResponse.json(
        { status: "failed", message: "No ID token provided" },
        { status: 400 },
      );
    const decoded = await admin.auth().verifyIdToken(idToken);
    if (!decoded)
      return NextResponse.json(
        { status: "failed", message: "Invalid ID token" },
        { status: 401 },
      );
    const phone = decoded.phone_number;
    const firebaseUid = decoded.uid;

    if (!phone) {
      return NextResponse.json(
        { status: "failed", message: "No phone number found" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { status: "success", phone, firebaseUid },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { status: "failed", message: "Something went wrong" },
      { status: 500 },
    );
  }
}
