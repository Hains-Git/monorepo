import { prismaDb } from '@my-workspace/prisma_hains';

export async function getVertragsTypsForMitarbeiterinfo() {
  return await prismaDb.vertragstyps.findMany({
    include: {
      vertragsgruppes: {
        include: {
          vertragsstuves: {
            include: {
              vertragsgruppes: true,
              vertrags_variantes: true
            }
          },
          vertragstyps: true
        }
      }
    }
  });
}
