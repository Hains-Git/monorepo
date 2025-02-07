import { Prisma } from '@prisma/client';
import { prismaDb } from '@my-workspace/prisma_hains';

export async function getDienstWuenscheInRange(start: Date, end: Date, include: Prisma.dienstwunschesInclude = {}) {
  return await prismaDb.dienstwunsches.findMany({
    where: {
      tag: {
        gte: start,
        lte: end
      },
      mitarbeiters: {
        platzhalter: false
      }
    },
    include,
    orderBy: {
      dienstkategorie_id: 'asc'
    }
  });
}
