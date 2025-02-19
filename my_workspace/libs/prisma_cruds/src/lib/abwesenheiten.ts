import { prismaDb } from '@my-workspace/prisma_hains';

export async function getAbwesenheitenSettings(userId: number) {
  return await prismaDb.abwesentheitenueberblick_settings.findFirst({
    where: {
      mitarbeiter_id: userId
    }
  });
}

export async function getAbwesenheitenCounters(userId: number) {
  return await prismaDb.abwesentheitenueberblick_counters.findMany({
    where: {
      mitarbeiter_id: userId
    }
  });
}

export async function getAllAbwesenheitenSpalten() {
  return await prismaDb.abwesentheiten_spaltens.findMany();
}

export async function getAbwesenheitenByYear(year: number) {
  return await prismaDb.abwesentheitenueberblicks.findMany({
    where: {
      jahr: year
    }
  });
}
