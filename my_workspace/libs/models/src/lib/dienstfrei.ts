import { _diensteinteilung } from '@my-workspace/prisma_cruds';
import { getDateNr, getDateStr, newDate, newDateYearMonthDay } from '@my-workspace/utils';
import { arbeitszeittyps, bedarfs_eintrags, schichts } from '@prisma/client';

export type TDFInfo = {
  id: number;
  tag: Date;
  dienst: string;
  mitarbeiter: string;
  team: string;
  teamId: number;
};

export type TDFEingeteilt = Record<
  string,
  {
    einteilungen: Record<number, Record<string, _diensteinteilung.TDienstfrei>>;
    bloecke: Record<number, Record<number, number>>;
  }
>;

function checkBedarf(df: _diensteinteilung.TDienstfrei, bedarf: bedarfs_eintrags) {
  if (!df.tag || !bedarf.tag) return false;
  return (
    (df.dienstplans?.dienstplanbedarf_id === null ||
      df.dienstplans?.dienstplanbedarf_id === bedarf.dienstplanbedarf_id) &&
    (df.bereich_id === null || df.bereich_id === bedarf.bereich_id) &&
    getDateStr(df.tag) === getDateStr(bedarf.tag) &&
    df.po_dienst_id === bedarf.po_dienst_id
  );
}

function checkSchichten(
  schichten: (schichts & {
    arbeitszeittyps: arbeitszeittyps | null;
  })[],
  date: Date,
  ausgleichTage: number
) {
  const ausgleichDate = newDate(date);
  ausgleichDate.setDate(ausgleichDate.getDate() + ausgleichTage);
  const dateNr = getDateNr(date);
  return !!schichten.find((s) => {
    if (s.arbeitszeittyps?.arbeitszeit || s.arbeitszeittyps?.dienstzeit || !s.anfang || !s.ende) return false;
    const dateAnfangWithAusgleich = newDate(s.anfang);
    dateAnfangWithAusgleich.setDate(dateAnfangWithAusgleich.getDate() + ausgleichTage);
    return getDateNr(dateAnfangWithAusgleich) > dateNr || getDateNr(s.ende) > dateNr;
  });
}

async function shouldAddDienstfrei(
  df: _diensteinteilung.TDienstfrei,
  date: Date,
  eingeteiltId = '',
  eingeteilt: TDFEingeteilt = {},
  onlyCounts = false
) {
  let shouldAdd = false;
  const mitarbeiterId = df.mitarbeiter_id || 0;
  eingeteiltId ||= `${df.mitarbeiters?.planname}_${df.po_diensts?.planname}_${df.tag}`;
  const dateStr = getDateStr(date);
  const tagKey = df.tag ? getDateStr(df.tag) : '';
  const dateNr = getDateNr(dateStr);
  const bedarfsEintraege = df.po_diensts?.bedarfs_eintrags;
  if (!df.po_dienst_id || !bedarfsEintraege) return shouldAdd;
  if (!tagKey || getDateNr(tagKey) >= dateNr) return shouldAdd;
  eingeteilt[tagKey] ||= {
    einteilungen: {},
    bloecke: {}
  };
  eingeteilt[tagKey].einteilungen[df.po_dienst_id] ||= {};
  if (eingeteilt[tagKey].einteilungen[df.po_dienst_id][eingeteiltId]) return shouldAdd;
  eingeteilt[tagKey].einteilungen[df.po_dienst_id][eingeteiltId] = df;
  const currBedarf = bedarfsEintraege.find((be) => checkBedarf(df, be));
  if (!currBedarf?.tag) return shouldAdd;
  const bedarfTagStr = getDateStr(currBedarf.tag);
  if (getDateNr(bedarfTagStr) >= dateNr) {
    console.log(`Not add Dienstfrei, kein Bedarf: ${currBedarf} - ${tagKey}`);
    return shouldAdd;
  }
  if (currBedarf.is_block) {
    const firstEntry = currBedarf.first_entry || 0;
    eingeteilt[tagKey].bloecke[firstEntry] ||= {};
    if (eingeteilt[tagKey].bloecke[firstEntry]?.[mitarbeiterId]) return shouldAdd;
    eingeteilt[tagKey].bloecke[firstEntry][mitarbeiterId] ||= 1;
    const currFirstBedarf = currBedarf.first_bedarf;
    const block = currFirstBedarf?.block_bedarfe;
    if (!currFirstBedarf || !block) return shouldAdd;
    const be = block[block.length - 1];
    if (!be?.tag) return shouldAdd;
    const dates = block.map((b) => b.tag || newDate());
    const einteilungenBlockSize = (
      await _diensteinteilung.getEinteilungBlockTage(mitarbeiterId, dates, currFirstBedarf.id, onlyCounts)
    ).length;
    const isFullBlock = einteilungenBlockSize === block.length;
    const isBeforeDate = getDateNr(be.tag) < dateNr;
    if (!(isFullBlock && isBeforeDate)) return shouldAdd;
    const ausgleichDate = newDate(be.tag);
    ausgleichDate.setDate(ausgleichDate.getDate() + (be.ausgleich_tage || 0));
    shouldAdd = getDateNr(ausgleichDate) >= dateNr;
    if (!shouldAdd) {
      shouldAdd = checkSchichten(be.schichts, date, be.ausgleich_tage || 0);
    }
  } else {
    const ausgleichtage = newDate(currBedarf.tag);
    ausgleichtage.setDate(ausgleichtage.getDate() + (currBedarf.ausgleich_tage || 0));
    shouldAdd = getDateNr(ausgleichtage) >= dateNr;
    if (!shouldAdd) {
      shouldAdd = checkSchichten(currBedarf.schichts, date, currBedarf.ausgleich_tage || 0);
    }
  }
  return shouldAdd;
}

