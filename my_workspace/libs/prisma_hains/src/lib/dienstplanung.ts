import { Prisma, PrismaClient } from '@prisma/client';

import { prismaHains } from './prisma-hains';
import {
  addDays,
  getWeek,
  getYear,
  isTuesday,
  parseISO,
  setISODay,
  setISOWeek,
  startOfYear,
  subDays,
} from 'date-fns';
import { getAllApiData } from './apidata';
import { format, lastDayOfMonth } from 'date-fns';
import PlanerDate from './planerdate/planerdate';
import { checkWeek } from './utils/feiertag';
import { async } from 'rxjs';

let prismaDb: PrismaClient<Prisma.PrismaClientOptions, 'query'>;

function getDataByHash(data: any, key = 'id') {
  return data.reduce((hash: any, value: any) => {
    hash[value[key]] = value;
    return hash;
  }, {});
}

function check_anfang_ende(dienstplan: any) {
  let anfang = dienstplan.anfang;
  let ende = dienstplan.ende;
  const startOfNextMonth = new Date(
    anfang.getFullYear(),
    anfang.getMonth() + 1,
    1
  );
  if (anfang.getDate() !== 1) {
    anfang = startOfNextMonth;
  }
  ende = lastDayOfMonth(anfang);
  return { anfang, ende };
}

function get_dpl_anfang_ende(dienstplan: any) {
  const { anfang, ende } = check_anfang_ende(dienstplan);
  const relevant_timeframe_size =
    dienstplan?.parametersets?.planparameters?.[0]?.relevant_timeframe_size;
  const anfang_frame = subDays(anfang, relevant_timeframe_size);
  const ende_frame = addDays(ende, relevant_timeframe_size);
  return {
    anfang,
    ende,
    anfang_frame,
    ende_frame,
  };
}

function dateCommercial(year: number, week: number, day: number): Date {
  // Start with the beginning of the specified year
  let date = startOfYear(new Date(year, 0, 1));

  // Set the ISO week
  date = setISOWeek(date, week);

  // Set the day of the week (1-7, where 1 is Monday and 7 is Sunday)
  date = setISODay(date, day);

  // Ensure we're in the correct year
  if (getYear(date) !== year) {
    date = setISOWeek(new Date(year, 11, 31), week);
    date = setISODay(date, day);
  }

  return date;
}

async function getZeitraumkategorien(anfang: Date, ende: Date) {
  const zeitraumkategorien = await prismaDb.zeitraumkategories.findMany({
    where: {
      AND: [
        {
          OR: [{ anfang: null }, { anfang: { gte: anfang } }],
        },
        {
          OR: [{ ende: null }, { ende: { lt: ende } }],
        },
      ],
    },
    orderBy: {
      prio: 'desc',
    },
  });

  return zeitraumkategorien;
}

async function getEinteilungen(
  id: number,
  windowAnfang: Date,
  windowEnde: Date
) {
  const einteilungen = await prismaDb.diensteinteilungs.findMany({
    where: {
      tag: {
        gte: windowAnfang,
        lte: windowEnde,
      },
      OR: [
        {
          dienstplan_id: id,
          einteilungsstatuses: {
            vorschlag: true,
          },
        },
        {
          einteilungsstatuses: {
            counts: true,
          },
        },
      ],
      mitarbeiters: {
        platzhalter: false,
      },
    },
    orderBy: [
      { tag: 'asc' },
      { po_dienst_id: 'asc' },
      { einteilungsstatuses: { public: 'desc' } },
      { bereich_id: 'asc' },
      { updated_at: 'asc' },
    ],
  });
  return getDataByHash(einteilungen);
}

async function getPoDienste(compute = true) {
  const dienste = await prismaDb.po_diensts.findMany({
    // include: {
    //   dienstratings: true,
    //   dienstbedarves: true,
    // },
  });
  return getDataByHash(dienste);
}

async function getMitarbeiters(compute = true, as_ids = false) {
  const mitarbeiter = as_ids
    ? await prismaDb.mitarbeiters.findMany({
        where: {
          platzhalter: false,
        },
        select: {
          id: true,
        },
        orderBy: {
          planname: 'asc',
        },
      })
    : await prismaDb.mitarbeiters.findMany({
        where: {
          platzhalter: false,
        },
        include: {
          account_infos: true,
          dienstratings: true,
          // qualifizierte_freigaben: true,
          // vertrags_phases: true,
          vertrags: true,
        },
        orderBy: {
          planname: 'asc',
        },
      });
  return as_ids
    ? mitarbeiter.map((item) => item.id)
    : getDataByHash(mitarbeiter);
}

