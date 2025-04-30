/*
  Warnings:

  - A unique constraint covering the columns `[account_info_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "account_infos" DROP CONSTRAINT "account_infos_user_id_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "users_account_info_id_key" ON "users"("account_info_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_account_info_id_fkey" FOREIGN KEY ("account_info_id") REFERENCES "account_infos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
