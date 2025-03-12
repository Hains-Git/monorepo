import { Prisma } from '@prisma/client';
import { prismaDb } from '@my-workspace/prisma_hains';

export async function findOne<TInclude extends Prisma.nicht_einteilen_absprachensInclude | undefined>(
  condition: Omit<Prisma.nicht_einteilen_absprachensFindUniqueArgs, 'include'>,
  include?: TInclude
) {
  const result = await prismaDb.nicht_einteilen_absprachens.findUnique({
    ...condition,
    include: include
  });
  return result as Prisma.nicht_einteilen_absprachensGetPayload<{ include: TInclude }> | null;
}

export async function findMany<TInclude extends Prisma.nicht_einteilen_absprachensInclude | undefined>(
  condition?: Omit<Prisma.nicht_einteilen_absprachensFindManyArgs, 'include'>,
  include?: TInclude
) {
  const result = await prismaDb.nicht_einteilen_absprachens.findMany({
    ...condition,
    include: include
  });
  return result as Prisma.nicht_einteilen_absprachensGetPayload<{ include: TInclude }>[];
}
