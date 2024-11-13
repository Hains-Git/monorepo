import { Prisma, PrismaClient } from '@prisma/client';

import { prismaHains } from './prisma-hains';
import { addDays, isTuesday, subDays } from 'date-fns';
import { getAllApiData } from './apidata';
import { format, lastDayOfMonth } from 'date-fns';
import PlanerDate from './planerdate/planerdate';

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

  // def load_dienste(compute = true)
  //   log("Loading Dienste")
  //   @dienst_mitarbeiter = {}
  //   @dienst_bedarf = {}
  //   @dienst_bedarfeintrag = {}
  //   @dienste = hash_by_key(PoDienst.includes(:dienstratings, :dienstbedarves).all
  //     .order(:order)) { |dienst|
  //     id = dienst.id
  //     @dienst_mitarbeiter[id] = {}
  //     @dienst_bedarf[id] = []
  //     @dienst_bedarfeintrag[id] = {}
  //   }
  //
  //   if compute
  //     compute_dienste()
  //   end
  // end
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
  return getDataByHash(mitarbeiter);
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

// async function getDienstbedarfEintrag(bedarfsEintraegeHash: any) {}

async function loadBasics(anfangFrame: Date, endeFrame: Date, dienstplan: any) {
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
  // const dienst_bedarfeintrag = await getDienstbedarfEintrag(bedarfs_eintraege);

  const dates = await createDateGridReact(anfangFrame, endeFrame);
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
