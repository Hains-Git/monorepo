-- AlterTable
ALTER TABLE "oauth_access_tokens_new" ALTER COLUMN "client_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "oauth_refresh_tokens" ALTER COLUMN "client_id" SET DATA TYPE TEXT;
