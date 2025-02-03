import { prismaDb } from '../prisma-hains';

export async function getVertragsTypsForMitarbeiterinfo() {
  return await prismaDb.vertragstyps.findMany({
    include: {
      vertragsgruppes: {
        include: {
          vertragsstuves: true
        }
      },
      vertrags_variantes: true
    }
  });
}
