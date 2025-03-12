import { Prisma } from '@prisma/client';
import { prismaDb } from '@my-workspace/prisma_hains';

export async function findOne<TInclude extends Prisma.geraetsInclude | undefined>(
  condition: Omit<Prisma.geraetsFindUniqueArgs, 'include'>,
  include?: TInclude
) {
  const result = await prismaDb.geraets.findUnique({
    ...condition,
    include: include
  });
  return result as Prisma.geraetsGetPayload<{ include: TInclude }> | null;
}

export async function findMany<TInclude extends Prisma.geraetsInclude | undefined>(
  condition?: Omit<Prisma.geraetsFindManyArgs, 'include'>,
  include?: TInclude
) {
  const result = await prismaDb.geraets.findMany({
    ...condition,
    include: include
  });
  return result as Prisma.geraetsGetPayload<{ include: TInclude }>[];
}