async function getDienstkategories(compute = true) {
  const dienstkategories = await prismaDb.dienstkategories.findMany({
    include: {
      dienstkategoriethemas: true,
    },
  });
  return getDataByHash(dienstkategories);

  // def load_dienstkategorien(compute = true)
  //   @dienstkategorie_dienste = {}
  //   log("Loading Dienstkategorien")
  //   @dienstkategorien = hash_by_key(Dienstkategorie.includes(:dienstkategoriethemas).all){ |kat|
  //     if compute
  //       compute_dienstkategorie_dienste(kat)
  //     end
  //   }
  // end
}

async function getKontingente(compute = true) {
  const kontingente = await prismaDb.kontingents.findMany({
    include: {
      kontingent_po_diensts: true,
    },
  });
  return getDataByHash(kontingente);
  // def load_kontingente(compute = true)
  //   log("Loading Kontingente")
  //   @kontingent_dienste = {}
  //   @kontingente = hash_by_key(Kontingent.includes(:kontingent_po_dienst).all){ |kon|
  //     if compute
  //       compute_kontingent_dienste(kon)
  //     end
  //   }
  // end
}

async function getWuensche(windowAnfang: Date, windowEnde: Date) {
  const wuensche = await prismaDb.dienstwunsches.findMany({
    where: {
      tag: {
        gte: windowAnfang,
        lte: windowEnde,
      },
      mitarbeiters: {
        platzhalter: false,
      },
    },
    include: {
      mitarbeiters: true,
    },
    orderBy: {
      dienstkategorie_id: 'asc',
    },
  });

  return getDataByHash(wuensche);

  // def load_wuensche()
  //   log("Loading Wünsche")
  //   @wuensche = hash_by_key(Dienstwunsch.joins(:mitarbeiter)
  //     .where("tag >= ? and tag <= ?", @window_anfang, @window_ende)
  //     .where(:mitarbeiters => { platzhalter: false })
  //     .order(:dienstkategorie_id)){ |wunsch|
  //       compute_wunsch_dienste(wunsch)
  //     }
  // end
}

async function getRotationen(compute = true, anfang: Date, ende: Date) {
  const rotationen = await prismaDb.einteilung_rotations.findMany({
    where: {
      OR: [
        {
          AND: [{ von: { lte: anfang } }, { bis: { gte: anfang } }],
        },
        {
          AND: [{ von: { lte: ende } }, { bis: { gte: ende } }],
        },
        {
          AND: [{ von: { gte: anfang } }, { bis: { lte: ende } }],
        },
      ],
      mitarbeiters: {
        platzhalter: false,
      },
    },
    include: {
      kontingents: {
        include: {
          teams: true,
        },
      },
      mitarbeiters: {
        include: {
          vertrags: {
            include: {
              vertragsgruppes: true,
              vertrags_phases: true,
            },
          },
        },
      },
    },
  });

  return getDataByHash(rotationen);

  // def load_rotationen(compute = true)
  //   log("Loading Rotationen")
  //   # Anfang oder Ende ist zwischen von und bis oder anfang ist kleiner und ende ist größer
  //   @rotationen = hash_by_key(
  //     EinteilungRotation.rotationen_in(@window_anfang, @window_ende)
  //     .order(:mitarbeiter_id)){ |rot|
  //       if compute
  //         compute_rotations_dienste(rot)
  //       end
  //     }
  // end
}

