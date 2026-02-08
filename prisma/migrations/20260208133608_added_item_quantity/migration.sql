-- CreateEnum
CREATE TYPE "QuantityUnit" AS ENUM ('kg', 'g', 'L', 'mL', 'mm', 'm', 'cm');

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "quantityUnit" "QuantityUnit" NOT NULL DEFAULT 'L';
