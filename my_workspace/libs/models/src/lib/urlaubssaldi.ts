import {
  _team,
  _arbeitszeittyp,
  _dienstbedarf,
  getAllPoDiensts,
  getDefaultKontingents,
  getMitarbeiterEinteilungenNachTagen,
  getMitarbeiterForUrlaubssaldis,
  getPossibleDienstfrei,
  Dienstfrei,
  getEinteilungBlockTage
} from '@my-workspace/prisma_cruds';
import { getDateStr, newDate } from '@my-workspace/utils';
import {
  arbeitszeittyps,
  bedarfs_eintrags,
  dienstbedarves,
  einteilung_rotations,
  funktions,
  kontingents,
  po_diensts,
  schichts,
  team_kw_krankpuffers,
  teams
} from '@prisma/client';
import {
  ArbeitszeitverteilungSchichtDays,
  createSchichtenDaysFromArbeitszeitverteilung
} from './arbeitszeitverteilung';
import { calculateDienstfreiFromDienstbedarf, checkDateOnDienstbedarf } from './dienstbedarf';
import { mitarbeiterTeamAmByMitarbeiter, mitarbeiterUrlaubssaldoAktivAm } from './mitarbeiter';

type SaldiValues = {
  verfuegbar: number;
  einteilungen: number;
  urlaub: number;
  krank: number;
  sonstige: number;
  bedarfe_min: number;
  bedarfe_opt: number;
  bedarfe: Record<number, dienstbedarves>;
  bedarfe_eingeteilt_min: number;
  bedarfe_eingeteilt_opt: number;
  bedarfe_eingeteilt_opt_markiert: number;
  defaultTeam: number;
};

const saldiDefaultValues: SaldiValues = {
  verfuegbar: 0,
  einteilungen: 0,
  urlaub: 0,
  krank: 0,
  sonstige: 0,
  bedarfe_min: 0,
  bedarfe_opt: 0,
  bedarfe: {},
  bedarfe_eingeteilt_min: 0,
  bedarfe_eingeteilt_opt: 0,
  bedarfe_eingeteilt_opt_markiert: 0,
  defaultTeam: 0
};

type RotationenHash = Record<
  number,
  (einteilung_rotations & {
    kontingents:
      | (kontingents & {
          teams: teams | null;
        })
      | null;
  })[]
>;

type DFInfo = {
  id: number;
  tag: Date;
  dienst: string;
  mitarbeiter: string;
  team: string;
  teamId: number;
};

type SaldiTeamDate = typeof saldiDefaultValues & {
  ID: number;
  funktionen: Record<
    number,
    {
      count: number;
      funktion: (funktions & { teams: teams | null }) | null;
    }
  >;
  mitarbeiter: string[];
  einteilungen_info: {
    bedarf: (string | number)[][];
    ohne_bedarf: (string | number)[][];
    dienstfrei: DFInfo[];
    optional: (string | number | boolean)[][];
  };
  bedarfe_dienstfrei: {
    count: number;
    eingeteilt: number;
    total: number;
    einteilungen: DFInfo[];
    [x: number]: {
      dienst: string;
      team: string;
      bereiche: Record<number, number>;
      bedarfe: Record<number, { min: number; date: Date }>;
    };
  };
};

type SaldiTeamBase = teams & {
  funktionen_ids: number[];
  team_kw_krankpuffers: team_kw_krankpuffers[];
};

type Saldi = Record<
  number,
  {
    team: SaldiTeamBase;
    dates: Record<string, SaldiTeamDate>;
  }
>;

type MitarbeiterInfos = {
  team_ids: Record<string, Record<string, number[]>>;
  rotationen: RotationenHash;
  dienstfreis?: any;
};

type SaldiBase = {
  dates: Date[];
  saldi: Saldi;
  mitarbeiter_infos: MitarbeiterInfos;
  default_team: SaldiTeamBase | null;
};

type BedarfeProDienstTagBereich = Record<
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

const noTeam: SaldiTeamBase = {
  id: 0,
  name: 'Ohne Team',
  default: false,
  verteiler_default: false,
  color: '#fff',
  kostenstelle_id: null,
  krank_puffer: 0,
  team_kw_krankpuffers: [],
  funktionen_ids: [],
  created_at: newDate(),
  updated_at: newDate()
};

