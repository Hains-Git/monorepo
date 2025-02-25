import { newDate } from '@my-workspace/utils';

export function getWeiterbildungsjahr(aSeit: Date | null, anrechenbareZeit: number | null) {
  const today = newDate();
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
