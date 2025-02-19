import { dienstplans, parametersets, planparameters } from '@prisma/client';

import {
  format,
  lastDayOfMonth,
  addDays,
  getWeek,
  getYear,
  isTuesday,
  setISODay,
  setISOWeek,
  startOfYear,
  subDays
} from 'date-fns';

import { PlanerDate } from './planerdate/planerdate';

import { processData, mapIdToKeys, newDateYearMonthDay, newDate } from '@my-workspace/utils';
import { planungsInfoGetAll } from './planungsinfo';

import {
  getAllPoDiensts,
  getDiensteinteilungInRange,
  getMitarbeitersByCustomQuery,
  getZeitraumKategoriesInRange,
  getAllDienstkategories,
  getDienstWuenscheInRange,
  getRotationenInRange,
  getRotationenByKontingentFlag,
  getBedarfseintragByDienstplanBedarfId,
  getSchichtenByDienstplanbedarfId,
  getDienstbedarfCustomQuery,
  findFirstKalernderWoche,
  createKalenderWoche,
  getWochenbilanzByKalenderWocheForMitarbeiters,
  getAllKontingents,
  getDienstplanById,
  checkWeek,
  getZeitraumkategorienInterval
} from '@my-workspace/prisma_cruds';

type Dienstplan = {
  parametersets:
    | ({
        planparameters: planparameters[];
      } & parametersets)
    | null;
} & dienstplans;

function getDataByHash(data: any, key = 'id') {
  return data.reduce((hash: any, value: any) => {
    hash[value[key]] = value;
    return hash;
  }, {});
}

function getInterSectionArrays(firstArr: any[], secondArr: any[]) {
  return firstArr.filter((id: any) => secondArr.includes(id));
}

function check_anfang_ende(dienstplan: Dienstplan) {
  let anfang = dienstplan?.anfang ? dienstplan.anfang : newDate();
  let ende = dienstplan.ende;
  const startOfNextMonth = newDateYearMonthDay(anfang.getFullYear(), anfang.getMonth() + 1, 1);
  if (anfang.getDate() !== 1) {
    anfang = startOfNextMonth;
  }
  ende = lastDayOfMonth(anfang);
  return { anfang, ende };
}

function get_dpl_anfang_ende(dienstplan: Dienstplan) {
  const { anfang, ende } = check_anfang_ende(dienstplan);
  const relevant_timeframe_size = dienstplan?.parametersets?.planparameters?.[0]?.relevant_timeframe_size;
  const anfang_frame = subDays(anfang, relevant_timeframe_size || 0);
  const ende_frame = addDays(ende, relevant_timeframe_size || 0);
  return {
    anfang,
    ende,
    anfang_frame,
    ende_frame
  };
}

function dateCommercial(year: number, week: number, day: number): Date {
  // Start with the beginning of the specified year
  let date = startOfYear(newDateYearMonthDay(year, 0, 1));

  // Set the ISO week
  date = setISOWeek(date, week);

  // Set the day of the week (1-7, where 1 is Monday and 7 is Sunday)
  date = setISODay(date, day);

  // Ensure we're in the correct year
  if (getYear(date) !== year) {
    date = setISOWeek(newDateYearMonthDay(year, 11, 31), week);
    date = setISODay(date, day);
  }

  return date;
}

async function getZeitraumkategorien(anfang: Date, ende: Date) {
  const zeitraumkategorien = await getZeitraumKategoriesInRange(anfang, ende);
  return zeitraumkategorien;
}

async function getEinteilungen(id: number, windowAnfang: Date, windowEnde: Date) {
  const einteilungen = await getDiensteinteilungInRange(windowAnfang, windowEnde, {
    tag: {
      gte: windowAnfang,
      lte: windowEnde
    },
    OR: [
      {
        dienstplan_id: id,
        einteilungsstatuses: {
          vorschlag: true
        }
      },
      {
        einteilungsstatuses: {
          counts: true
        }
      }
    ],
    mitarbeiters: {
      OR: [
        {
          platzhalter: false
        },
        {
          platzhalter: true,
          aktiv: true
        }
      ]
    }
  });
  return getDataByHash(einteilungen);
}

