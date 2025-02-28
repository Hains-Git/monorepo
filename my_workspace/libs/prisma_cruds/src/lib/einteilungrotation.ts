import { Prisma } from '@prisma/client';
import { prismaDb } from '@my-workspace/prisma_hains';
import { whereRotationIn } from './utils/crud_helper';

export async function einteilungRotationByTag(tag: Date, mitarbeiterId: number) {
  return await prismaDb.einteilung_rotations.findMany({
    where: {
      mitarbeiter_id: mitarbeiterId,
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

export async function getRotationenInRange<
  TInclude extends Prisma.einteilung_rotationsInclude,
  TOrderBy extends Prisma.einteilung_rotationsOrderByWithRelationInput[]
>(anfang: Date, ende: Date, include?: TInclude, orderBy?: TOrderBy) {
  return ((await prismaDb.einteilung_rotations.findMany({
    where: {
      ...whereRotationIn(anfang, ende),
      mitarbeiters: {
        platzhalter: false
      }
    },
    include,
    orderBy
  })) || []) as Prisma.einteilung_rotationsGetPayload<{ include: TInclude; orderBy: TOrderBy }>[];
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
