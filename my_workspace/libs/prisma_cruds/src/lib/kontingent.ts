import { Prisma } from '@prisma/client';
import { prismaDb } from '@my-workspace/prisma_hains';

export async function getAll<TInclude extends Prisma.kontingentsInclude>(include?: TInclude) {
  return ((await prismaDb.kontingents.findMany({ include })) || []) as Prisma.kontingentsGetPayload<{
    include: TInclude;
  }>[];
}

export async function getDefaults() {
  return await prismaDb.kontingents.findFirst({
    where: {
      default: true
    },
    include: {
      teams: true
    }
  });
}
