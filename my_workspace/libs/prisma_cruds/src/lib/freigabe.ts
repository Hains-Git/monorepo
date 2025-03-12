import { prismaDb } from '@my-workspace/prisma_hains';

export async function getByMitarbeiterId(mitarbeiterId: number | string) {
  const freigaben = await prismaDb.$queryRawUnsafe(`
    SELECT
      freigabetyps.id as id,
      freigabetyps.name as name,
      freigabes.freigabestatus_id
    FROM freigabetyps
    LEFT OUTER JOIN (
      SELECT * FROM dienstfreigabes
      WHERE mitarbeiter_id = ${mitarbeiterId}
    ) as freigabes ON freigabetyps.id = freigabes.freigabetyp_id
    ORDER BY sort, name ASC
  `);

  return freigaben;
}
