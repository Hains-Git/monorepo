-- AlterTable
ALTER TABLE "bedarfs_eintrags" ADD COLUMN     "team_id" INTEGER;

-- AlterTable
ALTER TABLE "dienstbedarves" ADD COLUMN     "team_id" INTEGER;

-- AddForeignKey
ALTER TABLE "bedarfs_eintrags" ADD CONSTRAINT "bedarfs_eintrags_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstbedarves" ADD CONSTRAINT "dienstbedarves_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;
