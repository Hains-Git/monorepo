import {
  _team,
  _arbeitszeittyp,
  _dienstbedarf,
  _po_dienst,
  _kontingent,
  _diensteinteilung,
  _mitarbeiter
} from '@my-workspace/prisma_cruds';
import { getDateNr, getDateStr, getKW, newDate } from '@my-workspace/utils';
import {
  arbeitszeittyps,
  dienstbedarves,
  einteilung_rotations,
  funktions,
  kontingents,
  po_diensts,
  team_kopf_soll,
  team_kw_krankpuffers,
  team_vk_soll,
  teams
} from '@prisma/client';
import {
  TArbeitszeitverteilungSchichtDays,
  createSchichtenDaysFromArbeitszeitverteilung
} from './arbeitszeitverteilung';
import { calculateDienstfreiFromDienstbedarf, checkDateOnDienstbedarf } from './dienstbedarf';
import { PlanerDate } from './planerdate/planerdate';
import { Dienstfrei, Mitarbeiter } from '..';

type TSaldiValues = {
  verfuegbar: number;
  einteilungen: number;
  urlaub: number;
  krank: number;
  sonstige: number;
  bedarfe_min: number;
  bedarfe_opt: number;
  bedarfe_eingeteilt_min: number;
  bedarfe_eingeteilt_opt: number;
  bedarfe_eingeteilt_opt_markiert: number;
  defaultTeam: number;
  saldo: number;
};

const saldiDefaultValues: TSaldiValues = {
  verfuegbar: 0,
  einteilungen: 0,
  urlaub: 0,
  krank: 0,
  sonstige: 0,
  bedarfe_min: 0,
  bedarfe_opt: 0,
  bedarfe_eingeteilt_min: 0,
  bedarfe_eingeteilt_opt: 0,
  bedarfe_eingeteilt_opt_markiert: 0,
  defaultTeam: 0,
  saldo: 0
};

type TRotationenHash = Record<
  number,
  (einteilung_rotations & {
    kontingents:
      | (kontingents & {
          teams: teams | null;
        })
      | null;
  })[]
>;

type TSaldiTeamDateFunctions = Record<
  number,
  {
    count: number;
    funktion: (funktions & { teams: teams | null }) | null;
    substitutionsFrom: Array<{ team: string; teamId: number; count: number }>;
    substitutionsTo: Array<{ team: string; teamId: number; count: number }>;
  }
>;

type TSaldiTeamDate = typeof saldiDefaultValues & {
  ID: number;
  funktionen: TSaldiTeamDateFunctions;
  mitarbeiter: string[];
  einteilungen_info: {
    bedarf: (string | number)[][];
    ohne_bedarf: (string | number)[][];
    dienstfrei: Dienstfrei.TDFInfo[];
    optional: (string | number | boolean)[][];
  };
  bedarfe_dienstfrei: {
    count: number;
    eingeteilt: number;
    total: number;
    einteilungen: Dienstfrei.TDFInfo[];
    [x: number]: {
      dienst: string;
      team: string;
      bereiche: Record<number, number>;
      bedarfe: Record<number, { min: number; date: Date }>;
    };
  };
  inTeam: string[];
  kopfSoll: number;
};

type TSaldiTeamBase = teams & {
  funktionen_ids: number[];
  team_kw_krankpuffers: team_kw_krankpuffers[];
  team_kopf_soll: team_kopf_soll[];
  team_vk_soll: team_vk_soll[];
};

type TSaldiRecordElement = {
  team: TSaldiTeamBase;
  dates: Record<string, TSaldiTeamDate>;
  remove?: boolean;
};

type TSaldi = Record<number, TSaldiRecordElement>;

type TMitarbeiterInfos = {
  team_ids: Record<number, Record<string, number[]>>;
  rotationen: TRotationenHash;
};

type TTeamIDs = TMitarbeiterInfos['team_ids'][number];

type TSaldiBase = {
  dates: Date[];
  saldi: TSaldi;
  mitarbeiter_infos: TMitarbeiterInfos;
  default_team: TSaldiTeamBase | null;
};

type TBedarfeProDienstTagBereich = Record<
  number,
  Record<
    string,
    Record<
      number,
      {
        bedarf: dienstbedarves;
        eingeteilt_min: number;
        eingeteilt_opt: number;
        eingeteilt_opt_markiert: number;
      }
    >
  >
