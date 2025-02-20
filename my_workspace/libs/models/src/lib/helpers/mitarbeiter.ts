import { newDate } from '@my-workspace/utils';
import { automatische_einteilungens, po_diensts, zeitraumkategories } from '@prisma/client';
import { startOfYear, formatDate } from 'date-fns';

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

type TAutomatischeEinteilung = automatische_einteilungens & {
  po_diensts: po_diensts;
  zeitraumkategories: zeitraumkategories;
};
export function automatischeEinteilungAnfang(automatischeEinteilung: TAutomatischeEinteilung) {
  const today = newDate();
  let result = startOfYear(today);
  if (automatischeEinteilung?.von) {
    result = automatischeEinteilung.von;
  } else if (automatischeEinteilung?.zeitraumkategories?.anfang) {
    result = automatischeEinteilung.zeitraumkategories.anfang;
  }
  return formatDate(result, 'yyyy-MM-dd');
}

export function automatischeEinteilungEnde(automatischeEinteilung: TAutomatischeEinteilung) {
  const today = newDate();
  let result = startOfYear(today);
  if (automatischeEinteilung?.bis) {
    result = automatischeEinteilung.bis;
  } else if (automatischeEinteilung?.zeitraumkategories?.ende) {
    result = automatischeEinteilung.zeitraumkategories.ende;
  }
  return formatDate(result, 'yyyy-MM-dd');
}
