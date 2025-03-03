import { Prisma } from '@prisma/client';
import { prismaDb } from '@my-workspace/prisma_hains';

export async function findOne<TInclude extends Prisma.geraetepassesInclude | undefined>(
  condition: Omit<Prisma.geraetepassesFindUniqueArgs, 'include'>,
  include?: TInclude
) {
  const result = await prismaDb.geraetepasses.findUnique({
    ...condition,
    include: include
  });
  return result as Prisma.geraetepassesGetPayload<{ include: TInclude }> | null;
}

export async function findMany<TInclude extends Prisma.geraetepassesInclude | undefined>(
  condition?: Omit<Prisma.geraetepassesFindManyArgs, 'include'>,
  include?: TInclude
) {
  const result = await prismaDb.geraetepasses.findMany({
    ...condition,
    include: include
  });
  return result as Prisma.geraetepassesGetPayload<{ include: TInclude }>[];
}