>;

const noTeam: TSaldiTeamBase = {
  id: 0,
  name: 'Ohne Team',
  default: false,
  verteiler_default: false,
  color: '#fff',
  kostenstelle_id: null,
  krank_puffer: 0,
  team_kw_krankpuffers: [],
  funktionen_ids: [],
  team_kopf_soll: [],
  team_vk_soll: [],
  created_at: newDate(),
  updated_at: newDate()
};

async function getSaldiBase(start: Date, ende: Date) {
  const dates: Date[] = [];
  for (const d = newDate(start); d <= newDate(ende); d.setDate(d.getDate() + 1)) {
    dates.push(newDate(d));
  }
  const result: TSaldiBase = {
    dates,
    saldi: {
      [noTeam.id]: {
        team: noTeam,
        dates: {},
        remove: true
      }
    },
    mitarbeiter_infos: {
      team_ids: {},
      rotationen: {}
    },
    default_team: null
  };

  const teams = await _team.getAllTeamsWithMainIncludes(start, ende);
  teams.forEach((t) => {
    result.saldi[t.id] = {
      team: {
        ...t,
        funktionen_ids: t.team_funktions.map((f) => f.funktion_id)
      },
      dates: {}
    };
    if (t.default) {
      result.default_team = {
        ...t,
        funktionen_ids: t.team_funktions.map((f) => f.funktion_id)
      };
    }
  });

  return result;
}

function createDefaultsForTeamSaldo(date: string, teamId: number, saldi: TSaldi) {
  const dateNr = getDateNr(date);
  saldi[teamId].dates[date] ||= {
    ...saldiDefaultValues,
    ID: teamId,
    funktionen: {},
    mitarbeiter: [],
    einteilungen_info: {
      bedarf: [],
      ohne_bedarf: [],
      dienstfrei: [],
      optional: []
    },
    bedarfe_dienstfrei: {
      count: 0,
      eingeteilt: 0,
      total: 0,
      einteilungen: []
    },
    inTeam: [],
    kopfSoll:
      saldi[teamId].team.team_kopf_soll.find((s) => getDateNr(s.von) <= dateNr && getDateNr(s.bis) >= dateNr)?.soll || 0
  };
  return saldi[teamId].dates[date];
}

