import { _mitarbeiter, _mitarbeiter_default_eingeteilt } from '@my-workspace/prisma_cruds';
import { prismaDb } from '@my-workspace/prisma_hains';
import { processData } from '@my-workspace/utils';
import { einteilung_rotations } from '@prisma/client';

type TKontingentHash = {
  rotationen: Record<number, any>;
  kontingente: Record<number, any>;
  defaults: Record<number, any>;
  counted_in_kontingent: Record<
    number,
    Record<string, Record<number, { all: number[]; in_rot: number[] }>>
  >;
};

type TKontingent = {
  name?: string;
  id?: number;
  [key: string]: any;
};

type TEinteilung = {
  id: number;
  von: Date;
  bis: Date;
  prioritaet: number;
  mitarbeiter_id: number;
  kontingent_id: number;
  team_id: number;
  kontingent_name: string;
  po_dienst_name: string;
  po_dienst_id: number;
  einteilung_id: number;
  tag: Date;
  mitarbeiter_name: string;
  dienst_name: string;
  factor: number;
  in_rot: boolean;
};

function addAndRound(value: number, add: number, roundValue = 2): number {
  return Number((value + add).toFixed(roundValue));
}

function createKontingentEingeteiltDefault(
  kon: TKontingent = {},
  konId = 0,
  hash: TKontingentHash = { rotationen: {}, kontingente: {}, defaults: {}, counted_in_kontingent: {} }
): void {
  if (!hash.kontingente[konId]) {
    const defaultValue = hash.defaults[konId]?.eingeteilt ?? 0;
    const lastYear = hash.defaults[konId]?.year ?? 0;

    hash.rotationen[konId] = [];
    hash.kontingente[konId] = { ...kon };
    hash.kontingente[konId].default_last_year = lastYear;
    hash.kontingente[konId].einteilungen = {
      while_in_rotation: {
        default_eingeteilt: 0,
        eingeteilt_sum: 0,
        rotationen: {}
      },
      all: {
        default_eingeteilt: defaultValue,
        eingeteilt_sum: defaultValue,
        einteilungen: {}
      }
    };
  }
}

async function getKontingenteDefaultEingeteiltsSum(mitarbeiterId: number) {
  return await _mitarbeiter_default_eingeteilt.getKontingentDefaultEingeteiltsSum(mitarbeiterId);
}

async function getKontingentEingeteiltBasis(kontingente: any[] = [], mitarbeiterId: number) {
  const kontingenteDefaultEingeteiltsSum = await getKontingenteDefaultEingeteiltsSum(mitarbeiterId);
  const hash: TKontingentHash = {
    rotationen: {},
    kontingente: {},
    defaults: processData('id', kontingenteDefaultEingeteiltsSum),
    counted_in_kontingent: {}
  };

  for (const kon of kontingente) {
    createKontingentEingeteiltDefault(kon, kon.id, hash);
  }

  return hash;
}

