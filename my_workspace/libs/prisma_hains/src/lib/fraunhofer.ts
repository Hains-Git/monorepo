// import * as fs from 'fs/promises';
import {
  arbeitszeittyps,
  arbeitszeitverteilungs,
  bedarfs_eintrags,
  dienstbedarves,
  dienstfreigabes,
  dienstgruppes,
  dienstkategories,
  dienstkategoriethemas,
  dienstplanbedarves,
  dienstplans,
  dienstratings,
  dienstwunsches,
  einteilung_rotations,
  freigabestatuses,
  po_diensts,
  schichts,
  themas
} from '@prisma/client';
import { prismaDb } from './prisma-hains';
import {
  bedarfsEintragsIncludeMainInfosNoBlock,
  getArbeitszeitInMinutenAm,
  getFraunhoferMitarbeiter,
  wherePlanBedarfIn
} from './utils/crud_helper';
import {
  Ausgleichsdienstgruppe,
  Bedarf,
  Bedarfsblock,
  BedarfsID,
  Dienst,
  DienstkategorieDienste,
  DienstTyp,
  DienstTypenThemen,
  Einteilung,
  FraunhoferNewPlan,
  Freigabe,
  FreigabeTyp,
  FreigabetypenDienste,
  Kombibedarf,
  PlanData,
  Präferenz,
  Rotation,
  Rotationszuweisung,
  Wunsch
} from './utils/fraunhofer_types';
import { newDate, newDateYearMonthDay } from '@my-workspace/utils';

const defaultPlanData: PlanData = {
  Mitarbeiter: [],
  Dienste: [],
  Kombibedarfe: [],
  Rotationen: [],
  Bedarfe: [],
  Bedarfsblöcke: [],
  Ausgleichsdienste: [],
  FixierteEinteilungen: [],
  AuslgeichsfreiDienstID: 0,
  MinPräferenz: 1,
  MaxPräferenz: 5,
  msg: ''
};

function mapThemenToDienstTypen(themen: themas[]) {
  const dienstTypenThemen: DienstTypenThemen = {
    Frühdienst: [],
    Rufdienst: [],
    Nachtdienst: [],
    VersetzterDienst: [],
    LangerDienst: [],
    OnTopFD: [],
    Frei: []
  };
  themen.forEach((t) => {
    let key: DienstTyp = 'Frei';
    const name = (t.name || '').trim().toLowerCase();
    const notStartWithKein = name.indexOf('kein') !== 0;
    if (notStartWithKein) {
      if (name.includes('versetzter dienst')) {
        key = 'VersetzterDienst';
      } else if (name.includes('langer dienst')) {
        key = 'LangerDienst';
      } else if (name.includes('nachtdienst')) {
        key = 'Nachtdienst';
      } else if (name.includes('frühdienst')) {
        key = 'Frühdienst';
      } else if (name.includes('rufdienst')) {
        key = 'Rufdienst';
      } else if (name.includes('on top fd')) {
        key = 'OnTopFD';
      }
    }
    dienstTypenThemen[key].push(t.id);
  });
  return dienstTypenThemen;
}

function getMitarbeiterRotationen(rotationen: einteilung_rotations[], tage: Date[]) {
  return rotationen.reduce((acc: Rotationszuweisung[], r) => {
    const kontingentId = r.kontingent_id || 0;
    if (kontingentId < 1) return acc;
    tage.forEach((tag) => {
      const check = r.von && r.bis && r.von <= tag && r.bis >= tag;
      if (!check) return;
      acc.push({
        Tag: tag,
        RotationsID: kontingentId
      });
    });
    return acc;
  }, []);
}

function getMitarbeiterWuensche(
  wuensche: ({
    dienstkategories: dienstkategories | null;
  } & dienstwunsches)[],
  dienstkategorieDienste: DienstkategorieDienste
) {
  return wuensche.reduce(
    (
      acc: {
        Wünsche: Wunsch[];
        'K-Wünsche': Date[];
      },
      w
    ) => {
      if (!w.tag || !w.dienstkategorie_id) return acc;
      if (w.dienstkategories?.poppix_name === 'K') {
        acc['K-Wünsche'].push(w.tag);
      } else {
        acc.Wünsche.push({
          Tag: w.tag,
          Dienste: dienstkategorieDienste[w.dienstkategorie_id] || []
        });
      }

      return acc;
    },
    {
      Wünsche: [],
      'K-Wünsche': []
    }
  );
}

function getMitarbeiterFreigaben(
  freigaben: ({
    freigabestatuses: freigabestatuses | null;
  } & dienstfreigabes)[],
  freigabetypenDienste: FreigabetypenDienste,
  tage: Date[]
) {
  return freigaben.reduce((acc: Freigabe[], f) => {
    const freigabeTypId = f.freigabetyp_id || 0;
    if (freigabeTypId < 1 || !f.freigabestatuses?.qualifiziert) return acc;
    // let typ: FreigabeTyp = f.freigabestatuses.counts_active ? 'qualifiziert' : 'nicht qualifiziert';
    const typ: FreigabeTyp = f.freigabestatuses.counts_active ? 'qualifiziert' : 'überqualifiziert';
    // if (f.freigabestatuses.name === 'erteilt, ruhend (höhere Qualifikation)') {
    //   typ = 'überqualifiziert';
    // }
    const ftDienste = freigabetypenDienste[freigabeTypId];
    if (!ftDienste) return acc;
    Object.values(ftDienste).forEach((dId) => {
      tage.forEach((tag) => {
        acc.push({
          Dienst: dId,
          Tag: tag,
          Freigabetyp: typ
        });
      });
    });
    return acc;
  }, []);
}

