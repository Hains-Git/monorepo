/*
  Warnings:

  - The primary key for the `vertrag_versions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `vertrag_versions` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `vertrags_arbeitszeits` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `vertrags_arbeitszeits` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `vertrag_id` on the `vertrags_arbeitszeits` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `vertragsstufe_id` on the `vertrags_phases` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "vertrag_versions" DROP CONSTRAINT "vertrag_versions_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "vertrag_versions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "vertrags_arbeitszeits" DROP CONSTRAINT "vertrags_arbeitszeits_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "vertrag_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "vertrags_arbeitszeits_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "vertrags_phases" ALTER COLUMN "vertragsstufe_id" SET DATA TYPE INTEGER;
