-- AlterTable
ALTER TABLE "users" ADD COLUMN     "provider" TEXT;

-- CreateTable
CREATE TABLE "telefonliste_joomla" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "position" INTEGER NOT NULL DEFAULT 0,
    "label_id" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "telefonliste_joomla_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "telefonliste_label" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "telefonliste_label_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "telefonliste_joomla" ADD CONSTRAINT "telefonliste_joomla_label_id_fkey" FOREIGN KEY ("label_id") REFERENCES "telefonliste_label"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
