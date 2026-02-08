-- AlterEnum
ALTER TYPE "QuantityUnit" ADD VALUE 'gsm';

-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "details" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Posts" ALTER COLUMN "description" DROP NOT NULL;