async function getPoDienste(compute = true) {
  const dienste = await getAllPoDiensts();
  return getDataByHash(dienste);
}

async function getMitarbeiters(compute = true, as_ids = false) {
  const mitarbeiter = as_ids
    ? await getMitarbeitersByCustomQuery({
        where: {
          OR: [
            {
              platzhalter: false
            },
            {
              platzhalter: true,
              aktiv: true
            }
          ]
        },
        select: {
          id: true
        },
        orderBy: {
          planname: 'asc'
        }
      })
    : await getMitarbeitersByCustomQuery({
        where: {
          OR: [
            {
              platzhalter: false
            },
            {
              platzhalter: true,
              aktiv: true
            }
          ]
        },
        include: {
          account_info: true,
          dienstratings: true,
          vertrags: true
        },
        orderBy: {
          planname: 'asc'
        }
      });
  return as_ids ? mitarbeiter.map((item) => item.id) : getDataByHash(mitarbeiter);
}

async function getDienstkategories() {
  const dienstkategories = await getAllDienstkategories({
    dienstkategoriethemas: true
  });
  return getDataByHash(dienstkategories);
}

async function getWuensche(windowAnfang: Date, windowEnde: Date) {
  const wuensche = await getDienstWuenscheInRange(windowAnfang, windowEnde, {
    mitarbeiters: true
  });
  return getDataByHash(wuensche);
}

async function getRotationen(anfang: Date, ende: Date) {
  const rotationen = await getRotationenInRange(anfang, ende, {
    kontingents: {
      include: {
        teams: true
      }
    },
    mitarbeiters: {
      include: {
        vertrags: {
          include: {
            vertragstyps: {
              include: {
                vertragsgruppes: true
              }
            },
            vertrags_phases: true
          }
        }
      }
    }
  });
  return rotationen;
}

async function getAllRotationenByKontingentFlag() {
  const rotationen = await getRotationenByKontingentFlag();
  return rotationen;
}

async function getBedarfe(dienstplanbedarf_id: number) {
  const bedarfsEintraege = await getBedarfseintragByDienstplanBedarfId(dienstplanbedarf_id);
  return getDataByHash(bedarfsEintraege);
}

async function getSchichten(dienstplanbedarf_id: number) {
  const schichten = await getSchichtenByDienstplanbedarfId(dienstplanbedarf_id);
  return schichten.reduce((hash: any, value: any) => {
    const key = String(value?.bedarfs_eintrag_id) || 0;
    hash[key] = hash[key] || [];
    hash[key].push(value);
    return hash;
  }, {});
}

async function getDienstbedarfe(anfang: Date, ende: Date) {
  const dienstbedarfe = await getDienstbedarfCustomQuery({
    where: {
      OR: [{ end_date: { gt: anfang } }, { end_date: null }],
      zeitraumkategories: getZeitraumkategorienInterval(anfang, ende)
    },
    orderBy: [{ po_diensts: { order: 'asc' } }, { bereich_id: 'asc' }, { zeitraumkategories: { prio: 'asc' } }]
  });
  return getDataByHash(dienstbedarfe);
}

async function createDateGridReact(anfang_dpl: Date, ende_dpl: Date) {
  const zeitraumkategorie = await getZeitraumkategorien(anfang_dpl, ende_dpl);
  const dates: { [key: string]: any } = {};
  const windowAnfang = anfang_dpl;
  const windowEnde = ende_dpl;
  let anfang = windowAnfang;
  let weekCounter = 0;
  let planerDate;

  do {
    planerDate = new PlanerDate(anfang, weekCounter);
    await planerDate.initializeFeiertage(anfang, zeitraumkategorie);
    dates[planerDate.id] = planerDate;
    anfang = addDays(anfang, 1);

    // week_counter:
    // Wochenden gelten von Fr. Abend, bis Mo. Morgen
    // -> Fr. - Mo. zählen zu einem Wochenende, welches den week_counter nutzt
    if (isTuesday(anfang)) {
      weekCounter = weekCounter + 1;
    }
  } while (anfang < windowEnde);

  planerDate = new PlanerDate(anfang, weekCounter);
  await planerDate.initializeFeiertage(anfang, zeitraumkategorie);
  dates[planerDate.id] = planerDate;
  return dates;
}

