import { prismaDb } from '@my-workspace/prisma_hains';

export async function getSchichtenByDienstplanbedarfId(dienstplanbedarf_id: number) {
  return await prismaDb.schichts.findMany({
    where: {
      bedarfs_eintrags: { dienstplanbedarf_id }
    }
  });
}
