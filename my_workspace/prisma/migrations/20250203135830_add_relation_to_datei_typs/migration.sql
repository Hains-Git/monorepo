-- AlterTable
ALTER TABLE "dateis" ADD COLUMN     "datei_typsId" INTEGER;

-- AddForeignKey
ALTER TABLE "dateis" ADD CONSTRAINT "dateis_datei_typsId_fkey" FOREIGN KEY ("datei_typsId") REFERENCES "datei_typs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
