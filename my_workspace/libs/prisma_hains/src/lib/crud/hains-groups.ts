import { prismaDb } from '../prisma-hains';

export async function getAllHainsGroups() {
  return await prismaDb.gruppes.findMany({
    orderBy: {
      name: 'asc'
    }
  });
}
