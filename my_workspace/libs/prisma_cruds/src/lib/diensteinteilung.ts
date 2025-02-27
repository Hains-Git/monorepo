import {
  account_infos,
  arbeitszeittyps,
  bedarfs_eintrags,
  diensteinteilungs,
  dienstplanbedarves,
  dienstplans,
  einteilungskontexts,
  einteilungsstatuses,
  mitarbeiters,
  po_diensts,
  Prisma,
  schichts,
  teams
} from '@prisma/client';
import { prismaDb } from '@my-workspace/prisma_hains';
import { startOfMonth, endOfMonth, parseISO, formatDate } from 'date-fns';
import { formatDateForDB, getDateStr, newDate } from '@my-workspace/utils';

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
) {
  const startDate = formatDateForDB(start);
  const endDate = formatDateForDB(end);

  return ((await prismaDb.diensteinteilungs.findMany({
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
  })) || []) as Prisma.diensteinteilungsGetPayload<{ include: TInclude }>[];
}

export async function getDiensteinteilungInRange(
  anfang: Date,
  ende: Date,
  _condition: Prisma.diensteinteilungsWhereInput | null = null
) {
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

export async function getMitarbeiterEinteilungenNachTagen(start: Date, ende: Date) {
  const einteilungen = await prismaDb.$queryRaw<
    {
      mitarbeiter_id: number;
      tag: Date;
      einteilungen: string;
    }[]
  >`
    SELECT DISTINCT
          m.id AS mitarbeiter_id,
          de.tag,
          STRING_AGG(
            t.id
            || ',' || p.id
            || ',' || p.stundennachweis_krank
            || ',' || p.stundennachweis_urlaub
            || ',' || p.stundennachweis_sonstig
            || ',' || CASE WHEN (
                        SELECT COUNT(*) FROM dienstbedarves AS db
                          WHERE db.po_dienst_id = p.id
                        ) > 0
                      THEN CAST((
                          SELECT COUNT(*)  FROM dienstbedarves AS db
                          WHERE db.po_dienst_id = p.id
                          AND db.ignore_in_urlaubssaldo
                        ) AS varchar)
                      ELSE 'false'
                      END
            || ',' || CASE WHEN de.bereich_id IS NULL THEN 0 ELSE de.bereich_id END
            || ',' || CASE WHEN de.is_optional THEN 1 ELSE 0 END
            || ',' || CASE WHEN p.as_abwesenheit THEN 1 ELSE 0 END
            , ';'
          ) as einteilungen
          FROM diensteinteilungs AS de
          JOIN einteilungsstatuses AS es ON es.id = de.einteilungsstatus_id AND counts
          JOIN mitarbeiters AS m ON m.id = de.mitarbeiter_id AND platzhalter = FALSE
          JOIN po_diensts AS p ON p.id = de.po_dienst_id
          JOIN teams AS t ON p.team_id = t.id
          GROUP BY m.id, de.tag
          HAVING de.tag >= ${start} AND de.tag <= ${ende}
          ORDER BY m.id, de.tag
    `;
  return einteilungen.reduce((acc: Record<number, Record<string, string[][]>>, e) => {
    const dateStr = getDateStr(e.tag);
    const mId = e.mitarbeiter_id;
    const einteilungen = e.einteilungen.split(';').map((e) => e.split(','));
    acc[mId] ||= {};
    acc[mId][dateStr] = einteilungen;
    return acc;
  }, {});
}

export async function getPossibleDienstfrei(tage: Date[], mitarbeiterIds: number[] = [], onlyCounts = false) {
  const firstDate = tage[0];
  const lastMonth = newDate(firstDate);
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  console.log(lastMonth);
  // Funktioniert noch nicht!!!!
  const query = Prisma.sql(
    [
      `SELECT DISTINCT 
      de.id, de.tag
      FROM diensteinteilungs AS de
      JOIN einteilungsstatuses AS es ON es.id = de.einteilungsstatus_id
      JOIN mitarbeiters AS m ON m.id = de.mitarbeiter_id
      JOIN bedarfs_eintrags AS be ON be.po_dienst_id = de.po_dienst_id 
      AND be.tag = de.tag
      AND de.bereich_id IS NULL OR de.bereich_id = be.bereich_id
      LEFT OUTER JOIN dienstplans AS dpl ON (
        dpl.dienstplanbedarf_id = be.dienstplanbedarf_id OR dpl.dienstplanbedarf_id IS NULL
      ) AND de.dienstplan_id = dpl.id
      JOIN bedarfs_eintrags AS be1 ON be1.first_entry = be.first_entry
      JOIN schichts AS s1 ON s1.bedarfs_eintrag_id = be1.id
      JOIN arbeitszeittyps AS a1 ON a1.id = s1.arbeitszeittyp_id
      WHERE m.platzhalter = FALSE
      AND `,
      '',
      'AND de.tag >=',
      'AND (',
      ') ORDER BY de.tag ASC',
      ''
    ],
    onlyCounts ? 'es.counts = true' : 'es.counts = true AND es.public = true',
    mitarbeiterIds.length ? `AND de.mitarbeiter_id IN (${mitarbeiterIds.join(',')}` : '',
    getDateStr(lastMonth),
    tage
      .map((tag) => {
        const dateStr = getDateStr(tag);
        return `(
          de.tag < '${dateStr}'
          AND be1.tag < '${dateStr}'
          AND (
            be1.tag + interval '1 days'*be1.ausgleich_tage >= '${dateStr}'
            OR s1.anfang::DATE + interval '1 days'*be1.ausgleich_tage > '${dateStr}'
            OR (
              s1.ende::DATE > '${dateStr}'
              AND a1.dienstzeit = FALSE
              AND a1.arbeitszeit = FALSE
            ) 
          )
        )`;
      })
      .join(' OR ')
  );
  const einteilungenTagIds = (
    await prismaDb.$queryRaw<
      {
        id: number;
        tag: Date;
      }[]
    >(query)
  ).reduce((acc: Record<string, number[]>, e) => {
    const dateStr = getDateStr(e.tag);
    acc[dateStr] ||= [];
    acc[dateStr].push(e.id);
    return acc;
  }, {});
  console.log(einteilungenTagIds);

  type Einteilungen = (diensteinteilungs & {
    einteilungskontext: einteilungskontexts | null;
    einteilungsstatuses: einteilungsstatuses | null;
    dienstplans:
      | ({
          dienstplanbedarves: dienstplanbedarves | null;
        } & dienstplans)
      | null;
    mitarbeiters: ({ account_info: account_infos | null } & mitarbeiters) | null;
    po_diensts:
      | ({
          teams: teams | null;
          bedarfs_eintrags: ({
            schichts: ({ arbeitszeittyps: arbeitszeittyps | null } & schichts)[];
            first_bedarf:
              | ({
                  schichts: ({ arbeitszeittyps: arbeitszeittyps | null } & schichts)[];
                } & bedarfs_eintrags)
              | null;
          } & bedarfs_eintrags)[];
        } & po_diensts)
      | null;
  })[];

  const results: Einteilungen = [];
  // for (const tag in einteilungenTagIds) {
  //   const ids = einteilungenTagIds[tag];
  //   const date = newDate(tag);
  //   const einteilungen: Einteilungen = await prismaDb.diensteinteilungs.findMany({
  //     where: {
  //       id: {
  //         in: ids
  //       },
  //       tag: date
  //     },
  //     include: {
  //       einteilungskontext: true,
  //       einteilungsstatuses: true,
  //       dienstplans: {
  //         include: {
  //           dienstplanbedarves: true
  //         }
  //       },
  //       mitarbeiters: {
  //         include: {
  //           account_info: true
  //         }
  //       },
  //       po_diensts: {
  //         include: {
  //           teams: true,
  //           bedarfs_eintrags: {
  //             include: {
  //               schichts: {
  //                 include: {
  //                   arbeitszeittyps: true
  //                 }
  //               },
  //               first_bedarf: {
  //                 include: {
  //                   schichts: {
  //                     include: {
  //                       arbeitszeittyps: true
  //                     }
  //                   }
  //                 }
  //               }
  //             },
  //             where: {
  //               tag: date
  //             }
  //           }
  //         }
  //       }
  //     }
  //   });
  //   results.concat(einteilungen);
  // }
  return results;
}
