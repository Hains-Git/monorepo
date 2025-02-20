import { Prisma } from '@prisma/client';
import { prismaDb } from '@my-workspace/prisma_hains';
import { newDate } from '@my-workspace/utils';
import { startOfMonth } from 'date-fns';

export async function getDienstWuenscheInRange<TInclude extends Prisma.dienstwunschesInclude>(
  start: Date,
  end: Date,
  include?: TInclude
) {
  return ((await prismaDb.dienstwunsches.findMany({
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
  })) || []) as Prisma.dienstwunschesGetPayload<{ include: TInclude }>[];
}

export async function getByMitarbeiterIdForFuture(mitarbeiterId: number) {
  const today = newDate();
  const beginningOfMonth = startOfMonth(today);
  const diestwuensche = await prismaDb.dienstwunsches.findMany({
    where: {
      mitarbeiter_id: Number(mitarbeiterId),
      tag: {
        gte: beginningOfMonth
      }
    }
  });

  return diestwuensche;
}
