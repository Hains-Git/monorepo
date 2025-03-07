import { prismaDb } from '@my-workspace/prisma_hains';

export async function getAllArbeitszeittypen() {
  return await prismaDb.arbeitszeittyps.findMany();
}
