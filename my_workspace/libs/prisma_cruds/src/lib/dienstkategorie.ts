import { Prisma } from '@prisma/client';
import { prismaDb } from '@my-workspace/prisma_hains';

export async function getAllDienstkategories(include: Prisma.dienstkategoriesInclude = {}) {
  return await prismaDb.dienstkategories.findMany({
    include
  });
}
