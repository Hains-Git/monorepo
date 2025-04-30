/*
  Warnings:

  - A unique constraint covering the columns `[datei_id]` on the table `antraeges` will be added. If there are existing duplicate values, this will fail.
  - Made the column `mitarbeiter_id` on table `antraeges` required. This step will fail if there are existing NULL values in that column.
  - Made the column `antragstyp_id` on table `antraeges` required. This step will fail if there are existing NULL values in that column.
  - Made the column `antragsstatus_id` on table `antraeges` required. This step will fail if there are existing NULL values in that column.
  - Made the column `mitarbeiter_id` on table `automatische_einteilungens` required. This step will fail if there are existing NULL values in that column.
  - Made the column `po_dienst_id` on table `automatische_einteilungens` required. This step will fail if there are existing NULL values in that column.
  - Made the column `datei_typ_id` on table `dateis` required. This step will fail if there are existing NULL values in that column.
  - Made the column `geraeteklasse_id` on table `geraets` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "dateis" DROP CONSTRAINT "dateis_datei_typ_id_fkey";

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
ALTER TABLE "dateis" ADD COLUMN     "file_hash" VARCHAR DEFAULT '',
ADD COLUMN     "path" VARCHAR DEFAULT '',
ADD COLUMN     "url" VARCHAR DEFAULT '',
ALTER COLUMN "name" SET DEFAULT '',
ALTER COLUMN "beschreibung" SET DEFAULT '',
ALTER COLUMN "datei_typ_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "geraets" ALTER COLUMN "name" SET DEFAULT '',
ALTER COLUMN "hersteller" SET DEFAULT '',
ALTER COLUMN "typ" SET DEFAULT '',
ALTER COLUMN "geraeteklasse_id" SET NOT NULL;

-- CreateTable
CREATE TABLE "datei_typ_gruppe" (
    "id" SERIAL NOT NULL,
    "datei_typ_id" INTEGER NOT NULL,
    "gruppe_id" INTEGER NOT NULL,

    CONSTRAINT "datei_typ_gruppe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "geraet_dateis" (
    "id" SERIAL NOT NULL,
    "besitzer_id" INTEGER NOT NULL,
    "datei_id" INTEGER NOT NULL,

    CONSTRAINT "geraet_dateis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mitarbeiter_dateis" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR DEFAULT '',
    "beschreibung" VARCHAR DEFAULT '',
    "ersteller_id" INTEGER NOT NULL,
    "besitzer_id" INTEGER NOT NULL,
    "datei_id" INTEGER NOT NULL,

    CONSTRAINT "mitarbeiter_dateis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "datei_typ_gruppe_datei_typ_id_gruppe_id_key" ON "datei_typ_gruppe"("datei_typ_id", "gruppe_id");

-- CreateIndex
CREATE UNIQUE INDEX "geraet_dateis_datei_id_key" ON "geraet_dateis"("datei_id");

-- CreateIndex
CREATE UNIQUE INDEX "mitarbeiter_dateis_datei_id_key" ON "mitarbeiter_dateis"("datei_id");

-- CreateIndex
CREATE UNIQUE INDEX "antraeges_datei_id_key" ON "antraeges"("datei_id");

-- AddForeignKey
ALTER TABLE "antraeges" ADD CONSTRAINT "antraeges_datei_id_fkey" FOREIGN KEY ("datei_id") REFERENCES "dateis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "datei_typ_gruppe" ADD CONSTRAINT "datei_typ_gruppe_datei_typ_id_fkey" FOREIGN KEY ("datei_typ_id") REFERENCES "datei_typs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "datei_typ_gruppe" ADD CONSTRAINT "datei_typ_gruppe_gruppe_id_fkey" FOREIGN KEY ("gruppe_id") REFERENCES "gruppes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dateis" ADD CONSTRAINT "dateis_datei_typ_id_fkey" FOREIGN KEY ("datei_typ_id") REFERENCES "datei_typs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "geraet_dateis" ADD CONSTRAINT "geraet_dateis_datei_id_fkey" FOREIGN KEY ("datei_id") REFERENCES "dateis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "geraet_dateis" ADD CONSTRAINT "geraet_dateis_besitzer_id_fkey" FOREIGN KEY ("besitzer_id") REFERENCES "geraets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mitarbeiter_dateis" ADD CONSTRAINT "mitarbeiter_dateis_datei_id_fkey" FOREIGN KEY ("datei_id") REFERENCES "dateis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mitarbeiter_dateis" ADD CONSTRAINT "mitarbeiter_dateis_besitzer_id_fkey" FOREIGN KEY ("besitzer_id") REFERENCES "mitarbeiters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mitarbeiter_dateis" ADD CONSTRAINT "mitarbeiter_dateis_ersteller_id_fkey" FOREIGN KEY ("ersteller_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
