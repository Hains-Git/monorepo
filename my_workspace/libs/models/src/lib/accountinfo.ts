import { addMonths, endOfMonth, formatDate, isValid } from 'date-fns';
import { account_infos } from '@prisma/client';

export function rentenEintritt(accountInfo: account_infos): string {
  const geburtsdatum = accountInfo.geburtsdatum;
  if (!geburtsdatum) return '';
  const renten_eintritt_monate = 804; // 67 * 12
  const start: Date = isValid(geburtsdatum) ? new Date(geburtsdatum ?? new Date()) : new Date();
  const eintrittDate = endOfMonth(addMonths(start, renten_eintritt_monate));
  return formatDate(eintrittDate, 'yyyy-MM-dd');
}
