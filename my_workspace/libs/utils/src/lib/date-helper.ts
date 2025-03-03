import { format, addWeeks, subWeeks, isValid, parseISO, startOfToday } from 'date-fns';

export function newDate(tag: string | Date | number = ''): Date {
  if (!tag) return new Date();
  const dateRegEx = /^\d{4}-(0[1-9]|1[0-2])-\d{2}$/;
  let date = new Date(tag);
  // 12 Uhr, damit keine Probleme mit der Zeitzone entstehen
  if (typeof tag === 'string' && dateRegEx.test(tag)) {
    tag = new Date(`${tag}T12:00:00.000Z`);
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

export function _subWeeks(date: Date | string, weeks: number) {
  let parseDate = newDate(date);
  return subWeeks(parseDate, weeks);
}

export function _addWeeks(date: Date | string, weeks: number) {
  let parseDate = newDate(date);
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
