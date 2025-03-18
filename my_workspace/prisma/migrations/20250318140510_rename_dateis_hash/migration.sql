/*
  Warnings:

  - You are about to drop the column `hash` on the `dateis` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "dateis" DROP COLUMN "hash",
ADD COLUMN     "file_hash" VARCHAR DEFAULT '';
