import { isDate } from './types';

/**
 * @returns {Date} Liefert das aktuelle Datum
 */
export const today = () => new Date();
export const jahresInterval = 5;
export const firstYear = 2021;
// Format: (-)Xt(-)Y
export const relDateRegEx = /^-?\d+t-?\d+$/;
// Format: YYYY-MM-DD
export const dateRegEx = /^\d{4}-(0[1-9]|1[0-2])-\d{1,2}$/;
// Format: 0000-00-00T00:00:00.000Z
export const dateTimeRegEx = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{1,3}Z/;
// Format: 0000-00-00T00:00
export const dateTimeInputRegEx = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;
// Liefert die Millisekunden für zwei Wochen
export const beforeInMS = 4 * 7 * 24 * 60 * 60 * 1000;

/**
 * @param {Date|String} dirtyDate - Ein String mit dem ein new Date(dirtyDate) funktioniert z.B. YYYY-MM-DD
 * @returns {Date} Gibt ein Date Objekt zurueck.
 * @example 2021-01-01 => Date(2021-01-01)
 */
export function toDate(dirtyDate) {
  const cleanDate = isDate(dirtyDate) ? dirtyDate : new Date(dirtyDate);
  const date = new Date(cleanDate.getTime());
  return date;
}

/**
 * @param {Date|String} dirtyDate
 * @description Formatiert ein Date in einen String im Format YYYY-MM-DD
 * @returns {String} String => YYYY-MM-DD
 * @example Date(2021-01-01) => 2021-01-01
 */
export function formatDate(dirtyDate) {
  const date = toDate(dirtyDate);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const day = String(date.getDate()).padStart(2, 0);
  const str = `${year}-${month}-${day}`;
  return str;
}

/**
 * @param {Date|String} dirtyDate
 * @description Gibt den letzten Tag des Monats als Date zurueck.
 * @returns {Date} Letzter Tag im Monat
 * @example 2021-10-01 => 2021-01-31
 */
export function endOfMonth(dirtyDate) {
  const date = toDate(dirtyDate);
  const month = date.getMonth();
  date.setFullYear(date.getFullYear(), month + 1, 0);
  date.setHours(23, 59, 59, 999);
  return date;
}

/**
 * @param {Date|String} dirtyDate
 * @description Gibt den ersten Tag des Monats als Date zurueck.
 * @returns {Date} Erster Tag im Monat
 * @example 2021-10-01 => 2021-01-01
 */
export function startOfMonth(dirtyDate) {
  const date = toDate(dirtyDate);
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * @param {Date|String} day
 * @param {Number} count
 * @returns {Date} Liefert den addierten Tag
 * @example 2021-01-01, 1 => 2021-01-02
 */
export function addDays(dirtyDate, count) {
  const date = toDate(dirtyDate);
  return new Date(date.setDate(date.getDate() + count));
}

/**
 * Fuer Juli = 7 nicht 6
 * @param {number} month
 * @param {number} year
 * @returns Anzahl der Tage im Monat
 * @example 7, 2021 => 31
 */
export function daysInMonth(month, year) {
  // Month in JavaScript is 0-indexed (January is 0, February is 1, etc),
  // but by using 0 as the day it will give us the last day of the prior
  // month. So passing in 1 as the month number will return the last day
  // of January, not February
  // to get july month = 7 != 6
  return new Date(year, month + 1, 0).getDate();
}

/**
 * @param {Date | String} dirtyDate - Kann als date oder string uebergeben werden.
 * @returns {number} Liefert die Kalenderwoche
 * @example 2021-31-12 => 53
 */
export function getWeek(dirtyDate) {
  const date = toDate(dirtyDate);
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  // January 4 is always in week 1.
  const week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  );
}

/**
 * Liefert das Jahr des uebergebenen Datums
 * @param {String | Date} date
 * @returns {Number} Liefert das Jahr
 * @example 2021-01-01 => 2021
 */
export function getYear(date) {
  return toDate(date).getFullYear();
}

/**
 * Liefert den Anfang der Woche als date object vom uebergebenen Tag
 * weekStartsOn: 0 = Sonntag, 1 = Montag
 * @param {Date | String} dirtyDate
 * @param {Number} weekStartsOn
 * @returns {Date} Date
 * @example 2021-01-01 => Date(2020-12-28)
 */
