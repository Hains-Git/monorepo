/*
  Warnings:

  - You are about to drop the column `usersId` on the `account_infos` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `account_infos` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "account_infos" DROP CONSTRAINT "account_infos_usersId_fkey";

-- AlterTable
ALTER TABLE "account_infos" DROP COLUMN "usersId";

-- CreateIndex
CREATE UNIQUE INDEX "account_infos_user_id_key" ON "account_infos"("user_id");

-- AddForeignKey
ALTER TABLE "account_infos" ADD CONSTRAINT "account_infos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
