import { getAsDate } from '@my-workspace/utils';
import { startOfToday, startOfMonth, endOfMonth, addDays, isWithinInterval, formatDate } from 'date-fns';
import { vertrags, vertrags_phases, vertragsgruppes, vertragsstuves, vertrags_arbeitszeits } from '@prisma/client';

type TVertragsMod = vertrags & {
  vertrags_phases: (vertrags_phases & {
    vertragsstuves: vertragsstuves & {
      vertragsgruppes: vertragsgruppes & {};
    };
  })[];
  vertrags_arbeitszeits: vertrags_arbeitszeits[];
};

export function vertragGueltigAm(tag: Date, vertrag: vertrags) {
  const anfang = vertrag.anfang;
  const ende = vertrag.ende;
  return anfang && ende && tag >= anfang && tag <= ende;
}

export function vertragsPhaseGueltigAm(tag: Date, vertrag: vertrags, vertragPhase: vertrags_phases) {
  const von = vertragPhase.von;
  const bis = vertragPhase.bis;
  return vertragGueltigAm(tag, vertrag) && von && bis && tag >= von && tag <= bis;
}

export function vertragsArbeitsZeitGueltigAm(tag: Date, vertrag: vertrags, vertragsArbeitszeit: vertrags_arbeitszeits) {
  const von = vertragsArbeitszeit.von;
  const bis = vertragsArbeitszeit.bis;
  const tageWoche = vertragsArbeitszeit.tage_woche ?? 5;
  const vk = vertragsArbeitszeit.vk ?? 0;

  return (
    vertragGueltigAm(tag, vertrag) &&
    von &&
    bis &&
    tag >= von &&
    tag <= bis &&
    (vk as number) > 0 &&
    (vk as number) <= 1 &&
    tageWoche > 0 &&
    tageWoche < 8
  );
}

export function vertragsPhaseAm(date = startOfToday(), vertrags: TVertragsMod[]) {
  const tag = getAsDate(date);
  const vertrag = vertrags.find((v) => vertragGueltigAm(tag, v));
  const vertragsPhases = vertrag?.vertrags_phases;
  let vertragsPhase = null;
  if (vertragsPhases && vertragsPhases.length > 0) {
    vertragsPhase = vertragsPhases.find((vp) => vertragsPhaseGueltigAm(tag, vertrag, vp));
  }
  return vertragsPhase;
}

export function vertragsArbeitszeitAm(date = startOfToday(), vertrags: TVertragsMod[]) {
  const tag = getAsDate(date);
  const vertrag = vertrags.find((v) => vertragGueltigAm(tag, v));
  const vertragsArbeitszeits = vertrag?.vertrags_arbeitszeits;
  let vertragsArbeitszeit = null;
  if (vertragsArbeitszeits && vertragsArbeitszeits.length > 0) {
    vertragsArbeitszeit = vertragsArbeitszeits.find((va) => vertragsArbeitsZeitGueltigAm(tag, vertrag, va));
  }
  return vertragsArbeitszeit;
}

export function vkAndVgruppeAm(date = startOfToday(), vertrags: TVertragsMod[]) {
  const tag = getAsDate(date);
  const monthStart = startOfMonth(tag);
  const monthMid = addDays(monthStart, 14);
  const monthEnd = endOfMonth(tag);

  const res = {
    vk: '',
    vgruppe: '',
    tag: formatDate(tag, 'yyyy-MM-dd'),
    vk_month: '',
    von: '',
    month_mid: formatDate(monthMid, 'yyyy-MM-dd'),
    month_end: formatDate(monthEnd, 'yyyy-MM-dd'),
    month_start: formatDate(monthStart, 'yyyy-MM-dd')
  };

  const ph = vertragsPhaseAm(tag, vertrags);
  const va = vertragsArbeitszeitAm(tag, vertrags);

  if (ph) {
    res.vgruppe = ph?.vertragsstuves?.vertragsgruppes?.name ?? '';
  }

  if (va && va.vk && va.von) {
    res.vk = va?.vk?.toFixed(1);
    res.von = formatDate(va.von, 'yyyy-MM-dd');
    res.vk_month = va.vk.toFixed(1);

    const isVonAfterMid = va.von && isWithinInterval(va.von, { start: res.month_mid, end: res.month_end });
    const isBisBeforeMid = va.bis && isWithinInterval(va.bis, { start: res.month_start, end: res.month_mid });

    if (isVonAfterMid || isBisBeforeMid) {
      res.vk_month = ((va.vk as unknown as number) / 2).toFixed(1);
    }
  }

  return res;
}
