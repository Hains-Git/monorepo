import { prismaDb } from '@my-workspace/prisma_hains';

export async function getAllHainsGroups() {
  return await prismaDb.gruppes.findMany({
    orderBy: {
      name: 'asc'
    }
  });
}
