import { format, addWeeks, subWeeks, isValid, parseISO, startOfToday } from 'date-fns';

export function _subWeeks(date: Date | string, weeks: number) {
  let parseDate = date;
  if (typeof date === 'string') {
    parseDate = new Date(date);
  }
  return subWeeks(parseDate, weeks);
}

export function _addWeeks(date: Date | string, weeks: number) {
  let parseDate = date;
  if (typeof date === 'string') {
    parseDate = new Date(date);
  }
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
