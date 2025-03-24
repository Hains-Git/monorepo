import { prismaDb } from '@my-workspace/prisma_hains';

export async function getAbwesenheitenSettings(mitarbeiterId: number) {
  return await prismaDb.abwesentheitenueberblick_settings.findFirst({
    where: {
      mitarbeiter_id: mitarbeiterId
    }
  });
}

export async function getAbwesenheitenCounters(mitarbeiterId: number) {
  return await prismaDb.abwesentheitenueberblick_counters.findMany({
    where: {
      mitarbeiter_id: mitarbeiterId
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
