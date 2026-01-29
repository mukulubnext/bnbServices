-- CreateEnum
CREATE TYPE "OTPChannel" AS ENUM ('EMAIL', 'PHONE');

-- CreateEnum
CREATE TYPE "OTPPurpose" AS ENUM ('LOGIN', 'SIGNUP', 'RESET_PASSWORD');

-- CreateTable
CREATE TABLE "OTP" (
    "id" SERIAL NOT NULL,
    "identifier" TEXT NOT NULL,
    "channel" "OTPChannel" NOT NULL,
    "purpose" "OTPPurpose" NOT NULL,
    "otpHash" TEXT NOT NULL,
    "attemptsLeft" INTEGER NOT NULL DEFAULT 5,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OTP_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OTP_identifier_channel_purpose_idx" ON "OTP"("identifier", "channel", "purpose");
