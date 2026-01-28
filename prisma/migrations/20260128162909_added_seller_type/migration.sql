-- CreateEnum
CREATE TYPE "SellerType" AS ENUM ('manufacturer', 'supplier');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "sellerType" "SellerType";
