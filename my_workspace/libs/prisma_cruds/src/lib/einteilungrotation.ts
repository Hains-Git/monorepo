import { Prisma } from '@prisma/client';
import { prismaDb } from '@my-workspace/prisma_hains';

export async function einteilungRotationByTag(tag: Date) {
  return await prismaDb.einteilung_rotations.findMany({
    where: {
      von: { lte: tag },
      bis: { gte: tag }
    },
    orderBy: {
      prioritaet: 'asc'
    }
  });
}

export async function getRotationenInRange(anfang: Date, ende: Date, include: Prisma.einteilung_rotationsInclude = {}) {
  return await prismaDb.einteilung_rotations.findMany({
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
  });
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
