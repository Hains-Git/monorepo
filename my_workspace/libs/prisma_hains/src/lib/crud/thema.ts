import { prismaDb } from '../prisma-hains';

export async function getAllThemas() {
  return await prismaDb.themas.findMany();
}
