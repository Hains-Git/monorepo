import { prismaDb } from '@my-workspace/prisma_hains';

export async function getAllDateiTyps() {
  return await prismaDb.datei_typs.findMany();
}
