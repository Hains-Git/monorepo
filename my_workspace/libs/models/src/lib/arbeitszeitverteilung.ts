import { arbeitszeittyps, arbeitszeitverteilungs } from '@prisma/client';

type TArbeitszeitverteilungSchicht = {
  anfang: string;
  anfangZahl: number;
  anfangSplit: string[];
  ende: string;
  endeZahl: number;
  endeSplit: string[];
  arbeitszeittyp_id: number;
  arbeitszeit: boolean;
  dienstzeit: boolean;
  minutes: number;
  tagAnfang: number;
  tagEnde: number;
};

export type TArbeitszeitverteilungSchichtDays = {
  dienstTage: number;
  ausgleichstage: number;
  schichtTage: Record<number, { containsDienstzeit: boolean; schichten: TArbeitszeitverteilungSchicht[] }>;
};

function formatZeiten(arbeitszeitverteilung: arbeitszeitverteilungs) {
  const result = arbeitszeitverteilung.verteilung.map((zeit) => {
    const time = `${zeit.getUTCHours().toString().padStart(2, '0')}:${zeit
      .getUTCMinutes()
      .toString()
      .padStart(2, '0')}`;
    return {
      zeit: time,
      zeitZahl: parseInt(time.replace(':', ''), 10)
    };
  });
  return result;
}

function createSchichtenFromArbeitszeitverteilung(
  arbeitszeitverteilung: arbeitszeitverteilungs,
  arbeitszeittypen: Record<number, arbeitszeittyps>
) {
  const schichten: TArbeitszeitverteilungSchicht[] = [];
  const zeiten = formatZeiten(arbeitszeitverteilung);
  const zeittypen = arbeitszeitverteilung.zeittypen;
  zeiten.forEach((zeit, i) => {
    if (i < 1) return;
    const prevZeit = zeiten[i - 1];
    const zeittyp = arbeitszeittypen[zeittypen[i - 1]];
    const schicht: TArbeitszeitverteilungSchicht = {
      anfang: prevZeit.zeit,
      anfangZahl: prevZeit.zeitZahl,
      anfangSplit: prevZeit.zeit.split(':'),
      ende: zeit.zeit,
      endeZahl: zeit.zeitZahl,
      endeSplit: zeit.zeit.split(':'),
      arbeitszeittyp_id: zeittyp?.id || 0,
      arbeitszeit: !!zeittyp?.arbeitszeit,
      dienstzeit: !!zeittyp.dienstzeit,
      minutes: 0,
      tagAnfang: 0,
      tagEnde: 0
    };
    const minutesDiff = parseInt(schicht.endeSplit[1], 10) - parseInt(schicht.anfangSplit[1], 10);
    const startStd = parseInt(schicht.anfangSplit[0], 10);
    const endeStd = parseInt(schicht.endeSplit[0], 10);
    let minutes = (endeStd - startStd) * 60 + minutesDiff;
    if (schicht.anfangZahl >= schicht.endeZahl) {
      minutes = (24 - startStd + endeStd) * 60 + minutesDiff;
    }
    schicht.minutes = minutes;
    schichten.push(schicht);
  });
  return schichten;
}

function createSchichtDaysFromArbeitszeitverteilungSchichten(
  arbeitszeitverteilung: arbeitszeitverteilungs,
  schichten: TArbeitszeitverteilungSchicht[]
) {
  const schichtDays: TArbeitszeitverteilungSchichtDays = { dienstTage: 0, schichtTage: {}, ausgleichstage: 0 };
  let day = 0;
  let blockStartDay = 0;
  schichten.forEach((schicht) => {
    schichtDays.schichtTage[blockStartDay] ||= { containsDienstzeit: false, schichten: [] };
    schicht.tagAnfang = day;
    // if anfang >= ende 00:00 must have been passed => new day
    if (schicht.anfangZahl >= schicht.endeZahl) {
      day += 1;
    }
    schicht.tagEnde = day;
    // add schicht to day of schichtblock
    schichtDays.schichtTage[blockStartDay].schichten.push(schicht);
    // mark day as day with duty if schicht is dienstzeit
    if (schicht.dienstzeit && !schichtDays.schichtTage[blockStartDay].containsDienstzeit) {
      schichtDays.dienstTage += 1;
      schichtDays.schichtTage[blockStartDay].containsDienstzeit = true;
    }
    // after each dienstzeit break, start next block, this block starts at current day
    if (!schicht.dienstzeit) {
      blockStartDay = day;
    }
  });
  const dauer = arbeitszeitverteilung.dauer || 0;
  schichtDays.ausgleichstage = dauer - schichtDays.dienstTage;
  return schichtDays;
}

export function createSchichtenDaysFromArbeitszeitverteilung(
  arbeitszeitverteilung: arbeitszeitverteilungs,
  arbeitszeittypen: Record<number, arbeitszeittyps>
) {
  const schichten = createSchichtenFromArbeitszeitverteilung(arbeitszeitverteilung, arbeitszeittypen);
  return createSchichtDaysFromArbeitszeitverteilungSchichten(arbeitszeitverteilung, schichten);
}
