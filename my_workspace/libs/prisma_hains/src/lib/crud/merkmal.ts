import { prismaDb } from '../prisma-hains';

export async function getAllMerkmal() {
  return await prismaDb.merkmals.findMany();
}
