import { Prisma } from '@prisma/client';
import { prismaDb } from '@my-workspace/prisma_hains';
import { newDate } from '@my-workspace/utils';
import { startOfMonth } from 'date-fns';

export async function findOne<TInclude extends Prisma.dienstwunschesInclude | undefined>(
  condition: Omit<Prisma.dienstwunschesFindUniqueArgs, 'include'>,
  include?: TInclude
) {
  const result = await prismaDb.dienstwunsches.findUnique({
    ...condition,
    include: include
  });
  return result as Prisma.dienstwunschesGetPayload<{ include: TInclude }> | null;
}

export async function findMany<TInclude extends Prisma.dienstwunschesInclude | undefined>(
  condition?: Omit<Prisma.dienstwunschesFindManyArgs, 'include'>,
  include?: TInclude
) {
  const result = await prismaDb.dienstwunsches.findMany({
    ...condition,
    include: include
  });
  return result as Prisma.dienstwunschesGetPayload<{ include: TInclude }>[];
}

export async function getGroupByTagDkIdByRange(anfang: Date, ende: Date) {
  const wuensche = await prismaDb.dienstwunsches.groupBy({
    by: ['tag', 'dienstkategorie_id'],
    where: {
      tag: {
        gte: anfang,
        lte: ende
      },
      dienstkategories: {
        selectable: true
      }
    },
    _count: {
      _all: true
    },
    orderBy: [{ tag: 'asc' }]
  });
  return wuensche;
}

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
