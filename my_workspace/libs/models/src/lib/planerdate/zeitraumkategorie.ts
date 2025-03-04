import { zeitraumkategories, zeitraumregels } from '@prisma/client';
import { PlanerDate } from './planerdate';
import { addDays, getWeek, isEqual, addMonths, subDays, subWeeks, isSameDay } from 'date-fns';
import { getDateStr, newDate, newDateYearMonthDay } from '@my-workspace/utils';
import { _zeitraumregel, getAllZeitraumKategories, getZeitraumKategoriesInRange } from '@my-workspace/prisma_cruds';

interface RegelcodeHash {
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
}

const ZEITRAUMREGELN_REGEX = {
  monat: /^m([1-9])$|^m1([0-2])$/g,
  kalenderwoche: /^kw[1-9]$|^kw[1-4][0-9]$|^kw5[0-3]$/g,
  wochentag: /^Mo$|^Di$|^Mi$|^Do$|^Fr$|^Sa$|^So$/g,
  clear: /^_|_$/g
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
  const dateNr = Number(getDateStr(newDate(fullDate)).split('-').join(''));
  if (zeitraumAnfang != null) {
    thisStart = dateNr >= Number(getDateStr(zeitraumAnfang).split('-').join(''));
  }
  if (zeitraumEnde != null) {
    thisEnd = dateNr < Number(getDateStr(zeitraumEnde).split('-').join(''));
  }
  return thisStart && thisEnd;
}

