/*
  Warnings:

  - The values [mL,gsm] on the enum `QuantityUnit` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "QuantityUnit_new" AS ENUM ('kg', 'g', 'L', 'ml', 'm', 'cm', 'mm', 'GSM');
ALTER TABLE "public"."Item" ALTER COLUMN "quantityUnit" DROP DEFAULT;
ALTER TABLE "Item" ALTER COLUMN "quantityUnit" TYPE "QuantityUnit_new" USING ("quantityUnit"::text::"QuantityUnit_new");
ALTER TYPE "QuantityUnit" RENAME TO "QuantityUnit_old";
ALTER TYPE "QuantityUnit_new" RENAME TO "QuantityUnit";
DROP TYPE "public"."QuantityUnit_old";
ALTER TABLE "Item" ALTER COLUMN "quantityUnit" SET DEFAULT 'L';
COMMIT;
