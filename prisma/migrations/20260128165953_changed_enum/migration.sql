/*
  Warnings:

  - The `sellerType` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "sellerType",
ADD COLUMN     "sellerType" TEXT;

-- DropEnum
DROP TYPE "SellerType";
