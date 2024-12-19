import { TVertragsArbeitszeit, TVertragsPhase } from './api_data_types';

export const getNanDiff = (a: number, b: number) => {
  if (Number.isNaN(a) && !Number.isNaN(b)) return 1;
  if (Number.isNaN(b) && !Number.isNaN(a)) return -1;
  return a - b || 0;
};

export const sortVertragsPhasenOrArbeitszeitenByVonBisId = (
  a: TVertragsPhase | TVertragsArbeitszeit,
  b: TVertragsPhase | TVertragsArbeitszeit
) => {
  const vonA = new Date(a.von || '').getTime();
  const vonB = new Date(b.von || '').getTime();
  const diffVon = getNanDiff(vonA, vonB);
  if (diffVon !== 0) return diffVon;
  const bisA = new Date(a.bis || '').getTime();
  const bisB = new Date(b.bis || '').getTime();
  const diffBis = getNanDiff(bisA, bisB);
  if (diffBis !== 0) return diffBis;
  return a.id - b.id;
};

export const getNextVonBis = (
  start: number,
  sortedArr: (TVertragsArbeitszeit | TVertragsPhase)[],
  key: 'von' | 'bis'
) => {
  let value = '';
  const max = sortedArr.length;
  const step = key === 'von' ? 1 : -1;
  for (let i = start; i >= 0 && i < max; i += step) {
    const next = sortedArr?.[i];
    value = next?.[key] || '';
    if (value) {
      const date = new Date(value);
      date.setDate(date.getDate() - step);
      return date.toISOString().split('T')[0];
    }
  }
  return value;
};

export const getPrevVonAndNextBis = (
  sortedArr: (TVertragsArbeitszeit | TVertragsPhase)[],
  idToFind: number,
  vertragAnfang: string,
  vertragEnde: string
) => {
  const index = sortedArr.findIndex((v) => v.id === idToFind) || 0;
  let newAnfang = getNextVonBis(index - 1, sortedArr, 'bis');
  let newEnde = getNextVonBis(index + 1, sortedArr, 'von');
  if (newAnfang) {
    const addAnfang = vertragAnfang ? new Date(newAnfang) > new Date(vertragAnfang) : true;
    if (!addAnfang) newAnfang = vertragAnfang;
  }
  if (newEnde) {
    const addEnde = vertragEnde ? new Date(newEnde) < new Date(vertragEnde) : true;
    if (!addEnde) newEnde = vertragEnde;
  }
  return [newAnfang, newEnde];
};
