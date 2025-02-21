import { mitarbeiters, einteilung_rotations, kontingents, teams } from '@prisma/client';
import {
  getWeiterbildungsjahr,
  automatischeEinteilungAnfang,
  automatischeEinteilungEnde,
  arbeitszeitAbspracheAnfang,
  arbeitszeitAbspracheEnde
} from './helpers/mitarbeiter';
import { rotationAm } from './einteilungrotation';
import {
  getDefaultTeam,
  getMitarbeiterById,
  getByFreigabenTypenIds,
  kontingent,
  dienstfreigabe,
  automatische_einteilung,
  arbeitszeit_absprache,
  mitarbeiter_default_eingeteilt
} from '@my-workspace/prisma_cruds';

import { newDate, processData, transformObject } from '@my-workspace/utils';
import { formatDate } from 'date-fns';
import { argv0 } from 'process';

type TDefaultKontingents = (kontingents & { teams: teams | null }) | null;

export function addWeiterbildungsjahr(mitarbeiter: mitarbeiters) {
  const aSeit = mitarbeiter.a_seit;
  const anrechenbareZeit = mitarbeiter.anrechenbare_zeit;
  const weiterbildungsjahr = getWeiterbildungsjahr(aSeit, anrechenbareZeit);
  return weiterbildungsjahr;
}

export async function getDefaultTeamForMitarbeiter(
  defaultTeam: teams | null = null,
  defaultKontingent: TDefaultKontingents = null
) {
  let team = null;
  if (!defaultTeam) {
    defaultTeam = await getDefaultTeam();
  }
  if (!defaultTeam && !defaultKontingent) {
    defaultKontingent = await kontingent.getDefaults();
  }

  if (defaultTeam) {
    team = defaultTeam;
  } else if (defaultKontingent?.teams) {
    team = defaultKontingent.teams;
  }
  return team;
}

type TRot = einteilung_rotations & {
  kontingents:
    | (kontingents & {
        teams?: teams | null;
      })
    | null;
};

export async function mitarbeiterTeamAm(
  date = newDate(),
  rotationen: TRot[] | null = null,
  defaultTeam = null,
  defaultKontingent = null,
  mitarbeiterId: number
) {
  let team;
  let rotation: TRot | undefined = undefined;
  const mitarbeiter = await getMitarbeiterById(mitarbeiterId, {
    funktion: {
      include: {
        teams: true
      }
    }
  });

  if (rotationen && rotationen.length > 0) {
    rotation = rotationen.find((er) => {
      if (er.von && er.bis) {
        return er.von <= date && er.bis >= date;
      }
      return false;
    });
  } else {
    const rot = await rotationAm(date, mitarbeiterId);
    if (rot && rot?.length > 0) {
      rotation = rot?.[0];
    }
  }

  if (rotation?.kontingents?.teams) {
    team = rotation?.kontingents?.teams;
  } else if (mitarbeiter?.funktion?.teams) {
    team = mitarbeiter.funktion?.teams;
  }

  if (!team) {
    team = getDefaultTeamForMitarbeiter(defaultTeam, defaultKontingent);
  }

  return team;
}

async function freigegebeneDienste(mitarbeiterId: number, preset = false) {
  const freigabeTypen = await dienstfreigabe.getFreigabenTypenIdsByMitarbeiterId(mitarbeiterId);
  const freigabeTypenIds = freigabeTypen.map((ft) => ft.freigabetyp_id).filter(Boolean) as number[];
  const dienste = await getByFreigabenTypenIds(freigabeTypenIds);
  return dienste;
}

export async function getFreigegebeneDienste(mitarbeiterId: number) {
  return await freigegebeneDienste(mitarbeiterId);
}