async function getDienstbedarfEintrag(dienste: any, bedarfsEintraegeHash: any) {
  const dienstBedarfEintrag: { [key: string]: any } = {};
  const bedarfsEintraege = Object.values(bedarfsEintraegeHash);
  bedarfsEintraege.forEach((be: any) => {
    const po_dienst_id = be.po_dienst_id;
    const tag = format(be.tag, 'yyyy-MM-dd');
    const id = be.id;
    if (!dienstBedarfEintrag?.[po_dienst_id]) {
      dienstBedarfEintrag[po_dienst_id] = {};
    }
    if (!dienstBedarfEintrag?.[po_dienst_id]?.[tag]) {
      dienstBedarfEintrag[po_dienst_id][tag] = [];
    }
    dienstBedarfEintrag[po_dienst_id][tag].push(id);
  });

  Object.keys(dienste).forEach((dienstId) => {
    if (!dienstBedarfEintrag[dienstId]) {
      dienstBedarfEintrag[dienstId] = {};
    }
  });
  return dienstBedarfEintrag;
}

async function getKalenderWoche(date: Date) {
  const kalenderwoche = await findFirstKalernderWoche(date);
  if (kalenderwoche) {
    return kalenderwoche;
  }
  const week = getWeek(date);
  const year = date.getFullYear();
  const monday = dateCommercial(year, week, 1);
  const friday = dateCommercial(year, week, 5);
  const sunday = dateCommercial(year, week, 7);
  const [nFeiertage, nArbeitstage] = await checkWeek(monday, sunday);

  return await createKalenderWoche({
    year,
    week,
    monday,
    friday,
    sunday,
    nArbeitstage,
    nFeiertage
  });
}

async function getWochenbilanzen(dienstplan: any) {
  let { anfang: bilanzDate } = check_anfang_ende(dienstplan);
  const kws: { [key: string]: any } = {};
  const wochenbilanzen: { [key: string]: any } = {};
  const mitarbeiterIds = await getMitarbeiters(false, true);

  for (let i = 0; i < 5; i++) {
    bilanzDate = subDays(bilanzDate, 7);
    const kw = await getKalenderWoche(bilanzDate);
    const wochenbilanzenMitarbeiters = await getWochenbilanzByKalenderWocheForMitarbeiters(kw.id, mitarbeiterIds);
    if (kw) {
      kws[kw.kw] = kw;
      wochenbilanzen[kw.kw] = getDataByHash(wochenbilanzenMitarbeiters, 'mitarbeiter_id');
    }
  }

  return { kws, wochenbilanzen };
}

function getRotationenIdsInRangeDate(dateStr: string, data: any, kontingenteDienste: any) {
  const date = newDate(dateStr);

  return data.reduce((dateHash: any, rotation: any) => {
    const vonDate = rotation.von;
    const bisDate = rotation.bis;
    const mitarbeiter_id = rotation.mitarbeiter_id;

    if (date >= vonDate && date <= bisDate) {
      if (!dateHash[dateStr]) {
        dateHash[dateStr] = {
          by_dienst: {},
          by_mitarbeiter: {},
          ids: []
        };
      }
      dateHash[dateStr].ids.push(rotation.id);

      if (!dateHash[dateStr].by_mitarbeiter[mitarbeiter_id]) {
        dateHash[dateStr].by_mitarbeiter[mitarbeiter_id] = [];
      }
      dateHash[dateStr].by_mitarbeiter[mitarbeiter_id].push(rotation.id);

      kontingenteDienste?.[rotation.kontingent_id]?.forEach?.((dienstId: number) => {
        if (!dateHash[dateStr].by_dienst[dienstId]) {
          dateHash[dateStr].by_dienst[dienstId] = [];
        }
        dateHash[dateStr].by_dienst[dienstId].push(rotation.id);
      });
    }
    return dateHash;
  }, {});
}

