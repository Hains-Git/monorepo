import { prismaDb } from '@my-workspace/prisma_hains';

export async function getByMitarbeiterId(mitarbeiterId: number) {
  const phasen = await prismaDb.vertrags_phases.findMany({
    where: {
      vertrags: {
        mitarbeiter_id: Number(mitarbeiterId)
      }
    },
    orderBy: [{ von: 'desc' }, { bis: 'desc' }]
  });
  return phasen;
}
