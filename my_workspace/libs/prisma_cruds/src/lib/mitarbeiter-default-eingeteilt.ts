import { prismaDb } from '@my-workspace/prisma_hains';

type TKontingentDefaultEingeteiltSum = {
  id: number;
  mitarbeiter_id: number;
  eingeteilt: number;
  year: number;
};
export async function getKontingentDefaultEingeteiltsSum(mitarbeiterId: number) {
  const result = (await prismaDb.$queryRawUnsafe(`
    SELECT
      kontingents.id as id,
      CAST(SUM(eingeteilt) AS INTEGER) as eingeteilt,
      mitarbeiter_id,
      MAX(year) as year
    FROM
      mitarbeiter_default_eingeteilts as mde
    JOIN
      po_diensts AS pod ON mde.po_dienst_id = pod.id
    JOIN
      kontingent_po_diensts AS kpod ON kpod.po_dienst_id = pod.id
    JOIN
      kontingents ON kpod.kontingent_id = kontingents.id
    WHERE
      mitarbeiter_id = ${mitarbeiterId}
    GROUP BY
      kontingents.id, mitarbeiter_id
  `)) as TKontingentDefaultEingeteiltSum[];

  return result;
}
