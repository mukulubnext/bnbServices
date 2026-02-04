/*
  Warnings:

  - You are about to drop the column `token` on the `Payment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[transactionId]` on the table `Offers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[transactionId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `transactionId` to the `Offers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `credits` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Offers" ADD COLUMN     "transactionId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "token",
ADD COLUMN     "credits" INTEGER NOT NULL,
ADD COLUMN     "transactionId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Offers_transactionId_key" ON "Offers"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_transactionId_key" ON "Payment"("transactionId");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offers" ADD CONSTRAINT "Offers_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
