import { newDate, processData } from '@my-workspace/utils';
import {
  nicht_einteilen_absprachens,
  nicht_einteilen_standort_themen,
  standorts,
  themas,
  zeitraumkategories
} from '@prisma/client';
import { formatDate, startOfYear } from 'date-fns';

type TNichtEinteilenAbsprache = nicht_einteilen_absprachens & {
  zeitraumkategories: zeitraumkategories;
  nicht_einteilen_standort_themen: (nicht_einteilen_standort_themen & {
    standorts: standorts;
    themas: themas;
  })[];
};

function anfang(record: TNichtEinteilenAbsprache) {
  const today = newDate();
  let result = startOfYear(today);
  if (record?.von) {
    result = record.von;
  } else if (record?.zeitraumkategories?.anfang) {
    result = record.zeitraumkategories.anfang;
  }
  return formatDate(result, 'yyyy-MM-dd');
}

function ende(record: TNichtEinteilenAbsprache) {
  const today = newDate();
  let result = startOfYear(today);
  if (record?.bis) {
    result = record.bis;
  } else if (record?.zeitraumkategories?.ende) {
    result = record.zeitraumkategories.ende;
  }
  return formatDate(result, 'yyyy-MM-dd');
}

export function transformNichtEinteilenAbsprache(records: TNichtEinteilenAbsprache[]) {
  return records.map((record) => ({
    ...record,
    anfang: anfang(record),
    ende: ende(record)
  }));
}