function createDateIdMap(data: any[], keys: string[], tagKey = 'tag') {
  return data.reduce((map: { [key: string]: any }, value: any) => {
    const dateFormatted = format(value[tagKey], 'yyyy-MM-dd');
    if (!map[dateFormatted]) {
      map[dateFormatted] = {};
    }
    keys.forEach((key: string) => {
      if (!map[dateFormatted][key]) {
        map[dateFormatted][key] = [];
      }
      map[dateFormatted][key].push(value[key]);
    });
    return map;
  }, {});
}

function createDateEinteilungMap(data: any[]) {
  return data.reduce((map: { [key: string]: any }, value: any) => {
    const dateFormatted = format(value.tag, 'yyyy-MM-dd');
    const dienstplan_id = value.dienstplan_id;
    if (!map[dateFormatted]) {
      map[dateFormatted] = {};
    }
    if (!map[dateFormatted][dienstplan_id]) {
      map[dateFormatted][dienstplan_id] = [];
    }
    map[dateFormatted][dienstplan_id].push(value.id);
    return map;
  }, {});
}

function setBereicheIdsObject(planerDate: any, po_dienst_id: number, bereichId: number, bedarfEintragId: number) {
  if (!planerDate.by_dienst[po_dienst_id].bereiche_ids[bereichId]) {
    planerDate.by_dienst[po_dienst_id].bereiche_ids[bereichId] = {
      id: bereichId,
      bedarfeintrag_id: bedarfEintragId,
      einteilungen: []
    };
  }
}

function computeEinteilung(einteilungen: any, dates: any, bedarfs_eintraege: any, dienst_bedarfeintrag: any) {
  einteilungen.forEach((einteilung: any) => {
    let bereichId = 0;

    const dateId = format(einteilung.tag, 'yyyy-MM-dd');
    const planerDate = dates[dateId];
    const po_dienst_id = einteilung.po_dienst_id;
    const mitarbeiter_id = einteilung.mitarbeiter_id;
    let bedarfEintragId = 0;

    if (einteilung.bereich_id) {
      bereichId = einteilung.bereich_id;
      bedarfEintragId = dienst_bedarfeintrag[po_dienst_id]?.[dateId]?.[0] || 0;
    }

    if (planerDate) {
      if (!planerDate.by_dienst[po_dienst_id]) {
        planerDate.by_dienst[po_dienst_id] = {
          bereiche_ids: {},
          einteilung_ids: {},
          rotation_ids: [],
          wunsch_ids: [],
          id: po_dienst_id
        };
      }
      if (!planerDate.by_mitarbeiter[mitarbeiter_id]) {
        console.log(mitarbeiter_id);
        planerDate.by_mitarbeiter[mitarbeiter_id] = {
          einteilung_ids: {},
          rotation_ids: [],
          wunsch_id: 0
        };
      }
      setBereicheIdsObject(planerDate, po_dienst_id, bereichId, bedarfEintragId);
      planerDate.by_dienst[po_dienst_id].bereiche_ids[bereichId].einteilungen.push(einteilung.id);
    }
  });
}

function computeBedarfsEintraege(bedarfsEintraege: any, dates: any) {
  bedarfsEintraege.forEach((bedarfsEintrag: any) => {
    let bereichId = 0;

    const dateId = format(bedarfsEintrag.tag, 'yyyy-MM-dd');
    const planerDate = dates[dateId];
    if (!planerDate) return;

    const po_dienst_id = bedarfsEintrag.po_dienst_id;

    if (bedarfsEintrag.bereich_id) {
      bereichId = bedarfsEintrag.bereich_id;
    }

    setBereicheIdsObject(planerDate, po_dienst_id, bereichId, bedarfsEintrag.id);
  });
}

async function getKontingenteDienste(diensteArr: any) {
  const kontingenteWithPoDienst = await getAllKontingents({ kontingent_po_diensts: true });
  if (!kontingenteWithPoDienst) return [];
  const kontingentDienste = kontingenteWithPoDienst.reduce((hashObj: any, value: any) => {
    const kontingentId = value.id;
    hashObj[kontingentId] = [];
    diensteArr.forEach((dienst: any) => {
      const dienstId = dienst.id;
      if (dienst.thema_ids && value.thema_ids) {
        const intersectionIds = getInterSectionArrays(dienst.thema_ids, value.thema_ids) || [];

        if (intersectionIds.length > 0) {
          hashObj[kontingentId].push(dienstId);
        }
      }
    });
    return hashObj;
  }, {});
  return kontingentDienste;
}

