import { Prisma } from '@prisma/client';
import { prismaDb } from '@my-workspace/prisma_hains';
import { FindManyArgsTypes } from './utils/types';

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
  return await prismaDb.mitarbeiters.findMany(condition);
}

export async function getMitarbeiterForUrlaubssaldis(mitarbeiterIds: number[]) {
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
        include: {
          vertrags_arbeitszeits: true,
          vertrags_phases: true
        }
      }
    }
  });
}
