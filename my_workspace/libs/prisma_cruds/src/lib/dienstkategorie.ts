import { Prisma } from '@prisma/client';
import { prismaDb } from '@my-workspace/prisma_hains';

export async function getAllDienstkategories<TInclude extends Prisma.dienstkategoriesInclude>(include?: TInclude) {
  return ((await prismaDb.dienstkategories.findMany({
    include
  })) || []) as Prisma.dienstkategoriesGetPayload<{ include: TInclude }>[];
}
