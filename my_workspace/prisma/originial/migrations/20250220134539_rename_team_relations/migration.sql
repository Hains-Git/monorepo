/*
  Warnings:

  - You are about to drop the column `teamsId` on the `team_kopf_soll` table. All the data in the column will be lost.
  - You are about to drop the column `teamsId` on the `team_vk_soll` table. All the data in the column will be lost.
  - Made the column `team_id` on table `team_funktions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `funktion_id` on table `team_funktions` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "team_kopf_soll" DROP CONSTRAINT "team_kopf_soll_teamsId_fkey";

-- DropForeignKey
ALTER TABLE "team_vk_soll" DROP CONSTRAINT "team_vk_soll_teamsId_fkey";

-- AlterTable
ALTER TABLE "team_funktions" ALTER COLUMN "team_id" SET NOT NULL,
ALTER COLUMN "funktion_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "team_kopf_soll" DROP COLUMN "teamsId";

-- AlterTable
ALTER TABLE "team_vk_soll" DROP COLUMN "teamsId";

-- AddForeignKey
ALTER TABLE "team_kopf_soll" ADD CONSTRAINT "team_kopf_soll_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_vk_soll" ADD CONSTRAINT "team_vk_soll_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
