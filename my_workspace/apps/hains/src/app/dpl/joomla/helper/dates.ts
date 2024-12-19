/**
 * Liefert das Datum im Format "YYYY-MM-DD" für das übergebene Datum.
 * @param {Date} date
 * @returns {string} Datum im Format "YYYY-MM-DD"
 */
export const getDateFromJSDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const convertDateToEnFormat = (date: Date) => {
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);

  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

/**
 * Liefert das aktuelle Datum im Format "YYYY-MM-DD".
 * @returns {string} Aktuelles Datum
 */
export const today = (): string => {
  return getDateFromJSDate(new Date());
};

/**
 * @param {Date | string} dirtyDate - Kann als date oder string uebergeben werden.
 * @returns {number} Liefert die Kalenderwoche
 * @example 2021-31-12 => 53
 */
export function getWeek(dirtyDate: Date | string): number {
  const date = typeof dirtyDate === 'string' ? new Date(dirtyDate) : dirtyDate;
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

export const isDate = (value: any) => value instanceof Date;

/**
 * @param {Date|String} dirtyDate - Ein String mit dem ein new Date(dirtyDate) funktioniert z.B. YYYY-MM-DD
 * @returns {Date} Gibt ein Date Objekt zurueck.
 * @example 2021-01-01 => Date(2021-01-01)
 */
export function toDate(dirtyDate: any) {
  const cleanDate = isDate(dirtyDate) ? dirtyDate : new Date(dirtyDate);
  const date = new Date(cleanDate.getTime());
  return date;
}

export function addDays(dirtyDate: Date | string, count: number) {
  const date = toDate(dirtyDate);
  return new Date(date.setDate(date.getDate() + count));
}

/**
 * @param {Date|String} dirtyDate
 * @description Gibt den letzten Tag des Monats als Date zurueck.
 * @returns {Date} Letzter Tag im Monat
 * @example 2021-10-01 => 2021-01-31
 */
export function endOfMonth(dirtyDate: any) {
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
export function startOfMonth(dirtyDate: any) {
  const date = toDate(dirtyDate);
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * Liefert das Datum plus die angegebene Anzahl an Monaten.
 * @param {Date | String} dirtyDate
 * @param {Number} amount
 * @returns {Date} Date
 * @example 2021-01-01, 1 => Date(2021-02-01)
 */
export function addMonths(dirtyDate: any, amount: number) {
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

export const getGermanDateLong = (dateStr: string) => {
  const date = new Date(dateStr);

  const options = {
    weekday: 'short',
    year: '2-digit',
    day: 'numeric',
    month: 'short'
  } as const;

  const formattedDate = date.toLocaleDateString('de-DE', options);
  return formattedDate;
};

export function getGermandate(dirtyDate: Date | string): string {
  const date = typeof dirtyDate === 'string' ? new Date(dirtyDate) : dirtyDate;
  return date.toLocaleDateString('de-De');
}
