import { getVertragsForTeamVK } from '@my-workspace/prisma_cruds';
import { getDateStr, newDate, newDateYearMonthDay } from '@my-workspace/utils';
import { vertrags, vertrags_phases, vertragsgruppes, vertragsstuves, vertrags_arbeitszeits } from '@prisma/client';
import { mitarbeiterTeamAmByMitarbeiter } from './mitarbeiter';

type TVertragsMod = vertrags & {
  vertrags_phases: (vertrags_phases & {
    vertragsstuves:
      | (vertragsstuves & {
          vertragsgruppes: vertragsgruppes | null;
        })
      | null;
  })[];
  vertrags_arbeitszeits: vertrags_arbeitszeits[];
};

export function vertragGueltigAm(date: Date, vertrag: vertrags) {
  const anfang = vertrag.anfang;
  const ende = vertrag.ende;
  const tag = newDate(date);
  tag.setHours(12, 0, 0, 0);
  anfang.setHours(12, 0, 0, 0);
  ende.setHours(12, 0, 0, 0);
  return anfang && ende && tag >= anfang && tag <= ende;
}

export function vertragsPhaseGueltigAm(date: Date, vertrag: vertrags, vertragPhase: vertrags_phases) {
  const von = vertragPhase.von;
  const bis = vertragPhase.bis;
  const tag = newDate(date);
  tag.setHours(12, 0, 0, 0);
  von.setHours(12, 0, 0, 0);
  bis.setHours(12, 0, 0, 0);
  return vertragGueltigAm(tag, vertrag) && von && bis && tag >= von && tag <= bis;
}

export function vertragsArbeitsZeitGueltigAm(
  date: Date,
  vertrag: vertrags,
  vertragsArbeitszeit: vertrags_arbeitszeits
) {
  const von = vertragsArbeitszeit.von;
  const bis = vertragsArbeitszeit.bis;
  const tageWoche = vertragsArbeitszeit.tage_woche ?? 5;
  const vk = Number(vertragsArbeitszeit.vk ?? 0);
  const tag = newDate(date);
  tag.setHours(12, 0, 0, 0);
  von.setHours(12, 0, 0, 0);
  bis.setHours(12, 0, 0, 0);

  return (
    vertragGueltigAm(tag, vertrag) &&
    von &&
    bis &&
    tag >= von &&
    tag <= bis &&
    vk > 0 &&
    vk <= 1 &&
    tageWoche > 0 &&
    tageWoche < 8
  );
}

export function vertragsPhaseAm(date = newDate(), vertrags: TVertragsMod[]) {
  const vertrag = vertrags.find((v) => vertragGueltigAm(date, v));
  const vertragsPhases = vertrag?.vertrags_phases;
  let vertragsPhase = null;
  if (vertragsPhases && vertragsPhases.length > 0) {
    vertragsPhase = vertragsPhases.find((vp) => vertragsPhaseGueltigAm(date, vertrag, vp));
  }
  return vertragsPhase;
}

export function vertragsArbeitszeitAm(date = newDate(), vertrags: TVertragsMod[]) {
  const vertrag = vertrags.find((v) => vertragGueltigAm(date, v));
  const vertragsArbeitszeits = vertrag?.vertrags_arbeitszeits;
  let vertragsArbeitszeit = null;
  if (vertragsArbeitszeits && vertragsArbeitszeits.length > 0) {
    vertragsArbeitszeit = vertragsArbeitszeits.find((va) => vertragsArbeitsZeitGueltigAm(date, vertrag, va));
  }
  return vertragsArbeitszeit;
}

