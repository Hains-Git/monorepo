import { prismaDb } from '../prisma-hains';

export async function getAllFunktionen() {
  return await prismaDb.funktions.findMany();
}
