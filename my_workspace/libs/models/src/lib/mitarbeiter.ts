import { mitarbeiters, einteilung_rotations, kontingents, teams } from '@prisma/client';
import { getWeiterbildungsjahr } from './helpers/mitarbeiter';
import { rotationAm } from './einteilungrotation';
import {
  getDefaultKontingents,
  getMitarbeiterById,
  _team,
  MitarbeiterUrlaubssaldo,
  getMitarbeiterForUrlaubssaldis
} from '@my-workspace/prisma_cruds';
import { getDateStr, newDate, newDateYearMonthDay } from '@my-workspace/utils';
import { vertragsArbeitszeitAm, vertragsPhaseAm, vkAndVgruppeInMonth } from './vertrag';

export function addWeiterbildungsjahr(mitarbeiter: mitarbeiters) {
  const aSeit = mitarbeiter.a_seit;
  const anrechenbareZeit = mitarbeiter.anrechenbare_zeit;
  const weiterbildungsjahr = getWeiterbildungsjahr(aSeit, anrechenbareZeit);
  return weiterbildungsjahr;
}

type TDefaultKontingents = (kontingents & { teams: teams | null }) | null;

export async function getDefaultTeamForMitarbeiter(
  defaultTeam: teams | null = null,
  defaultKontingent: TDefaultKontingents = null
) {
  let team = null;
  if (!defaultTeam) {
    defaultTeam = await _team.getDefaultTeam();
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
  defaultTeam: teams | null = null,
  defaultKontingent: TDefaultKontingents | null = null,
  mitarbeiterId: number
) {
  let team: teams | null = null;
  let rotation: TRot | undefined = undefined;
  date.setHours(12, 0, 0, 0);
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
        er.von.setHours(12, 0, 0, 0);
        er.bis.setHours(12, 0, 0, 0);
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
    team = await getDefaultTeamForMitarbeiter(defaultTeam, defaultKontingent);
  }

  return team;
}

export async function mitarbeiterTeamAmByMitarbeiter(
  mitarbeiter: mitarbeiters & {
    einteilung_rotations: TRot[];
    funktion: {
      teams: teams | null;
    } | null;
  },
  date = newDate(),
  defaultTeam: teams | null = null,
  defaultKontingent: TDefaultKontingents | null = null
) {
  let team: teams | null = null;
  const tag = newDate(date);
  tag.setHours(12, 0, 0, 0);
  team =
    mitarbeiter.einteilung_rotations.find((rot) => {
      if (rot.von && rot.bis) {
        rot.von.setHours(12, 0, 0, 0);
        rot.bis.setHours(12, 0, 0, 0);
        return rot.von <= tag && rot.bis >= tag;
      }
      return false;
    })?.kontingents?.teams || null;
  if (!team && mitarbeiter.funktion?.teams) {
    team = mitarbeiter.funktion?.teams;
  }
  if (!team) {
    team = await getDefaultTeamForMitarbeiter(defaultTeam, defaultKontingent);
  }
  return team;
}

export async function mitarbeiterAktivAm(mitarbeiter: MitarbeiterUrlaubssaldo, date = newDate()) {
  let aktiv = !!mitarbeiter.aktiv;
  const tag = newDate(date);
  tag.setHours(12, 0, 0, 0);
  if (aktiv && mitarbeiter.aktiv_bis) {
    mitarbeiter.aktiv_bis.setHours(12, 0, 0, 0);
    aktiv = mitarbeiter.aktiv_bis >= tag;
  }
  if (aktiv && mitarbeiter.aktiv_von) {
    mitarbeiter.aktiv_von.setHours(12, 0, 0, 0);
    aktiv = mitarbeiter.aktiv_von <= tag;
  }
  if (aktiv) {
    aktiv = !!(vertragsPhaseAm(tag, mitarbeiter.vertrags) && vertragsArbeitszeitAm(tag, mitarbeiter.vertrags));
  }
  return aktiv;
}

export async function mitarbeiterUrlaubssaldoAktivAm(mitarbeiter: MitarbeiterUrlaubssaldo, date = newDate()) {
  const tag = newDate(date);
  tag.setHours(12, 0, 0, 0);
  const aktiv = !mitarbeiter.urlaubssaldo_abspraches.find((a) => {
    if (a.von && a.bis) {
      a.von.setHours(12, 0, 0, 0);
      a.bis.setHours(12, 0, 0, 0);
      return a.von <= tag && a.bis >= tag;
    }
    return false;
  });
  if (!aktiv) return aktiv;
  return await mitarbeiterAktivAm(mitarbeiter, date);
}

export async function getVKOverview(von: Date, bis: Date) {
  const start = newDateYearMonthDay(von.getFullYear(), von.getMonth() + 1, 0);
  const ende = newDateYearMonthDay(bis.getFullYear(), bis.getMonth() + 1, 0);
  const result: Record<
    string,
    Record<
      number,
      ReturnType<typeof vkAndVgruppeInMonth> & {
        planname: string;
        aktiv: boolean;
      }
    >
  > = {};
  if (start > ende) return result;
  const mitarbeiter = await getMitarbeiterForUrlaubssaldis([], start, ende);
  mitarbeiter.forEach((mit) => {
    let date = start;
    while (date <= ende) {
      const dateKey = getDateStr(date);
      result[dateKey] ||= {};
      result[dateKey][mit.id] = {
        ...vkAndVgruppeInMonth(date, mit.vertrags),
        planname: mit.planname || '',
        aktiv: !!(mit.account_info && mitarbeiterAktivAm(mit, date))
      };
      date = newDateYearMonthDay(date.getFullYear(), date.getMonth() + 2, 0);
    }
  });
  return result;
}
