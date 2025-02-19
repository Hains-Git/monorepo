import { Prisma } from '@prisma/client';
import { prismaDb } from '@my-workspace/prisma_hains';

export async function einteilungRotationByTag(tag: Date, mitarbeiterId: number) {
  return await prismaDb.einteilung_rotations.findMany({
    where: {
      mitarbeiter_id: Number(mitarbeiterId),
      von: { lte: tag },
      bis: { gte: tag }
    },
    include: {
      kontingents: {
        include: {
          teams: true
        }
      }
    },
    orderBy: {
      prioritaet: 'asc'
    }
  });
}

export async function getRotationenInRange<TInclude extends Prisma.einteilung_rotationsInclude>(
  anfang: Date,
  ende: Date,
  include?: TInclude
) {
  return ((await prismaDb.einteilung_rotations.findMany({
    where: {
      OR: [
        {
          AND: [{ von: { lte: anfang } }, { bis: { gte: anfang } }]
        },
        {
          AND: [{ von: { lte: ende } }, { bis: { gte: ende } }]
        },
        {
          AND: [{ von: { gte: anfang } }, { bis: { lte: ende } }]
        }
      ],
      mitarbeiters: {
        platzhalter: false
      }
    },
    include
  })) || []) as Prisma.einteilung_rotationsGetPayload<{ include: TInclude }>[];
}

export async function getRotationenByKontingentFlag() {
  return await prismaDb.einteilung_rotations.findMany({
    where: {
      kontingents: {
        show_all_rotations: true
      }
    }
  });
}
