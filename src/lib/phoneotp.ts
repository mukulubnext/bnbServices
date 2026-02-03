import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/lib/firebase";

export async function sendPhoneOTP(
  phone: string,
  containerId = "recaptcha-container"
) {
  const recaptcha = new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
  });

  return await signInWithPhoneNumber(auth, phone, recaptcha);
}

export async function confPhoneOTP(
  confirmation: any,
  otp: string
) {
  const result = await confirmation.confirm(otp);
  return await result.user.getIdToken();
}