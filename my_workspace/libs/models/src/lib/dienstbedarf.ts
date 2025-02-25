import { arbeitszeittyps, arbeitszeitverteilungs, dienstbedarves, zeitraumkategories } from '@prisma/client';
import { PlanerDate } from './planerdate/planerdate';
import { checkDate } from './planerdate/zeitraumkategorie';
import {
  ArbeitszeitverteilungSchichtDays,
  createSchichtenDaysFromArbeitszeitverteilung
} from './arbeitszeitverteilung';
import { getDateStr, newDate } from '@my-workspace/utils';

type SchichtObjType = {
  anfang: Date;
  ende: Date;
  is_frei: boolean;
};

export async function checkDateOnDienstbedarf(
  date: Date | PlanerDate,
  bedarf: dienstbedarves & { zeitraumkategories: zeitraumkategories | null }
) {
  if (!(date instanceof PlanerDate)) {
    const originalDate = date;
    date = new PlanerDate(date);
    await date.initializeFeiertage(originalDate);
  }
  if (!bedarf.zeitraumkategories || (bedarf.end_date && bedarf.end_date <= date.full_date)) {
    return false;
  }
  return await checkDate(date, bedarf.zeitraumkategories);
}

export function calculateDienstfreiFromDienstbedarf(
  date: Date,
  arbeitszeittypen: Record<number, arbeitszeittyps>,
  tageInfo: ArbeitszeitverteilungSchichtDays,
  dienstbedarf: dienstbedarves & { arbeitszeitverteilungs: arbeitszeitverteilungs | null },
  block: (date: Date, dateStr: string, schicht: SchichtObjType) => void
) {
  const azv = dienstbedarf.arbeitszeitverteilungs;
  const dienstfreis: Record<string, { typ: SchichtObjType; dienstbedarf_id: number }[]> = {};
  if (!azv) return;

  tageInfo ||= createSchichtenDaysFromArbeitszeitverteilung(azv, arbeitszeittypen);
  const tageInfoLength = Object.values(tageInfo.schichtTage).length - 1;
  const ausgleich = tageInfo.ausgleichstage;
  Object.entries(tageInfo.schichtTage).forEach(([pos, info], tIndex) => {
    const posNr = parseInt(pos, 10);
    const tag = newDate(date);
    // Aktuell letzten Dienst-Tag berechnen
    if (info.containsDienstzeit) tag.setDate(tag.getDate() + posNr);
    const tagWithAusgleich = newDate(tag);
    tagWithAusgleich.setDate(tagWithAusgleich.getDate() + ausgleich);
    const schichtenLength = info.schichten.length - 1;
    info.schichten.forEach((schicht, index) => {
      const anfang = newDate(tag);
      anfang.setDate(anfang.getDate() + schicht.tagAnfang);
      anfang.setHours(parseInt(schicht.anfangSplit[0], 10), parseInt(schicht.anfangSplit[1], 10));
      const ende = newDate(tag);
      ende.setDate(ende.getDate() + schicht.tagEnde);
      ende.setHours(parseInt(schicht.endeSplit[0], 10), parseInt(schicht.endeSplit[1], 10));
      const schichtObj: SchichtObjType = {
        anfang,
        ende,
        is_frei: !schicht.dienstzeit && !schicht.arbeitszeit
      };
      // Nur Frei-Schichten betrachten
      if (!schichtObj.is_frei) return;
      for (let d = newDate(anfang); d <= ende; d.setDate(d.getDate() + 1)) {
        // Frei Schichten >= 1 Tag gelten als Dienstfrei
        // Auch der letzte Tag gilt als Dienstfrei, wenn es sich um eine Frei-Schicht handelt
        // und der Tag zu dem berechneten Ausgleich gehört
        const isDienstFrei =
          (index === schichtenLength && tIndex === tageInfoLength && getDateStr(d) === getDateStr(tagWithAusgleich)) ||
          (anfang <= d && ende > d);
        if (!isDienstFrei) continue;
        const key = getDateStr(d);
        dienstfreis[key] ||= [];
        dienstfreis[key].push({ typ: schichtObj, dienstbedarf_id: dienstbedarf.id });
        block(d, key, schichtObj);
      }
    });
  });
  return dienstfreis;
}
