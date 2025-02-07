import { prismaDb } from '@my-workspace/prisma_hains';

export async function getBedarfseintragByDienstplanBedarfId(dienstplanbedarf_id: number) {
  return prismaDb.bedarfs_eintrags.findMany({
    where: {
      dienstplanbedarf_id
    }
  });
}
