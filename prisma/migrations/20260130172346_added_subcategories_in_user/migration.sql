-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_subCategoryId_fkey";

-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "subCategoryId" DROP NOT NULL,
ALTER COLUMN "subCategoryId" DROP DEFAULT;

-- CreateTable
CREATE TABLE "_SubCategoryToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_SubCategoryToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_SubCategoryToUser_B_index" ON "_SubCategoryToUser"("B");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "SubCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubCategoryToUser" ADD CONSTRAINT "_SubCategoryToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "SubCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubCategoryToUser" ADD CONSTRAINT "_SubCategoryToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