async function getBedarfe(dienstplanbedarf_id: number) {
  const bedarfs_eintraege = await prismaDb.bedarfs_eintrags.findMany({
    where: {
      dienstplanbedarf_id,
    },
  });
  return getDataByHash(bedarfs_eintraege);

  // def load_bedarf()
  //   @bedarf = hash_by_key(Dienstbedarf.bedarfe_by_date(@window_anfang))
  //   shall_compute = !parameterset.planparameter.reuse_bedarf || @recompute  || dienstplanbedarf.anfang != @window_anfang || dienstplanbedarf.ende != @window_ende || self.bedarfs_eintrag.count == 0
  //   # Irgendwie geht er in compute_bedarf, obwohl shall_compute false ist, deshalb das === true
  //   if shall_compute === true
  //     load_zeitraumkategorien()
  //     compute_tage_schichten()
  //     compute_bedarf()
  //   else
  //     log("Reloading Bedarf")
  //   end
  //   #load from Database
  //   # @bedarfs_eintraege = hash_by_key(self.bedarfs_eintrag){ |be|
  //   #   compute_date_dienst_bedarfseintrag(be)
  //   # }
  //   # @schichten = matrix_by_key(self.schicht, :bedarfs_eintrag_id)
  //   @bedarfs_eintraege = {}
  //   @schichten = {}
  //   self.bedarfs_eintrag.find_in_batches do |batch|
  //     @bedarfs_eintraege = hash_by_key(batch, :id, @bedarfs_eintraege){ |be|
  //       compute_date_dienst_bedarfseintrag(be)
  //     }
  //   end
  //   self.schicht.find_in_batches do |batch|
  //     @schichten = matrix_by_key(batch, :bedarfs_eintrag_id, false, @schichten)
  //   end
  // end
}

async function getSchichten(dienstplanbedarf_id: number) {
  const schichten = await prismaDb.schichts.findMany({
    where: {
      bedarfs_eintrags: { dienstplanbedarf_id },
    },
  });
  return schichten.reduce((hash: any, value) => {
    const key = String(value?.bedarfs_eintrag_id) || 0;
    hash[key] = hash[key] || [];
    hash[key].push(value);
    return hash;
  }, {});
}

