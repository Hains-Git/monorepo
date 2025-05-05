import { prismaDb } from '@my-workspace/prisma_hains';
import { whereMitarbeiterAktivNoPlatzhalter } from './utils/crud_helper';
import { newDateYearMonthDay } from '@my-workspace/utils';

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

export async function getAbwesenheitenRelations(year: number) {
  const sumsAbw = await prismaDb.abwesentheitenueberblicks.aggregate({
    _sum: { ru: true, ug: true },
    where: {
      jahr: year,
      mitarbeiters: {
        ...whereMitarbeiterAktivNoPlatzhalter(newDateYearMonthDay(year, 0, 1), newDateYearMonthDay(year, 11, 31))
      }
    }
  });

  if (sumsAbw._sum.ru == null || sumsAbw._sum.ug == null || sumsAbw._sum.ug == 0) {
    return 0;
  }
  const precision = 2;
  const factor = Math.pow(10, precision);
  return Math.round((sumsAbw._sum.ru / sumsAbw._sum.ug) * factor) / factor;
}
