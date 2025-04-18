import { format, addWeeks, subWeeks, isValid, parseISO, startOfToday } from 'date-fns';

export function newDate(tag: string | Date | number = ''): Date {
  if (!tag) return new Date();
  const dateRegEx = /^\d{4}-(0[1-9]|1[0-2])-\d{2}$/;
  let date = new Date(tag);
  // 12 Uhr, damit keine Probleme mit der Zeitzone entstehen
  if (typeof tag === 'string' && dateRegEx.test(tag)) {
    date = new Date(`${tag}T12:00:00.000Z`);
  }
  return date;
}

export function newDateYearMonthDay(year: number, month: number, day: number): Date {
  return new Date(year, month, day, 12);
}

export function getDateStr(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const str = `${year}-${month}-${day}`;
  return str;
}

export function getDateNr(date: Date | string) {
  const tag = typeof date === 'string' ? date : getDateStr(date);
  return Number(tag.split('-').join(''));
}

export function getKW(dirtyDate: Date | string) {
  const date = newDate(dirtyDate);
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  // January 4 is always in week 1.
  const week1 = newDateYearMonthDay(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
}

export function _subWeeks(date: Date | string, weeks: number) {
  const parseDate = newDate(date);
  return subWeeks(parseDate, weeks);
}

export function _addWeeks(date: Date | string, weeks: number) {
  const parseDate = newDate(date);
  return addWeeks(parseDate, weeks);
}

export function getAsDate(date: Date | string) {
  let tag = startOfToday();

  if (date) {
    if (typeof date === 'string') {
      const parsedDate = parseISO(date);
      if (isValid(parsedDate)) {
        tag = parsedDate;
      }
    } else if (date instanceof Date) {
      tag = date;
    }
  }

  return tag;
}

export function formatDateForDB(input: Date | string) {
  let date;

  if (input instanceof Date) {
    date = input;
  } else if (typeof input === 'string') {
    date = parseISO(input);
    if (!isValid(date)) {
      throw new Error('Invalid date string');
    }
  } else {
    throw new Error('Invalid input type. Expected Date or string.');
  }

  // Format as ISO 8601 with local timezone offset
  return format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
}
