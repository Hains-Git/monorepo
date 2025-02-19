import { zeitraumkategories } from '@prisma/client';
import { PlanerDate } from './planerdate';
import { addDays, getWeek, isEqual, addMonths, subDays, subWeeks, isSameDay } from 'date-fns';
import { newDate, newDateYearMonthDay } from '@my-workspace/utils';

interface RegelcodeHash {
  is_bedarf: boolean;
  feiertage: string;
  wochentage: string;
  monatstage: string;
  wochen: string;
  monate: string;
  feiertage_r: string[];
  wochentage_r: string[];
  wochen_r: string[];
  monate_r: string[];
  is_nicht: boolean;
  is_auch: boolean;
  is_nur: boolean;
  has_feiertag: boolean;
}

const ZEITRAUMREGELN_REGEX = {
  monat: /^m([1-9])$|^m1([0-2])$/,
  kalenderwoche: /^kw[1-9]$|^kw[1-4][0-9]$|^kw5[0-3]$/,
  wochentag: /^Mo$|^Di$|^Mi$|^Do$|^Fr$|^Sa$|^So$/,
  clear: /^_|_$/
};

function isPlanerDate(date: Date | PlanerDate) {
  return date instanceof PlanerDate;
}

async function shouldCheckDate(
  date: Date | PlanerDate,
  zeitraumAnfang: Date | null,
  zeitraumEnde: Date | null
): Promise<boolean> {
  let thisStart = true;
  let thisEnd = true;

  if (!(date instanceof PlanerDate)) {
    const originalDate = date;
    date = new PlanerDate(date);
    await date.initializeFeiertage(originalDate);
  }

  const fullDate = isPlanerDate(date) ? date.full_date : date;
  if (zeitraumAnfang != null) {
    thisStart = fullDate >= zeitraumAnfang;
  }
  if (zeitraumEnde != null) {
    thisEnd = fullDate < zeitraumEnde;
  }
  return thisStart && thisEnd;
}

function splitRegelcode(regelcode: string) {
  const hash: {
    isBedarf: boolean;
    feiertage: string;
    wochentage: string;
    monatstage: string;
    wochen: string;
    monate: string;
    feiertageR: string[];
    wochentageR: string[];
    wochenR: string[];
    monateR: string[];
    isNicht: boolean;
    isAuch: boolean;
    isNur: boolean;
    hasFeiertag: boolean;
  } = {
    isBedarf: regelcode === '',
    feiertage: '',
    wochentage: '',
    monatstage: '',
    wochen: '',
    monate: '',
    feiertageR: [],
    wochentageR: [],
    wochenR: [],
    monateR: [],
    isNicht: false,
    isAuch: false,
    isNur: false,
    hasFeiertag: false
  };

  if (!hash.isBedarf) {
    const regelnFt = regelcode.split('#ft');
    if (regelnFt[1]) hash.feiertage = regelnFt[1];

    if (regelnFt[0]) {
      const regelnWr = regelnFt[0].split('#wr');
      if (regelnWr[1]) hash.wochentage = regelnWr[1];

      if (regelnWr[0]) {
        const regelnTr = regelnWr[0].split('#tr');
        if (regelnTr[1]) hash.monatstage = regelnTr[1];

        if (regelnTr[0]) {
          const regelnKw = regelnTr[0].split('#fkw');
          if (regelnKw[1]) hash.wochen = regelnKw[1];

          if (regelnKw[0]) {
            const regelnM = regelnKw[0].split('#fm');
            if (regelnM[1]) hash.monate = regelnM[1];
          }
        }
      }
    }

    const feiertageStr = hash.feiertage.replace(ZEITRAUMREGELN_REGEX.clear, '');
    const wochentageStr = hash.wochentage.replace(ZEITRAUMREGELN_REGEX.clear, '');
    const wochenStr = hash.wochen.replace(ZEITRAUMREGELN_REGEX.clear, '');
    const monateStr = hash.monate.replace(ZEITRAUMREGELN_REGEX.clear, '');

    hash.feiertageR = feiertageStr.length ? feiertageStr.split('_').filter(Boolean) : [];
    hash.wochentageR = wochentageStr.length ? wochentageStr.split('_').filter(Boolean) : [];
    hash.wochenR = wochenStr.length ? wochenStr.split('_').filter(Boolean) : [];
    hash.monateR = monateStr.length ? monateStr.split('_').filter(Boolean) : [];

    hash.isNicht = regelcode.includes('#nicht');
    hash.isAuch = regelcode.includes('#auch');
    hash.isNur = regelcode.includes('#nur');
    hash.hasFeiertag = regelcode.includes('#ft');
  }

  return hash;
}

function checkKalenderwochen(regeln: string[], date: Date | PlanerDate): boolean {
  const currentWeek = isPlanerDate(date) ? date.week : getWeek(date, { weekStartsOn: 1 });
  let result = regeln.includes(`kw${currentWeek}`);

  if (result) {
    const lastWeek = isPlanerDate(date) ? date.last_week : getWeek(subWeeks(date, 1), { weekStartsOn: 1 });

    if (regeln.includes('#extra')) {
      result = lastWeek === 53;
    } else if (regeln.includes('#gemein')) {
      result = lastWeek === 52;
    }
  }

  return result;
}

