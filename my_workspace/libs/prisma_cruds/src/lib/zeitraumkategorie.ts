import { prismaDb } from '@my-workspace/prisma_hains';
import { getZeitraumkategorienInterval } from './utils/crud_helper';

export async function getAllZeitraumKategories() {
  return await prismaDb.zeitraumkategories.findMany();
}

export async function getZeitraumKategoriesInRange(anfang: Date, ende: Date) {
  const zeitraumkategorien = await prismaDb.zeitraumkategories.findMany({
    where: getZeitraumkategorienInterval(anfang, ende),
    orderBy: {
      prio: 'desc'
    }
  });

  return zeitraumkategorien;
}