async function checkTeamBedarfe(dates: Date[], saldi: TSaldi) {
  const bedarfeProDienstTagBereich: TBedarfeProDienstTagBereich = {};
  const days: Date[] = [];
  const daysHash: Record<string, Date> = {};
  const d = newDate(dates[0]);
  d.setDate(d.getDate() - 14);
  const lastDate = dates[dates.length - 1];
  for (; d <= lastDate; d.setDate(d.getDate() + 1)) {
    const date = newDate(d);
    const dateStr = getDateStr(date);
    daysHash[dateStr] = date;
    days.push(date);
  }
  const freiTypen: number[] = [];
  const arbeitszeittypen = (await _arbeitszeittyp.getAllArbeitszeittypen()).reduce(
    (acc: Record<number, arbeitszeittyps>, az) => {
      acc[az.id] = az;
      if (!az.arbeitszeit && !az.dienstzeit) {
        freiTypen.push(az.id);
      }
      return acc;
    },
    {}
  );
  const dienstbedarfe = await _dienstbedarf.getDienstbedarfForSaldi(days[0], days[days.length - 1]);
  const dienstfreis: Record<number, Record<string, boolean>> = {};
  const computedSchichten: Record<number, TArbeitszeitverteilungSchichtDays> = {};
  const bedarfeLength = dienstbedarfe.length;
  const daysLength = days.length;
  const planerDates: PlanerDate[] = [];
  let weekCounter = 0;
  for (let i = 0; i < daysLength; i++) {
    const date = days[i];
    const plDate = new PlanerDate(date, weekCounter);
    await plDate.initializeFeiertage(date);
    planerDates.push(plDate);
    if (date.getDay() === 5) {
      weekCounter++;
    }
  }
  for (let i = 0; i < bedarfeLength; i++) {
    const bedarf = dienstbedarfe[i];
    const dienst = bedarf.po_diensts;
    const team = dienst?.teams;
    const azv = bedarf.arbeitszeitverteilungs;
    if (!azv || !dienst || !team) continue;
    const min = bedarf.min || 0;
    const opt = bedarf.opt || 0;
    const teamId = dienst?.team_id || 0;
    const dienstId = bedarf.po_dienst_id || 0;
    const bereichId = bedarf.bereich_id || 0;
    const azvId = bedarf.arbeitszeitverteilung_id || 0;
    bedarfeProDienstTagBereich[dienstId] ||= {};
    const dienstBedarfe = bedarfeProDienstTagBereich[dienstId];
    const checkDienstfrei = min > 0 && (azv?.zeittypen || []).some((z) => freiTypen.includes(z));
    // Bedarfseintrags Schichten berechnen, wenn noch nicht vorhanden
    if (checkDienstfrei) {
      computedSchichten[azvId] ||= createSchichtenDaysFromArbeitszeitverteilung(azv, arbeitszeittypen);
    }
    // Alle Tage testen, ob Bedarf auf diese fällt
    for (let j = 0; j < daysLength; j++) {
      const date = days[j];
      const plDate = planerDates[j];
      const day = getDateStr(date);
      // Nur Bedarfe hinzufügen, die noch nicht im Hash sind
      if (dienstBedarfe[day]?.[bereichId]) continue;
      // Nur Bedarfe mit gültiger Zeitraumkategorie berücksichtigen
      const dateCheck = await checkDateOnDienstbedarf(plDate, bedarf);
      if (!dateCheck) continue;
      const currSaldi = createDefaultsForTeamSaldo(day, teamId, saldi);
      dienstBedarfe[day] ||= {};
      dienstBedarfe[day][bereichId] = {
        bedarf,
        eingeteilt_min: 0,
        eingeteilt_opt: 0,
        eingeteilt_opt_markiert: 0
      };
      dienstfreis[bedarf.id] ||= {};
      // Nur gewisse Bedarfe nicht im Urlaubssaldo berücksichtigen
      if (!bedarf.ignore_in_urlaubssaldo) {
        currSaldi.bedarfe_min += min;
        currSaldi.bedarfe_opt += opt;
      }
      if (!checkDienstfrei) continue;
      // Dienstfrei initialisieren
      calculateDienstfreiFromDienstbedarf(date, arbeitszeittypen, computedSchichten[azvId], bedarf, (day, dayStr) => {
        if (dienstfreis[bedarf.id][dayStr] || !daysHash[dayStr]) return;

        dienstfreis[bedarf.id][dayStr] = true;
        const currSaldi = createDefaultsForTeamSaldo(dayStr, teamId, saldi);
        const df = currSaldi.bedarfe_dienstfrei;
        df[dienstId] ||= {
          dienst: dienst.planname || '',
          team: team.name || '',
          bereiche: {},
          bedarfe: {}
        };
        if (df[dienstId].bereiche[bereichId]) return;
        df[dienstId].bedarfe[bedarf.id] ||= { min, date };
        df[dienstId].bereiche[bereichId] ||= 0;
        df[dienstId].bereiche[bereichId] += min;
        df.count += min;
        df.total += min;
      });
    }
  }
  return bedarfeProDienstTagBereich;
}

const addTeamId = (team: { id: number } | null, teamIds: TTeamIDs, date: string) => {
  let teamId = noTeam.id;
  if (team) {
    teamId = team.id || noTeam.id;
  }
  if (!teamIds[date].includes(teamId)) {
    teamIds[date].push(teamId);
  }
  return teamId;
};

