import { prismaDb } from '../prisma-hains';

export async function getAllDateiTyps() {
  return await prismaDb.datei_typs.findMany();
}
