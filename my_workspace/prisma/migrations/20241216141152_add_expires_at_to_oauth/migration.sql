/*
  Warnings:

  - Added the required column `expires_at` to the `oauth_access_tokens_new` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expires_at` to the `oauth_refresh_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "oauth_access_tokens_new" DROP CONSTRAINT "oauth_access_tokens_new_client_id_fkey";

-- DropForeignKey
ALTER TABLE "oauth_refresh_tokens" DROP CONSTRAINT "oauth_refresh_tokens_client_id_fkey";

-- AlterTable
ALTER TABLE "oauth_access_tokens_new" ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "oauth_refresh_tokens" ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL;
