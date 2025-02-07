import { feiertages } from '@prisma/client';
import { prismaDb } from '@my-workspace/prisma_hains';

export async function getPlanerDateFeiertage(date: Date) {
  const feiertag = await prismaDb.feiertages.findFirst({
    where: {
      datum: date
    }
  });
  return feiertag;
}

type TCreateFeiertageInput = Omit<feiertages, 'id' | 'counts_every_year' | 'key' | 'created_at' | 'updated_at'>;
export async function createPlanerDate({ name, tag, monat, datum, jahr }: TCreateFeiertageInput) {
  const now = new Date();
  const feiertag = await prismaDb.feiertages.create({
    data: {
      name,
      tag,
      monat,
      datum,
      created_at: now,
      updated_at: now,
      jahr
    }
  });

  return feiertag;
}

export const existFeiertagEntryByYear = async (year: number) => {
  const feiertag = await prismaDb.feiertages.findFirst({
    where: {
      jahr: year
    }
  });
  return feiertag;
};
