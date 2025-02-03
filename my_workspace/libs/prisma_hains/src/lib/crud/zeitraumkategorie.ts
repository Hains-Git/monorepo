import { prismaDb } from '../prisma-hains';

export async function getAllZeitraumKategories() {
  return await prismaDb.zeitraumkategories.findMany();
}
