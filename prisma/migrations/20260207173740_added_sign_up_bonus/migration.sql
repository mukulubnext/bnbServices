-- AlterEnum
ALTER TYPE "TransactionType" ADD VALUE 'SIGNUP_BONUS';

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "credits" SET DEFAULT 0;