async function getDienstbedarfe(date: Date) {
  const dienstbedarfe = await prismaDb.dienstbedarves.findMany({
    where: {
      OR: [{ end_date: { gt: date } }, { end_date: null }],
      zeitraumkategories: {
        OR: [{ anfang: { lte: date } }, { anfang: null }],
        AND: [
          {
            OR: [{ ende: { gte: date } }, { ende: null }],
          },
        ],
      },
    },
    orderBy: [
      { po_diensts: { order: 'asc' } },
      { bereich_id: 'asc' },
      { zeitraumkategories: { prio: 'asc' } },
    ],
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
    planerDate = new PlanerDate(anfang, weekCounter, zeitraumkategorie);
    dates[planerDate.id] = planerDate;
    anfang = addDays(anfang, 1);

    // week_counter:
    // Wochenden gelten von Fr. Abend, bis Mo. Morgen
    // -> Fr. - Mo. zählen zu einem Wochenende, welches den week_counter nutzt
    if (isTuesday(anfang)) {
      weekCounter = weekCounter + 1;
    }
  } while (anfang < windowEnde);

  planerDate = new PlanerDate(anfang, weekCounter, zeitraumkategorie);
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
  const kalenderwoche = await prismaDb.kalenderwoches.findFirst({
    where: {
      AND: [{ montag: { lte: date } }, { sonntag: { gte: date } }],
    },
  });
  if (kalenderwoche) {
    return kalenderwoche;
  }
  const week = getWeek(date);
  const year = date.getFullYear();
  const monday = dateCommercial(year, week, 1);
  const friday = dateCommercial(year, week, 5);
  const sunday = dateCommercial(year, week, 7);
  const [nFeiertage, nArbeitstage] = await checkWeek(monday, sunday);

  return await prismaDb.kalenderwoches.create({
    data: {
      jahr: year,
      kw: week,
      montag: monday,
      freitag: friday,
      sonntag: sunday,
      arbeitstage: nArbeitstage,
      feiertage: nFeiertage,
      created_at: new Date(),
      updated_at: new Date(),
    },
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
    const wochenbilanzenMitarbeiters = await prismaDb.wochenbilanzs.findMany({
      where: {
        kalenderwoche_id: kw.id,
        mitarbeiter_id: {
          in: mitarbeiterIds,
        },
      },
    });

    if (kw) {
      kws[kw.kw] = kw;
      wochenbilanzen[kw.kw] = getDataByHash(
        wochenbilanzenMitarbeiters,
        'mitarbeiter_id'
      );
    }
  }

  return { kws, wochenbilanzen };
}

function getRotationenIdsInRangeDate(
  dateStr: string,
  data: any,
  kontingente: any
) {
  const date = new Date(dateStr);
  return data.reduce((dateHash: any, rotation: any) => {
    const vonDate = rotation.von;
    const bisDate = rotation.bis;
    const mitarbeiter_id = rotation.mitarbeiter_id;

    if (date >= vonDate && date <= bisDate) {
      if (!dateHash[dateStr]) {
        dateHash[dateStr] = {
          by_dienst: {},
          by_mitarbeiter: {},
          ids: [],
        };
      }
      dateHash[dateStr].ids.push(rotation.id);
      if (!dateHash[dateStr].by_mitarbeiter[mitarbeiter_id]) {
        dateHash[dateStr].by_mitarbeiter[mitarbeiter_id] = [];
      }
      dateHash[dateStr].by_mitarbeiter[mitarbeiter_id].push(rotation.id);
      // TODO: get kontingent, po_dienst_id, = compute_rotations_dienste

      // if (!dateHash[dateStr].by_dienst[po_dienst_id]) {
      //   dateHash[dateStr].by_dienst[po_dienst_id] = [];
      // }
      // dateHash[dateStr].by_dienst[po_dienst_id].push(rotation.id);
    }
    return dateHash;
  }, {});
}

function getRotationenByDienstByMitarbeiter(dateStr: string, data: any) {
  const date = new Date(dateStr);
  return data.reduce((dateHash: any, rotation: any) => {
    const vonDate = rotation.von;
    const bisDate = rotation.bis;
    const po_dienst_id = rotation.po_dienst_id;
    const mitarbeiter_id = rotation.mitarbeiter_id;

    if (date >= vonDate && date <= bisDate) {
      if (!dateHash[dateStr]) {
        dateHash[dateStr] = {
          by_dienst: {},
          by_mitarbeiter: {},
          ids: [],
        };
      }
      if (!dateHash[dateStr].by_dienst[po_dienst_id]) {
        dateHash[dateStr].by_dienst[po_dienst_id] = [];
      }
      if (!dateHash[dateStr].by_dienst[mitarbeiter_id]) {
        dateHash[dateStr].by_dienst[mitarbeiter_id] = [];
      }
      console.log(dateHash);
      // dateHash[dateStr].by_dienst[po_dienst_id].push(rotation.id);
      // dateHash[dateStr].by_mitarbeiter[mitarbeiter_id].push(rotation.id);
      // dateHash[dateStr].ids.push(rotation.id);
    }
    return dateHash;
  }, {});
}

function createDateIdMap(data: any[], keys: string[]) {
  return data.reduce((map: { [key: string]: any }, value: any) => {
    const dateFormatted = format(value.tag, 'yyyy-MM-dd');
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

function computeEinteilung(einteilungen: any, dates: any) {
  einteilungen.forEach((einteilung: any) => {
    let bereichId = 0;
    const bedarfEintragId = 0;
    const dateId = format(einteilung.tag, 'yyyy-MM-dd');
    if (einteilung.bereich_id) {
      bereichId = einteilung.bereich_id;
    }
    const planerDate = dates[dateId];
    const po_dienst_id = einteilung.po_dienst_id;

    if (planerDate) {
      if (!planerDate.by_dienst[po_dienst_id]) {
        planerDate.by_dienst[po_dienst_id] = {
          bereiche_ids: {},
          einteilung_ids: {},
          rotation_ids: [],
          wunsch_ids: [],
          id: po_dienst_id,
        };
      }
      if (!planerDate.by_dienst[po_dienst_id].bereiche_ids[bereichId]) {
        planerDate.by_dienst[po_dienst_id].bereiche_ids[bereichId] = {
          id: bereichId,
          bedarfeintrag_id: bedarfEintragId,
          einteilungen: [],
        };
        planerDate.by_dienst[po_dienst_id].bereiche_ids[
          bereichId
        ].einteilungen.push(einteilung.id);
      }
    }
  });
}

async function computeDates(props: any) {
  const {
    dates,
    bedarfs_eintraege,
    einteilungen,
    rotationen,
    wuensche,
    dienste,
    kontingente,
  } = props;

  const bedarfsEintraegeMap = createDateIdMap(
    Object.values(bedarfs_eintraege),
    ['id', 'dienstbedarf_id']
  );
  const einteilungenMap = createDateIdMap(Object.values(einteilungen), ['id']);
  const wuenscheMap = createDateIdMap(Object.values(wuensche), ['id']);
  const rotationenArr = Object.values(rotationen);
  const diensteArr = Object.values(dienste);

  Object.keys(dates).forEach((dateStr) => {
    dates[dateStr].bedarfseintraege = bedarfsEintraegeMap[dateStr].id || [];
    dates[dateStr].bedarf = bedarfsEintraegeMap[dateStr].dienstbedarf_id || [];
    dates[dateStr].einteilungen = einteilungenMap[dateStr].id || [];
    dates[dateStr].wuensche = wuenscheMap[dateStr].id || [];
    const rotationenHash = getRotationenIdsInRangeDate(
      dateStr,
      rotationenArr,
      kontingente
    );
    console.log(rotationenHash);
    // dates[dateStr].rotationen = rotationenHash?.[dateStr].ids || [];

    diensteArr.forEach((dienst: any) => {
      dates[dateStr].by_dienst[dienst.id] = {
        bedarf_id: 0,
        bereiche_ids: {},
        einteilung_ids: {},
        id: dienst.id,
        rotation_ids: [],
        wunsch_ids: [],
      };
    });
  });

  computeEinteilung(Object.values(einteilungen), dates);
}

async function loadBasics(anfangFrame: Date, endeFrame: Date, dienstplan: any) {
  const dates = await createDateGridReact(anfangFrame, endeFrame);
  const einteilungen = await getEinteilungen(64, anfangFrame, endeFrame);
  const dienste = await getPoDienste();
  const mitarbeiter = await getMitarbeiters(true, true);
  const dienstkategorien = await getDienstkategories();
  const kontingente = await getKontingente();
  const wuensche = await getWuensche(anfangFrame, endeFrame);
  const rotationen = await getRotationen(true, anfangFrame, endeFrame);
  const bedarfs_eintraege = await getBedarfe(dienstplan?.dienstplanbedarf_id);
  const schichten = await getSchichten(dienstplan?.dienstplanbedarf_id);
  const bedarf = await getDienstbedarfe(anfangFrame);
  const dienst_bedarfeintrag = await getDienstbedarfEintrag(
    dienste,
    bedarfs_eintraege
  );
  const { kws, wochenbilanzen } = await getWochenbilanzen(dienstplan);
  console.time('computeDates');
  const computedDates = await computeDates({
    dates,
    bedarfs_eintraege,
    einteilungen,
    dienste,
    mitarbeiter,
    rotationen,
    wuensche,
    bedarf,
    kontingente,
  });
  console.timeEnd('computeDates');

  console.log(anfangFrame, endeFrame);

  return {
    einteilungen,
    dienste,
    mitarbeiter,
    dienstkategorien,
    kontingente,
    wuensche,
    rotationen,
    bedarfs_eintraege,
    schichten,
    bedarf,
    dates,
    dienst_bedarfeintrag,
    kws,
    wochenbilanzen,
  };
}

export async function getMonatsplanung(dpl_id: number) {
  const db = prismaHains();
  prismaDb = db;

  const dienstplan = await prismaDb.dienstplans.findFirst({
    where: {
      id: dpl_id || 65,
    },
    include: {
      parametersets: {
        include: {
          planparameters: true,
        },
      },
    },
  });

  const { anfang, ende, anfang_frame, ende_frame } =
    get_dpl_anfang_ende(dienstplan);
  const data = await loadBasics(anfang_frame, ende_frame, dienstplan);
  const apiData = await getAllApiData();

  // const sum = Object.values(data).reduce(
  //   (sum, obj) => sum + Object.values(obj).length,
  //   0
  // );
  // console.log(
  //   Object.entries(data).map(
  //     ([key, value]) => `${key}: ${Object.values(value).length}`
  //   )
  // );
  // console.log('sum', sum);
  //
  // console.log(
  //   Object.entries(apiData).map(
  //     ([key, value]) => `${key}: ${Object.values(value).length}`
  //   )
  // );

  return {
    name: dienstplan?.name,
    created_at: dienstplan?.created_at,
    beschreibung: dienstplan?.beschreibung,
    id: dienstplan?.id,
    parameterset_id: dienstplan?.parameterset_id,
    sys: dienstplan?.sys,
    updated_at: dienstplan?.updated_at,
    dienstplan,
    anfang: format(anfang, 'yyyy-MM-dd'),
    ende: format(ende, 'yyyy-MM-dd'),
    plantime_anfang: format(anfang, 'yyyy-MM-dd'),
    plantime_ende: format(ende, 'yyyy-MM-dd'),
    anfang_frame: format(anfang_frame, 'yyyy-MM-dd'),
    ende_frame: format(ende_frame, 'yyyy-MM-dd'),
    dienstplanstatus_id: dienstplan?.dienstplanstatus_id,
    dienstplanbedarf_id: dienstplan?.dienstplanbedarf_id,
    ...data,
    apiData,
  };
}