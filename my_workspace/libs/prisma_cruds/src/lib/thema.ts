import { prismaDb } from '@my-workspace/prisma_hains';

export async function getAllThemas() {
  return await prismaDb.themas.findMany();
}
