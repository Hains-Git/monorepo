import { prismaDb } from '@my-workspace/prisma_hains';

export async function getAllPoDiensts() {
  return await prismaDb.po_diensts.findMany();
}
