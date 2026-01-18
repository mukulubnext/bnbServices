/*
  Warnings:

  - You are about to drop the column `offerDetails` on the `Offers` table. All the data in the column will be lost.
  - You are about to drop the column `offerPrice` on the `Offers` table. All the data in the column will be lost.
  - You are about to drop the column `offerStatus` on the `Offers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Offers" DROP COLUMN "offerDetails",
DROP COLUMN "offerPrice",
DROP COLUMN "offerStatus";

-- DropEnum
DROP TYPE "offerStatus";
