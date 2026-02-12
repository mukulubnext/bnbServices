// Helper function to send OTP to phone
// Kindly add your Firebase configuration in .env file as shown in .env.example

// Used in:
//  -> Registeration Page

// Imports

import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/lib/firebase";

export async function sendPhoneOTP( // Function to send OTP to phone
  phone: string,
  containerId = "recaptcha-container"
) {
  const recaptcha = new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
  });

  return await signInWithPhoneNumber(auth, phone, recaptcha);
}

export async function confPhoneOTP(     // Function to confirm OTP sent to phone
  confirmation: any,
  otp: string
) {
  const result = await confirmation.confirm(otp);
  return await result.user.getIdToken();
}