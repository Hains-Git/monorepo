-- AddForeignKey
ALTER TABLE "diensteinteilungs" ADD CONSTRAINT "diensteinteilungs_einteilungskontext_id_fkey" FOREIGN KEY ("einteilungskontext_id") REFERENCES "einteilungskontexts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