async function mitarbeiterEinteilen(
  e: string[],
  team: teams | null,
  dateKey: string,
  mitarbeiterName: string,
  saldi: TSaldi,
  dienstName: string,
  bedarfe: TBedarfeProDienstTagBereich[number][string],
  teamIds: TTeamIDs
) {
  let notVerfuegbar = false;
  // Einteilung: [t.id, p.id, p.stundennachweis_krank, p.stundennachweis_urlaub, p.stundennachweis_sonstig, ignore_in_urlaubssaldo, bereich_id, is_optional, as_abwesenheit]
  const bereichId = parseInt(e[6], 10);
  const isOptional = e[7] === '1';
  const asAbwesenheit = e[8] === '1';
  const isBedarfEinteilung = e[5] !== 'false';
  const einteilungTeam = isBedarfEinteilung ? { id: parseInt(e[0], 10) || 0 } : team;
  let bedarf: dienstbedarves | null = null;
  let bedarfeBlock: {
    bedarf: dienstbedarves;
    eingeteilt_min: number;
    eingeteilt_opt: number;
    eingeteilt_opt_markiert: number;
  } | null = null;
  if (isBedarfEinteilung && bedarfe) {
    bedarfeBlock = bereichId === 0 ? Object.values(bedarfe)[0] : bedarfe[bereichId];
    if (bedarfeBlock) {
      bedarf = bedarfeBlock.bedarf;
      if (bedarf?.ignore_in_urlaubssaldo) return notVerfuegbar;
    }
  }
  const teamId = addTeamId(einteilungTeam, teamIds, dateKey);
  const currSaldi = createDefaultsForTeamSaldo(dateKey, teamId, saldi);
  let key: keyof typeof currSaldi = 'einteilungen';
  if (e[2] === 'true') {
    key = 'krank';
  } else if (e[3] === 'true') {
    key = 'urlaub';
  } else if (e[4] === 'true') {
    key = 'sonstige';
  }
  currSaldi[key] += 1;
  if (!notVerfuegbar) {
    notVerfuegbar = asAbwesenheit;
  }
  if (isBedarfEinteilung && !bedarf?.ignore_in_urlaubssaldo && bedarf && bedarfeBlock) {
    currSaldi.einteilungen_info.bedarf.push([mitarbeiterName, dienstName, bereichId]);
    const min = bedarf.min || 0;
    if (!isOptional && min > 0 && bedarfeBlock?.eingeteilt_min < min) {
      notVerfuegbar = true;
      bedarfeBlock.eingeteilt_min += 1;
      currSaldi.bedarfe_eingeteilt_min += 1;
    } else if (isOptional) {
      notVerfuegbar = true;
      bedarfeBlock.eingeteilt_opt_markiert += 1;
      currSaldi.bedarfe_eingeteilt_opt_markiert += 1;
    } else {
      bedarfeBlock.eingeteilt_opt += 1;
      currSaldi.bedarfe_eingeteilt_opt += 1;
      currSaldi.einteilungen_info.optional.push([mitarbeiterName, dienstName, bereichId, notVerfuegbar]);
    }
  } else {
    notVerfuegbar = true;
    const key = bedarf ? 'bedarf' : 'ohne_bedarf';
    currSaldi.einteilungen_info[key].push([mitarbeiterName, dienstName, bereichId]);
  }
  return notVerfuegbar;
}