export async function getAutomatischeEinteilungen(mitarbeiterId: number) {
  let automatischeEinteilungen = await automatische_einteilung.getByMitarbeiterId(mitarbeiterId);
  automatischeEinteilungen = automatischeEinteilungen.map((ae) => {
    const aeObj = transformObject(ae, [
      {
        key: 'anfang',
        method: automatischeEinteilungAnfang
      },
      {
        key: 'ende',
        method: automatischeEinteilungEnde
      },
      { key: 'von', method: (ae) => (ae?.von ? formatDate(ae.von, 'yyyy-MM-dd') : ae.von) },
      { key: 'bis', method: (ae) => (ae?.bis ? formatDate(ae.bis, 'yyyy-MM-dd') : ae.bis) }
    ]);
    return aeObj;
  });
  return automatischeEinteilungen;
}

export async function getArbeitszeitAbsprachen(mitarbeiterId: number) {
  let arbeitszeitAbsprachen = await arbeitszeit_absprache.getByMitarbeiterId(mitarbeiterId);
  arbeitszeitAbsprachen = arbeitszeitAbsprachen.map((aa) => {
    const aaObj = transformObject(aa, [
      { key: 'anfang', method: arbeitszeitAbspracheAnfang },
      { key: 'anfang', method: arbeitszeitAbspracheEnde },
      {
        key: 'arbeitszeit_von_time',
        method: (ae) => (ae?.arbeitszeit_von ? formatDate(ae.arbeitszeit_von, 'HH:mm') : ae.arbeitszeit_von)
      },
      {
        key: 'arbeitszeit_bis_time',
        method: (ae) => (ae?.arbeitszeit_bis ? formatDate(ae.arbeitszeit_bis, 'HH:mm') : ae.arbeitszeit_bis)
      }
    ]);
    return aaObj;
  });
  return arbeitszeitAbsprachen;
}

type HashObjType<T, IsArray extends boolean> = Record<string | number, IsArray extends true ? T[] : T>;

type TResult = {
  rotationen: {
    [key: number]: [];
  };
  kontingente: {
    [key: number]: kontingents & {
      default_last_year?: number;
      einteilungen?: {
        while_in_rotation: {
          default_eingeteilt: number;
          eingeteilt_sum: number;
          rotationen: object;
        };
        all: {
          default_eingeteilt: number;
          eingeteilt_sum: number;
          rotationen: object;
        };
      };
    };
  };
  defaults: HashObjType<
    {
      id: number;
      mitarbeiter_id: number;
      eingeteilt: number;
      year: number;
    },
    false
  >;
  counted_in_kontingent: object;
};

function createKontingentEingeteiltDefault(kontingent: kontingents, kontingentId = 0, resultObj: TResult) {
  if (resultObj.kontingente[kontingentId]) {
    return resultObj;
  }
  const defaultValue = resultObj.defaults[kontingentId]?.eingeteilt || 0;
  const lastYear = resultObj.defaults[kontingentId]?.year || 0;
  resultObj.rotationen[kontingentId] = [];
  resultObj.kontingente[kontingentId] = kontingent;
  resultObj.kontingente[kontingentId]['default_last_year'] = lastYear;
  resultObj.kontingente[kontingentId]['einteilungen'] = {
    while_in_rotation: {
      default_eingeteilt: 0,
      eingeteilt_sum: 0,
      rotationen: {}
    },
    all: {
      default_eingeteilt: defaultValue,
      eingeteilt_sum: defaultValue,
      rotationen: {}
    }
  };
}

export async function getKontingentEingeteiltBasis(mitarbeiterId: number) {
  const kontingente = await kontingent.getAll();
  const kontigentDefaultEingeteiltSum =
    await mitarbeiter_default_eingeteilt.getKontingentDefaultEingeteiltsSum(mitarbeiterId);

  const defaults = processData('id', kontigentDefaultEingeteiltSum);

  const result = {
    rotationen: {},
    kontingente: {},
    defaults,
    counted_in_kontingent: {}
  };

  for (const kontingent of kontingente) {
    createKontingentEingeteiltDefault(kontingent, kontingent.id, result);
  }
  return result;
}
