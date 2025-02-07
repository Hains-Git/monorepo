import { Prisma } from '@prisma/client';
import { prismaDb } from '@my-workspace/prisma_hains';

export async function getAllKontingents(include: Prisma.kontingentsInclude = {}) {
  return await prismaDb.kontingents.findMany({ include });
}
