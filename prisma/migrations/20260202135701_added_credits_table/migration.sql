-- CreateTable
CREATE TABLE "Credits" (
    "id" SERIAL NOT NULL,
    "credits" INTEGER NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Credits_pkey" PRIMARY KEY ("id")
);
