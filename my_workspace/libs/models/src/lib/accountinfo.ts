import { addMonths, endOfMonth, formatDate, isValid } from 'date-fns';
import { account_infos } from '@prisma/client';
import { newDate } from '@my-workspace/utils';

export function rentenEintritt(accountInfo: account_infos): string {
  const geburtsdatum = accountInfo.geburtsdatum;
  if (!geburtsdatum) return '';
  const renten_eintritt_monate = 804; // 67 * 12
  const start: Date = isValid(geburtsdatum) ? newDate(geburtsdatum ?? newDate()) : newDate();
  const eintrittDate = endOfMonth(addMonths(start, renten_eintritt_monate));
  return formatDate(eintrittDate, 'yyyy-MM-dd');
}