function createDiensteAndMapInfos(
  dienste: po_diensts[],
  dienstTypenThemen: DienstTypenThemen,
  dienstkategorien: ({
    dienstkategoriethemas: dienstkategoriethemas[];
  } & dienstkategories)[],
  themen: themas[]
) {
  return dienste.reduce(
    (
      acc: {
        diensteArr: Dienst[];
        freigabetypenDienste: FreigabetypenDienste;
        dienstkategorieDienste: DienstkategorieDienste;
        nachtdienste: number[];
      },
      d
    ) => {
      // Map Dienste to Freigabetypen
      d.freigabetypen_ids.forEach((ft) => {
        acc.freigabetypenDienste[ft] ||= {};
        acc.freigabetypenDienste[ft][d.id] = d.id;
      });

      // Get DienstTyp
      const typ: DienstTyp =
        (Object.entries(dienstTypenThemen).find(([key, ids]) => {
          // Frei ist der Default-Typ und gilt nur, wenn alle anderen nicht zutreffen
          if (key === 'Frei') return false;
          return d.thema_ids.find((t) => ids.includes(t));
        })?.[0] as DienstTyp) || 'Frei';

      if (typ === 'Nachtdienst') acc.nachtdienste.push(d.id);

      // Map Dienste to Dienstkategorien
      dienstkategorien.forEach((dk) => {
        const hasThemen = d.thema_ids.find((t) => dk.dienstkategoriethemas.find((dt) => dt.thema_id === t));
        if (!hasThemen) {
          return;
        }
        acc.dienstkategorieDienste[dk.id] ||= [];
        acc.dienstkategorieDienste[dk.id].push(d.id);
      });

      const istRelevantFürDoppelWhopper = typ === 'Nachtdienst';

      // Add Dienst to DiensteArr
      acc.diensteArr.push({
        ID: d.id,
        Name: d.planname || '',
        Typ: typ,
        IstRelevantFürDoppelWhopper: istRelevantFürDoppelWhopper
      });
      return acc;
    },
    {
      diensteArr: [],
      freigabetypenDienste: {},
      dienstkategorieDienste: {},
      nachtdienste: []
    }
  );
}

function getPraeferenzen(ratings: dienstratings[], min: number, max: number) {
  return ratings.reduce((acc: Präferenz[], r) => {
    if (r.po_dienst_id && r.rating !== null && r.rating >= min && r.rating <= max) {
      acc.push({
        Dienst: r.po_dienst_id,
        Bewertung: r.rating
      });
    }
    return acc;
  }, []);
}

function createTageAndMonths(start: Date, end: Date) {
  const tage: Date[] = [];
  const months: Record<string, string> = {};

  // Create Tage and Months
  for (let d = newDate(start); d <= end; d.setDate(d.getDate() + 1)) {
    const date = newDate(d);
    tage.push(date);
    const [year, month] = [date.getFullYear(), date.getMonth()];
    // 12 Uhr mittags, damit es keine Probleme mit der Zeitzone gibt
    const firstDayStr = newDateYearMonthDay(year, month, 1).toISOString();
    months[firstDayStr] ||= newDateYearMonthDay(year, month + 1, 0).toISOString();
  }

  return { tage, months };
}

type Schicht = {
  arbeitszeittyps: arbeitszeittyps | null;
} & schichts;

type BedarfsEintragMainInfosNoBlock = {
  schichts: Schicht[];
  po_diensts: po_diensts | null;
  dienstbedarves:
    | ({
        arbeitszeitverteilungs:
          | ({
              pre_dienstgruppes: dienstgruppes | null;
            } & arbeitszeitverteilungs)
          | null;
      } & dienstbedarves)
    | null;
};

type MainBedarfsEintrag = BedarfsEintragMainInfosNoBlock & bedarfs_eintrags;

type BedarfsEintrag = {
  first_bedarf:
    | ({
        block_bedarfe: MainBedarfsEintrag[];
      } & bedarfs_eintrags)
    | null;
} & MainBedarfsEintrag;

type DienstPlan = {
  dienstplanbedarves:
    | ({
        bedarfs_eintrags: BedarfsEintrag[];
      } & dienstplanbedarves)
    | null;
} & dienstplans;

