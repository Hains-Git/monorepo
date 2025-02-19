import { prismaDb } from '@my-workspace/prisma_hains';

export async function getWochenbilanzByKalenderWocheForMitarbeiters(kwId: number, mitarbeiterIds: number[]) {
  return await prismaDb.wochenbilanzs.findMany({
    where: {
      kalenderwoche_id: kwId,
      mitarbeiter_id: {
        in: mitarbeiterIds
      }
    }
  });
}
