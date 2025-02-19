import { prismaDb } from '@my-workspace/prisma_hains';

export async function getAllFunktionen() {
  return await prismaDb.funktions.findMany();
}