async function getDienstplanPerMonth(start: Date, end: Date) {
  const { tage, months } = createTageAndMonths(start, end);
  const dienstplaene: DienstPlan[] = [];
  for (const monthStart in months) {
    const monthEnd = months[monthStart];
    const dpl = await prismaDb.dienstplans.findFirst({
      where: {
        ...wherePlanBedarfIn(newDate(monthStart), newDate(monthEnd)),
        dienstplanbedarves: {
          isNot: null
        }
      },
      include: {
        dienstplanbedarves: {
          include: {
            bedarfs_eintrags: {
              where: {
                AND: [
                  { tag: { gte: monthStart, lte: monthEnd } },
                  {
                    tag: { gte: start, lte: end }
                  }
                ]
              },
              include: {
                first_bedarf: {
                  include: {
                    block_bedarfe: {
                      include: {
                        ...bedarfsEintragsIncludeMainInfosNoBlock
                      }
                    }
                  }
                },
                ...bedarfsEintragsIncludeMainInfosNoBlock
              }
            }
          }
        }
      },
      orderBy: [
        {
          anfang: 'asc'
        },
        {
          ende: 'desc'
        }
      ]
    });
    if (!dpl) continue;
    dienstplaene.push(dpl);
  }

  return { dienstplaene, tage, months };
}

type UeberschneidungSchicht = {
  anfang: Date;
  ende: Date;
  acceptedUeberschneidung: number;
  diensteIds: number[];
  isArbeitszeit: boolean;
  isDienstzeit: boolean;
  dienst: po_diensts;
};

type UeberschneidungSchichtenSammlung = Record<string, Record<number, Record<number, UeberschneidungSchicht[]>>>;

function calculateBedarfArbeitszeit(
  bedarfsEintrag: MainBedarfsEintrag,
  uberschneidungSchichten: UeberschneidungSchichtenSammlung
) {
  let bereitschaft = false;
  let wochenende = false;
  const dienst = bedarfsEintrag.po_diensts;
  const bedarfseintragTag = bedarfsEintrag.tag;
  if (!dienst || !bedarfseintragTag) {
    console.error('No Dienst or Day found for BedarfsEintrag:', bedarfsEintrag);
    return {
      arbeitszeitInMinuten: 0,
      wochenende,
      bereitschaft
    };
  }

  wochenende = [0, 6].includes(bedarfseintragTag.getDay());
  const dienstId = bedarfsEintrag.po_dienst_id || 0;
  const bereichId = bedarfsEintrag.bereich_id || 0;
  const tag = bedarfseintragTag.toISOString().split('T')[0];

  const checkPreDienstgruppen = !bedarfsEintrag.is_block || bedarfsEintrag.id === bedarfsEintrag.first_entry;
  const arbeitszeitverteilung = bedarfsEintrag.dienstbedarves?.arbeitszeitverteilungs;

  const addSchichtToSammlung = (schicht: UeberschneidungSchicht) => {
    uberschneidungSchichten[tag] ||= {};
    uberschneidungSchichten[tag][dienstId] ||= {};
    uberschneidungSchichten[tag][dienstId][bereichId] ||= [];
    uberschneidungSchichten[tag][dienstId][bereichId].push(schicht);
  };

  const arbeitszeitInMinuten = bedarfsEintrag.schichts.reduce((acc: number, s, i) => {
    if (!s.anfang || !s.ende) return acc;
    const azt = s.arbeitszeittyps;
    // Check for Bereitschaftsdienst
    if (azt?.bereitschaft) bereitschaft = true;

    // Dienstgruppen Forderung überprüfen und DienstgruppenZeitraum hinzufügen, vor erste Schicht
    if (checkPreDienstgruppen && i === 0 && arbeitszeitverteilung) {
      const preDienstgruppe = arbeitszeitverteilung?.pre_dienstgruppes;
      const preDienstgruppeStd = Number(arbeitszeitverteilung?.pre_std || 0);
      if (preDienstgruppe?.dienste?.length && preDienstgruppeStd) {
        const preSchichtAnfang = newDate(s.anfang.getTime() - preDienstgruppeStd * 3600000);
        const ueberschneidungSchicht: UeberschneidungSchicht = {
          anfang: preSchichtAnfang,
          ende: s.anfang,
          acceptedUeberschneidung: arbeitszeitverteilung?.pre_ueberschneidung_minuten || 0,
          isArbeitszeit: false,
          isDienstzeit: true,
          diensteIds: preDienstgruppe.dienste,
          dienst
        };
        addSchichtToSammlung(ueberschneidungSchicht);
      }
    }

    // Schichten hinzufügen. Wichtig: Dienstgruppenforderung an ester Stelle
    const ueberschneidungSchicht: UeberschneidungSchicht = {
      anfang: s.anfang,
      ende: s.ende,
      acceptedUeberschneidung: 0,
      isArbeitszeit: !!azt?.arbeitszeit,
      isDienstzeit: !!azt?.dienstzeit,
      diensteIds: [],
      dienst
    };
    addSchichtToSammlung(ueberschneidungSchicht);

    // Calculate Arbeitzeit and check if is Wochenenddienst
    // Wochenende: (Start Mo < 5:00 or Ende Fr > 21:00)
    if (azt?.arbeitszeit && s.arbeitszeit) {
      // Bereitschaftsdienst mitzählen und Rufdienst ignorieren.
      if (!azt.rufbereitschaft) acc += s.arbeitszeit;
      if (!wochenende && azt?.dienstzeit) {
        const beginsMondayBeforeFive = s.anfang.getDay() === 1 && s.anfang.getHours() < 5;
        const endTime = s.ende.toTimeString().split(' ')[0];
        const endTimeAsNumber = parseInt(endTime.split(':').join(''), 10);
        const endsFridayAfterNine = s.ende.getDay() === 5 && endTimeAsNumber > 210000;
        wochenende = beginsMondayBeforeFive || endsFridayAfterNine;
      }
    }
    return acc;
  }, 0);

  return {
    arbeitszeitInMinuten,
    wochenende,
    bereitschaft
  };
}