export function startDayOfWeek(dirtyDate, weekStartsOn = 1) {
  const date = toDate(dirtyDate);
  const day = date.getDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;

  date.setDate(date.getDate() - diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * Liefert das Ende der Woche als date object vom uebergebenen Tag
 * weekStartsOn: 0 = Sonntag, 1 = Montag
 * @param {Date | String} dirtyDate
 * @param {Number} weekStartsOn
 * @returns {Date} Date
 * @example 2021-01-01 => Date(2021-01-03)
 */
export function lastDayOfWeek(dirtyDate, weekStartsOn = 1) {
  const date = toDate(dirtyDate);
  const day = date.getDay();
  const diff = (day < weekStartsOn ? -7 : 0) + 6 - (day - weekStartsOn);

  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + diff);
  return date;
}

/**
 * Liefert das Datum plus die angegebene Anzahl an Wochen.
 * @param {Date | String} dirtyDate
 * @param {Number} amount
 * @returns {Date} Date
 * @example 2021-01-01, 1 => Date(2021-01-08)
 */
export function addWeeks(dirtyDate, amount) {
  const days = amount * 7;
  return addDays(dirtyDate, days);
}

/**
 * Liefert das Datum plus die angegebene Anzahl an Monaten.
 * @param {Date | String} dirtyDate
 * @param {Number} amount
 * @returns {Date} Date
 * @example 2021-01-01, 1 => Date(2021-02-01)
 */
export function addMonths(dirtyDate, amount) {
  const date = toDate(dirtyDate);
  if (Number.isNaN(amount)) return;
  if (amount === 0) {
    // If 0 months, no-op to avoid changing times in the hour before end of DST
    return date;
  }
  const dayOfMonth = date.getDate();

  // The JS Date object supports date math by accepting out-of-bounds values for
  // month, day, etc. For example, new Date(2020, 0, 0) returns 31 Dec 2019 and
  // new Date(2020, 13, 1) returns 1 Feb 2021.  This is *almost* the behavior we
  // want except that dates will wrap around the end of a month, meaning that
  // new Date(2020, 13, 31) will return 3 Mar 2021 not 28 Feb 2021 as desired. So
  // we'll default to the end of the desired month by adding 1 to the desired
  // month and using a date of 0 to back up one day to the end of the desired
  // month.
  const endOfDesiredMonth = new Date(date.getTime());
  endOfDesiredMonth.setMonth(date.getMonth() + amount + 1, 0);
  const _daysInMonth = endOfDesiredMonth.getDate();
  if (dayOfMonth >= _daysInMonth) {
    // If we're already at the end of the month, then this is the correct date
    // and we're done.
    return endOfDesiredMonth;
  }
  // Otherwise, we now know that setting the original day-of-month value won't
  // cause an overflow, so set the desired day-of-month. Note that we can't
  // just set the date of `endOfDesiredMonth` because that object may have had
  // its time changed in the unusual case where where a DST transition was on
  // the last day of the month and its local time was in the hour skipped or
  // repeated next to a DST transition.  So we use `date` instead which is
  // guaranteed to still have the original time.
  date.setFullYear(
    endOfDesiredMonth.getFullYear(),
    endOfDesiredMonth.getMonth(),
    dayOfMonth
  );
  return date;
}

/**
 * Liefert das Datum plus die angegebene Anzahl an Jahren.
 * @param {String | Date} dirtyDate
 * @param {Number} amount
 * @returns {Date} Date
 * @example 2021-01-01, 1 => Date(2022-01-01)
 */
export function addYears(dirtyDate, amount) {
  return addMonths(dirtyDate, amount * 12);
}

/**
 * Liefert das Datum plus die angegebene Anzahl an Typ.
 * Typen: day, week, month, year
 * Wird kein passender Typ gefunden, wird das Datum zurueckgegeben.
 * @param {String | Date} dirtyDate
 * @param {Number} amount
 * @param {String} type
 * @returns {Date} Date
 * @example
 * 2021-01-01, 1, day => Date(2021-01-02)
 * 2021-01-01, 1, week => Date(2021-01-08)
 * 2021-01-01, 1, month => Date(2021-02-01)
 * 2021-01-01, 1, year => Date(2022-01-01)
 * 2021-01-01, 1, test => Date(2021-01-01)
 */
export function addDateByType(dirtyDate, amount = 1, type = 'day') {
  switch (type) {
    case 'day':
      return addDays(dirtyDate, amount);
    case 'week':
      return addWeeks(dirtyDate, amount);
    case 'month':
      return addMonths(dirtyDate, amount);
    case 'year':
      return addYears(dirtyDate, amount);
    default:
      return addDays(dirtyDate, 0);
  }
}

/** Liefert den Input als dateTimeInput-String zurück.
 * Wenn der Input kein gültiger dateTimeInput-String ist, wird das aktuelle Datum zurückgegeben.
 * @param {String} date
 * @returns {String} yyyy-MM-ddThh:mm
 * @example 2021-01-01T00:00
 */
export const createDateTimeInput = (date) => {
  if (typeof date === 'string' && dateTimeInputRegEx.test(date)) {
    return date;
  }
  return today().toISOString().slice(0, 16);
};

/**
 * @param {String} str
 * @returns {Array} Liefert [Jahr, Monat, Tag]
 * @example 2021-01-01 => [2021, 1, 1]
 */
export const getYearMonthDayFromString = (str) =>
  str.split('-').map((value) => parseInt(value, 10));

/**
 * Erstellt ein absolutes Datum
 * (-)Xt(-)Y -> yyyy-MM-DD
 * @param {String} dateId
 * @param {String} anfang
 * @returns {String} yyyy-MM-DD
 * @example 1t1, 2021-01-01 => 2021-02-02
 */
export const createAbsolutDateId = (dateId, anfang) => {
  let absoluteDate = dateId;
  if (!(relDateRegEx.test(dateId) && dateRegEx.test(anfang)))
    return absoluteDate;
  const splittedDate = dateId.split('t');
  const relDay = parseInt(splittedDate[0], 10);
  const relMonth = parseInt(splittedDate[1], 10);
  const [mainYear, mainMonth] = getYearMonthDayFromString(anfang);

  let days = relDay;
  let year = mainYear;
  let month = mainMonth + relMonth;
  if (month < 1) {
    month += 12;
    year -= 1;
  } else if (month > 12) {
    month -= 12;
    year += 1;
  }
  if (relDay < 1) {
    const nextDate = new Date(year, month - 1, 32);
    const nextMonthDays = nextDate.getDate();
    const maxDays = 32 - nextMonthDays;
    days += maxDays;
  }
  days = days < 10 ? `0${days}` : days;
  month = month < 10 ? `0${month}` : month;
  absoluteDate = `${year}-${month}-${days}`;
  return absoluteDate;
};

/**
 * Erstellt ein relatives Datum
 * yyyy-MM-DD -> XtY
 *
 * X = -1, Y = -1 -> vorheriger Monat, letzter Tag
 *
 * X = Tag des Monats, Y = 0 -> Tag des Hauptmonats
 *
 * X = 1, Y = 1 -> nächster Monat, erster Tag
 * @param {String} dateId
 * @param {String} anfang
 * @returns {String} XtY
 * @example 2021-02-02, 2021-01-01 => 1t1
 */
export const createRelativeDateId = (dateId, anfang) => {
  let relativeDate = dateId;
  if (!(dateRegEx.test(dateId) && dateRegEx.test(anfang))) return relativeDate;
  const [mainYear, mainMonth] = getYearMonthDayFromString(anfang);
  const [nowYear, nowMonth, nowDay] = getYearMonthDayFromString(dateId);
  const year = nowYear - mainYear;
  let month = -1 * (Math.abs(year) * 12 - nowMonth + mainMonth);
  if (year > 0) {
    month = Math.abs(year) * 12 - mainMonth + nowMonth;
  }
  let day = nowDay;
  if (month < 0) {
    // Monat - 1, da in Rails der Monat bei 1 beginnt und in JS bei 0
    const nextDate = new Date(nowYear, nowMonth - 1, 32);
    const nextMonthDays = nextDate.getDate();
    const maxDays = 32 - nextMonthDays;
    day -= maxDays;
  }
  relativeDate = `${day}t${month}`;
  return relativeDate;
};

/**
 * Liefert die PlanTime-Anfänge der Monatspläne für den Wochenverteiler
 * @param {String} anfangStr
 * @param {String} pageName
 * @returns {Object} {tage: [], anfaenge: []}
 * @example {tage: ["2021-01-01", "2021-01-02", "2021-01-03"], anfaenge: ["2021-01-01"]}
 */
export const getVerteilerDates = (anfangStr, pageName) => {
  const result = {
    tage: [],
    anfaenge: []
  };
  const anfang = toDate(anfangStr);
  if (anfang) {
    // wochenverteiler erstellt die Dates für eine ganze Woche
    if (pageName === 'wochenverteiler') {
      const anfangWeekDay = anfang.getDay();
      if (anfangWeekDay > 1) {
        anfang.setDate(anfang.getDate() - (anfangWeekDay - 1));
      } else if (anfangWeekDay === 0) {
        anfang.setDate(anfang.getDate() - 6);
      }
      for (let i = 0; i < 7; i++) {
        const date = new Date(anfang);
        date.setDate(date.getDate() + i);
        result.tage.push(formatDate(date));
        date.setDate(1);
        const monthStartString = formatDate(date);
        if (!result.anfaenge.includes(monthStartString))
          result.anfaenge.push(monthStartString);
      }
    } else {
      result.tage.push(anfangStr);
      anfang.setDate(1);
      result.anfaenge.push(formatDate(anfang));
    }
  }
  return result;
};

/**
 * @param {Date|String} date
 * @returns {String} Liefert den kurzen Monatsnamen als String
 * @example Jan, Feb, Mär, Apr, Mai, Jun, Jul, Aug, Sep, Okt, Nov, Dez
 */
export const getMonthShort = (date) =>
  toDate(date).toLocaleDateString('de-De', { month: 'short' });

/**
 * @param {Date|String} date
 * @returns {String} Liefert den Monatsnamen als String
 * @example Januar, Februar, März, April, Mai, Juni, Juli, August, September, Oktober, November, Dezember
 */
export const getMonth = (date) =>
  toDate(date).toLocaleDateString('de-De', { month: 'long' });

/**
 * @param {Date|String} date
 * @returns {String} Liefert das Datum im deutschen Format
 * @example 2021-01-01 => 01.01.2021
 */
export const getFullDate = (date) => toDate(date).toLocaleDateString('de-De');

/**
 * @param {Date|String} date
 * @returns {String} Liefert den Wochentag als String
 * @example Montag, Dienstag, Mittwoch, Donnerstag, Freitag, Samstag, Sonntag
 */
export const getWeekday = (date) =>
  toDate(date).toLocaleDateString('de-De', { weekday: 'long' });

/**
 * @param {Date|String} date
 * @returns {String} Liefert den Wochentag als Short-String
 * @example Mo, Di, Mi, Do, Fr, Sa, So
 */
export const getWeekdayShort = (date) =>
  toDate(date).toLocaleDateString('de-De', { weekday: 'short' });

/**
 * @param {Date|String} date
 * @returns {String} Liefert das KW Datum als String KWxx Monat Jahr
 * @example 2021-01-01 => KW53 Dezember 2020
 */
export const getKWLabel = (date) => {
  const day = toDate(date);
  return `KW${getWeek(date)} ${getMonthShort(date)} ${day.getFullYear()}`;
};

/**
 * @param {Array} arr
 * @returns {String} Liefert das Datum als String im Format yyyy-MM-dd
 * @example [2021, 1, 1] => 2021-01-01
 */
export const returnDateStringFromArr = (arr) => {
  const [jahr, monat, tag] = arr;
  return `${jahr}-${monat < 10 ? `0${monat}` : monat}-${
    tag < 10 ? `0${tag}` : tag
  }`;
};

/**
 * @param {Date|String} calDateStr
 * @returns {Object} { name, dateDe }
 * Liefert das Datum im deutschen Format und den Wochentag als String
 * @example { name: "Montag", dateDe: "01.01.2021" }
 */
export function getGermanDate(calDateStr) {
  return {
    name: getWeekday(calDateStr),
    dateDe: getFullDate(calDateStr)
  };
}

/**
 * Testet, ob zwei Datum-Strings aufeinander folgen
 * @param {String} _today
 * @param {String} yesterday
 * @returns {Boolean} True, wenn _today der Tag nach yesterday ist
 * @example 2021-01-01, 2020-12-31 => true
 */
export function isNextDay(_today, yesterday) {
  return formatDate(yesterday) === formatDate(addDays(_today, -1));
}

/**
 * Liefert Wochentag und Tag des Datums
 * @param {String} tag
 * @returns {String} "Wochentag Datum" => "Mo 01.01.2021"
 * @example 2021-01-01 => "Fr 01.01.2021"
 */
export const getTagLabel = (tag) => {
  return `${getWeekdayShort(tag)} ${getFullDate(tag)}`;
};
