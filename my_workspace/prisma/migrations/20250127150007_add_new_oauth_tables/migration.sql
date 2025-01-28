/*
  Warnings:

  - Made the column `user_id` on table `users_gruppes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gruppe_id` on table `users_gruppes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users_gruppes" ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "gruppe_id" SET NOT NULL,
ADD CONSTRAINT "users_gruppes_pkey" PRIMARY KEY ("user_id", "gruppe_id");

-- CreateTable
CREATE TABLE "oauth_access_tokens_new" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "client_id" VARCHAR(255) NOT NULL,
    "refresh_token_id" INTEGER NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "scopes" TEXT[],
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "oauth_access_tokens_new_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oauth_authorization_codes" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "client_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "oauth_authorization_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oauth_clients" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "client_id" VARCHAR(255) NOT NULL,
    "scopes" TEXT[],
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "client_secret" TEXT NOT NULL,

    CONSTRAINT "oauth_clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oauth_refresh_tokens" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "client_id" VARCHAR(255) NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "scopes" TEXT[],
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "oauth_refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "oauth_access_tokens_new_token_key" ON "oauth_access_tokens_new"("token");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_authorization_codes_code_key" ON "oauth_authorization_codes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_clients_client_id_key" ON "oauth_clients"("client_id");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_refresh_tokens_token_key" ON "oauth_refresh_tokens"("token");

-- AddForeignKey
ALTER TABLE "oauth_access_tokens_new" ADD CONSTRAINT "oauth_access_tokens_new_refresh_token_id_fkey" FOREIGN KEY ("refresh_token_id") REFERENCES "oauth_refresh_tokens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oauth_access_tokens_new" ADD CONSTRAINT "oauth_access_tokens_new_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oauth_refresh_tokens" ADD CONSTRAINT "oauth_refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