async function checkMitarbeiterVerfuegbarkeit(
  bedarfeProDienstTagBereich: TBedarfeProDienstTagBereich,
  result: TSaldiBase
) {
  const dates = result.dates;
  const saldi = result.saldi;
  const defaultTeam = result.default_team;
  const infos: TMitarbeiterInfos = {
    team_ids: {},
    rotationen: {}
  };
  const diensteHash = (await _po_dienst.getAllPoDiensts()).reduce((acc: Record<number, po_diensts>, d) => {
    acc[d.id] = d;
    return acc;
  }, {});
  const defaultKontingent = await _kontingent.getDefaults();
  const mitarbeiterEinteilungen = await _diensteinteilung.getMitarbeiterEinteilungenNachTagen(
    dates[0],
    dates[dates.length - 1]
  );
  const mitarbeiterIds = Object.keys(mitarbeiterEinteilungen);

  const mitarbeiter = await _mitarbeiter.getMitarbeiterForUrlaubssaldis(
    mitarbeiterIds.map((m) => Number(m)),
    dates[0],
    dates[dates.length - 1]
  );
  const dienstfreiEingeteilt = await Dienstfrei.calculateDienstfrei(
    dates,
    mitarbeiter.map((m) => m.id),
    true
  );
  const datesLength = dates.length;
  const mitarbeiterLength = mitarbeiter.length;
  const mitarbeiterTeamAm: Record<number, Record<string, teams>> = {};
  for (let i = 0; i < mitarbeiterLength; i++) {
    const m = mitarbeiter[i];
    const mId = m.id;
    if (m.platzhalter) continue;
    if (m.einteilung_rotations?.length) infos.rotationen[mId] = m.einteilung_rotations;
    mitarbeiterEinteilungen[mId] ||= {};
    infos.team_ids[mId] ||= {};
    const teamIds = infos.team_ids[mId];
    const einteilungen = mitarbeiterEinteilungen[mId];
    const accountInfo = m.platzhalter ? null : m.account_info;
    const funktion = m.funktion;
    const funktionId = m.funktion_id || 0;
    for (let i = 0; i < datesLength; i++) {
      const date = dates[i];
      const dateKey = getDateStr(date);
      teamIds[dateKey] ||= [];
      mitarbeiterTeamAm[mId] ||= {};
      mitarbeiterTeamAm[mId][dateKey] ||=
        (await Mitarbeiter.mitarbeiterTeamAmByMitarbeiter(m, date, defaultTeam, defaultKontingent)) || noTeam;
      const team = mitarbeiterTeamAm[mId][dateKey];
      einteilungen[dateKey] ||= [];
      let notVerfuegbar = false;
      const aktiv = !!(accountInfo && Mitarbeiter.mitarbeiterUrlaubssaldoAktivAm(m, date));
      const einteilungenLength = einteilungen[dateKey].length;

      for (let j = 0; j < einteilungenLength; j++) {
        // Einteilung: [t.id, p.id, p.stundennachweis_krank, p.stundennachweis_urlaub, p.stundennachweis_sonstig, ignore_in_urlaubssaldo, bereich_id, is_optional, as_abwesenheit]
        const e = einteilungen[dateKey][j];
        const dienstId = parseInt(e[1], 10);
        const eingeteilt = await mitarbeiterEinteilen(
          e,
          team,
          dateKey,
          m.planname || '',
          saldi,
          diensteHash[parseInt(e[1], 10)]?.planname || '',
          bedarfeProDienstTagBereich?.[dienstId]?.[dateKey],
          teamIds
        );
        notVerfuegbar ||= eingeteilt;
      }

      const teamId = addTeamId(team, teamIds, dateKey);
      const currSaldi = createDefaultsForTeamSaldo(dateKey, teamId, saldi);
      currSaldi.inTeam.push(m.planname || '');
      const dfDate = dienstfreiEingeteilt[dateKey];

      if (dfDate?.[mId]) {
        notVerfuegbar = true;
        const df = dfDate[mId];
        for (const poDienstId in df) {
          // Dienstfrei wird dem Team des Dienstes zugeordnet
          const dfInfo = df[poDienstId];
          const teamId = addTeamId({ id: dfInfo.teamId }, teamIds, dateKey);
          const currDfSaldi = createDefaultsForTeamSaldo(dateKey, teamId, saldi);
          currDfSaldi.einteilungen_info.dienstfrei.push(dfInfo);
          currDfSaldi.bedarfe_dienstfrei.eingeteilt += 1;
          currDfSaldi.bedarfe_dienstfrei.total -= 1;
          currDfSaldi.bedarfe_dienstfrei.einteilungen.push(dfInfo);
          if (currDfSaldi.bedarfe_dienstfrei.total < 0) {
            currDfSaldi.bedarfe_dienstfrei.total = 0;
          }
        }
      }

      if (aktiv && !notVerfuegbar) {
        currSaldi.verfuegbar += 1;
        currSaldi.funktionen[funktionId] ||= {
          count: 0,
          funktion,
          substitutionsFrom: [],
          substitutionsTo: []
        };
        currSaldi.mitarbeiter.push(m.planname || '');
        currSaldi.funktionen[funktionId].count += 1;
      }
    }
  }
  return infos;
}

function getUrlaubssaldo(teamSaldo: TSaldiRecordElement, date: string) {
  const kw = getKW(date);
  const teamDateSaldo = teamSaldo.dates[date];
  if (!teamDateSaldo) return 0;
  const kwKrankpuffer = teamSaldo.team.team_kw_krankpuffers.find((puffer) => puffer.kw === kw);
  const krankPuffer = kwKrankpuffer ? kwKrankpuffer.puffer : teamSaldo.team.krank_puffer;
  const puffer = krankPuffer - teamDateSaldo.krank;
  const bedarf = teamDateSaldo.bedarfe_min - teamDateSaldo.bedarfe_eingeteilt_min;
  return teamDateSaldo.verfuegbar - teamDateSaldo.bedarfe_dienstfrei.total - bedarf - puffer;
}