export async function calculateDienstfrei(dates: Date[], mitarbeiterIds: number[]) {
  const dienstfreiEingeteilt: Record<string, Record<number, Record<number, TDFInfo>>> = {};
  const dienstfrei = await _diensteinteilung.getPossibleDienstfrei(dates, mitarbeiterIds, true);
  const dienstfreiLength = dienstfrei.length;
  const datesLength = dates.length;
  for (let i = 0; i < dienstfreiLength; i++) {
    const df = dienstfrei[i];
    if (df.mitarbeiters?.platzhalter || !df.tag) continue;
    const mitarbeiterId = df.mitarbeiter_id || 0;
    const dienstId = df.po_dienst_id || 0;
    for (let j = 0; j < datesLength; j++) {
      const date = dates[j];
      const dateKey = getDateStr(date);
      const check = await shouldAddDienstfrei(df, date);
      if (!check) continue;
      dienstfreiEingeteilt[dateKey] ||= {};
      dienstfreiEingeteilt[dateKey][mitarbeiterId] ||= {};
      dienstfreiEingeteilt[dateKey][mitarbeiterId][dienstId] ||= {
        id: df.id,
        tag: df.tag || newDate(),
        dienst: df.po_diensts?.planname || '',
        mitarbeiter: df.mitarbeiters?.planname || '',
        team: df.po_diensts?.teams?.name || '',
        teamId: df.po_diensts?.team_id || 0
      };
    }
  }
  return dienstfreiEingeteilt;
}

export async function getDienstfreis(mitarbeiterIds: number[] = []) {
  const eingeteilt: TDFEingeteilt = {};
  const today = newDate();
  const monthStart = newDateYearMonthDay(today.getFullYear(), today.getMonth(), 1);
  const monthEnd = newDateYearMonthDay(today.getFullYear(), today.getMonth() + 1, 0);
  const dates: Date[] = [];
  for (let i = monthStart; i <= monthEnd; i.setDate(i.getDate() + 1)) {
    dates.push(newDate(i));
  }
  const dienstfrei = await _diensteinteilung.getPossibleDienstfrei(dates, mitarbeiterIds);
  const result: {
    tag: string;
    description: string;
    label: string;
    id: string;
    color: string;
  }[] = [];
  const dienstfreiLength = dienstfrei.length;
  const datesLength = dates.length;
  for (let i = 0; i < dienstfreiLength; i++) {
    const df = dienstfrei[i];
    if (df.mitarbeiters?.platzhalter || !df.tag) continue;
    for (let j = 0; j < datesLength; j++) {
      const date = dates[j];
      if (getDateNr(date) - getDateNr(df.tag) > 14) break;
      const check = await shouldAddDienstfrei(df, date, '', eingeteilt);
      if (!check) continue;
      result.push({
        tag: getDateStr(date),
        description: `Status: ${df.einteilungsstatuses?.name}\nDienstfrei aus ${df.po_diensts?.name} am ${getDateStr(
          df.tag
        )}.`,
        label: 'Dienstfrei',
        id: `${df.id}_${getDateStr(date)}`,
        color: '#d3d3d3'
      });
    }
  }
}
