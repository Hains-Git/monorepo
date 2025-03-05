import { mitarbeiters, einteilung_rotations, kontingents, teams } from '@prisma/client';
import { getWeiterbildungsjahr } from './helpers/mitarbeiter';
import { rotationAm } from './einteilungrotation';
import { getDefaultKontingents, getMitarbeiterById, _team, mitarbeiterUrlaubssaldo } from '@my-workspace/prisma_cruds';
import { getDateNr, getDateStr, newDate } from '@my-workspace/utils';

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
  const dateNr = getDateNr(date);
  team =
    mitarbeiter.einteilung_rotations.find((rot) => {
      if (rot.von && rot.bis) {
        const vonNr = getDateNr(rot.von);
        const bisNr = getDateNr(rot.bis);
        return vonNr <= dateNr && bisNr >= dateNr;
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

export async function mitarbeiterAktivAm(mitarbeiter: mitarbeiterUrlaubssaldo, date = newDate()) {
  let aktiv = !!mitarbeiter.aktiv;
  if (aktiv && mitarbeiter.aktiv_bis) {
    aktiv = mitarbeiter.aktiv_bis >= date;
  }
  if (aktiv && mitarbeiter.aktiv_von) {
    aktiv = mitarbeiter.aktiv_von <= date;
  }
  if (aktiv) {
    aktiv = !!mitarbeiter.vertrags.find((v) => {
      if (v.anfang && v.ende) {
        return (
          v.anfang <= date &&
          v.ende >= date &&
          v.vertrags_phases.find((p) => {
            if (p.von && p.bis) {
              return p.von <= date && p.bis >= date;
            }
            return false;
          }) &&
          v.vertrags_arbeitszeits.find((a) => {
            if (a.von && a.bis) {
              const vk = Number(a.vk || 0);
              const tageWoche = a.tage_woche || 0;
              return a.von <= date && a.bis >= date && vk > 0 && vk <= 1 && tageWoche > 0 && tageWoche <= 7;
            }
            return false;
          })
        );
      }
      return false;
    });
  }
  return aktiv;
}

export async function mitarbeiterUrlaubssaldoAktivAm(mitarbeiter: mitarbeiterUrlaubssaldo, date = newDate()) {
  const aktiv = !mitarbeiter.urlaubssaldo_abspraches.find((a) => {
    if (a.von && a.bis) {
      return a.von <= date && a.bis >= date;
    }
    return false;
  });
  if (!aktiv) return aktiv;
  return await mitarbeiterAktivAm(mitarbeiter, date);
}
