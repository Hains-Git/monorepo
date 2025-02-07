import { prismaDb } from '@my-workspace/prisma_hains';

export async function findFirstKalernderWoche(date: Date) {
  return await prismaDb.kalenderwoches.findFirst({
    where: {
      AND: [{ montag: { lte: date } }, { sonntag: { gte: date } }]
    }
  });
}

type TKalenderWocheCreate = {
  year: number;
  week: number;
  monday: Date;
  friday: Date;
  sunday: Date;
  nArbeitstage: number;
  nFeiertage: number;
};

export async function createKalenderWoche({
  year,
  week,
  monday,
  friday,
  sunday,
  nArbeitstage,
  nFeiertage
}: TKalenderWocheCreate) {
  return await prismaDb.kalenderwoches.create({
    data: {
      jahr: year,
      kw: week,
      montag: monday,
      freitag: friday,
      sonntag: sunday,
      arbeitstage: nArbeitstage,
      feiertage: nFeiertage,
      created_at: new Date(),
      updated_at: new Date()
    }
  });
}
