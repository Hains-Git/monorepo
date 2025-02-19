import { mitarbeiters, einteilung_rotations, kontingents, teams } from '@prisma/client';
import { getWeiterbildungsjahr } from './helpers/mitarbeiter';
import { rotationAm } from './einteilungrotation';
import { getDefaultTeam, getDefaultKontingents, getMitarbeiterById } from '@my-workspace/prisma_cruds';

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
  date = new Date(),
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

  return;
}
