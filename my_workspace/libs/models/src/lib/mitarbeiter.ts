import { mitarbeiters, einteilung_rotations, kontingents, teams } from '@prisma/client';
import { getWeiterbildungsjahr, automatischeEinteilungAnfang, automatischeEinteilungEnde } from './helpers/mitarbeiter';
import { rotationAm } from './einteilungrotation';
import {
  getDefaultTeam,
  getDefaultKontingents,
  getMitarbeiterById,
  getByFreigabenTypenIds,
  dienstfreigabe,
  automatischeeinteilung,
  arbeitszeitabsprache
} from '@my-workspace/prisma_cruds';

import { newDate, transformObject } from '@my-workspace/utils';
import { formatDate } from 'date-fns';

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
    defaultKontingent = await getDefaultKontingents();
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
  let automatischeEinteilungen = await automatischeeinteilung.getByMitarbeiterId(mitarbeiterId);
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
  let arbeitszeitAbsprachen = await arbeitszeitabsprache.getByMitarbeiterId(mitarbeiterId)
  arbeitszeitAbsprachen = arbeitszeitAbsprachen.map((aa) => {
    const aaObj = transformObject(aa, [
      { key: 'von', method: (aa) => (aa?.von ? formatDate(aa.von, 'yyyy-MM-dd') : aa.von) },
      { key: 'bis', method: (aa) => (aa?.bis ? formatDate(aa.bis, 'yyyy-MM-dd') : aa.bis) }
    ]);
    return aaObj;
  });

}