function createBedarf(
  bedarfsEintrag: MainBedarfsEintrag,
  uberschneidungSchichten: UeberschneidungSchichtenSammlung
): Bedarf | null {
  if (!bedarfsEintrag.tag || !bedarfsEintrag.po_dienst_id || !bedarfsEintrag.bereich_id) return null;
  const { arbeitszeitInMinuten, wochenende, bereitschaft } = calculateBedarfArbeitszeit(
    bedarfsEintrag,
    uberschneidungSchichten
  );
  return {
    ID: {
      Tag: bedarfsEintrag.tag,
      Dienst: bedarfsEintrag.po_dienst_id,
      Bereich: bedarfsEintrag.bereich_id
    },
    Minimum: bedarfsEintrag.min || 0,
    OptionalerZusätzlicherBedarf: bedarfsEintrag.opt || 0,
    IstBereitschaftsdienst: bereitschaft,
    ArbeitszeitInMinuten: arbeitszeitInMinuten,
    Belastung: 0,
    IstWochenendEinteilung: wochenende
  };
}

function checkBedarf(
  be: MainBedarfsEintrag,
  addedBedarfe: Record<string, Record<string, MainBedarfsEintrag>> = {},
  uberschneidungSchichten: UeberschneidungSchichtenSammlung
) {
  if (!be.tag || !be.po_dienst_id) return;
  const tagKey = be.tag.toISOString();
  const key = `${be.po_dienst_id}_${be.bereich_id}`;
  addedBedarfe[tagKey] ||= {};
  if (addedBedarfe[tagKey][key]) return;
  const bedarf = createBedarf(be, uberschneidungSchichten);
  if (!bedarf) return;
  addedBedarfe[tagKey][key] = be;
  return bedarf;
}

function getBedarfeAndBloecke(dienstplaene: DienstPlan[], start: Date, end: Date, nachtdienste: number[]) {
  const bedarfe: Bedarf[] = [];
  const bloecke: Bedarfsblock[] = [];
  const addedBloecke: Record<number, boolean> = {};
  const addedBedarfe: Record<string, Record<string, MainBedarfsEintrag>> = {};
  const bedarfeTageOutSideInterval: Record<string, number[]> = {};
  const uberschneidungSchichten: UeberschneidungSchichtenSammlung = {};
  const ausgleichsdienstgruppen: Record<number, Ausgleichsdienstgruppe> = {};

  const addToAusgleichsDienstgruppe = (be: MainBedarfsEintrag, isLastInBlock: boolean) => {
    if (!be.po_dienst_id || !be.tag || !be.bereich_id) return;
    const dienstId = be.po_dienst_id;
    const dienst = be.po_diensts?.planname || 'Unknown';
    const isK3 = be.po_diensts?.planname === 'K3';

    if (!isK3) {
      const isDonnerstagNachtDienst = be.tag.getDay() === 4 && nachtdienste.includes(dienstId);
      if (isLastInBlock && isDonnerstagNachtDienst) {
        const l = be.schichts.length - 1;
        const nextDayLimit = newDate(be.tag);
        nextDayLimit.setDate(nextDayLimit.getDate() + 1);
        nextDayLimit.setHours(12, 0, 0, 0);
        const dateZahl = Number(be.tag.toISOString().split('T')[0].split('-').join(''));
        let hasFreiNextDays = false;
        const ausgleichsTage = be.ausgleich_tage || 0;
        for (let i = l; i >= 0; i--) {
          const schicht = be.schichts[i];
          const isArbeitszeit = schicht.arbeitszeittyps?.arbeitszeit;
          const isFrei = !isArbeitszeit && !schicht.arbeitszeittyps?.dienstzeit;
          if (!schicht.anfang || !schicht.ende) continue;
          const endeDateZahl = Number(schicht.ende.toISOString().split('T')[0].split('-').join(''));
          // Es sind nur Schichten bis zum Tag des Bedarfs relevant
          if (endeDateZahl <= dateZahl) break;
          // Falls es an einem Folgetag eine Arbeitszeit gibt, dann ist es keine Ausgleichsdienstgruppe
          if (isArbeitszeit && schicht.ende > nextDayLimit) {
            return;
          }
          // Falls an dem Folgetag ein Frei existiert, dann ist es eine Ausgleichsdienstgruppe
          if (isFrei) {
            const freiAbSamstag = endeDateZahl > dateZahl + 1;
            const freiAbFreitagAndAusgleich = endeDateZahl > dateZahl && ausgleichsTage > 0;
            hasFreiNextDays = freiAbSamstag || freiAbFreitagAndAusgleich;
          }
        }
        if (!hasFreiNextDays) return;
      } else return;
    }

    ausgleichsdienstgruppen[dienstId] ||= {
      Name: dienst,
      Einträge: []
    };
    ausgleichsdienstgruppen[dienstId].Einträge.push({
      Tag: be.tag,
      Dienst: be.po_dienst_id,
      Bereich: be.bereich_id
    });
  };

  dienstplaene.forEach((dpl) => {
    if (!dpl?.dienstplanbedarves?.bedarfs_eintrags) return;
    dpl.dienstplanbedarves.bedarfs_eintrags.forEach((be) => {
      if (!be.tag || !be.po_dienst_id) return;
      const firstBedarf = be.first_bedarf;
      const isBlock = firstBedarf && firstBedarf.block_bedarfe.length > 1;
      if (!isBlock) {
        const bedarf = checkBedarf(be, addedBedarfe, uberschneidungSchichten);
        if (bedarf) {
          bedarfe.push(bedarf);
          addToAusgleichsDienstgruppe(be, true);
        }
        return;
      }

      addedBloecke[firstBedarf.id] = true;
      const l = firstBedarf.block_bedarfe.length - 1;
      bloecke.push({
        Einträge: firstBedarf.block_bedarfe.reduce((acc: BedarfsID[], bb, i) => {
          if (!bb.tag || !bb.po_dienst_id || !bb.bereich_id) return acc;
          const bedarf = checkBedarf(bb, addedBedarfe, uberschneidungSchichten);
          if (bedarf) {
            bedarfe.push(bedarf);
            addToAusgleichsDienstgruppe(bb, i === l);
            if (bb.tag < start || bb.tag > end) {
              const tagKey = bb.tag.toISOString();
              bedarfeTageOutSideInterval[tagKey] ||= [];
              bedarfeTageOutSideInterval[tagKey].push(bb.po_dienst_id);
            }
          }
          acc.push({
            Tag: bb.tag,
            Dienst: bb.po_dienst_id,
            Bereich: bb.bereich_id
          });
          return acc;
        }, []),
        AnzahlAusgleichstage: firstBedarf.ausgleich_tage || 0
      });
    });
  });

  return { bedarfe, bloecke, bedarfeTageOutSideInterval, uberschneidungSchichten, ausgleichsdienstgruppen };
}

