import { addDays, getYear, setYear } from 'date-fns';
import { Prisma, PrismaClient } from '@prisma/client';
import { prismaHains } from '../prisma-hains';
const prismaDb: PrismaClient<Prisma.PrismaClientOptions, 'query'> =
  prismaHains();

interface Feiertag {
  name: string;
  day: number;
  month: number;
  fullDate: Date;
}

export async function getFeiertag(date: Date): Promise<any[]> {
  await checkIfComputed(date.getFullYear());
  return prismaDb.feiertages.findMany({
    where: { datum: date },
  });
}

export async function isAt(date: Date): Promise<boolean> {
  await checkIfComputed(date.getFullYear());
  const count = await prismaDb.feiertages.count({
    where: { datum: date },
  });
  return count > 0;
}

async function checkIfComputed(year: number): Promise<void> {
  const count = await prismaDb.feiertages.count({
    where: { jahr: year },
  });
  if (count === 0) {
    await createFeiertage(year);
  }
}

export async function getHolidaysByYear(year: number): Promise<any[]> {
  let feiertage = await prismaDb.feiertages.findMany({
    where: { jahr: year },
  });
  if (feiertage.length === 0) {
    await createFeiertage(year);
    feiertage = await prismaDb.feiertages.findMany({
      where: { jahr: year },
    });
  }
  return feiertage;
}

export async function checkWeek(
  monday: Date,
  sunday: Date
): Promise<[number, number]> {
  await checkIfComputed(monday.getFullYear());
  await checkIfComputed(sunday.getFullYear());

  const feiertage = await prismaDb.feiertages.findMany({
    where: {
      datum: {
        gte: monday,
        lte: sunday,
      },
    },
  });

  const nFeiertage = feiertage.length;
  let nArbeitstage = 5;

  for (const feiertag of feiertage) {
    const date =
      feiertag?.datum instanceof Date ? new Date(feiertag?.datum) : new Date();
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      nArbeitstage -= 1;
    }
  }

  return [nFeiertage, nArbeitstage];
}

async function createFeiertage(year: number): Promise<void> {
  const yearStr = year.toString();
  const feiertage: Feiertag[] = [
    {
      name: 'Neujahr',
      day: 1,
      month: 1,
      fullDate: new Date(`${yearStr}-01-01`),
    },
    {
      name: 'Heilige Drei Könige',
      day: 6,
      month: 1,
      fullDate: new Date(`${yearStr}-01-06`),
    },
    {
      name: 'Tag der Arbeit',
      day: 1,
      month: 5,
      fullDate: new Date(`${yearStr}-05-01`),
    },

    {
      name: 'Tag der deutschen Einheit',
      day: 3,
      month: 10,
      fullDate: new Date(`${yearStr}-10-03`),
    },
    // {
    //     "name": "Reformationstag",
    //     "day": 31,
    //     "month": 10,
    //      fullDate: new Date(`${yearStr}-10-31`),
    // },
    {
      name: 'Allerheiligen',
      day: 1,
      month: 11,
      fullDate: new Date(`${yearStr}-11-01`),
    },
    {
      name: 'Heiligabend',
      day: 24,
      month: 12,
      fullDate: new Date(`${yearStr}-12-24`),
    },
    {
      name: 'Erster Weihnachtstag',
      day: 25,
      month: 12,
      fullDate: new Date(`${yearStr}-12-25`),
    },
    {
      name: 'Zweiter Weihnachtstag',
      day: 26,
      month: 12,
      fullDate: new Date(`${yearStr}-12-26`),
    },
    {
      name: 'Silvester',
      day: 31,
      month: 12,
      fullDate: new Date(`${yearStr}-12-31`),
    },
  ];

  const tagesDifferenzen: { [key: string]: number } = {
    Karfreitag: -2,
    Karsamstag: -1,
    Ostersonntag: 0,
    Ostermontag: 1,
    'Christi Himmelfahrt': 39,
    Pfingstsonntag: 49,
    Pfingstmontag: 50,
    Fronleichnam: 60,
  };

  const ostern = osterSonntag(year);
  for (const [name, differenz] of Object.entries(tagesDifferenzen)) {
    const osterDatum = addDays(ostern, differenz);
    feiertage.push({
      name,
      day: osterDatum.getDate(),
      month: osterDatum.getMonth() + 1,
      fullDate: osterDatum,
    });
  }

  for (const feiertag of feiertage) {
    await prismaDb.feiertages.create({
      data: {
        jahr: year,
        tag: feiertag.day,
        monat: feiertag.month,
        datum: feiertag.fullDate,
        name: feiertag.name,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }
}

function osterSonntag(jahr: number): Date {
  const a = jahr % 19;
  const d = (19 * a + 24) % 30;
  let tag = d + ((2 * (jahr % 4) + 4 * (jahr % 7) + 6 * d + 5) % 7);
  if (tag === 35 || (tag === 34 && d === 28 && a > 10)) {
    tag -= 7;
  }
  const osterDatum = setYear(new Date(jahr, 2, 22), jahr);
  return addDays(osterDatum, tag);
}