function getDienstkategorieDienste(dienstkategorien: any, dienste: any) {
  const diensteArr = Object.values(dienste);

  const dienstkategoreieDienste = Object.values(dienstkategorien).reduce((hashObj: any, dk: any) => {
    const katId = dk.id;
    hashObj[katId] = [];
    const themaIds = dk.dienstkategoriethemas.map((dkt: any) => dkt.thema_id);
    diensteArr.forEach((dienst: any) => {
      const dienstId = dienst.id;
      if (dienst?.thema_ids && themaIds?.length) {
        const intersectionIds = getInterSectionArrays(dienst.thema_ids, themaIds);
        if (intersectionIds.length > 0) {
          hashObj[katId].push(dienstId);
        }
      }
    });
    return hashObj;
  }, {});
  return dienstkategoreieDienste;
}

function computeWuensche(wuensche: any[], dates: any, dienstkategoreieDienste: any) {
  wuensche.forEach((wunsch: any) => {
    const dateStr = format(wunsch.tag, 'yyyy-MM-dd');
    dates[dateStr].by_mitarbeiter[wunsch.mitarbeiter_id].wunsch_id = wunsch.id;
    const dienstKategorieId = wunsch.dienstkategorie_id;
    dienstkategoreieDienste[dienstKategorieId].forEach((id: number) => {
      dates[dateStr].by_dienst[id].wunsch_ids.push(wunsch.id);
    });
  });
}

async function computeDates(props: any) {
  const {
    dates,
    bedarfs_eintraege,
    dienst_bedarfeintrag,
    einteilungen,
    rotationenArr,
    wuensche,
    dienste,
    mitarbeiter,
    dienstkategoreieDienste
  } = props;

  const bedarfsEintraegeMap = createDateIdMap(Object.values(bedarfs_eintraege), ['id', 'dienstbedarf_id']);
  const wuenschArr = Object.values(wuensche);
  const einteilungenMap = createDateEinteilungMap(Object.values(einteilungen));
  const wuenscheMap = createDateIdMap(wuenschArr, ['id']);
  const diensteArr = Object.values(dienste);
  const mitarbeiterArr = Object.values(mitarbeiter);
  const kontigentDienste = await getKontingenteDienste(diensteArr);

  Object.keys(dates).forEach((dateStr) => {
    dates[dateStr].bedarfseintraege = bedarfsEintraegeMap?.[dateStr]?.id || [];
    dates[dateStr].bedarf = bedarfsEintraegeMap?.[dateStr]?.dienstbedarf_id || [];
    dates[dateStr].einteilungen = einteilungenMap?.[dateStr] || {};
    dates[dateStr].wuensche = wuenscheMap?.[dateStr]?.id || [];
    const rotationenHash = getRotationenIdsInRangeDate(dateStr, rotationenArr, kontigentDienste);
    dates[dateStr].rotationen = rotationenHash?.[dateStr]?.ids || [];

    diensteArr.forEach((dienst: any) => {
      dates[dateStr].by_dienst[dienst.id] = {
        bedarf_id: 0,
        bereiche_ids: {},
        einteilung_ids: {},
        id: dienst.id,
        rotation_ids: [],
        wunsch_ids: []
      };
      dates[dateStr].by_dienst[dienst.id].rotation_ids = rotationenHash?.[dateStr].by_dienst[dienst.id] || [];
    });

    mitarbeiterArr.forEach((mId: any) => {
      dates[dateStr].by_mitarbeiter[mId] = {
        einteilung_ids: {},
        id: mId,
        rotation_ids: [],
        wunsch_id: 0
      };
      dates[dateStr].by_mitarbeiter[mId].rotation_ids = rotationenHash?.[dateStr].by_mitarbeiter[mId] || [];
    });
  });
  computeEinteilung(Object.values(einteilungen), dates, bedarfs_eintraege, dienst_bedarfeintrag);
  computeBedarfsEintraege(Object.values(bedarfs_eintraege), dates);
  computeWuensche(wuenschArr, dates, dienstkategoreieDienste);
}

