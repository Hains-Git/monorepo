import { prismaDb } from '@my-workspace/prisma_hains';

export async function getAllMerkmal() {
  return await prismaDb.merkmals.findMany();
}
