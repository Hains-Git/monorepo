-- DropForeignKey
ALTER TABLE "telefonliste_joomla" DROP CONSTRAINT "telefonliste_joomla_label_id_fkey";

-- AlterTable
ALTER TABLE "telefonliste_joomla" ALTER COLUMN "label_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "telefonliste_joomla" ADD CONSTRAINT "telefonliste_joomla_label_id_fkey" FOREIGN KEY ("label_id") REFERENCES "telefonliste_label"("id") ON DELETE SET NULL ON UPDATE CASCADE;
