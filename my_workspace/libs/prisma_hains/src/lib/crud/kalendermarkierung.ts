import { prismaDb } from '../prisma-hains';

export async function getKalenderMarkierungByDateRange(dateStart: Date, dateEnd: Date) {
  const kalendermarkierungen = await prismaDb.kalendermarkierungs.findMany({
    where: {
      OR: [
        {
          AND: [{ start: { gte: dateStart } }, { ende: { lte: dateEnd } }]
        },
        {
          AND: [{ start: { lte: dateStart } }, { ende: { lte: dateEnd } }]
        },
        {
          AND: [{ start: { gte: dateStart } }, { ende: { gte: dateEnd } }]
        }
      ]
    }
  });
  return kalendermarkierungen;
}
