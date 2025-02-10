import { Prisma } from '@prisma/client';
import { prismaDb } from '@my-workspace/prisma_hains';
import { startOfMonth, endOfMonth, parseISO, formatDate } from 'date-fns';
import { formatDateForDB } from '@my-workspace/utils';

type TParamsOhneBedarf = {
  von: Date;
  bis: Date;
  counts?: boolean;
  isPublic?: boolean;
  poDienstIds?: number[] | undefined;
  mitarbeiterIds?: number[] | undefined;
};

export async function getEinteilungenOhneBedarf({
  von,
  bis,
  counts = true,
  isPublic = true,
  poDienstIds = undefined,
  mitarbeiterIds = undefined
}: TParamsOhneBedarf) {
  const dateStart = typeof von === 'string' ? parseISO(von) : von;
  const dateEnd = typeof bis === 'string' ? parseISO(bis) : bis;
  const dpAnfang = formatDate(startOfMonth(dateStart), 'yyyy-MM-dd');
  const dpEnde = formatDate(endOfMonth(dateEnd), 'yyyy-MM-dd');

  const result = await prismaDb.$queryRawUnsafe(
    `
  WITH RankedResults AS (
    SELECT de.*,
    ROW_NUMBER() OVER (PARTITION BY de.tag, de.po_dienst_id, de.mitarbeiter_id ORDER BY de.updated_at DESC) AS RowNum
    FROM public.diensteinteilungs AS de
    LEFT JOIN public.dienstbedarves AS db ON db.po_dienst_id = de.po_dienst_id
    JOIN public.po_diensts AS po ON de.po_dienst_id = po.id
    JOIN public.einteilungsstatuses AS es ON es.id = de.einteilungsstatus_id
    JOIN public.mitarbeiters AS m ON m.id = de.mitarbeiter_id
    WHERE ${!mitarbeiterIds ? `m.aktiv = true AND m.platzhalter != true` : `m.id IN (${mitarbeiterIds.join(',')})`}
    ${!poDienstIds ? `` : `AND de.po_dienst_id IN (${poDienstIds.join(',')})`}
    AND de.tag >= $1 AND de.tag <= $2
    AND de.dienstplan_id IN (
      SELECT dp.id FROM public.dienstplans AS dp
      WHERE (dp.anfang <= '${dpAnfang}' AND dp.ende >= '${dpEnde}')
      OR (dp.anfang <= '${dpEnde}' AND dp.ende >= '${dpEnde}')
      OR (dp.anfang >= '${dpAnfang}' AND dp.ende <= '${dpEnde}')
      OR (dp.anfang IS NULL AND dp.ende IS NULL)
    )
    AND es.public = ${isPublic} AND es.counts = ${counts}
    AND db.id IS NULL
  )
  SELECT id,
  mitarbeiter_id, einteilungsstatus_id, po_dienst_id, tag,
  updated_at, created_at, dienstplan_id, reason, number,
  einteilungskontext_id, doppeldienst_id, schicht_nummern,
  arbeitsplatz_id, bereich_id, context_comment, info_comment, is_optional
  FROM RankedResults
  WHERE RowNum = 1
  ORDER BY mitarbeiter_id, tag
`,
    dateStart,
    dateEnd,
    dpAnfang,
    dpEnde,
    isPublic,
    counts
  );

  return result;
}

export async function getPublicRangeEinteilungenForMitarbeiter<TInclude extends Prisma.diensteinteilungsInclude>(
  id: number,
  start: Date,
  end: Date,
  include?: TInclude
): Promise<Prisma.diensteinteilungsGetPayload<{ include: TInclude }>[] | null> {
  const startDate = formatDateForDB(start);
  const endDate = formatDateForDB(end);

  return (await prismaDb.diensteinteilungs.findMany({
    where: {
      mitarbeiter_id: id,
      tag: {
        gte: startDate,
        lte: endDate
      },
      einteilungsstatuses: {
        counts: true,
        public: true
      }
    },
    include
  })) as Prisma.diensteinteilungsGetPayload<{ include: TInclude }>[] | null;
}

export async function getDiensteinteilungInRange(anfang: Date, ende: Date, _condition: any) {
  const condition = _condition
    ? _condition
    : {
        tag: {
          gte: anfang,
          lte: ende
        }
      };

  return await prismaDb.diensteinteilungs.findMany({
    where: { ...condition },
    orderBy: [
      { tag: 'asc' },
      { po_dienst_id: 'asc' },
      { einteilungsstatuses: { public: 'desc' } },
      { bereich_id: 'asc' },
      { updated_at: 'asc' }
    ]
  });
}
