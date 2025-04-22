import { prismaDb } from '@my-workspace/prisma_hains';

export async function getByMitarbeiterId(mitarbeiterId: number) {
  const automatischeEinteilungen = await prismaDb.automatische_einteilungens.findMany({
    where: {
      mitarbeiter_id: Number(mitarbeiterId)
    },
    include: {
      po_dienst: true,
      zeitraumkategorie: true
    }
  });
  return automatischeEinteilungen;
}
