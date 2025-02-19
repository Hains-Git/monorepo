/*
  Warnings:

  - You are about to drop the column `datei_typsId` on the `dateis` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "dateis" DROP CONSTRAINT "dateis_datei_typsId_fkey";

-- AlterTable
ALTER TABLE "dateis" DROP COLUMN "datei_typsId";

-- AddForeignKey
ALTER TABLE "dateis" ADD CONSTRAINT "dateis_datei_typ_id_fkey" FOREIGN KEY ("datei_typ_id") REFERENCES "datei_typs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
