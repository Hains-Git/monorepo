-- AddForeignKey
ALTER TABLE "account_infos" ADD CONSTRAINT "account_infos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