async function getFixedEinteilungen(start: Date, end: Date, bedarfeTageOutSideInterval: Record<string, number[]>) {
  const fixedEinteilungen = await prismaDb.diensteinteilungs.findMany({
    where: {
      OR: [
        {
          tag: {
            gte: start,
            lte: end
          }
        },
        ...Object.entries(bedarfeTageOutSideInterval).map(([tag, dienste]) => ({
          tag: tag,
          po_dienst_id: {
            in: dienste
          }
        }))
      ],
      einteilungsstatuses: {
        counts: true
      }
    }
  });
  return fixedEinteilungen;
}

async function getData(start: Date, end: Date) {
  const relevantTeams = await prismaDb.teams.findMany({
    where: {
      name: { in: ['OP Team'] }
    }
  });
  const relevantTeamIds = relevantTeams.map((t) => t.id);
  const mitarbeiter = await prismaDb.mitarbeiters.findMany(getFraunhoferMitarbeiter(start, end, relevantTeamIds));
  const dienste = await prismaDb.po_diensts.findMany({
    where: {
      team_id: { in: relevantTeamIds }
    }
  });

  const kontingente = await prismaDb.kontingents.findMany();
  const dienstkategorien = await prismaDb.dienstkategories.findMany({
    include: {
      dienstkategoriethemas: true
    }
  });
  const themen = await prismaDb.themas.findMany();

  return {
    mitarbeiter,
    dienste,
    kontingente,
    dienstkategorien,
    themen
  };
}

function createKombibedarfe(
  tag: string,
  key1: string,
  key2: string,
  typ: 'Aus schwacher Konflikt' | 'Aus Dienstgruppen-Forderung',
  id: number
): Kombibedarf {
  const date = newDate(tag);
  const [dienst1, bereich1] = key1.split('_').map(Number);
  const [dienst2, bereich2] = key2.split('_').map(Number);
  return {
    ID: id,
    Name: `${tag} ${key1} ${key2} ${typ}`,
    Bedarfe: [
      {
        Tag: date,
        Dienst: dienst1,
        Bereich: bereich1
      },
      {
        Tag: date,
        Dienst: dienst2,
        Bereich: bereich2
      }
    ]
  };
}

