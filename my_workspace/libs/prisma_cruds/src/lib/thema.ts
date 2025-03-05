import { Prisma } from '@prisma/client';
import { prismaDb } from '@my-workspace/prisma_hains';

export async function findOne<TInclude extends Prisma.themasInclude | undefined>(
  condition: Omit<Prisma.themasFindUniqueArgs, 'include'>,
  include?: TInclude
) {
  const result = await prismaDb.themas.findUnique({
    ...condition,
    include: include
  });
  return result as Prisma.themasGetPayload<{ include: TInclude }> | null;
}

export async function findMany<TInclude extends Prisma.themasInclude | undefined>(
  condition?: Omit<Prisma.themasFindManyArgs, 'include'>,
  include?: TInclude
) {
  const result = await prismaDb.themas.findMany({
    ...condition,
    include: include
  });
  return result as Prisma.themasGetPayload<{ include: TInclude }>[];
}