function moveFreeMitarbeiterToOtherTeam(
  diff: number,
  saldiFunktion: TSaldiTeamDateFunctions[number],
  dateStr: string,
  from: TSaldiRecordElement,
  to: TSaldiRecordElement
) {
  const fromTeamDateSaldo = from.dates?.[dateStr];
  const toTeamDateSaldo = to.dates?.[dateStr];
  if (diff <= 0 || !fromTeamDateSaldo || !toTeamDateSaldo) return;
  const funktionId = saldiFunktion.funktion?.id || 0;

  saldiFunktion.count -= diff;
  fromTeamDateSaldo.verfuegbar -= diff;
  fromTeamDateSaldo.saldo = getUrlaubssaldo(from, dateStr);
  saldiFunktion.substitutionsTo.push({
    team: to.team.name,
    teamId: to.team.id,
    count: -diff
  });

  toTeamDateSaldo.verfuegbar += diff;
  toTeamDateSaldo.funktionen[funktionId] ||= {
    count: 0,
    funktion: saldiFunktion.funktion,
    substitutionsFrom: [],
    substitutionsTo: []
  };
  toTeamDateSaldo.funktionen[funktionId].count += diff;
  toTeamDateSaldo.funktionen[funktionId].substitutionsFrom.push({
    team: from.team.name,
    teamId: from.team.id,
    count: diff
  });
  to.dates[dateStr].saldo = getUrlaubssaldo(to, dateStr);
}

function moveNoTeamToOtherTeams(saldiBase: TSaldiBase, dateStr: string) {
  const { saldi, default_team } = saldiBase;
  const noTeamSaldo = saldi[noTeam.id];
  const noTeamDateSaldo = noTeamSaldo.dates[dateStr];
  if (!noTeamDateSaldo) return;

  noTeamDateSaldo.saldo = getUrlaubssaldo(noTeamSaldo, dateStr);
  if (noTeamDateSaldo.saldo <= 0) return;

  const defaultTeamId = default_team?.id;

  const teams = Object.values(saldi)
    .filter((s) => {
      const dateTeamSaldo = s.dates[dateStr];
      if (s.team.id !== noTeam.id && dateTeamSaldo) {
        dateTeamSaldo.saldo = getUrlaubssaldo(s, dateStr);
        // Get only default team and teams with negative saldo
        return dateTeamSaldo.saldo < 0 || s.team.id === defaultTeamId;
      }
      return false;
    })
    .sort((a, b) => {
      // Default Team is last in the list
      if (a.team.id === defaultTeamId) return 1;
      if (b.team.id === defaultTeamId) return -1;
      return 0;
    });

  const teamsLength = teams.length;
  if (!teamsLength) return;

  Object.values(noTeamDateSaldo.funktionen).forEach((f) => {
    const funktionId = f.funktion?.id || 0;
    for (let i = 0; i < teamsLength && f.count > 0 && noTeamDateSaldo.saldo > 0; i++) {
      const teamSaldo = teams[i];
      const team = teamSaldo.team;
      const isDefaultTeam = team.id === defaultTeamId;
      // Add only to lastTeam or team with the same funktion
      if (!isDefaultTeam && !team.funktionen_ids.includes(funktionId)) continue;
      const teamDateSaldo = teamSaldo.dates[dateStr];
      const negativeSaldo = teamDateSaldo.saldo;
      // Verfügbare Mitarbeiter auf andere Teams verteilen, bis alle min. Bedarfe gedeckt sind.
      const diff = isDefaultTeam && negativeSaldo + f.count > 0 ? -teamDateSaldo.saldo : f.count;
      moveFreeMitarbeiterToOtherTeam(diff, f, dateStr, noTeamSaldo, teamSaldo);
    }
  });

  // Testen, ob alle verfügbaren Mitarbeiter verteilt wurden und keine Bedarfe existieren.
  // Dann kann das Team entfernt werden.
  noTeamSaldo.remove &&=
    noTeamDateSaldo.verfuegbar > 0 || noTeamDateSaldo.bedarfe_min > 0 || noTeamDateSaldo.bedarfe_opt > 0;
}