export function vkAndVgruppeAm(date = newDate(), vertrags: TVertragsMod[]) {
  const tag = newDate(date);
  tag.setHours(12, 0, 0, 0);
  const monthStart = newDateYearMonthDay(tag.getFullYear(), tag.getMonth(), 1);
  const monthMid = newDateYearMonthDay(tag.getFullYear(), tag.getMonth(), 15);
  const monthEnd = newDateYearMonthDay(tag.getFullYear(), tag.getMonth() + 1, 0);
  monthStart.setHours(12, 0, 0, 0);
  monthMid.setHours(12, 0, 0, 0);
  monthEnd.setHours(12, 0, 0, 0);

  const res = {
    vk: '',
    vgruppe: '',
    tag: getDateStr(tag),
    vk_month: '',
    von: '',
    month_mid: getDateStr(monthMid),
    month_end: getDateStr(monthEnd),
    month_start: getDateStr(monthStart)
  };

  const ph = vertragsPhaseAm(tag, vertrags);
  const va = vertragsArbeitszeitAm(tag, vertrags);

  if (ph) {
    res.vgruppe = ph?.vertragsstuves?.vertragsgruppes?.name ?? '';
  }

  if (va && va.vk && va.von) {
    va.von.setHours(12, 0, 0, 0);
    va.bis.setHours(12, 0, 0, 0);
    res.vk = Number(va.vk).toPrecision(2);
    res.von = getDateStr(va.von);
    res.vk_month = res.vk;
    const isVonAfterMid = va.von >= monthMid && va.von <= monthStart;
    const isBisBeforeMid = va.bis <= monthMid && va.bis >= monthEnd;

    if (isVonAfterMid || isBisBeforeMid) {
      res.vk_month = (Number(va.vk) / 2).toPrecision(2);
    }
  }

  return res;
}

export function vkAndVgruppeInMonth(date = newDate(), vertrags: TVertragsMod[]) {
  const von = newDateYearMonthDay(date.getFullYear(), date.getMonth(), 1);
  let bis = newDateYearMonthDay(date.getFullYear(), date.getMonth() + 1, 0);
  let result = vkAndVgruppeAm(date, vertrags);
  if (!vertrags.length || result.vk_month) return result;
  // Falls Verträge existieren und Vk-Month leer ist, dann iteriere rückwärts durch die Tage und nehme den ersten gültigen Wert
  bis = newDateYearMonthDay(bis.getFullYear(), bis.getMonth(), bis.getDate() - 1);
  while (bis >= von) {
    result = vkAndVgruppeAm(bis, vertrags);
    if (result.vk_month) return result;
    bis = newDateYearMonthDay(bis.getFullYear(), bis.getMonth(), bis.getDate() - 1);
  }
  return result;
}

export async function getTeamVks(date: Date) {
  const tag = newDate(date);
  tag.setHours(12, 0, 0, 0);
  const vertraege = await getVertragsForTeamVK(tag);
  const result: {
    vertraege: Record<number, { mitarbeiter_id: number; team_id: number; vk: number }>;
    teams: Record<number, { name: string; vk: number; vertreaege: number[]; mitarbeiter: string[] }>;
    mitarbeiter: number[];
  } = { vertraege: {}, teams: {}, mitarbeiter: [] };
  vertraege.forEach(async (v) => {
    if (!v.mitarbeiter_id || !v.mitarbeiters) return;
    if (result.mitarbeiter.includes(v.mitarbeiter_id)) return;
    result.mitarbeiter.push(v.mitarbeiter_id);
    const team = await mitarbeiterTeamAmByMitarbeiter(v.mitarbeiters, tag);
    const va = vertragsArbeitszeitAm(tag, [v]);
    const vk = va?.vk ? Number(va.vk) : 0;
    const teamId = team?.id || 0;
    result.vertraege[v.id] ||= {
      mitarbeiter_id: v.mitarbeiter_id,
      team_id: teamId,
      vk
    };
    result.teams[teamId] ||= {
      name: team ? team.name || '' : 'Kein Team',
      vk: 0,
      vertreaege: [],
      mitarbeiter: []
    };
    result.teams[teamId].vk += vk;
    result.teams[teamId].vertreaege.push(v.id);
    result.teams[teamId].mitarbeiter.push(`${v.mitarbeiters?.planname}: ${vk} (V-ID: ${v.id}, VA-ID: ${va?.id})`);
  });
  return result;
}
