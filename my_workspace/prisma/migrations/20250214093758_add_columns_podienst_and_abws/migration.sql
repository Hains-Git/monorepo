-- AlterTable
ALTER TABLE "abwesentheitenueberblicks" ADD COLUMN     "sbu" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "po_diensts" ADD COLUMN     "reduziere_urlaub" BOOLEAN DEFAULT false;
