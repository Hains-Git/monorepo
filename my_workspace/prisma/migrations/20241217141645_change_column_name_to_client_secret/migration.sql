/*
  Warnings:

  - You are about to drop the column `secret_id` on the `oauth_clients` table. All the data in the column will be lost.
  - Added the required column `client_secret` to the `oauth_clients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "oauth_clients" DROP COLUMN "secret_id",
ADD COLUMN     "client_secret" TEXT NOT NULL;
