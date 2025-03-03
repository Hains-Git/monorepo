import { mitarbeiters, Prisma } from '@prisma/client';
import { prismaDb } from '@my-workspace/prisma_hains';
import { FindManyArgsTypes } from './utils/types';

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
