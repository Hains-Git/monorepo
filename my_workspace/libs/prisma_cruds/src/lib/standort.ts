import { prismaDb } from '@my-workspace/prisma_hains';

export async function getAllStandorte() {
  return await prismaDb.standorts.findMany();
}
