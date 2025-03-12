import { Prisma } from '@prisma/client';
import { prismaDb } from '@my-workspace/prisma_hains';

export async function getAll<TInclude extends Prisma.merkmalsInclude>(include?: TInclude) {
  return ((await prismaDb.merkmals.findMany({
    include
  })) || []) as Prisma.merkmalsGetPayload<{ include: TInclude }>[];
}
