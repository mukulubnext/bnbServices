-- AlterTable
ALTER TABLE "Posts" ADD COLUMN     "offerIds" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
