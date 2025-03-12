import { prismaDb } from '@my-workspace/prisma_hains';

export async function getByMitarbeiterId(mitarbeiterId: number) {
  return await prismaDb.urlaubssaldo_abspraches.findMany({
    where: {
      mitarbeiter_id: Number(mitarbeiterId)
    }
  });
}
