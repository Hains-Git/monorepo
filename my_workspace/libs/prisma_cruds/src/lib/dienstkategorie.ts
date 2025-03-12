import { Prisma } from '@prisma/client';
import { prismaDb } from '@my-workspace/prisma_hains';

export async function findOne<TInclude extends Prisma.dienstkategoriesInclude | undefined>(
  condition: Omit<Prisma.dienstkategoriesFindUniqueArgs, 'include'>,
  include?: TInclude
) {
  const result = await prismaDb.dienstkategories.findUnique({
    ...condition,
    include: include
  });
  return result as Prisma.dienstkategoriesGetPayload<{ include: TInclude }> | null;
}

export async function findMany<TInclude extends Prisma.dienstkategoriesInclude | undefined>(
  condition?: Omit<Prisma.dienstkategoriesFindManyArgs, 'include'>,
  include?: TInclude
) {
  const result = await prismaDb.dienstkategories.findMany({
    ...condition,
    include: include
  });
  return result as Prisma.dienstkategoriesGetPayload<{ include: TInclude }>[];
}

export async function getAllDienstkategories<TInclude extends Prisma.dienstkategoriesInclude>(
  include?: TInclude
) {
  return ((await prismaDb.dienstkategories.findMany({
    include
  })) || []) as Prisma.dienstkategoriesGetPayload<{ include: TInclude }>[];
}
