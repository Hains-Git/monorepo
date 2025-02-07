import { mitarbeiters, einteilung_rotations } from '@prisma/client';

export function getWeiterbildungsjahr(aSeit: Date | null, anrechenbareZeit: number | null) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  if (!aSeit) {
    return '';
  }
  const aSeitYear = aSeit.getFullYear();
  const aSeitMonth = aSeit.getMonth();

  const anrechenbareZeitInMonate = anrechenbareZeit ?? 0;

  const diffInMonths = year * 12 + month - (aSeitYear * 12 + aSeitMonth) + anrechenbareZeitInMonate;
  let yearDisplay = '';
  let monthDisplay = '';

  if (diffInMonths >= 0) {
    yearDisplay = String(Math.floor(diffInMonths / 12));
    monthDisplay = String(diffInMonths % 12);
  } else {
    yearDisplay = '0';
    monthDisplay = String(diffInMonths);
  }

  return `${yearDisplay}.Jahr : ${monthDisplay} Monat`;
}

export function addWeiterbildungsjahr(mitarbeiter: mitarbeiters) {
  const aSeit = mitarbeiter.a_seit;
  const anrechenbareZeit = mitarbeiter.anrechenbare_zeit;
  const weiterbildungsjahr = getWeiterbildungsjahr(aSeit, anrechenbareZeit);
  return weiterbildungsjahr;
}

export function teamAm(
  date = new Date(),
  rotationen: einteilung_rotations[] | null = null,
  defaultTeam = null,
  defaultKontingent = null
) {
  let team;
  let rotation;
  if (rotationen && rotationen.length > 0) {
    rotation = rotationen.find((er) => {
      if (er.von && er.bis) {
        return er.von <= date && er.bis >= date;
      }
      return false;
    });
  }

  return;
}