function getUeberschneidung(
  schicht1: UeberschneidungSchicht,
  schicht2: UeberschneidungSchicht,
  onlyArbeitszeiten = false
) {
  const isFrei1 = !schicht1.isArbeitszeit && !schicht1.isDienstzeit;
  const isFrei2 = !schicht2.isArbeitszeit && !schicht2.isDienstzeit;
  // Only Arbeitszeiten -> Keine Überschneidung möglich, wenn eine von beiden Schichten Frei ist
  // !Only Arbeitszeiten -> Keine Überschneidung zwischen zwei Frei Schichten
  const ignore = onlyArbeitszeiten ? isFrei1 || isFrei2 : isFrei1 && isFrei2;
  if (ignore) return 0;
  const timeA = schicht1.anfang.getTime();
  const timeE = schicht1.ende.getTime();
  const timeA2 = schicht2.anfang.getTime();
  const timeE2 = schicht2.ende.getTime();
  // Überschneidung, wenn alle times > 0
  const times = [timeE - timeA, timeE2 - timeA, timeE - timeA2, timeE2 - timeA2];
  const min = Math.min(...times.map((t) => (t < 0 ? 0 : t))) / 60000;
  return min;
}

export async function isValidFraunhoferRequest(clientId: string, clientSecret: string) {
  const isValid = await prismaDb.oauth_applications.findFirst({
    where: {
      name: 'Fraunhofer',
      uid: clientId,
      secret: clientSecret
    }
  });
  return !!isValid;
}

const MAX_BEREITSCHAFTSDIENSTE = 7;

export async function getFraunhoferPlanData(
  start: Date,
  end: Date,
  client_id: string,
  client_secret: string
): Promise<PlanData> {
  const result: PlanData = { ...defaultPlanData };

  const isValid = await isValidFraunhoferRequest(client_id, client_secret);
  if (!isValid) {
    result.msg = 'Nicht authorisiert!';
    return result;
  }

  if (!start.getTime() || !end.getTime() || start > end) {
    result.msg = 'Ungültige Zeitspanne!';
    return result;
  }

  try {
    const { dienstplaene, tage } = await getDienstplanPerMonth(start, end);
    if (!dienstplaene.length) {
      result.msg = 'Dienstpläne existieren noch nicht!';
      return result;
    }

    const { mitarbeiter, dienste, kontingente, dienstkategorien, themen } = await getData(start, end);

    const { diensteArr, freigabetypenDienste, dienstkategorieDienste, nachtdienste } = createDiensteAndMapInfos(
      dienste,
      mapThemenToDienstTypen(themen),
      dienstkategorien,
      themen
    );

    result.Dienste = diensteArr;

    const { bedarfe, bloecke, bedarfeTageOutSideInterval, uberschneidungSchichten, ausgleichsdienstgruppen } =
      getBedarfeAndBloecke(dienstplaene, start, end, nachtdienste);

    const fixedEinteilungen = await getFixedEinteilungen(start, end, bedarfeTageOutSideInterval);

    result.Bedarfe = bedarfe;
    result.Bedarfsblöcke = bloecke;
    result.Ausgleichsdienste = Object.values(ausgleichsdienstgruppen);

    Object.entries(uberschneidungSchichten).forEach(([tag, dienstObj]) => {
      const parallel = new Set<string>();
      // Kombidienste anhand der Dienstgruppenforderung suchen
      // und mögliche Kombidienste über weak_parallel_conflict sammeln
      Object.entries(dienstObj).forEach(([dienstId, bereichObj]) => {
        Object.entries(bereichObj).forEach(([bereichId, schichten]) => {
          const firstSchicht = schichten[0];
          const dienst = firstSchicht?.dienst;
          const fordertDienstgruppe = firstSchicht?.diensteIds?.length;
          if (fordertDienstgruppe && schichten.length > 1) {
            firstSchicht.diensteIds.forEach((dId) => {
              if (`${dId}` === dienstId) return;
              const dienstToCheck = dienstObj[dId];
              if (!dienstToCheck) return;
              Object.entries(dienstToCheck).forEach(([bId, schichtenToCheck]) => {
                // Wenn der Dienstfreizeitraum sich mit einer Arbeitszeit/Dienstzeit Schicht überschneidet, dann kann es eine Kombi sein.
                const possibleKombi = schichtenToCheck.find((s) => getUeberschneidung(firstSchicht, s, true) > 0);
                if (!possibleKombi) return;
                let ueberschneidung = 0;
                // Falls sich Schichten mehr als die akzeptierte Ueberschneidung überschneiden, dann ist es keine Kombi
                schichten.find((s, i) => {
                  if (i === 0) return false;
                  return schichtenToCheck.find((ls) => {
                    ueberschneidung += getUeberschneidung(s, ls, false);
                    return ueberschneidung > firstSchicht.acceptedUeberschneidung;
                  });
                });
                if (ueberschneidung > firstSchicht.acceptedUeberschneidung) return;
                result.Kombibedarfe.push(
                  createKombibedarfe(
                    tag,
                    `${dienstId}_${bereichId}`,
                    `${dId}_${bId}`,
                    'Aus Dienstgruppen-Forderung',
                    result.Kombibedarfe.length
                  )
                );
              });
            });
          } else if (dienst?.weak_parallel_conflict) {
            parallel.add(`${dienstId}_${bereichId}`);
          }
        });
      });

      // Mögliche Kombidienste gelten nur, wenn es keine konfliktreichen Überschneidungen gibt
      const parallelArr = Array.from(parallel);
      const l = parallelArr.length;
      parallelArr.forEach((key1, i) => {
        const [dienstId, bereichId] = key1.split('_');
        const schichten1 = dienstObj[Number(dienstId)][Number(bereichId)];
        for (let j = i + 1; j < l; j++) {
          const key2 = parallelArr[j];
          const [dienstId, bereichId] = key2.split('_');
          const schichten2 = dienstObj[Number(dienstId)][Number(bereichId)];
          const hasUeberschneidung = schichten1.find((s) => {
            return schichten2.find((ls) => getUeberschneidung(s, ls) > 0, false);
          });
          if (hasUeberschneidung) continue;
          result.Kombibedarfe.push(
            createKombibedarfe(tag, key1, key2, 'Aus schwacher Konflikt', result.Kombibedarfe.length)
          );
        }
      });
    });

    result.AuslgeichsfreiDienstID =
      (
        await prismaDb.po_diensts.findFirst({
          select: { id: true },
          where: { name: 'Ausgleichsfrei' }
        })
      )?.id || 0;

    result.FixierteEinteilungen = fixedEinteilungen.reduce((acc: Einteilung[], e) => {
      if (e.mitarbeiter_id && e.po_dienst_id && e.tag) {
        acc.push({
          MitarbeiterID: e.mitarbeiter_id,
          DienstID: e.po_dienst_id,
          Tag: e.tag,
          BereichID: e.bereich_id
        });
      }
      return acc;
    }, []);

    result.Rotationen = kontingente.reduce((acc: Rotation[], k) => {
      acc.push({
        ID: k.id,
        Name: k.name || '',
        Dienste: dienste.reduce((acc: number[], d) => {
          if (d.thema_ids.find((t) => k.thema_ids.includes(t))) acc.push(d.id);
          return acc;
        }, [])
      });
      return acc;
    }, []);

    // KombibedarfAusschlüsse könnten wir über eine Befragung für O1 Tag/Nacht lösen.
    result.Mitarbeiter = mitarbeiter.map((m) => ({
      ID: m.id,
      Name: `Mitarbeiter ${m.id}`,
      Freigaben: getMitarbeiterFreigaben(m.dienstfreigabes, freigabetypenDienste, tage),
      KombibedarfAusschlüsse: [],
      Rotationen: getMitarbeiterRotationen(m.einteilung_rotations, tage),
      Arbeitszeit: tage.map((tag) => ({ Tag: tag, ArbeitszeitInMinuten: getArbeitszeitInMinutenAm(m, tag) })),
      Präferenzen: getPraeferenzen(m.dienstratings, result.MinPräferenz, result.MaxPräferenz),
      MaximaleAnzahlBereitschaftsdienste: MAX_BEREITSCHAFTSDIENSTE,
      ...getMitarbeiterWuensche(m.dienstwunsches, dienstkategorieDienste)
    }));
  } catch (error) {
    console.error('Error in getFraunhoferPlanData:', error);
    return { ...defaultPlanData, msg: 'Es gab einen Fehler beim Laden der Daten!' };
  }

  // Write Response in JSON-File
  // await fs.writeFile('fraunhoferPlanData.json', JSON.stringify(result, null, 2), 'utf8');
  return result;
}

