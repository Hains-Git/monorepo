import { prismaDb } from '../prisma-hains';

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
