/*
  Warnings:

  - You are about to drop the column `file_id` on the `dateis` table. All the data in the column will be lost.
  - You are about to drop the column `datei_typ_id` on the `geraet_dateis` table. All the data in the column will be lost.
  - You are about to drop the column `file_id` on the `geraet_dateis` table. All the data in the column will be lost.
  - You are about to drop the column `geraet_id` on the `geraet_dateis` table. All the data in the column will be lost.
  - You are about to drop the `files` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[datei_id]` on the table `geraet_dateis` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `besitzer_id` to the `geraet_dateis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `datei_id` to the `geraet_dateis` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "dateis" DROP CONSTRAINT "dateis_besitzer_id_fkey";

-- DropForeignKey
ALTER TABLE "dateis" DROP CONSTRAINT "dateis_ersteller_id_fkey";

-- DropForeignKey
ALTER TABLE "dateis" DROP CONSTRAINT "dateis_file_id_fkey";

-- DropForeignKey
ALTER TABLE "geraet_dateis" DROP CONSTRAINT "geraet_dateis_datei_typ_id_fkey";

-- DropForeignKey
ALTER TABLE "geraet_dateis" DROP CONSTRAINT "geraet_dateis_file_id_fkey";

-- DropForeignKey
ALTER TABLE "geraet_dateis" DROP CONSTRAINT "geraet_dateis_geraet_id_fkey";

-- DropIndex
DROP INDEX "dateis_file_id_key";

-- DropIndex
DROP INDEX "geraet_dateis_file_id_key";

-- AlterTable
ALTER TABLE "dateis" DROP COLUMN "file_id",
ADD COLUMN     "hash" VARCHAR DEFAULT '',
ADD COLUMN     "path" VARCHAR DEFAULT '',
ADD COLUMN     "url" VARCHAR DEFAULT '',
ALTER COLUMN "name" SET DEFAULT '',
ALTER COLUMN "beschreibung" SET DEFAULT '',
ALTER COLUMN "ersteller_id" DROP NOT NULL,
ALTER COLUMN "besitzer_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "geraet_dateis" DROP COLUMN "datei_typ_id",
DROP COLUMN "file_id",
DROP COLUMN "geraet_id",
ADD COLUMN     "besitzer_id" INTEGER NOT NULL,
ADD COLUMN     "datei_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "files";

-- CreateTable
CREATE TABLE "datei_typ_gruppe" (
    "id" SERIAL NOT NULL,
    "datei_typ_id" INTEGER NOT NULL,
    "gruppe_id" INTEGER NOT NULL,

    CONSTRAINT "datei_typ_gruppe_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "mitarbeiter_dateis_datei_id_key" ON "mitarbeiter_dateis"("datei_id");

-- CreateIndex
CREATE UNIQUE INDEX "geraet_dateis_datei_id_key" ON "geraet_dateis"("datei_id");

-- AddForeignKey
ALTER TABLE "datei_typ_gruppe" ADD CONSTRAINT "datei_typ_gruppe_datei_typ_id_fkey" FOREIGN KEY ("datei_typ_id") REFERENCES "datei_typs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "datei_typ_gruppe" ADD CONSTRAINT "datei_typ_gruppe_gruppe_id_fkey" FOREIGN KEY ("gruppe_id") REFERENCES "gruppes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dateis" ADD CONSTRAINT "dateis_besitzer_id_fkey" FOREIGN KEY ("besitzer_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dateis" ADD CONSTRAINT "dateis_ersteller_id_fkey" FOREIGN KEY ("ersteller_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
