import { prismaDb } from '@my-workspace/prisma_hains';

export async function getAll() {
  const freigabenStatusAll = await prismaDb.freigabestatuses.findMany();
  return freigabenStatusAll;
}