async function loadBasics(anfangFrame: Date, endeFrame: Date, dienstplan: Dienstplan, loadVorschlaege: boolean) {
  const dplBedarfId = dienstplan?.dienstplanbedarf_id || 0;
  const bedarfs_eintraege = await getBedarfe(dplBedarfId);
  if (Object.keys(bedarfs_eintraege).length === 0) {
    return false;
  }
  const dates = await createDateGridReact(anfangFrame, endeFrame);
  const einteilungen = await getEinteilungen(loadVorschlaege ? dienstplan.id : 0, anfangFrame, endeFrame);
  const dienste = await getPoDienste();
  const mitarbeiter = await getMitarbeiters(true, true);
  const dienstkategorien = await getDienstkategories();
  const wuensche = await getWuensche(anfangFrame, endeFrame);
  const rotationenArr = await getRotationen(anfangFrame, endeFrame);
  const schichten = await getSchichten(dplBedarfId);
  const bedarf = await getDienstbedarfe(anfangFrame, endeFrame);
  const dienst_bedarfeintrag = await getDienstbedarfEintrag(dienste, bedarfs_eintraege);
  const { kws, wochenbilanzen } = await getWochenbilanzen(dienstplan);

  const rotationenByKontingentFlag = await getAllRotationenByKontingentFlag();
  const mitarbeiterRotsationenMap = mapIdToKeys(rotationenByKontingentFlag, 'mitarbeiter_id', ['obj']);

  const rotationen = processData('id', rotationenArr, [
    (item: any) => {
      item['all_rotations'] = mitarbeiterRotsationenMap?.[item.mitarbeiter_id]?.obj || [];
      return item;
    }
  ]);

  const dienstkategoreieDienste = getDienstkategorieDienste(dienstkategorien, dienste);

  console.time('computeDates');
  await computeDates({
    dates,
    bedarfs_eintraege,
    einteilungen,
    dienste,
    mitarbeiter,
    rotationenArr,
    wuensche,
    bedarf,
    dienstkategoreieDienste,
    dienst_bedarfeintrag
  });
  console.timeEnd('computeDates');

  console.log(anfangFrame, endeFrame);

  return {
    bedarf,
    bedarfs_eintraege,
    einteilungen,
    dates,
    dienst_bedarfeintrag,
    kws,
    rotationen,
    schichten,
    wochenbilanzen,
    wuensche
  };
}

export async function getDienstplanung(dpl_id: number, loadVorschlaege: boolean) {
  const dienstplan = await getDienstplanById(dpl_id);

  if (!dienstplan || !dienstplan?.anfang || !dienstplan?.ende) {
    return '';
  }

  const { anfang, ende, anfang_frame, ende_frame } = get_dpl_anfang_ende(dienstplan);
  const data = await loadBasics(anfang_frame, ende_frame, dienstplan, loadVorschlaege);
  const planungsinfos = await planungsInfoGetAll(anfang, ende);

  if (!data) {
    return '';
  }

  return {
    anfang: format(anfang, 'yyyy-MM-dd'),
    anfang_frame: format(anfang_frame, 'yyyy-MM-dd'),
    name: dienstplan?.name,
    created_at: dienstplan?.created_at,
    beschreibung: dienstplan?.beschreibung,
    id: dienstplan?.id,
    ende: format(ende, 'yyyy-MM-dd'),
    parameterset_id: dienstplan?.parameterset_id,
    plantime_anfang: format(anfang, 'yyyy-MM-dd'),
    plantime_ende: format(ende, 'yyyy-MM-dd'),
    ende_frame: format(ende_frame, 'yyyy-MM-dd'),
    dienstplanstatus_id: dienstplan?.dienstplanstatus_id,
    dienstplanbedarf_id: dienstplan?.dienstplanbedarf_id,
    sys: dienstplan?.sys,
    recompute: false,
    updated_at: dienstplan?.updated_at,
    planungsinfos,
    ...data
  };
}
