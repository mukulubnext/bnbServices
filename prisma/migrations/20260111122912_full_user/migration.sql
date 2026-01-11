/*
  Warnings:

  - Added the required column `address` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employeeCount` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inceptionDate` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipCode` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "companyName" TEXT NOT NULL,
ADD COLUMN     "companyWebsite" TEXT,
ADD COLUMN     "employeeCount" TEXT NOT NULL,
ADD COLUMN     "gstNumber" TEXT,
ADD COLUMN     "inceptionDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "interestedCategories" TEXT[],
ADD COLUMN     "pastLegalAction" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pastLegalExplanation" TEXT,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "zipCode" TEXT NOT NULL;
