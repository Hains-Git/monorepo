import { prismaDb } from '@my-workspace/prisma_hains';

export async function getByMitarbeiterId(mitarbeiterId: number) {
  const result = await prismaDb.arbeitszeit_absprachens.findMany({
    where: {
      mitarbeiter_id: Number(mitarbeiterId)
    },
    include: {
      zeitraumkategories: true
    }
  });
  return result;
}