async function fillSolls(saldiBase: TSaldiBase) {
  const { default_team, dates, saldi } = saldiBase;
  const noTeamSaldo = saldi[noTeam.id];
  const defaultTeamSaldo = saldi[default_team?.id || noTeam.id];
  if (!(defaultTeamSaldo || noTeamSaldo)) return saldiBase;

  const teamSaldis = Object.values(saldi).filter((s) => {
    return s.team.id !== noTeam.id && s.team.id !== default_team?.id;
  });
  const teamLengths = teamSaldis.length;
  // Ziel:
  // 1. Kein Team verfügbare Mitarbeiter auf andere Teams verteilen, bis alle Bedarfe gedeckt sind.
  // 2. Default Team verfügbare Mitarbeiter auf andere Teams verteilen, bis alle (Kopf-Soll oder die) Bedarfe gedeckt sind.
  dates.forEach((date) => {
    const dateStr = getDateStr(date);
    if (noTeamSaldo) moveNoTeamToOtherTeams(saldiBase, dateStr);
    const defaultTeamDateSaldi = defaultTeamSaldo.dates[dateStr];
    if (!defaultTeamDateSaldi) return;

    defaultTeamDateSaldi.saldo = getUrlaubssaldo(defaultTeamSaldo, dateStr);
    if (defaultTeamDateSaldi.verfuegbar <= 0 || !teamLengths) return;

    Object.values(defaultTeamDateSaldi.funktionen).forEach((defaultTeamF) => {
      for (let i = 0; i < teamLengths && defaultTeamF.count > 0 && defaultTeamDateSaldi.verfuegbar > 0; i++) {
        const teamSaldo = teamSaldis[i];
        const teamDateSaldo = teamSaldo.dates[dateStr];
        if (!teamDateSaldo) continue;

        teamDateSaldo.saldo = getUrlaubssaldo(teamSaldo, dateStr);
        const countInTeam =
          teamDateSaldo.inTeam.length +
          Object.values(teamDateSaldo.funktionen).reduce((acc, teamF) => {
            return acc + teamF.substitutionsFrom.reduce((acc, f) => acc + f.count, 0);
          }, 0);
        const sollValue =
          teamDateSaldo.kopfSoll > teamDateSaldo.bedarfe_min ? teamDateSaldo.kopfSoll : teamDateSaldo.bedarfe_min;
        const missing = sollValue - countInTeam;
        if (missing <= 0) continue;
        const diff = missing > defaultTeamF.count ? defaultTeamF.count : missing;
        console.log({
          dateStr,
          min: teamDateSaldo?.bedarfe_min,
          soll: teamDateSaldo.kopfSoll,
          missing,
          diff,
          countInTeam,
          inTeam: teamDateSaldo.inTeam.length,
          inTeamSubs: Object.values(teamDateSaldo.funktionen).reduce((acc, teamF) => {
            return acc + teamF.substitutionsFrom.reduce((acc, f) => acc + f.count, 0);
          }, 0),
          from: defaultTeamSaldo.team?.name,
          to: teamSaldo.team?.name
        });
        moveFreeMitarbeiterToOtherTeam(diff, defaultTeamF, dateStr, defaultTeamSaldo, teamSaldo);
      }
    });
  });

  return saldiBase;
}

export async function getSaldi(start: Date, ende: Date) {
  const saldiBase = await getSaldiBase(start, ende);
  const bedarfeProDienstTagBereich = await checkTeamBedarfe(saldiBase.dates, saldiBase.saldi);
  saldiBase.mitarbeiter_infos = await checkMitarbeiterVerfuegbarkeit(bedarfeProDienstTagBereich, saldiBase);
  const result = await fillSolls(saldiBase);

  // Entferne NoTeam aus dem Ergebnis, da dessen Werte auf die anderen Teams aufgeteilt werden.
  if (result.saldi[noTeam.id]?.remove) delete result.saldi[noTeam.id];

  return {
    ...result,
    dates: result.dates.map((d) => getDateStr(d))
  };
}
