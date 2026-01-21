/*
  Warnings:

  - You are about to drop the column `budget` on the `Posts` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Posts` table. All the data in the column will be lost.
  - You are about to drop the column `details` on the `Posts` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Posts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Posts" DROP CONSTRAINT "Posts_categoryId_fkey";

-- AlterTable
ALTER TABLE "Posts" DROP COLUMN "budget",
DROP COLUMN "categoryId",
DROP COLUMN "details",
DROP COLUMN "quantity";

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "details" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "budget" DECIMAL(65,30) NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
