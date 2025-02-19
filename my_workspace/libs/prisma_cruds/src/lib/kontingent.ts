import { Prisma } from '@prisma/client';
import { prismaDb } from '@my-workspace/prisma_hains';

export async function getAllKontingents<TInclude extends Prisma.kontingentsInclude>(include?: TInclude) {
  return ((await prismaDb.kontingents.findMany({ include })) || []) as Prisma.kontingentsGetPayload<{
    include: TInclude;
  }>[];
}

export async function getDefaultKontingents() {
  return await prismaDb.kontingents.findFirst({
    where: {
      default: true
    },
    include: {
      teams: true
    }
  });
}
