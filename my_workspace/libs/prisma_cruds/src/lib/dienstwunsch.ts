import { Prisma } from '@prisma/client';
import { prismaDb } from '@my-workspace/prisma_hains';

export async function getDienstWuenscheInRange<TInclude extends Prisma.dienstwunschesInclude>(
  start: Date,
  end: Date,
  include?: TInclude
): Promise<Prisma.dienstwunschesGetPayload<{ include: TInclude }>[] | null> {
  return (await prismaDb.dienstwunsches.findMany({
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
  })) as Prisma.dienstwunschesGetPayload<{ include: TInclude }>[] | null;
}
