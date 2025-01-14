/*
  Warnings:

  - A unique constraint covering the columns `[tag,po_dienst_id,bereich_id]` on the table `planungsinformations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "planungsinformations_tag_po_dienst_id_bereich_id_key" ON "planungsinformations"("tag", "po_dienst_id", "bereich_id");
