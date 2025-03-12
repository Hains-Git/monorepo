import { Prisma } from '@prisma/client';
import { prismaDb } from '@my-workspace/prisma_hains';

export async function findOne<TInclude extends Prisma.dienstkategorie_teamsInclude | undefined>(
  condition: Omit<Prisma.dienstkategorie_teamsFindUniqueArgs, 'include'>,
  include?: TInclude
) {
  const result = await prismaDb.dienstkategorie_teams.findUnique({
    ...condition,
    include: include
  });
  return result as Prisma.dienstkategorie_teamsGetPayload<{ include: TInclude }> | null;
}

export async function findMany<TInclude extends Prisma.dienstkategorie_teamsInclude | undefined>(
  condition?: Omit<Prisma.dienstkategorie_teamsFindManyArgs, 'include'>,
  include?: TInclude
) {
  const result = await prismaDb.dienstkategorie_teams.findMany({
    ...condition,
    include: include
  });
  return result as Prisma.dienstkategorie_teamsGetPayload<{ include: TInclude }>[];
}