async function checkDate(date: Date | PlanerDate, zeitraumkategorie: zeitraumkategories): Promise<boolean> {
  let isBedarf = false;

  if (!(date instanceof PlanerDate)) {
    date = new PlanerDate(date);
  }

  const zeitraumAnfang = zeitraumkategorie.anfang;
  const zeitraumEnde = zeitraumkategorie.ende;
  const regelcode = zeitraumkategorie.regelcode || '';
  if (await shouldCheckDate(date, zeitraumAnfang, zeitraumEnde)) {
    const hash = splitRegelcode(regelcode);
    isBedarf = hash.isBedarf;

    if (!isBedarf) {
      let isFeiertag = false;

      if (hash.hasFeiertag) {
        if (date.feiertag === '') {
          isFeiertag = hash.isNicht;
        } else {
          // Note: Holidays seem to need to be passed as a string, otherwise some are not recognized
          const checkFeiertagValue = hash.feiertageR.includes(date.feiertag.name.toLowerCase());
          isFeiertag = hash.isNicht ? !checkFeiertagValue : checkFeiertagValue;
        }
      }

      const monthNr = isPlanerDate(date) ? date.month_nr : (date as Date).getMonth() + 1;

      const isKw = !regelcode.includes('#fkw') || checkKalenderwochen(hash.wochenR, date);
      const isMonth = !regelcode.includes('#fm') || hash.monateR.includes(`m${monthNr}`);
      const isWochentag = !regelcode.includes('#wr') || hash.wochentageR.includes(date.week_day);
      const isStart = isKw && isMonth && isWochentag;

      if (hash.isAuch || !hash.hasFeiertag) {
        isBedarf = checkMonatstag(regelcode, hash.monatstage, date, hash.monateR, isStart || isFeiertag);
      } else if ((hash.isNur && isFeiertag) || (hash.isNicht && isFeiertag)) {
        isBedarf = checkMonatstag(regelcode, hash.monatstage, date, hash.monateR, isStart && isFeiertag);
      }
    }
  }

  return isBedarf;
}

function checkMonatstag(
  regelcode: string,
  monatstage: string,
  date: PlanerDate,
  monateR: string[],
  isStart: boolean
): boolean {
  return regelcode.includes('#tr') ? checkTagRhythmus(monatstage, date, monateR, isStart) : isStart;
}

function checkTagRhythmus(regeln: string, date: PlanerDate | Date, monate: string[], start: boolean): boolean {
  let isRhythmus = start;

  if (isRhythmus) {
    // Remove clear markers and split the rules
    let tagRegeln = regeln.replace(ZEITRAUMREGELN_REGEX.clear, '').split('_').filter(Boolean);
    const jedenMonatAbStart = tagRegeln.includes('#neu');
    const jedenMonatBisEnde = tagRegeln.includes('#ende');

    if (jedenMonatAbStart) {
      tagRegeln = tagRegeln.filter((items) => items !== '#neu');
    }
    if (jedenMonatBisEnde) {
      tagRegeln = tagRegeln.filter((items) => items !== '#ende');
    }

    // Extract start tag, repetition, and end tag from rules
    const startTag = parseInt(tagRegeln[0], 10);
    const wiederholung = Math.abs(parseInt(tagRegeln[1], 10));
    const endTag = parseInt(tagRegeln[2], 10);

    const currentDate = date instanceof Date ? date : newDate(date.full_date); // Use full_date if it's a PlanerDate
    const currentMonth = currentDate.getMonth(); // JavaScript months are 0-indexed
    const currentYear = currentDate.getFullYear();

    // Determine start and end months from input
    const startMonth = monate.length ? parseInt(monate[0].replace('m', ''), 10) : 0;
    const endMonth = monate.length ? parseInt(monate[monate.length - 1].replace('m', ''), 10) : 11;

    // Calculate valid start and end dates
    const startDatum = checkValidDate(currentYear, startMonth, startTag);
    const endDatum = checkValidDate(currentYear, endMonth, endTag);

    // Determine the initial check date
    let checkDatum = jedenMonatAbStart ? checkValidDate(currentYear, currentMonth, startTag) : startDatum;

    // Check if it matches the rhythm initially
    isRhythmus = wiederholung === 0 && isSameDay(currentDate, checkDatum);

    if (wiederholung > 0) {
      const isInRange = currentDate >= startDatum && currentDate <= endDatum;
      if (isInRange) {
        let thisEndDatum = checkValidDate(checkDatum.getFullYear(), checkDatum.getMonth(), endTag);

        while (checkDatum <= endDatum && checkDatum <= currentDate) {
          isRhythmus = isEqual(currentDate, checkDatum);
          const newCheckDatum = addDays(checkDatum, wiederholung);

          if (jedenMonatBisEnde && checkDatum > thisEndDatum) {
            isRhythmus = false;
          }

          const isNewMonth = newCheckDatum.getMonth() > checkDatum.getMonth();
          checkDatum = newCheckDatum;

          if (isNewMonth) {
            thisEndDatum = checkValidDate(checkDatum.getFullYear(), checkDatum.getMonth(), endTag);
            if (jedenMonatAbStart) {
              checkDatum = checkValidDate(checkDatum.getFullYear(), checkDatum.getMonth(), startTag);
            }
          }
        }
      }
    }
  }

  return isRhythmus;
}

function checkValidDate(year: number, month: number, day: number): Date {
  const nextMonthDate = addMonths(newDateYearMonthDay(year, month, 1), 1);
  const lastDayOfMonth = subDays(nextMonthDate, 1);
  let result: Date;

  if (day <= 0) {
    result = addDays(nextMonthDate, day - 1); // day is negative, move back
  } else if (day > lastDayOfMonth.getDate()) {
    result = newDateYearMonthDay(year, month, lastDayOfMonth.getDate()); // day exceeds maximum for the month
  } else {
    result = newDateYearMonthDay(year, month, day);
  }

  return result;
}

export { checkDate };
