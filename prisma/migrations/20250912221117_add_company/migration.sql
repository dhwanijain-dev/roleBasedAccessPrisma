/*
  Warnings:

  - The primary key for the `Company` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `Document` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Document" DROP CONSTRAINT "Document_companyId_fkey";

-- AlterTable
ALTER TABLE "public"."Company" DROP CONSTRAINT "Company_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Company_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Company_id_seq";

-- DropTable
DROP TABLE "public"."Document";

-- CreateTable
CREATE TABLE "public"."CompanyFile" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "url" TEXT,
    "size" INTEGER,
    "mime" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompanyFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CompanyFile_companyId_idx" ON "public"."CompanyFile"("companyId");

-- AddForeignKey
ALTER TABLE "public"."CompanyFile" ADD CONSTRAINT "CompanyFile_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
