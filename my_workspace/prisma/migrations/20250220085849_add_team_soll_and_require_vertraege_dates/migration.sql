/*
  Warnings:

  - Made the column `team_id` on table `team_kw_krankpuffers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `anfang` on table `vertrags` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ende` on table `vertrags` required. This step will fail if there are existing NULL values in that column.
  - Made the column `von` on table `vertrags_arbeitszeits` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bis` on table `vertrags_arbeitszeits` required. This step will fail if there are existing NULL values in that column.
  - Made the column `von` on table `vertrags_phases` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bis` on table `vertrags_phases` required. This step will fail if there are existing NULL values in that column.
  - Made the column `von` on table `vertrags_variantes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bis` on table `vertrags_variantes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "team_kw_krankpuffers" ALTER COLUMN "team_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "vertrags" ALTER COLUMN "anfang" SET NOT NULL,
ALTER COLUMN "ende" SET NOT NULL;

-- AlterTable
ALTER TABLE "vertrags_arbeitszeits" ALTER COLUMN "von" SET NOT NULL,
ALTER COLUMN "bis" SET NOT NULL;

-- AlterTable
ALTER TABLE "vertrags_phases" ALTER COLUMN "von" SET NOT NULL,
ALTER COLUMN "bis" SET NOT NULL;

-- AlterTable
ALTER TABLE "vertrags_variantes" ALTER COLUMN "von" SET NOT NULL,
ALTER COLUMN "bis" SET NOT NULL;

-- CreateTable
CREATE TABLE "team_kopf_soll" (
    "id" SERIAL NOT NULL,
    "team_id" INTEGER NOT NULL,
    "soll" INTEGER NOT NULL,
    "von" DATE NOT NULL,
    "bis" DATE NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "teamsId" INTEGER NOT NULL,

    CONSTRAINT "team_kopf_soll_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_vk_soll" (
    "id" SERIAL NOT NULL,
    "team_id" INTEGER NOT NULL,
    "soll" INTEGER NOT NULL,
    "von" DATE NOT NULL,
    "bis" DATE NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "teamsId" INTEGER NOT NULL,

    CONSTRAINT "team_vk_soll_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "team_kopf_soll" ADD CONSTRAINT "team_kopf_soll_teamsId_fkey" FOREIGN KEY ("teamsId") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_vk_soll" ADD CONSTRAINT "team_vk_soll_teamsId_fkey" FOREIGN KEY ("teamsId") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
