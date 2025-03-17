/*
  Warnings:

  - A unique constraint covering the columns `[datei_id]` on the table `antraeges` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[file_id]` on the table `dateis` will be added. If there are existing duplicate values, this will fail.
  - Made the column `mitarbeiter_id` on table `antraeges` required. This step will fail if there are existing NULL values in that column.
  - Made the column `antragstyp_id` on table `antraeges` required. This step will fail if there are existing NULL values in that column.
  - Made the column `antragsstatus_id` on table `antraeges` required. This step will fail if there are existing NULL values in that column.
  - Made the column `mitarbeiter_id` on table `automatische_einteilungens` required. This step will fail if there are existing NULL values in that column.
  - Made the column `po_dienst_id` on table `automatische_einteilungens` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ersteller_id` on table `dateis` required. This step will fail if there are existing NULL values in that column.
  - Made the column `besitzer_id` on table `dateis` required. This step will fail if there are existing NULL values in that column.
  - Made the column `datei_typ_id` on table `dateis` required. This step will fail if there are existing NULL values in that column.
  - Made the column `geraeteklasse_id` on table `geraets` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "dateis" DROP CONSTRAINT "dateis_besitzer_id_fkey";

-- DropForeignKey
ALTER TABLE "dateis" DROP CONSTRAINT "dateis_datei_typ_id_fkey";

-- DropForeignKey
ALTER TABLE "dateis" DROP CONSTRAINT "dateis_ersteller_id_fkey";

-- AlterTable
ALTER TABLE "antraeges" ADD COLUMN     "datei_id" INTEGER,
ALTER COLUMN "mitarbeiter_id" SET NOT NULL,
ALTER COLUMN "antragstyp_id" SET NOT NULL,
ALTER COLUMN "antragsstatus_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "automatische_einteilungens" ALTER COLUMN "mitarbeiter_id" SET NOT NULL,
ALTER COLUMN "po_dienst_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "datei_typs" ADD COLUMN     "category" VARCHAR NOT NULL DEFAULT '',
ADD COLUMN     "owner" VARCHAR NOT NULL DEFAULT '',
ALTER COLUMN "name" SET DEFAULT '';

-- AlterTable
ALTER TABLE "dateis" ADD COLUMN     "file_id" INTEGER,
ALTER COLUMN "ersteller_id" SET NOT NULL,
ALTER COLUMN "besitzer_id" SET NOT NULL,
ALTER COLUMN "datei_typ_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "geraets" ALTER COLUMN "name" SET DEFAULT '',
ALTER COLUMN "hersteller" SET DEFAULT '',
ALTER COLUMN "typ" SET DEFAULT '',
ALTER COLUMN "geraeteklasse_id" SET NOT NULL;

-- CreateTable
CREATE TABLE "files" (
    "id" SERIAL NOT NULL,
    "url" VARCHAR NOT NULL DEFAULT '',
    "md5hash" VARCHAR NOT NULL DEFAULT '',

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "geraet_dateis" (
    "id" SERIAL NOT NULL,
    "geraet_id" INTEGER NOT NULL,
    "file_id" INTEGER NOT NULL,
    "datei_typ_id" INTEGER NOT NULL,

    CONSTRAINT "geraet_dateis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "geraet_dateis_file_id_key" ON "geraet_dateis"("file_id");

-- CreateIndex
CREATE UNIQUE INDEX "antraeges_datei_id_key" ON "antraeges"("datei_id");

-- CreateIndex
CREATE UNIQUE INDEX "dateis_file_id_key" ON "dateis"("file_id");

-- AddForeignKey
ALTER TABLE "antraeges" ADD CONSTRAINT "antraeges_datei_id_fkey" FOREIGN KEY ("datei_id") REFERENCES "dateis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dateis" ADD CONSTRAINT "dateis_besitzer_id_fkey" FOREIGN KEY ("besitzer_id") REFERENCES "mitarbeiters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dateis" ADD CONSTRAINT "dateis_ersteller_id_fkey" FOREIGN KEY ("ersteller_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dateis" ADD CONSTRAINT "dateis_datei_typ_id_fkey" FOREIGN KEY ("datei_typ_id") REFERENCES "datei_typs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dateis" ADD CONSTRAINT "dateis_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "geraet_dateis" ADD CONSTRAINT "geraet_dateis_datei_typ_id_fkey" FOREIGN KEY ("datei_typ_id") REFERENCES "datei_typs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "geraet_dateis" ADD CONSTRAINT "geraet_dateis_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "geraet_dateis" ADD CONSTRAINT "geraet_dateis_geraet_id_fkey" FOREIGN KEY ("geraet_id") REFERENCES "geraets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
