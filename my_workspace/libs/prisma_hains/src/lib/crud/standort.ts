import { prismaDb } from '../prisma-hains';

export async function getAllStandorte() {
  return await prismaDb.standorts.findMany();
}
