-- AddForeignKey
ALTER TABLE "bedarfs_eintrags" ADD CONSTRAINT "bedarfs_eintrags_first_entry_fkey" FOREIGN KEY ("first_entry") REFERENCES "bedarfs_eintrags"("id") ON DELETE SET NULL ON UPDATE CASCADE;
