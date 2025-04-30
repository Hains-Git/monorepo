-- AddForeignKey
ALTER TABLE "dateis" ADD CONSTRAINT "dateis_besitzer_id_fkey" FOREIGN KEY ("besitzer_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dateis" ADD CONSTRAINT "dateis_ersteller_id_fkey" FOREIGN KEY ("ersteller_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
