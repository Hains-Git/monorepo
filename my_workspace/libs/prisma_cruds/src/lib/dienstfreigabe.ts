import { prismaDb } from '@my-workspace/prisma_hains';

export async function getFreigabenTypenIdsByMitarbeiterId(mitarbeiterId: number) {
  const freigabenTypenIds = await prismaDb.dienstfreigabes.findMany({
    where: {
      mitarbeiter_id: Number(mitarbeiterId),
      freigabestatuses: {
        counts_active: true
      }
    },
    select: {
      freigabetyp_id: true
    }
  });
  return freigabenTypenIds;
}