function countEinteilungInKontingent(
  einteilung: TEinteilung,
  hash: TKontingentHash,
  selfId: number
): TKontingentHash {
  const konId = einteilung.kontingent_id;
  const factor = einteilung.factor > 0 ? Number((1.0 / einteilung.factor).toFixed(2)) : 0;

  createKontingentEingeteiltDefault({ name: einteilung.kontingent_name, id: konId }, konId, hash);

  const einteilungenHash = hash.kontingente[konId].einteilungen;
  const allEinteilungenHash = einteilungenHash.all.einteilungen;
  const countedInKontingent = hash.counted_in_kontingent;

  if (einteilung.mitarbeiter_id === selfId || hash.kontingente[konId] || factor > 0) {
    const rotId = einteilung.id;
    const tag = einteilung.tag;
    const dienstId = einteilung.po_dienst_id;
    const isInRot = einteilung.in_rot;

    countedInKontingent[konId] = countedInKontingent[konId] || {};
    countedInKontingent[konId][tag.toISOString()] = countedInKontingent[konId][tag.toISOString()] || {};
    countedInKontingent[konId][tag.toISOString()][dienstId] = countedInKontingent[konId][
      tag.toISOString()
    ][dienstId] || {
      all: [],
      in_rot: []
    };

    if (!allEinteilungenHash[dienstId]) {
      allEinteilungenHash[dienstId] = {
        tage: [],
        eingeteilt_count_factor: einteilung.factor,
        value: factor,
        name: einteilung.po_dienst_name
      };
    }

    const isTagBiggerLastDefaultYear = tag.getFullYear() > hash.kontingente[konId].default_last_year;
    if (
      countedInKontingent[konId][tag.toISOString()][dienstId].all.length === 0 &&
      isTagBiggerLastDefaultYear
    ) {
      einteilungenHash.all.eingeteilt_sum = addAndRound(einteilungenHash.all.eingeteilt_sum, factor, 2);
      allEinteilungenHash[dienstId].tage.push(tag);
    }

    if (isInRot) {
      if (!einteilungenHash.while_in_rotation.rotationen[rotId]) {
        einteilungenHash.while_in_rotation.rotationen[rotId] = {
          von: einteilung.von,
          bis: einteilung.bis,
          eingeteilt: 0,
          eingeteilt_sum: 0,
          einteilungen: {}
        };
      }

      const inRotCounter = einteilungenHash.while_in_rotation.rotationen[rotId];
      if (!inRotCounter.einteilungen[dienstId]) {
        inRotCounter.einteilungen[dienstId] = {
          tage: [],
          eingeteilt_count_factor: einteilung.factor,
          value: factor,
          name: einteilung.po_dienst_name
        };
      }

      if (countedInKontingent[konId][tag.toISOString()][dienstId].in_rot.length === 0) {
        einteilungenHash.while_in_rotation.eingeteilt_sum = addAndRound(
          einteilungenHash.while_in_rotation.eingeteilt_sum,
          factor,
          2
        );
        inRotCounter.eingeteilt_sum = addAndRound(inRotCounter.eingeteilt_sum, factor, 2);
      }

      if (!inRotCounter.einteilungen[dienstId].tage.some((d) => d.getTime() === tag.getTime())) {
        inRotCounter.einteilungen[dienstId].tage.push(tag);
        inRotCounter.eingeteilt = addAndRound(inRotCounter.eingeteilt, factor, 2);
      }

      countedInKontingent[konId][tag.toISOString()][dienstId].in_rot.push(rotId);
    }

    countedInKontingent[konId][tag.toISOString()][dienstId].all.push(rotId);
  }

  return hash;
}

async function getEinteilungenInKontingente(mitarbeiterIds: number[] = [], isRotationsplaner = false) {
  const mitarbeiterIdsString = mitarbeiterIds.join(',');
  const whereClause = isRotationsplaner ? '' : 'WHERE er.published = TRUE';

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
      AND m.id IN (${mitarbeiterIdsString})
    JOIN public.kontingents AS k ON k.id = er.kontingent_id
    JOIN public.teams AS t ON t.id = k.team_id
    JOIN public.kontingent_po_diensts AS kp ON kp.kontingent_id = er.kontingent_id
    JOIN public.po_diensts AS pd ON pd.id = kp.po_dienst_id
    JOIN public.diensteinteilungs AS de ON de.po_dienst_id = kp.po_dienst_id
      AND de.mitarbeiter_id = er.mitarbeiter_id
      AND de.tag <= current_date
    JOIN public.einteilungsstatuses AS es ON es.id = de.einteilungsstatus_id
      AND es.counts
      AND es.public
    ${whereClause}
    ORDER BY er.mitarbeiter_id ASC, de.tag ASC, er.von ASC, er.prioritaet ASC, er.kontingent_id ASC
  `;

  const result = await prismaDb.$queryRawUnsafe<TEinteilung[]>(query);
  return result;
}

function addKontingents(mitarbeiter) {
  const kontingents = mitarbeiter.einteilung_rotations.map((e) => e.kontingents);
  mitarbeiter.kontingents = kontingents;
  return mitarbeiter;
}

export async function kontingentMitarbeiter(authUserId: number): Promise<Record<number, any>> {
  // const isRotationsplaner = currentUser.checkHasRole?.('Rotationsplaner') || false;
  const isRotationsplaner = true; // Placeholder for actual role check

  const mitarbeiters = await _mitarbeiter.findMany(
    {
      where: { platzhalter: false }
    },
    {
      einteilung_rotations: {
        include: { kontingents: true }
      }
    }
  );

  const statistiken: Record<number, TKontingentHash> = {};
  const mitarbeitersHash = processData('id', mitarbeiters, [addKontingents]);
  const eingeteilteKontingente: Record<number, any> = {};

  const einteilungen = await getEinteilungenInKontingente(
    mitarbeiters.map((m) => m.id),
    isRotationsplaner
  );

  for (const e of einteilungen) {
    const mId = e.mitarbeiter_id;
    const m = mitarbeitersHash[mId];

    if (m) {
      if (!statistiken[mId]) {
        statistiken[mId] = await getKontingentEingeteiltBasis(m.kontingents, mId);
      }
      countEinteilungInKontingent(e, statistiken[mId], m.id);
      eingeteilteKontingente[mId] = statistiken[mId].kontingente;
    }
  }

  return eingeteilteKontingente;
}