async function getSaldiBase(start: Date, ende: Date) {
  const dates: Date[] = [];
  for (const d = newDate(start); d <= newDate(ende); d.setDate(d.getDate() + 1)) {
    dates.push(newDate(d));
  }
  const result: SaldiBase = {
    dates,
    saldi: {
      [noTeam.id]: {
        team: noTeam,
        dates: {}
      }
    },
    mitarbeiter_infos: {
      team_ids: {},
      rotationen: {}
    },
    default_team: null
  };

  const teams = await _team.getAllTeamsWithMainIncludes();
  teams.forEach((t) => {
    result.saldi[t.id] = {
      team: {
        ...t,
        funktionen_ids: t.team_funktions.map((f) => f.id)
      },
      dates: {}
    };
    if (t.default) {
      result.default_team = {
        ...t,
        funktionen_ids: t.team_funktions.map((f) => f.id)
      };
    }
  });

  return result;
}

function createDefaultsForTeamSaldo(date: string, teamId: number, saldi: Saldi) {
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
    }
  };
  return saldi[teamId].dates[date];
}

async function checkTeamBedarfe(dates: Date[], saldi: Saldi) {
  const bedarfeProDienstTagBereich: BedarfeProDienstTagBereich = {};
  const days: Date[] = [];
  const daysHash: Record<string, Date> = {};
  const d = newDate(dates[0]);
  d.setDate(d.getDate() - 14);
  const lastDate = dates[dates.length - 1];
  for (; d <= lastDate; d.setDate(d.getDate() + 1)) {
    const date = newDate(d);
    daysHash[getDateStr(date)] = date;
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
  const computedSchichten: Record<number, ArbeitszeitverteilungSchichtDays> = {};
  const bedarfeLength = dienstbedarfe.length;
  const daysLength = days.length;
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
      const key = getDateStr(date);
      // Nur Bedarfe hinzufügen, die noch nicht im Hash sind
      if (dienstBedarfe[key]?.[bereichId]) continue;
      // Nur Bedarfe mit gültiger Zeitraumkategorie berücksichtigen
      if (!(await checkDateOnDienstbedarf(date, bedarf))) continue;
      const currSaldi = createDefaultsForTeamSaldo(key, teamId, saldi);
      dienstBedarfe[key] ||= {};
      dienstBedarfe[key][bereichId] = {
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
        currSaldi.bedarfe[bedarf.id] ||= bedarf;
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

function checkBedarf(df: Dienstfrei, bedarf: bedarfs_eintrags) {
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
  const dateNr = Number(getDateStr(date).split('-').join(''));
  return !!schichten.find((s) => {
    if (s.arbeitszeittyps?.arbeitszeit || s.arbeitszeittyps?.dienstzeit || !s.anfang || !s.ende) return false;
    const dateAnfangWithAusgleich = newDate(s.anfang);
    dateAnfangWithAusgleich.setDate(dateAnfangWithAusgleich.getDate() + ausgleichTage);
    return (
      Number(getDateStr(dateAnfangWithAusgleich).split('-').join('')) > dateNr ||
      Number(getDateStr(s.ende).split('-').join('')) > dateNr
    );
  });
}

async function shouldAddDienstfrei(
  df: Dienstfrei,
  date: Date,
  eingeteiltId = '',
  eingeteilt: Record<
    string,
    {
      einteilungen: Record<number, Record<string, Dienstfrei>>;
      bloecke: Record<number, Record<number, number>>;
    }
  > = {},
  onlyCounts = false
) {
  let shouldAdd = false;
  const mitarbeiterId = df.mitarbeiter_id || 0;
  eingeteiltId ||= `${df.mitarbeiters?.planname}_${df.po_diensts?.planname}_${df.tag}`;
  const dateStr = getDateStr(date);
  const tagKey = df.tag ? getDateStr(df.tag) : '';
  const dateNr = Number(dateStr.split('-').join(''));
  const bedarfsEintraege = df.po_diensts?.bedarfs_eintrags;
  if (!df.po_dienst_id || !bedarfsEintraege) return shouldAdd;
  if (!tagKey || Number(tagKey.split('-').join('')) >= dateNr) return shouldAdd;
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
  if (Number(bedarfTagStr.split('-').join('')) >= dateNr) {
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
    const einteilungenBlockSize = (await getEinteilungBlockTage(mitarbeiterId, dates, currFirstBedarf.id, onlyCounts))
      .length;
    const isFullBlock = einteilungenBlockSize === block.length;
    const isBeforeDate = Number(getDateStr(be.tag).split('-').join('')) < dateNr;
    if (!(isFullBlock && isBeforeDate)) return shouldAdd;
    const ausgleichDate = newDate(be.tag);
    ausgleichDate.setDate(ausgleichDate.getDate() + (be.ausgleich_tage || 0));
    shouldAdd = Number(getDateStr(ausgleichDate).split('-').join('')) >= dateNr;
    if (!shouldAdd) {
      shouldAdd = checkSchichten(be.schichts, date, be.ausgleich_tage || 0);
      console.log('schichten', shouldAdd);
    }
  } else {
    const ausgleichtage = newDate(currBedarf.tag);
    ausgleichtage.setDate(ausgleichtage.getDate() + (currBedarf.ausgleich_tage || 0));
    shouldAdd = Number(getDateStr(ausgleichtage).split('-').join('')) >= dateNr;
    if (!shouldAdd) {
      shouldAdd = checkSchichten(currBedarf.schichts, date, currBedarf.ausgleich_tage || 0);
    }
  }
  return shouldAdd;
}

async function checkMitarbeiterVerfuegbarkeit(
  bedarfeProDienstTagBereich: BedarfeProDienstTagBereich,
  result: SaldiBase
) {
  const dates = result.dates;
  const saldi = result.saldi;
  const defaultTeam = result.default_team;
  const infos: MitarbeiterInfos = {
    team_ids: {},
    rotationen: {}
  };
  const diensteHash = (await getAllPoDiensts()).reduce((acc: Record<number, po_diensts>, d) => {
    acc[d.id] = d;
    return acc;
  }, {});
  const defaultKontingent = await getDefaultKontingents();
  const noTeamId = 0;
  const mitarbeiterEinteilungen = await getMitarbeiterEinteilungenNachTagen(dates[0], dates[dates.length - 1]);
  const mitarbeiterIds = Object.keys(mitarbeiterEinteilungen);

  const addTeamId = (
    noTeamId: number,
    team: { id: number } | null,
    teamIds: Record<string, number[]>,
    date: string
  ) => {
    let teamId = noTeamId;
    if (team) {
      teamId = team.id || noTeamId;
    }
    if (!teamIds[date].includes(teamId)) {
      teamIds[date].push(teamId);
    }
    return teamId;
  };

  const mitarbeiter = await getMitarbeiterForUrlaubssaldis(
    mitarbeiterIds.map((m) => Number(m)),
    dates[0],
    dates[dates.length - 1]
  );
  const dienstfreiEingeteilt: Record<string, Record<number, Record<number, DFInfo>>> = {};
  const dienstfrei = await getPossibleDienstfrei(
    dates,
    mitarbeiter.map((m) => m.id),
    true
  );
  const dienstfreiLength = dienstfrei.length;
  const datesLength = dates.length;
  for (let i = 0; i < dienstfreiLength; i++) {
    const df = dienstfrei[i];
    if (df.mitarbeiters?.platzhalter) continue;
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
  infos.dienstfreis = dienstfreiEingeteilt;
  const mitarbeiterLength = mitarbeiter.length;
  const mitarbeiterTeamAm: Record<number, Record<string, teams>> = {};
  for (let i = 0; i < mitarbeiterLength; i++) {
    const m = mitarbeiter[i];
    const mId = m.id;
    if (m.platzhalter) continue;
    infos.rotationen[mId] = m.einteilung_rotations;
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
        (await mitarbeiterTeamAmByMitarbeiter(m, date, defaultTeam, defaultKontingent)) || noTeam;
      const team = mitarbeiterTeamAm[mId][dateKey];
      einteilungen[dateKey] ||= [];
      let notVerfuegbar = false;
      const aktiv = !!(accountInfo && (await mitarbeiterUrlaubssaldoAktivAm(m, date)));
      const einteilungenLength = einteilungen[dateKey].length;
      for (let j = 0; j < einteilungenLength; j++) {
        // Einteilung: [t.id, p.id, p.stundennachweis_krank, p.stundennachweis_urlaub, p.stundennachweis_sonstig, ignore_in_urlaubssaldo, bereich_id, is_optional, as_abwesenheit]
        const e = einteilungen[dateKey][j];
        const dienstId = parseInt(e[1], 10);
        const bereichId = parseInt(e[6], 10);
        const isOptional = e[7] === '1';
        const asAbwesenheit = e[8] === '1';
        const isBedarfEinteilung = e[5] !== 'false';
        const einteilungTeam = isBedarfEinteilung ? { id: parseInt(e[0], 10) } : team;
        let bedarf: dienstbedarves | null = null;
        let bedarfeBlock: {
          bedarf: dienstbedarves;
          eingeteilt_min: number;
          eingeteilt_opt: number;
          eingeteilt_opt_markiert: number;
        } | null = null;
        if (isBedarfEinteilung && bedarfeProDienstTagBereich[dienstId]) {
          const bedarfe = bedarfeProDienstTagBereich[dienstId][dateKey];
          if (bedarfe) {
            bedarfeBlock = bereichId === 0 ? Object.values(bedarfe)[0] : bedarfe[bereichId];
            if (bedarfeBlock) {
              bedarf = bedarfeBlock.bedarf;
              if (bedarf?.ignore_in_urlaubssaldo) continue;
            }
          }
        }
        const teamId = addTeamId(noTeamId, einteilungTeam, teamIds, dateKey);
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
          currSaldi.einteilungen_info.bedarf.push([m.planname || '', diensteHash[dienstId]?.planname || '', bereichId]);
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
            currSaldi.einteilungen_info.optional.push([
              m.planname || '',
              diensteHash[dienstId].planname || '',
              bereichId,
              notVerfuegbar
            ]);
          }
        } else {
          notVerfuegbar = true;
          const key = bedarf ? 'bedarf' : 'ohne_bedarf';
          currSaldi.einteilungen_info[key].push([m.planname || '', diensteHash[dienstId]?.planname || '', bereichId]);
        }
      }

      const dfDate = dienstfreiEingeteilt[dateKey];
      if (dfDate && dfDate[mId]) {
        notVerfuegbar = true;
        const df = dfDate[mId];
        for (const poDienstId in df) {
          // Dienstfrei wird dem Team des Dienstes zugeordnet
          const dfInfo = df[poDienstId];
          const teamId = addTeamId(noTeamId, { id: dfInfo.teamId }, teamIds, dateKey);
          const currSaldi = createDefaultsForTeamSaldo(dateKey, teamId, saldi);
          currSaldi.einteilungen_info.dienstfrei.push(dfInfo);
          currSaldi.bedarfe_dienstfrei.eingeteilt += 1;
          currSaldi.bedarfe_dienstfrei.total -= 1;
          currSaldi.bedarfe_dienstfrei.einteilungen.push(dfInfo);
          if (currSaldi.bedarfe_dienstfrei.total < 0) {
            currSaldi.bedarfe_dienstfrei.total = 0;
          }
        }
      } else if (aktiv && !notVerfuegbar) {
        const teamId = addTeamId(noTeamId, team, teamIds, dateKey);
        const currSaldi = createDefaultsForTeamSaldo(dateKey, teamId, saldi);
        currSaldi.verfuegbar += 1;
        currSaldi.funktionen[funktionId] ||= {
          count: 0,
          funktion
        };
        currSaldi.mitarbeiter.push(m.planname || '');
        currSaldi.funktionen[funktionId].count += 1;
      }
    }
  }
  return infos;
}

export async function getSaldi(start: Date, ende: Date) {
  const result = await getSaldiBase(start, ende);
  const bedarfeProDienstTagBereich = await checkTeamBedarfe(result.dates, result.saldi);
  result.mitarbeiter_infos = await checkMitarbeiterVerfuegbarkeit(bedarfeProDienstTagBereich, result);
  return {
    ...result,
    dates: result.dates.map((d) => getDateStr(d))
  };
}
