import { prismaDb } from '@my-workspace/prisma_hains';
import { FindManyArgsTypes } from './utils/types';

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
