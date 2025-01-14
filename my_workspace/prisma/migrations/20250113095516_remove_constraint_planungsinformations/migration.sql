/*
  Warnings:

  - Made the column `tag` on table `planungsinformations` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "planungsinformations_tag_po_dienst_id_bereich_id_key";

-- AlterTable
ALTER TABLE "planungsinformations" ALTER COLUMN "tag" SET NOT NULL;