export async function createFraunhoferPlan(body: FraunhoferNewPlan): Promise<{
  msg: string;
  updated: boolean;
}> {
  const result = {
    msg: 'Plan konnte nicht erstellt werden!\n',
    updated: false
  };

  const isValid = await isValidFraunhoferRequest(body?.client_id || '', body?.client_secret || '');
  if (!isValid) {
    result.msg = 'Nicht authorisiert!\n';
    return result;
  }

  try {
    result.msg = '';
    if (typeof body.Name !== 'string' || !body.Name.trim()) {
      result.msg = 'Name muss ein String sein!\n';
      return result;
    }
    const name = body.Name.trim();
    let beschreibung = typeof body.Beschreibung === 'string' ? body.Beschreibung : '';
    beschreibung += ' (Fraunhofer Plan)';
    beschreibung = beschreibung.trim();
    const parameter = typeof body.Parameter === 'string' ? body.Parameter.trim() : '';
    const einteilungen = Array.isArray(body.Einteilungen) ? body.Einteilungen : [];

    const dienstplanStatusVorschlagId =
      (
        await prismaDb.dienstplanstatuses.findFirst({
          select: { id: true },
          where: { name: 'Vorschlag' }
        })
      )?.id || 0;

    if (!dienstplanStatusVorschlagId) {
      result.msg = 'Dienstplanstatus Vorschlag nicht gefunden!\n';
      return result;
    }

    const einteilungsstatusVorschlagId =
      (
        await prismaDb.einteilungsstatuses.findFirst({
          select: { id: true },
          where: { name: 'Vorschlag', public: false, counts: false }
        })
      )?.id || 0;
    if (!einteilungsstatusVorschlagId) {
      result.msg = 'Einteilungsstatus Vorschlag nicht gefunden!\n';
      return result;
    }

    const einteilungskontextAutoId =
      (
        await prismaDb.einteilungskontexts.findFirst({
          select: { id: true },
          where: {
            name: 'Auto'
          }
        })
      )?.id || 0;
    if (!einteilungskontextAutoId) {
      result.msg = 'Einteilungskontext Auto nicht gefunden!\n';
      return result;
    }

    const parametersetId = (await prismaDb.parametersets.findFirst({ select: { id: true } }))?.id || 0;
    if (!parametersetId) {
      result.msg = 'Parameterset nicht gefunden!\n';
      return result;
    }

    const mitarbeiterHash = (await prismaDb.mitarbeiters.findMany({ select: { id: true } })).reduce(
      (acc: Record<number, boolean>, m) => {
        acc[m.id] = true;
        return acc;
      },
      {}
    );

    const relevantTeamIds = (
      await prismaDb.teams.findMany({
        where: {
          name: { in: ['OP Team'] }
        }
      })
    ).map((t) => t.id);

    const diensteHash = (
      await prismaDb.po_diensts.findMany({
        select: { id: true },
        where: {
          team_id: { in: relevantTeamIds }
        }
      })
    ).reduce((acc: Record<number, boolean>, d) => {
      acc[d.id] = true;
      return acc;
    }, {});

    const bereicheHash = (
      await prismaDb.bereiches.findMany({
        select: { id: true }
      })
    ).reduce((acc: Record<number, boolean>, b) => {
      acc[b.id] = true;
      return acc;
    }, {});

    const dates: Record<
      string,
      {
        start: Date;
        end: Date;
        einteilungen: Einteilung[];
      }
    > = {};

    const fileteredEinteilungen = einteilungen.filter((e) => {
      const tag = newDate(e.Tag);
      if (e.BereichID === 0) e.BereichID = null;
      const validBereich = e.BereichID ? bereicheHash[e.BereichID] : true;
      // zusätzlich Bedarfe und Team testen (OP Team)
      const validateMsg = [
        !tag.getTime() ? ' Ungültiges Datum ' : '',
        !mitarbeiterHash[e.MitarbeiterID] ? ' Ungültiger Mitarbeiter ' : '',
        !diensteHash[e.DienstID] ? ' Ungültiger Dienst ' : '',
        !validBereich ? ' Ungültiger Bereich ' : ''
      ]
        .join('')
        .trim();
      if (validateMsg) {
        result.msg += `Einteilung (${Object.entries(e)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ')}: ${validateMsg})!\n`;
        return false;
      }
      e.Tag = tag;

      const [year, month] = [tag.getFullYear(), tag.getMonth()];
      const monthYear = tag.toISOString().split('T')[0];
      if (dates[monthYear]) {
        dates[monthYear].einteilungen.push(e);
        return true;
      }

      const start = newDateYearMonthDay(year, month, 1);
      const end = newDateYearMonthDay(year, month + 1, 0);
      dates[monthYear] = {
        start,
        end,
        einteilungen: [e]
      };

      return true;
    });

    if (!fileteredEinteilungen.length) {
      result.msg += 'Keine gültigen Einteilungen vorhanden!\n';
      return result;
    }

    for (const monthYear in dates) {
      const { start, end, einteilungen } = dates[monthYear];
      const dienstplanBedarfId =
        (
          await prismaDb.dienstplanbedarves.findFirst({
            select: { id: true },
            where: {
              anfang: { lte: start },
              ende: { gte: end }
            }
          })
        )?.id || 0;
      if (!dienstplanBedarfId) {
        result.msg += `Keine Bedarf für ${start.toLocaleDateString('de-De')} - ${end.toLocaleDateString(
          'de-De'
        )} gefunden!\n`;
        continue;
      }
      const dienstplan = await prismaDb.dienstplans.create({
        data: {
          name,
          beschreibung,
          parameter,
          created_at: newDate(),
          updated_at: newDate(),
          parameterset_id: parametersetId,
          dienstplanstatus_id: dienstplanStatusVorschlagId,
          dienstplanbedarf_id: dienstplanBedarfId
        }
      });
      const dienstplanId = dienstplan.id;
      if (!dienstplanId) {
        result.msg += `Fehler beim Erstellen des Plans für ${monthYear}!\n`;
        continue;
      }

      await prismaDb.diensteinteilungs.createMany({
        data: einteilungen.map((e) => ({
          tag: e.Tag,
          mitarbeiter_id: e.MitarbeiterID,
          po_dienst_id: e.DienstID,
          bereich_id: e.BereichID,
          dienstplan_id: dienstplanId,
          einteilungsstatus_id: einteilungsstatusVorschlagId,
          schicht_nummern: [0],
          is_optional: false,
          einteilungskontext_id: einteilungskontextAutoId,
          created_at: newDate(),
          updated_at: newDate(),
          reason: 'Fraunhofer Plan'
        }))
      });
    }

    result.updated = true;
  } catch (error) {
    console.error('Error in createFraunhoferPlan:', error);
    result.msg = 'Fehler beim Erstellen des Plans!';
    result.updated = false;
  }

  return result;
}