function splitRegelcode(regelcode: string) {
  const hash: RegelcodeHash = {
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

function checkKalenderwochen(regeln: string[], date: PlanerDate): boolean {
  let result = regeln.includes(`kw${date.week}`);

  if (result) {
    const lastWeek = date.last_week;

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
    const originalDate = date;
    date = new PlanerDate(date);
    await date.initializeFeiertage(originalDate);
  }

  const zeitraumAnfang = zeitraumkategorie.anfang;
  const zeitraumEnde = zeitraumkategorie.ende;
  const regelcode = zeitraumkategorie.regelcode || '';
  if (!(await shouldCheckDate(date, zeitraumAnfang, zeitraumEnde))) return isBedarf;

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

    const isKw = !regelcode.includes('#fkw') || checkKalenderwochen(hash.wochenR, date);
    const isMonth = !regelcode.includes('#fm') || hash.monateR.includes(`m${date.month_nr}`);
    const isWochentag = !regelcode.includes('#wr') || hash.wochentageR.includes(date.week_day);
    const isStart = isKw && isMonth && isWochentag;

    if (hash.isAuch || !hash.hasFeiertag) {
      isBedarf = checkMonatstag(regelcode, hash.monatstage, date, hash.monateR, isStart || isFeiertag);
    } else if ((hash.isNur && isFeiertag) || (hash.isNicht && isFeiertag)) {
      isBedarf = checkMonatstag(regelcode, hash.monatstage, date, hash.monateR, isStart && isFeiertag);
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

function checkTagRhythmus(regeln: string, date: PlanerDate, monate: string[], start: boolean): boolean {
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

    const currentDate = newDate(date.full_date); // Use full_date if it's a PlanerDate
    const currentDateStr = getDateStr(currentDate);
    const currentMonth = currentDate.getMonth(); // JavaScript months are 0-indexed
    const currentYear = currentDate.getFullYear();

    // Determine start and end months from input (values are 1-12) -> JS expects 0-11
    const startMonth = (monate.length ? parseInt(monate[0].replace('m', ''), 10) : 1) - 1;
    const endMonth = (monate.length ? parseInt(monate[monate.length - 1].replace('m', ''), 10) : 12) - 1;

    // Calculate valid start and end dates
    const startDatum = checkValidDate(currentYear, startMonth, startTag);
    const endDatum = checkValidDate(currentYear, endMonth, endTag);

    // Determine the initial check date
    let checkDatum = jedenMonatAbStart ? checkValidDate(currentYear, currentMonth, startTag) : startDatum;

    // Check if it matches the rhythm initially
    isRhythmus = wiederholung === 0 && currentDateStr === getDateStr(checkDatum);

    if (wiederholung > 0) {
      const currentDateNr = Number(currentDateStr.split('-').join(''));
      const startDatumNr = Number(getDateStr(startDatum).split('-').join(''));
      const endDatumNr = Number(getDateStr(endDatum).split('-').join(''));
      const isInRange = currentDateNr >= startDatumNr && currentDateNr <= endDatumNr;

      if (isInRange) {
        let checkDatumStr = getDateStr(checkDatum);
        let checkDatumNr = Number(checkDatumStr.split('-').join(''));
        let thisEndDatum = checkValidDate(checkDatum.getFullYear(), checkDatum.getMonth(), endTag);

        let thisEndDatumNr = Number(getDateStr(thisEndDatum).split('-').join(''));

        // Iterate over while,
        // because the rythm has to be calculated
        while (checkDatumNr <= endDatumNr && checkDatumNr <= currentDateNr) {
          isRhythmus = checkDatumStr === currentDateStr;

          const newCheckDatum = newDateYearMonthDay(
            checkDatum.getFullYear(),
            checkDatum.getMonth(),
            checkDatum.getDate() + wiederholung
          );
          if (jedenMonatBisEnde && checkDatumNr > thisEndDatumNr) {
            isRhythmus = false;
          }

          const isNewMonth = newCheckDatum.getMonth() > checkDatum.getMonth();
          checkDatum = newCheckDatum;
          if (isNewMonth) {
            thisEndDatum = checkValidDate(checkDatum.getFullYear(), checkDatum.getMonth(), endTag);
            thisEndDatumNr = Number(getDateStr(thisEndDatum).split('-').join(''));
            if (jedenMonatAbStart) {
              checkDatum = checkValidDate(checkDatum.getFullYear(), checkDatum.getMonth(), startTag);
            }
          }
          checkDatumStr = getDateStr(checkDatum);
          checkDatumNr = Number(checkDatumStr.split('-').join(''));
        }
      }
    }
  }

  return isRhythmus;
}

function checkValidDate(year: number, month: number, day: number): Date {
  const nextMonthDate = newDateYearMonthDay(year, month + 1, 1);
  const lastDayOfMonth = newDateYearMonthDay(year, month + 1, 0);
  let result: Date;

  if (day <= 0) {
    result = nextMonthDate;
    nextMonthDate.setDate(1 + (day - 1));
  } else if (day > lastDayOfMonth.getDate()) {
    result = lastDayOfMonth;
  } else {
    result = newDateYearMonthDay(year, month, day);
  }

  return result;
}

async function previewZeitraumkategorien(year: number | string) {
  const dates: PlanerDate[] = [];
  let weekCounter = 0;
  if (typeof year === 'string') {
    year = parseInt(year, 10);
  }
  const anfang = newDateYearMonthDay(year, 0, 1);
  const ende = newDateYearMonthDay(year + 1, 0, 1);
  const zeitraumkategorien = await getZeitraumKategoriesInRange(anfang, ende);
  while (anfang < ende) {
    const planerDate = new PlanerDate(anfang, weekCounter);
    await planerDate.initializeFeiertage(anfang, zeitraumkategorien);
    dates.push(planerDate);
    if (anfang.getDay() === 5) {
      weekCounter++;
    }
    anfang.setDate(anfang.getDate() + 1);
  }
  const result = {
    zeitraumkategorien: (await getAllZeitraumKategories()).reduce((acc: Record<number, zeitraumkategories>, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {}),
    zeitraumregeln: (await _zeitraumregel.getAllZeitraumregeln()).reduce(
      (acc: Record<number, zeitraumregels>, curr) => {
        acc[curr.id] = curr;
        return acc;
      },
      {}
    ),
    dates
  };
  return result;
}

export { checkDate, previewZeitraumkategorien };
