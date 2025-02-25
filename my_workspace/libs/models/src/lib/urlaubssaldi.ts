import {
  _team,
  _arbeitszeittyp,
  _dienstbedarf,
  getRotationenInRange,
  getAllPoDiensts,
  getDefaultKontingents,
  getMitarbeiterEinteilungenNachTagen,
  getMitarbeiterForUrlaubssaldis
} from '@my-workspace/prisma_cruds';
import { getDateStr, newDate } from '@my-workspace/utils';
import {
  arbeitszeittyps,
  dienstbedarves,
  einteilung_rotations,
  kontingents,
  po_diensts,
  team_kw_krankpuffers,
  teams
} from '@prisma/client';
import {
  ArbeitszeitverteilungSchichtDays,
  createSchichtenDaysFromArbeitszeitverteilung
} from './arbeitszeitverteilung';
import { calculateDienstfreiFromDienstbedarf, checkDateOnDienstbedarf } from './dienstbedarf';

const saldiDefaultValues = {
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
  defaultTeam: 0
};

type SaldiTeamDate = typeof saldiDefaultValues & {
  ID: number;
  funktionen: Record<string, any>;
  mitarbeiter: any[];
  einteilungen_info: {
    bedarf: any[];
    ohne_bedarf: any[];
    dienstfrei: any[];
    optional: any[];
  };
  bedarfe_dienstfrei: {
    count: number;
    eingeteilt: number;
    total: number;
    einteilungen: any[];
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

type SaldiBase = {
  dates: Date[];
  saldi: Saldi;
  mitarbeiter_infos: Record<string, any>;
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

async function getSaldiBase(start: Date, ende: Date) {
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
    mitarbeiter_infos: {},
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
      if (!dienstBedarfe[key]?.[bereichId]) continue;
      // Nur Bedarfe mit gültiger Zeitraumkategorie berücksichtigen
      if (!(await checkDateOnDienstbedarf(date, bedarf))) continue;
      createDefaultsForTeamSaldo(key, teamId, saldi);
      const resultTeamBedarfe = saldi[teamId].dates[key];
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
        resultTeamBedarfe.bedarfe_min += min;
        resultTeamBedarfe.bedarfe_opt += opt;
      }
      if (!checkDienstfrei) continue;
      // Dienstfrei initialisieren
      calculateDienstfreiFromDienstbedarf(date, arbeitszeittypen, computedSchichten[azvId], bedarf, (day, dayStr) => {
        if (dienstfreis[bedarf.id][dayStr] || !daysHash[dayStr]) return;
        dienstfreis[bedarf.id][dayStr] = true;
        createDefaultsForTeamSaldo(dayStr, teamId, saldi);
        const df = saldi[teamId].dates[dayStr].bedarfe_dienstfrei;
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

async function checkMitarbeiterVerfuegbarkeit(
  bedarfeProDienstTagBereich: BedarfeProDienstTagBereich,
  result: SaldiBase
) {
  const dates = result.dates;
  const saldi = result.saldi;
  const defaultTeam = result.default_team;
  const rotationen = (
    await getRotationenInRange(
      dates[0],
      dates[dates.length - 1],
      {
        kontingents: {
          include: {
            teams: true
          }
        }
      },
      {
        prioritaet: 'asc',
        von: 'asc'
      }
    )
  ).reduce(
    (
      acc: Record<
        number,
        (einteilung_rotations & {
          kontingents:
            | (kontingents & {
                teams: teams | null;
              })
            | null;
        })[]
      >,
      rotation
    ) => {
      const mId = rotation.mitarbeiter_id || 0;
      acc[mId] ||= [];
      acc[mId].push(rotation);
      return acc;
    },
    {}
  );
  const infos = {
    team_ids: {},
    rotationen: rotationen
  };
  const diensteHash = (await getAllPoDiensts()).reduce((acc: Record<number, po_diensts>, d) => {
    acc[d.id] = d;
    return acc;
  }, {});
  const defaultKontingent = await getDefaultKontingents();
  const noTeamId = 0;
  const mitarbeiterEinteilungen = await getMitarbeiterEinteilungenNachTagen(dates[0], dates[dates.length - 1]);
  const mitarbeiterIds = Object.keys(mitarbeiterEinteilungen);
  const addTeamId = (noTeamId: number, team: teams | null, teamIds: Record<string, number[]>, date: string) => {
    let teamId = noTeamId;
    if (team) {
      teamId = team.id || noTeamId;
    }
    if (!teamIds[date].includes(teamId)) {
      teamIds[date].push(teamId);
    }
    return teamId;
  };
  const mitarbeiter = await getMitarbeiterForUrlaubssaldis(mitarbeiterIds.map((m) => Number(m)));
  const dienstfreiEingeteilt = {};
  //       dienstfrei = Diensteinteilung.possible_dienstfrei(dates, mitarbeiter.map(&:id), true)
  //       dienstfrei.find_in_batches do |batch|
  //         batch.each do |df|
  //           next if df.mitarbeiter.platzhalter
  //           dates.each do |date|
  //             break if (date - df.tag).to_i > 14
  //             check = df.should_add_dienstfrei(date, nil, {}, true)
  //             next unless check
  //             dienstfrei_eingeteilt[date] ||= {}
  //             dienstfrei_eingeteilt[date][df.mitarbeiter_id] ||= {}
  //             # Jeder Dienst soll nur einmal gezählt werden
  //             dienstfrei_eingeteilt[date][df.mitarbeiter_id][df.po_dienst_id] ||= {
  //               tag: df.tag,
  //               dienst: df.po_dienst.planname,
  //               mitarbeiter: df.mitarbeiter.planname,
  //               team: df.po_dienst.team
  //             }
  //           end
  //         end
  //       end
  //     }
  //     ApplicationRecord.measure("--Mitarbeiter each") {
  //       mitarbeiter.each do |m|
  //         m_id = m.id
  //         next if m.platzhalter
  //         unless mitarbeiter_einteilungen.has_key?(m_id)
  //           mitarbeiter_einteilungen[m_id] = {}
  //         end
  //         unless infos[:team_ids].has_key?(m_id)
  //           infos[:team_ids][m_id] = {}
  //         end
  //         team_ids = infos[:team_ids][m_id]
  //         einteilungen = mitarbeiter_einteilungen[m_id]
  //         accountInfo = m.platzhalter ? nil : m.accountInfo
  //         funktion = m.funktion
  //         funktion_id = m.funktion_id
  //         rot = rotationen[m_id].present? ? rotationen[m_id] : []
  //         dates.each do |date|
  //           if team_ids[date].nil?
  //             team_ids[date] = []
  //           end
  //           team = m.team_am(date, rot, default_team, default_kontingent)
  //           einteilungen[date.to_s] ||= []
  //           not_verfuegbar = false
  //           aktiv = accountInfo.present? && m.urlaubssaldo_aktiv_am(date)
  //           # Iteriert über die Einteilungen und zählt die Einteilungen pro Team
  //           # Einteilung: [t.id, p.id, p.stundennachweis_krank, p.stundennachweis_urlaub, p.stundennachweis_sonstig, ignore_in_urlaubssaldo, bereich_id, is_optional, as_abwesenheit]
  //           einteilungen[date.to_s].each do |e|
  //             dienst_id = e[1].to_i
  //             bereich_id = e[6].to_i
  //             is_optional = e[7] == "1"
  //             as_abwesenheit = e[8] == "1"
  //             # Einteilungen mit Bedarf werden dem Team des Dienstes zugeordnet
  //             is_bedarf_einteilung = e[5] != "false"
  //             if is_bedarf_einteilung
  //               einteilung_team = { id: e[0].to_i }
  //             else
  //               einteilung_team = team
  //             end
  //             bedarf = nil
  //             bedarfeBlock = nil
  //             # Einteilungen in Dienste mit pre_dienst_gruppe werden nicht berücksichtigt
  //             if is_bedarf_einteilung && bedarfe_pro_dienst_tag_bereich[dienst_id].present?
  //               bedarfe = bedarfe_pro_dienst_tag_bereich[dienst_id][date]
  //               if bedarfe.present?
  //                 bedarfeBlock = bereich_id == 0 ? bedarfe.values.first : bedarfe[bereich_id]
  //                 if bedarfeBlock.present?
  //                   bedarf = bedarfeBlock[:bedarf]
  //                   next if bedarf.present? && bedarf.ignore_in_urlaubssaldo
  //                 end
  //               end
  //             end
  //             team_id = add_team_id.call(no_team_id, einteilung_team, team_ids, date)
  //             Antraege.create_defaults_for_team_saldo(date, team_id, result, default_values)
  //             key = :einteilungen
  //             if e[2] == "true"
  //               key = :krank
  //             elsif e[3] == "true"
  //               key = :urlaub
  //             elsif e[4] == "true"
  //               key = :sonstige
  //             end
  //             result[team_id][:dates][date][key] += 1
  //             not_verfuegbar = as_abwesenheit unless not_verfuegbar
  //             if is_bedarf_einteilung && bedarf.present? && !bedarf.ignore_in_urlaubssaldo
  //               result[team_id][:dates][date][:einteilungen_info][:bedarf] << [m.planname, dienste_hash[dienst_id].planname, bereich_id]
  //               if !is_optional && bedarf.min > 0 && bedarfeBlock[:eingeteilt_min] < bedarf.min
  //                 not_verfuegbar = true
  //                 bedarfeBlock[:eingeteilt_min] += 1
  //                 result[team_id][:dates][date][:bedarfe_eingeteilt_min] += 1
  //               elsif is_optional
  //                 # Als optional markierte Bedarfe gelten nicht als verfügbar
  //                 not_verfuegbar = true
  //                 bedarfeBlock[:eingeteilt_opt_markiert] += 1
  //                 result[team_id][:dates][date][:bedarfe_eingeteilt_opt_markiert] += 1
  //               else
  //                 # Optionale Bedarfe gelten als verfügbar
  //                 bedarfeBlock[:eingeteilt_opt] += 1
  //                 result[team_id][:dates][date][:bedarfe_eingeteilt_opt] += 1
  //                 result[team_id][:dates][date][:einteilungen_info][:optional] << [m.planname, dienste_hash[dienst_id].planname, bereich_id, not_verfuegbar]
  //               end
  //             else
  //               not_verfuegbar = true
  //               key = bedarf.present? ? :bedarf : :ohne_bedarf
  //               result[team_id][:dates][date][:einteilungen_info][key] << [m.planname, dienste_hash[dienst_id].planname, bereich_id]
  //             end
  //           end
  //           dfDate = dienstfrei_eingeteilt[date]
  //           if dfDate.present? && dfDate.has_key?(m_id)
  //             not_verfuegbar = true
  //             dfDate[m_id].each do |po_dienst_id, df|
  //               # Dienstfrei wird dem Team des Dienstes zugeordnet
  //               team_id = add_team_id.call(no_team_id, df[:team], team_ids, date)
  //               Antraege.create_defaults_for_team_saldo(date, team_id, result, default_values)
  //               result[team_id][:dates][date][:einteilungen_info][:dienstfrei] << df
  //               result[team_id][:dates][date][:bedarfe_dienstfrei][:eingeteilt] += 1
  //               result[team_id][:dates][date][:bedarfe_dienstfrei][:total] -= 1
  //               result[team_id][:dates][date][:bedarfe_dienstfrei][:einteilungen] << df
  //               if result[team_id][:dates][date][:bedarfe_dienstfrei][:total] < 0
  //                 result[team_id][:dates][date][:bedarfe_dienstfrei][:total] = 0
  //               end
  //             end
  //           elsif aktiv && !not_verfuegbar
  //             team_id = add_team_id.call(no_team_id, team, team_ids, date)
  //             Antraege.create_defaults_for_team_saldo(date, team_id, result, default_values)
  //             result[team_id][:dates][date][:verfuegbar] += 1
  //             unless result[team_id][:dates][date][:funktionen].has_key?(funktion_id)
  //               result[team_id][:dates][date][:funktionen][funktion_id] = {
  //                 count: 0,
  //                 funktion: funktion
  //               }
  //             end
  //             result[team_id][:dates][date][:mitarbeiter] << m.planname
  //             result[team_id][:dates][date][:funktionen][funktion_id][:count] += 1
  //           end
  //         end
  //       end
  //     }
  //     infos
  //   end
}

export async function getSaldi(start: Date, ende: Date) {
  const result = await getSaldiBase(start, ende);
  const bedarfeProDienstTagBereich = await checkTeamBedarfe(result.dates, result.saldi);
  await checkMitarbeiterVerfuegbarkeit(bedarfeProDienstTagBereich, result);
  return result;
}
