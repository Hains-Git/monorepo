import { _team, _arbeitszeittyp } from '@my-workspace/prisma_cruds';
import { newDate } from '@my-workspace/utils';
import { arbeitszeittyps, team_kw_krankpuffers, teams } from '@prisma/client';
import { PlanerDate } from './planerdate/planerdate';

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

async function checkTeamBedarfe(dates: Date[], saldi: Saldi) {
  //   def self.check_team_bedarfe(dates, result, default_values)
  //     bedarfe_pro_dienst_tag_bereich = {}
  const bedarfe_pro_dienst_tag_bereich: Record<string, any> = {};
  const days: Date[] = [];
  const d = newDate(dates[0]);
  d.setDate(d.getDate() - 14);
  const lastDate = dates[dates.length - 1];
  for (; d <= lastDate; d.setDate(d.getDate() + 1)) {
    days.push(newDate(d));
  }
  const planerDates = days.map((d) => new PlanerDate(d));
  const pl = planerDates.length;
  for (let i = 0; i < pl; i++) {
    const d = planerDates[i];
    await d.initializeFeiertage(days[i]);
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
  //     dienstfreis = {}
  //     computed_schichten = {}
  //     Dienstbedarf.joins(:arbeitszeitverteilung)
  //     .includes(:zeitraumkategorie, :arbeitszeitverteilung, :po_dienst, :po_dienst => [:team])
  //     .where('end_date > ? OR end_date IS NULL' , days[0])
  //     .order("zeitraumkategories.prio DESC").each do |bedarf|
  //       min = bedarf.min
  //       opt = bedarf.opt
  //       team_id = bedarf.po_dienst.team_id
  //       po_dienst_id = bedarf.po_dienst_id
  //       bereich_id = bedarf.bereich_id
  //       azv_id = bedarf.arbeitszeitverteilung_id
  //       azv = bedarf.arbeitszeitverteilung
  //       dienst = bedarf.po_dienst
  //       team = dienst.team
  //       unless bedarfe_pro_dienst_tag_bereich.has_key?(po_dienst_id)
  //         bedarfe_pro_dienst_tag_bereich[po_dienst_id] = {}
  //       end
  //       dienst_bedarfe = bedarfe_pro_dienst_tag_bereich[po_dienst_id]
  //       check_dienstfrei = min > 0 && (azv.zeittypen & frei_typen).present?
  //       # Bedarfseintrags Schichten berechnen, wenn noch nicht vorhanden
  //       computed_schichten[azv_id] ||= azv.compute_schichten(arbeitszeittypen) if check_dienstfrei
  //       # Alle Tage testen, ob Bedarf auf diese fällt
  //       days.each_with_index do |date, index|
  //         exists = dienst_bedarfe[date].present? && dienst_bedarfe[date].has_key?(bereich_id)
  //         # Nur Bedarfe hinzufügen, die noch nicht im Hash sind
  //         # und wenn Zeitraumkategorie für das Datum gilt
  //         next if exists || !bedarf.check_date(planer_dates[index])
  //         Antraege.create_defaults_for_team_saldo(date, team_id, result, default_values)
  //         result_team_bedarfe = result[team_id][:dates][date]
  //         dienst_bedarfe[date] ||= {}
  //         dienst_bedarfe[date][bereich_id] = {bedarf: bedarf, eingeteilt_min: 0, eingeteilt_opt: 0, eingeteilt_opt_markiert: 0}
  //         dienstfreis[bedarf.id] ||= {}
  //         # Gewisse Bedarfe nicht im Urlaubssaldo berücksichtigen
  //         unless bedarf.ignore_in_urlaubssaldo
  //           result_team_bedarfe[:bedarfe_min] += min
  //           result_team_bedarfe[:bedarfe_opt] += opt
  //         end
  //         next unless check_dienstfrei
  //         # Dienstfrei initialisieren
  //         bedarf.calculate_dienstfrei_from(date, arbeitszeittypen, computed_schichten[azv_id]) do |day, schicht|
  //           if dienstfreis[bedarf.id][day].blank? && days.include?(day)
  //             dienstfreis[bedarf.id][day] = true
  //             Antraege.create_defaults_for_team_saldo(day, team_id, result, default_values)
  //             df = result[team_id][:dates][day][:bedarfe_dienstfrei]
  //             df[po_dienst_id] ||= {
  //               dienst: dienst.planname,
  //               team: team.name,
  //               bereiche: {},
  //               bedarfe: {}
  //             }
  //             # Dienstfrei aus Bedarfen berücksichtigen
  //             unless df[po_dienst_id][:bedarfe].has_key?(bedarf.id)
  //               df[po_dienst_id][:bedarfe][bedarf.id] = {min: bedarf.min, date: date}
  //               df[po_dienst_id][:bereiche][bereich_id] ||= 0
  //               df[po_dienst_id][:bereiche][bereich_id] += min
  //               df[:count] += min
  //               df[:total] += min
  //             end
  //           end
  //         end
  //       end
  //     end
  //     bedarfe_pro_dienst_tag_bereich
  //   end
}

export async function getSaldi(start: Date, ende: Date) {
  const result = await getSaldiBase(start, ende);
  const bedarfe_pro_dienst_tag_bereich = await checkTeamBedarfe(result.dates, result.saldi);
  // await checkMitarbeiterVerfuegbarkeit(bedarfe_pro_dienst_tag_bereich, result.dates, result.saldi, result.default_team);
  return result;
}

//   def self.create_defaults_for_team_saldo(date, team_id, result, default_values)
//     unless result[team_id][:dates].has_key?(date)
//       result[team_id][:dates][date] = default_values.clone
//       result[team_id][:dates][date][:ID] = team_id
//       result[team_id][:dates][date][:funktionen] = {}
//       result[team_id][:dates][date][:mitarbeiter] = []
//       result[team_id][:dates][date][:einteilungen_info] = {
//         bedarf: [],
//         ohne_bedarf: [],
//         dienstfrei: [],
//         optional: []
//       }
//       result[team_id][:dates][date][:bedarfe_dienstfrei] = {
//         :count => 0,
//         :eingeteilt => 0,
//         :total => 0,
//         :einteilungen => []
//       }
//     end
//   end

//   # Ermittelt die Verfügbarkeit der Mitarbeiter für die angegebenen Tage
//   def self.check_mitarbeiter_verfuegbarkeit(bedarfe_pro_dienst_tag_bereich, dates, result, default_values, default_team = nil)
//     rotationen = {}
//     rotationen = self.matrix_by_key(EinteilungRotation.rotationen_in(dates[0], dates[-1], false)
//           .order(:prioritaet => :asc, :von => :asc), :mitarbeiter_id)
//     infos = {
//       :team_ids => {},
//       :rotationen => rotationen
//     }

//     mitarbeiter_einteilungen = Diensteinteilung.get_mitarbeiter_einteilungen_nach_tagen(dates[0], dates[-1])
//     dienste_hash = hash_by_key(PoDienst.all)

//     default_kontingent = Kontingent.includes(:team).find_by(default: true)
//     rotationen = infos[:rotationen]
//     no_team_id = Team::KEIN_TEAM[:id]
//     mitarbeiter_ids = mitarbeiter_einteilungen.keys

//     add_team_id = -> (no_team_id, team, team_ids, date) do
//       team_id = no_team_id
//       unless team.nil?
//         team_id = team[:id]
//       end
//       unless team_ids[date].include?(team_id)
//         team_ids[date] << team_id
//       end
//       team_id
//     end

//     mitarbeiter = Mitarbeiter.includes(:urlaubssaldo_abspraches, :funktion_team, :funktion, :accountInfo, :vertrags, :vertrags_phases, :vertrags_arbeitszeits, funktion: [
//         :team
//       ], :vertrags_phases => [:vertrag], :vertrags_arbeitszeits => [:vertrag])
//       .where(platzhalter: false)
//       .where("aktiv OR id IN (?)", mitarbeiter_ids)
//     dienstfrei_eingeteilt = {}
//     ApplicationRecord.measure("--Dienstfrei") {
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
