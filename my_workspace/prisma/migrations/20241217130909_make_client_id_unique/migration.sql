/*
  Warnings:

  - You are about to alter the column `client_id` on the `oauth_access_tokens_new` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `client_id` on the `oauth_clients` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `client_id` on the `oauth_refresh_tokens` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - A unique constraint covering the columns `[code]` on the table `oauth_authorization_codes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[client_id]` on the table `oauth_clients` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "oauth_access_tokens_new" ALTER COLUMN "client_id" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "oauth_clients" ALTER COLUMN "client_id" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "oauth_refresh_tokens" ALTER COLUMN "client_id" SET DATA TYPE VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "oauth_authorization_codes_code_key" ON "oauth_authorization_codes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_clients_client_id_key" ON "oauth_clients"("client_id");
