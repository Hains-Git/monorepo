/*
  Warnings:

  - Made the column `name` on table `teams` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "antragsstatuses" ALTER COLUMN "color" SET DEFAULT '#ffffff';

-- AlterTable
ALTER TABLE "benachrichtigungs_statuses" ALTER COLUMN "color" SET DEFAULT '#ffffff';

-- AlterTable
ALTER TABLE "benachrichtigungs_typs" ALTER COLUMN "color" SET DEFAULT '#ffffff';

-- AlterTable
ALTER TABLE "bereich_tagesverteilers" ALTER COLUMN "color" SET DEFAULT '#ffffff';

-- AlterTable
ALTER TABLE "dienstkategories" ALTER COLUMN "color" SET DEFAULT '#ffffff';

-- AlterTable
ALTER TABLE "dienstplaner_user_farbgruppens" ALTER COLUMN "color" SET DEFAULT '#ffffff';

-- AlterTable
ALTER TABLE "dienstplanstatuses" ALTER COLUMN "color" SET DEFAULT '#ffffff';

-- AlterTable
ALTER TABLE "einteilungskontexts" ALTER COLUMN "color" SET DEFAULT '#ffffff';

-- AlterTable
ALTER TABLE "einteilungsstatuses" ALTER COLUMN "color" SET DEFAULT '#ffffff';

-- AlterTable
ALTER TABLE "freigabestatuses" ALTER COLUMN "color" SET DEFAULT '#ffffff';

-- AlterTable
ALTER TABLE "funktions" ALTER COLUMN "color" SET DEFAULT '#ffffff';

-- AlterTable
ALTER TABLE "geraetebereiches" ALTER COLUMN "color" SET DEFAULT '#ffffff';

-- AlterTable
ALTER TABLE "geraeteklasses" ALTER COLUMN "color" SET DEFAULT '#ffffff';

-- AlterTable
ALTER TABLE "kalendermarkierungs" ALTER COLUMN "color" SET DEFAULT '#ffffff';

-- AlterTable
ALTER TABLE "notfallmedizin_statuses" ALTER COLUMN "color" SET DEFAULT '#ffffff';

-- AlterTable
ALTER TABLE "po_diensts" ALTER COLUMN "color" SET DEFAULT '#ffffff';

-- AlterTable
ALTER TABLE "tagesverteilers" ALTER COLUMN "color" SET DEFAULT '#ffffff';

-- AlterTable
ALTER TABLE "teams" ADD COLUMN     "color" VARCHAR NOT NULL DEFAULT '#ffffff',
ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "themas" ALTER COLUMN "color" SET DEFAULT '#ffffff';
