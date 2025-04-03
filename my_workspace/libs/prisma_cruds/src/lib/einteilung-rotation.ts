import { Prisma } from '@prisma/client';
import { prismaDb } from '@my-workspace/prisma_hains';
import { TResultEinteilungenInKontingente } from './utils/types';

export async function findOne<TInclude extends Prisma.einteilung_rotationsInclude | undefined>(
  condition: Omit<Prisma.einteilung_rotationsFindUniqueArgs, 'include'>,
  include?: TInclude
) {
  const result = await prismaDb.einteilung_rotations.findUnique({
    ...condition,
    include: include
  });
  return result as Prisma.einteilung_rotationsGetPayload<{
    include: Prisma.einteilung_rotationsInclude;
  }> | null;
}

export async function findMany<TInclude extends Prisma.einteilung_rotationsInclude | undefined>(
  condition?: Omit<Prisma.einteilung_rotationsFindManyArgs, 'include'>,
  include?: TInclude
) {
  const result = await prismaDb.einteilung_rotations.findMany({
    ...condition,
    include: include
  });
  return result as Prisma.einteilung_rotationsGetPayload<{
    include: Prisma.einteilung_rotationsInclude;
  }>[];
}

export async function einteilungRotationByTag(tag: Date, mitarbeiterId: number) {
  return await prismaDb.einteilung_rotations.findMany({
    where: {
      mitarbeiter_id: Number(mitarbeiterId),
      von: { lte: tag },
      bis: { gte: tag }
    },
    include: {
      kontingents: {
        include: {
          teams: true
        }
      }
    },
    orderBy: {
      prioritaet: 'asc'
    }
  });
}

export async function getRotationenInRange<TInclude extends Prisma.einteilung_rotationsInclude>(
  anfang: Date,
  ende: Date,
  include?: TInclude
) {
  return ((await prismaDb.einteilung_rotations.findMany({
    where: {
      OR: [
        {
          AND: [{ von: { lte: anfang } }, { bis: { gte: anfang } }]
        },
        {
          AND: [{ von: { lte: ende } }, { bis: { gte: ende } }]
        },
        {
          AND: [{ von: { gte: anfang } }, { bis: { lte: ende } }]
        }
      ],
      mitarbeiters: {
        platzhalter: false
      }
    },
    include
  })) || []) as Prisma.einteilung_rotationsGetPayload<{ include: TInclude }>[];
}

export async function getRotationenByKontingentFlag() {
  return await prismaDb.einteilung_rotations.findMany({
    where: {
      kontingents: {
        show_all_rotations: true
      }
    }
  });
}

export async function sortedByVon(mitarbeiterId: number) {
  const result = await prismaDb.einteilung_rotations.findMany({
    where: {
      mitarbeiter_id: Number(mitarbeiterId)
    },
    orderBy: [{ prioritaet: 'asc' }, { von: 'asc' }]
  });
  return result;
}

export async function getPublished(mitarbeiterId: number) {
  const result = await prismaDb.einteilung_rotations.findMany({
    where: {
      mitarbeiter_id: Number(mitarbeiterId),
      published: true
    },
    orderBy: [{ prioritaet: 'asc' }, { von: 'asc' }]
  });
  return result;
}

export async function getEinteilungenInKontingente(
  mitarbeiterIds: number[],
  isRotationsplaner: boolean
) {
  const query = `
    SELECT DISTINCT
      er.id,
      er.von,
      er.bis,
      er.prioritaet,
      er.mitarbeiter_id,
      er.kontingent_id,
      t.id AS team_id,
      k.name AS kontingent_name,
      pd.name AS po_dienst_name,
      de.po_dienst_id AS po_dienst_id,
      de.id AS einteilung_id,
      de.tag AS tag,
      m.planname AS mitarbeiter_name,
      pd.planname AS dienst_name,
      kp.eingeteilt_count_factor AS factor,
      (de.tag >= er.von AND de.tag <= er.bis) AS in_rot
    FROM public.einteilung_rotations AS er
    JOIN public.mitarbeiters AS m ON er.mitarbeiter_id = m.id
      AND m.platzhalter = FALSE
      AND m.id IN (${mitarbeiterIds.join(',')})
    JOIN public.kontingents AS k ON k.id = er.kontingent_id
    JOIN public.teams AS t ON t.id = k.team_id
    JOIN public.kontingent_po_diensts AS kp ON kp.kontingent_id = er.kontingent_id
    JOIN public.po_diensts AS pd ON pd.id = kp.po_dienst_id
    JOIN public.diensteinteilungs AS de ON de.po_dienst_id = kp.po_dienst_id
      AND de.mitarbeiter_id = er.mitarbeiter_id
      AND de.tag <= CURRENT_DATE
    JOIN public.einteilungsstatuses AS es ON es.id = de.einteilungsstatus_id
      AND es.counts
      AND es.public
    ${isRotationsplaner ? '' : 'WHERE er.published = TRUE'}
    ORDER BY er.mitarbeiter_id ASC, de.tag ASC, er.von ASC, er.prioritaet ASC, er.kontingent_id ASC
  `;

  const result: TResultEinteilungenInKontingente[] = await prismaDb.$queryRawUnsafe(`${query}`);
  return result;
}
