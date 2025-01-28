/*
  Warnings:

  - A unique constraint covering the columns `[mitarbeiter_id]` on the table `account_infos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `account_infos` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
DROP INDEX IF EXISTS "index_account_infos_on_mitarbeiter_id";
CREATE UNIQUE INDEX "account_infos_mitarbeiter_id_key" ON "account_infos"("mitarbeiter_id");
CREATE INDEX "index_account_infos_on_mitarbeiter_id" ON "account_infos" USING btree ("mitarbeiter_id");

-- CreateIndex
CREATE UNIQUE INDEX "account_infos_user_id_key" ON "account_infos"("user_id");
