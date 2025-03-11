import { mitarbeiters, Prisma } from '@prisma/client';
import { prismaDb } from '@my-workspace/prisma_hains';
import { FindManyArgsTypes } from './utils/types';
import {
  whereMitarbeiterAktivNoPlatzhalter,
  whereRotationIn,
  whereVertragIn,
  whereVertragsphaseIn
} from './utils/crud_helper';

export async function findOne<TInclude extends Prisma.mitarbeitersInclude | undefined>(
  condition: Omit<Prisma.mitarbeitersFindUniqueArgs, 'include'>,
  include?: TInclude
) {
  const result = await prismaDb.mitarbeiters.findUnique({
    ...condition,
    include: include
  });
  return result as Prisma.mitarbeitersGetPayload<{ include: TInclude }> | null;
}

export async function findMany<TInclude extends Prisma.mitarbeitersInclude | undefined>(
  condition?: Omit<Prisma.mitarbeitersFindManyArgs, 'include'>,
  include?: TInclude
) {
  const result = await prismaDb.mitarbeiters.findMany({
    ...condition,
    include: include
  });
  return result as Prisma.mitarbeitersGetPayload<{ include: TInclude }>[];
}

export async function getMitarbeiterById<TInclude extends Prisma.mitarbeitersInclude>(
  id: number | string,
  include?: TInclude
) {
  const mitarbeiterId = Number(id);
  const result = await prismaDb.mitarbeiters.findUnique({
    where: { id: mitarbeiterId },
    include
  });

  return result as Prisma.mitarbeitersGetPayload<{ include: TInclude }> | null;
}

export async function getAllActiveMitarbeiter() {
  return await prismaDb.mitarbeiters.findMany({
    where: {
      aktiv: true,
      platzhalter: false
    }
  });
}

export async function getAllMitarbeiter() {
  return await prismaDb.mitarbeiters.findMany();
}

export async function getMitarbeitersWithoutAccountInfo() {
  return await prismaDb.mitarbeiters.findMany({
    where: {
      platzhalter: false,
      aktiv: true,
      account_info: null
    }
  });
}

export async function getMitarbeitersByCustomQuery(condition: FindManyArgsTypes['mitarbeiters']) {
  const result = await prismaDb.mitarbeiters.findMany(condition);
  return result;
}

export async function getMitarbeiterForUrlaubssaldis(mitarbeiterIds: number[], start: Date, ende: Date) {
  return await prismaDb.mitarbeiters.findMany({
    where: {
      platzhalter: false,
      OR: [
        {
          aktiv: true
        },
        {
          id: {
            in: mitarbeiterIds
          }
        }
      ]
    },
    include: {
      urlaubssaldo_abspraches: true,
      funktion: {
        include: {
          teams: true
        }
      },
      account_info: true,
      vertrags: {
        where: {
          ...whereVertragIn(start, ende)
        },
        orderBy: [{ anfang: 'asc' }, { ende: 'asc' }],
        include: {
          vertrags_arbeitszeits: {
            where: {
              ...whereVertragsphaseIn(start, ende),
              vk: { gt: 0, lte: 1 },
              tage_woche: { gt: 0, lte: 7 }
            },
            orderBy: [{ von: 'asc' }, { bis: 'asc' }]
          },
          vertrags_phases: {
            where: {
              ...whereVertragsphaseIn(start, ende)
            },
            orderBy: [{ von: 'asc' }, { bis: 'asc' }]
          }
        }
      },
      einteilung_rotations: {
        include: {
          kontingents: {
            include: {
              teams: true
            }
          }
        },
        where: {
          ...whereRotationIn(start, ende)
        },
        orderBy: [{ prioritaet: 'asc' }, { von: 'asc' }]
      }
    }
  });
}

export type mitarbeiterUrlaubssaldo = Awaited<ReturnType<typeof getMitarbeiterForUrlaubssaldis>>[number];

export async function mitarbeiterUrlaubssaldoAktivAm(date: Date, id: number) {
  return await prismaDb.mitarbeiters.findFirst({
    where: {
      id,
      urlaubssaldo_abspraches: {
        none: { von: { lte: date }, bis: { gte: date } }
      },
      ...whereMitarbeiterAktivNoPlatzhalter(date, date)
    }
  });
}
