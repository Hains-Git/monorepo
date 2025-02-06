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
    if (name.includes('versetzter dienst') && name.indexOf('kein') !== 0) {
      key = 'VersetzterDienst';
    } else if (name.includes('langer dienst') && name.indexOf('kein') !== 0) {
      key = 'LangerDienst';
    } else if (name.includes('nachtdienst') && name.indexOf('kein') !== 0) {
      key = 'Nachtdienst';
    } else if (name.includes('frühdienst') && name.indexOf('kein') !== 0) {
      key = 'Frühdienst';
    } else if (name.includes('rufdienst') && name.indexOf('kein') !== 0) {
      key = 'Rufdienst';
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

function calculateBedarfArbeitszeit(key = '', schichten: Schicht[], isWochenende = false) {
  let wochenende = isWochenende;
  let bereitschaft = false;
  const arbeitszeitInMinuten = schichten.reduce((acc: number, s) => {
    if (!s.anfang || !s.ende) return acc;
    const azt = s.arbeitszeittyps;
    if (azt?.bereitschaft) bereitschaft = true;
    if (azt?.arbeitszeit && s.arbeitszeit) {
      if (!wochenende && azt?.dienstzeit) {
        const beginsMondayBeforeFive = s.anfang.getDay() === 1 && s.anfang.getHours() < 5;
        const endTime = s.ende.toTimeString().split(' ')[0];
        const endTimeAsNumber = parseInt(endTime.split(':').join(''), 10);
        const endsFridayAfterNine = s.ende.getDay() === 5 && endTimeAsNumber > 210000;
        wochenende = beginsMondayBeforeFive || endsFridayAfterNine;
      }
      return acc + s.arbeitszeit;
    }
    return acc;
  }, 0);
  return {
    arbeitszeitInMinuten,
    wochenende,
    bereitschaft
  };
}

function createBedarf(bedarfsEintrag: MainBedarfsEintrag): Bedarf | null {
  if (!bedarfsEintrag.tag || !bedarfsEintrag.po_dienst_id || !bedarfsEintrag.bereich_id) return null;
  const wochentag = bedarfsEintrag.tag.getDay();
  let istWochenendEinteilung = wochentag === 0 || wochentag === 6;
  const { arbeitszeitInMinuten, wochenende, bereitschaft } = calculateBedarfArbeitszeit(
    `${bedarfsEintrag.po_dienst_id}_${bedarfsEintrag.bereich_id}`,
    bedarfsEintrag.schichts,
    istWochenendEinteilung
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
    IstWochenendEinteilung: istWochenendEinteilung || wochenende
  };
}

function checkBedarf(be: MainBedarfsEintrag, addedBedarfe: Record<string, Record<string, MainBedarfsEintrag>> = {}) {
  if (!be.tag || !be.po_dienst_id) return;
  const tagKey = be.tag.toISOString();
  const key = `${be.po_dienst_id}_${be.bereich_id}`;
  addedBedarfe[tagKey] ||= {};
  if (addedBedarfe[tagKey][key]) return;
  const bedarf = createBedarf(be);
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

  dienstplaene.forEach((dpl) => {
    if (!dpl?.dienstplanbedarves?.bedarfs_eintrags) return;
    dpl.dienstplanbedarves.bedarfs_eintrags.forEach((be) => {
      if (!be.tag) return;
      const firstBedarf = be.first_bedarf;
      const isBlock = firstBedarf && firstBedarf.block_bedarfe.length > 1;
      if (!isBlock) {
        const bedarf = checkBedarf(be, addedBedarfe);
        if (bedarf) bedarfe.push(bedarf);
        return;
      }
      addedBloecke[firstBedarf.id] = true;
      const lastBedarf = firstBedarf.block_bedarfe[firstBedarf.block_bedarfe.length - 1];
      bloecke.push({
        Einträge: firstBedarf.block_bedarfe.reduce((acc: BedarfsID[], bb) => {
          if (!bb.tag || !bb.po_dienst_id || !bb.bereich_id) return acc;
          const bedarf = checkBedarf(bb, addedBedarfe);
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
  return { bedarfe, bloecke, bedarfeTageOutSideInterval };
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

    const { bedarfe, bloecke, bedarfeTageOutSideInterval } = getBedarfeAndBloecke(dienstplaene, start, end);
    result.Bedarfe = bedarfe;
    result.Bedarfsblöcke = bloecke;

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
