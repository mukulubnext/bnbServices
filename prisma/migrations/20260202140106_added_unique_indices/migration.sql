/*
  Warnings:

  - A unique constraint covering the columns `[credits,price]` on the table `Credits` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Credits_credits_price_key" ON "Credits"("credits", "price");
