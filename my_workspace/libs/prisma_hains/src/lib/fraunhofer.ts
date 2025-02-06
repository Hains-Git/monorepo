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
  PlanData,
  Präferenz,
  Rotation,
  Rotationszuweisung,
  Wunsch
} from './utils/fraunhofer_types';

const defaultPlanData: PlanData = {
  Mitarbeiter: [],
  Dienste: [],
  Kombidienste: [],
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
  } & dienstkategories)[]
) {
  return dienste.reduce(
    (
      acc: {
        diensteArr: Dienst[];
        freigabetypenDienste: FreigabetypenDienste;
        dienstkategorieDienste: DienstkategorieDienste;
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
          return d.thema_ids.find((t) => ids.includes(t));
        })?.[0] as DienstTyp) || 'Frei';

      // Map Dienste to Dienstkategorien
      dienstkategorien.forEach((dk) => {
        const hasThemen = d.thema_ids.find((t) => dk.dienstkategoriethemas.find((dt) => dt.thema_id === t));
        if (!hasThemen) return;
        acc.dienstkategorieDienste[dk.id] ||= [];
        acc.dienstkategorieDienste[dk.id].push(d.id);
      });

      // Add Dienst to DiensteArr
      acc.diensteArr.push({
        ID: d.id,
        Name: d.planname || '',
        Typ: typ,
        IstRelevantFürDoppelWhopper: false
      });
      return acc;
    },
    {
      diensteArr: [],
      freigabetypenDienste: {},
      dienstkategorieDienste: {}
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
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const date = new Date(d);
    tage.push(date);
    const [year, month] = [date.getFullYear(), date.getMonth()];
    // 12 Uhr mittags, damit es keine Probleme mit der Zeitzone gibt
    const firstDayStr = new Date(year, month, 1, 12).toISOString();
    months[firstDayStr] ||= new Date(year, month + 1, 0, 12).toISOString();
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
        ...wherePlanBedarfIn(new Date(monthStart), new Date(monthEnd)),
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
  if (!dienst) {
    console.error('No Dienst found for BedarfsEintrag:', bedarfsEintrag);
    return {
      arbeitszeitInMinuten: 0,
      wochenende,
      bereitschaft
    };
  }

  if (bedarfsEintrag.tag) wochenende = [0, 6].includes(bedarfsEintrag.tag.getDay());
  const dienstId = bedarfsEintrag.po_dienst_id || 0;
  const bereichId = bedarfsEintrag.bereich_id || 0;

  const checkPreDienstgruppen = !bedarfsEintrag.is_block || bedarfsEintrag.id === bedarfsEintrag.first_entry;
  const arbeitszeitverteilung = bedarfsEintrag.dienstbedarves?.arbeitszeitverteilungs;

  const addSchichtToSammlung = (schicht: UeberschneidungSchicht, tag: string) => {
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
    const anfangTag = s.anfang.toISOString().split('T')[0];
    const endeTag = s.ende.toISOString().split('T')[0];

    const ueberschneidungSchicht: UeberschneidungSchicht = {
      anfang: s.anfang,
      ende: s.ende,
      acceptedUeberschneidung: 0,
      isArbeitszeit: !!azt?.arbeitszeit,
      isDienstzeit: !!azt?.dienstzeit,
      diensteIds: [],
      dienst
    };
    addSchichtToSammlung(ueberschneidungSchicht, anfangTag);
    if (anfangTag !== endeTag) {
      addSchichtToSammlung(ueberschneidungSchicht, endeTag);
    }

    // Dienstgruppen Forderung überprüfen und DienstgruppenZeitraum hinzufügen
    if (checkPreDienstgruppen && i === 0 && arbeitszeitverteilung) {
      const preDienstgruppe = arbeitszeitverteilung?.pre_dienstgruppes;
      const preDienstgruppeStd = Number(arbeitszeitverteilung?.pre_std || 0);
      if (preDienstgruppe?.dienste?.length && preDienstgruppeStd) {
        const preSchichtAnfang = new Date(s.anfang.getTime() - preDienstgruppeStd * 3600000);
        const preSchichtAnfangTag = preSchichtAnfang.toISOString().split('T')[0];
        addSchichtToSammlung(
          {
            anfang: preSchichtAnfang,
            ende: s.anfang,
            acceptedUeberschneidung: arbeitszeitverteilung?.pre_ueberschneidung_minuten || 0,
            isArbeitszeit: false,
            isDienstzeit: true,
            diensteIds: preDienstgruppe.dienste,
            dienst
          },
          preSchichtAnfangTag
        );
      }
    }

    // Calculate Arbeitzeit and check if is Wochenenddienst
    // Wochenende: (Start Mo < 5:00 or Ende Fr > 21:00)
    if (azt?.arbeitszeit && s.arbeitszeit) {
      acc += s.arbeitszeit;
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

function getBedarfeAndBloecke(dienstplaene: DienstPlan[], start: Date, end: Date) {
  const bedarfe: Bedarf[] = [];
  const bloecke: Bedarfsblock[] = [];
  const addedBloecke: Record<number, boolean> = {};
  const addedBedarfe: Record<string, Record<string, MainBedarfsEintrag>> = {};
  const bedarfeTageOutSideInterval: Record<string, number[]> = {};
  const uberschneidungSchichten: UeberschneidungSchichtenSammlung = {};

  dienstplaene.forEach((dpl) => {
    if (!dpl?.dienstplanbedarves?.bedarfs_eintrags) return;
    dpl.dienstplanbedarves.bedarfs_eintrags.forEach((be) => {
      if (!be.tag) return;
      const firstBedarf = be.first_bedarf;
      const isBlock = firstBedarf && firstBedarf.block_bedarfe.length > 1;
      if (!isBlock) {
        const bedarf = checkBedarf(be, addedBedarfe, uberschneidungSchichten);
        if (bedarf) bedarfe.push(bedarf);
        return;
      }
      addedBloecke[firstBedarf.id] = true;
      bloecke.push({
        Einträge: firstBedarf.block_bedarfe.reduce((acc: BedarfsID[], bb) => {
          if (!bb.tag || !bb.po_dienst_id || !bb.bereich_id) return acc;
          const bedarf = checkBedarf(bb, addedBedarfe, uberschneidungSchichten);
          if (bedarf) {
            bedarfe.push(bedarf);
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

  return { bedarfe, bloecke, bedarfeTageOutSideInterval, uberschneidungSchichten };
}

async function getData(start: Date, end: Date, bedarfeTageOutSideInterval: Record<string, number[]>) {
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

  return {
    mitarbeiter,
    dienste,
    kontingente,
    dienstkategorien,
    themen,
    fixedEinteilungen
  };
}

const MAX_BEREITSCHAFTSDIENSTE = 7;

export async function getFraunhoferPlanData(start: Date, end: Date): Promise<PlanData> {
  const result: PlanData = { ...defaultPlanData };

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

    const { bedarfe, bloecke, bedarfeTageOutSideInterval, uberschneidungSchichten } = getBedarfeAndBloecke(
      dienstplaene,
      start,
      end
    );
    result.Bedarfe = bedarfe;
    result.Bedarfsblöcke = bloecke;

    Object.entries(uberschneidungSchichten).forEach(([tag, dienstObj]) => {
      const parallel = new Set<string>();
      // Kombidienste anhand der Dienstgruppenforderung suchen
      // und mögliche Kombidienste über weak_parallel_conflict sammeln
      Object.entries(dienstObj).forEach(([dienstId, bereichObj]) => {
        Object.entries(bereichObj).forEach(([bereichId, schichten]) => {
          const firstSchicht = schichten[0];
          const dienst = firstSchicht?.dienst;
          const fordertDienstgruppe = firstSchicht?.diensteIds?.length;
          if (fordertDienstgruppe) {
            // Add mögliche Dienste aus Dienstgruppe (ohne Überschneidungen, außer acceptedUeberschneidung)
            // Nur Bedarfe im Zeitraum der entsprechenden Forderung
            // und nur mit akzeptierter Überschneidung gelten als Kombidienste
          } else if (dienst?.weak_parallel_conflict) {
            parallel.add(`${dienstId}_${bereichId}`);
          }
        });
      });

      // Mögliche Kombidienste gelten nur, wenn es keine konfliktreichen Überschneidungen gibt
      const parallelArr = Array.from(parallel);
      parallelArr.forEach((key1, i) => {
        const [dienstId, bereichId] = key1.split('_');
        const schichten1 = dienstObj[Number(dienstId)][Number(bereichId)];
        parallelArr.forEach((key2) => {
        if(key1 === key2) return;
        const [dienstId, bereichId] = key2.split('_');
        const schichten2 = dienstObj[Number(dienstId)][Number(bereichId)];
        schichten1.find((s) => {
          return schichten2.find((ls) => {
            // Falls es eine Überschneidung gibt, soll ein True zurückgegeben werden
            // Und ein Kombidienst erstellt werden
            return true;
          });
        });
      });
    });

    const { mitarbeiter, dienste, kontingente, dienstkategorien, themen, fixedEinteilungen } = await getData(
      start,
      end,
      bedarfeTageOutSideInterval
    );

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
          Tag: e.tag
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

    const { diensteArr, freigabetypenDienste, dienstkategorieDienste } = createDiensteAndMapInfos(
      dienste,
      mapThemenToDienstTypen(themen),
      dienstkategorien
    );

    result.Dienste = diensteArr;

    result.Mitarbeiter = mitarbeiter.map((m) => ({
      ID: m.id,
      Name: m.planname || '',
      Freigaben: getMitarbeiterFreigaben(m.dienstfreigabes, freigabetypenDienste, tage),
      KombidienstAusschlüsse: [],
      Rotationen: getMitarbeiterRotationen(m.einteilung_rotations, tage),
      Arbeitszeit: tage.map((tag) => ({ Tag: tag, ArbeitszeitInMinuten: getArbeitszeitInMinutenAm(m, tag) })),
      Präferenzen: getPraeferenzen(m.dienstratings, result.MinPräferenz, result.MaxPräferenz),
      MaximaleAzahlBereitschaftsdienste: MAX_BEREITSCHAFTSDIENSTE,
      ...getMitarbeiterWuensche(m.dienstwunsches, dienstkategorieDienste)
    }));
  } catch (error) {
    console.error('Error in getFraunhoferPlanData:', error);
    return { ...defaultPlanData, msg: 'Es gab einen Fehler beim Laden der Daten!' };
  }

  return result;
}

export async function createFraunhoferPlan(body: FraunhoferNewPlan): Promise<{
  msg: string;
  updated: boolean;
}> {
  const result = {
    msg: 'Plan konnte nicht erstellt werden!',
    updated: false
  };
  try {
  } catch (error) {
    console.error('Error in createFraunhoferPlan:', error);
    result.msg = 'Fehler beim Erstellen des Plans!';
    result.updated = false;
  }

  return result;
}
