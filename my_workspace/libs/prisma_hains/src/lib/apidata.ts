import { PrismaClient } from '@prisma/client';
import { prismaDb } from './prisma-hains';
import { getUserById } from './crud/user';
import { format } from 'date-fns';

import { processData, processAsyncData, convertBereichPlanname, convertDienstPlanname } from '@my-workspace/utils';
import { newDate } from '@my-workspace/utils';

const MONATSPLAN_ANSICHTEN = ['Datum-Dienste', 'Mitarbeiter-Datum', 'Mitarbeiter-Dienste'];

function transformPodienst(poDienst: any) {
  poDienst['dienstbedarves'] = poDienst.dienstbedarves.map((dienstbedarf: any) => dienstbedarf.id);
  poDienst['dienstratings'] = poDienst.dienstratings.map((dienstrating: any) => dienstrating.id);
  return poDienst;
}

function transformDienstkategorie(dienstkategorie: any) {
  dienstkategorie['dienstkategoriethemas'] = dienstkategorie.dienstkategoriethemas.map(
    (dienstkategoriethema: any) => dienstkategoriethema.thema_id
  );
  return dienstkategorie;
}

type PrismaModels = Extract<Exclude<keyof PrismaClient, `$${string}`>, string>;

type FindManyArgsTypes = {
  [K in PrismaModels]: K extends keyof PrismaClient ? Parameters<PrismaClient[K]['findMany']>[0] : never;
};

async function getApiDataByKey<K extends PrismaModels>(key: K, args: FindManyArgsTypes[K] = {}) {
  const data = await (prismaDb[key] as any).findMany(args);
  return data;
}

async function transformMitarbeiter(mitarbeiter: any) {
  const freigabenTypenIds = await getApiDataByKey('dienstfreigabes', {
    where: {
      mitarbeiter_id: mitarbeiter.id,
      freigabestatuses: {
        qualifiziert: true
      }
    }
  });
  mitarbeiter['freigabetypen_ids'] = freigabenTypenIds.map((freigabe: any) => freigabe.freigabetyp_id);
  mitarbeiter['dienstfreigabes'] = mitarbeiter.dienstfreigabes.map((dienstfreigabe: any) => dienstfreigabe.id);
  mitarbeiter['dienstratings'] = mitarbeiter.dienstratings.map((dienstrating: any) => dienstrating.id);
  mitarbeiter['vertragphasen_ids'] = [];
  mitarbeiter['vertrags_arbeitszeits_ids'] = [];
  mitarbeiter['vertrags'] = mitarbeiter.vertrags.map((vertrag: any) => {
    vertrag.vertrags_phases?.forEach?.((phase: any) => {
      mitarbeiter['vertragphasen_ids'].push(phase.id);
    });
    vertrag.vertrags_arbeitszeits?.forEach?.((arbeitszeit: any) => {
      mitarbeiter['vertrags_arbeitszeits_ids'].push(arbeitszeit.id);
    });
    return vertrag.id;
  });
  return mitarbeiter;
}

function transformTeams(team: any) {
  team['po_diensts'] = team.po_diensts.map((po_dienst: any) => po_dienst.id);
  team['team_funktions'] = team.team_funktions.map((team_funktion: any) => team_funktion.funktion_id);
  team['kontingents'] = team.kontingents.map((kontingent: any) => kontingent.id);
  return team;
}

async function getAllgemeineVorlagenIds() {
  const allgemeineVorlagen = await prismaDb.allgemeine_vorlages.findMany({
    select: { vorlage_id: true }
  });
  const vorlagenIds = allgemeineVorlagen.map((v) => v.vorlage_id || 0) || [];
  return vorlagenIds;
}

async function getAdminVorlagen(mitarbeiterId: number) {
  const vorlagenIds = await getAllgemeineVorlagenIds();

  const vorlagen =
    (await prismaDb.vorlages.findMany({
      where: {
        OR: [
          { mitarbeiter_id: mitarbeiterId },
          {
            id: {
              in: vorlagenIds
            }
          }
        ]
      },
      include: {
        allgemeine_vorlages: true
      },
      orderBy: [{ position: 'asc' }, { name: 'asc' }]
    })) || [];
  return vorlagen;
}

async function getUserVorlagen(mitarbeiterId: number) {
  const vorlagen =
    (await prismaDb.vorlages.findMany({
      where: {
        mitarbeiter_id: mitarbeiterId
      },
      include: {
        allgemeine_vorlages: true
      },
      orderBy: [{ position: 'asc' }, { name: 'asc' }]
    })) || [];

  return vorlagen;
}

async function getPublicVorlagesIdsByTeams(teamIds: number[]) {
  const vorlagenIds = await getAllgemeineVorlagenIds();
  const publicVorlagen = await prismaDb.vorlages.findMany({
    where: {
      OR: [{ team_id: null }, { team_id: { in: teamIds } }],
      id: { in: vorlagenIds }
    },
    select: { id: true }
  });
  return publicVorlagen.map((v) => v.id || 0) || [];
}

async function getMonatsplanungSettings(user: any, isAdmin: boolean, canAcces: boolean) {
  if (!user?.account_info) return {};
  const teamIds = user.dienstplaners_teams.map((team: any) => team.team_id);
  const mitarbeiterId = user.account_info.mitarbeiter_id || 0;

  const res = {
    vorlagen: <any[]>[],
    dienstplan_custom_felder: <any[]>[],
    dienstplan_custom_counter: <any[]>[],
    dienstplaner_settings: {
      user_settings: user.dienstplaner_user_settings?.[0] || {},
      farbgruppen: user.dienstplaner_user_farbgruppens
    }
  };
  if (!canAcces) return res;

  if (isAdmin) {
    res['vorlagen'] = await getAdminVorlagen(mitarbeiterId);
  } else {
    res['vorlagen'] = await getUserVorlagen(mitarbeiterId);
  }
  const vorlagenIds =
    !isAdmin && canAcces ? await getPublicVorlagesIdsByTeams(teamIds) : res.vorlagen.map((v) => v.id || 0) || [];

  const dienstplanCustomFelder = await prismaDb.dienstplan_custom_felds.findMany({
    where: {
      vorlage_id: { in: vorlagenIds }
    },
    orderBy: [{ vorlage_id: 'asc' }, { ansicht_id: 'asc' }, { index: 'asc' }]
  });
  const dienstplanCustomFelderIds = dienstplanCustomFelder.map((f) => f.id || 0) || [];

  res.dienstplan_custom_felder = dienstplanCustomFelder;
  res.dienstplan_custom_counter = await prismaDb.dienstplan_custom_counters.findMany({
    where: {
      dienstplan_custom_feld_id: { in: dienstplanCustomFelderIds }
    },
    orderBy: [{ dienstplan_custom_feld_id: 'asc' }, { id: 'asc' }]
  });

  res.vorlagen = res.vorlagen.map((v) => {
    const filepattern = v?.allgemeine_vorlages?.[0]?.filepattern;
    if (v.allgemeine_vorlages.length !== 0) {
      v.allgemeine_vorlages[0].publish = filepattern ? filepattern.split('_')[2].replace(/[()]/g, '').split('|') : '';
    }
    return v;
  });

  return res;
}

function addPropertiesToVorlage(vorlage: any) {
  const filepattern = vorlage?.allgemeine_vorlages?.[0]?.filepattern;
  if (vorlage.allgemeine_vorlages.length !== 0) {
    vorlage.allgemeine_vorlages[0].publish = filepattern
      ? filepattern.split('_')[2].replace(/[()]/g, '').split('|')
      : '';
  }
  return vorlage;
}

async function getPublicVorlagen(user: any) {
  const teamIds = user.dienstplaners_teams.map((team: any) => team.team_id);
  const vorlagenIds = await getAllgemeineVorlagenIds();
  const vorlagen = await prismaDb.vorlages.findMany({
    where: {
      OR: [{ team_id: null }, { team_id: { in: teamIds } }],
      id: { in: vorlagenIds }
    },
    include: {
      allgemeine_vorlages: {
        select: {
          dienstplan_path_id: true,
          publishable: true,
          order: true,
          filepattern: true
        }
      }
    },
    orderBy: [{ id: 'asc' }]
  });
  return processData('id', vorlagen, [addPropertiesToVorlage]);
}

function getAnfang(absprache: any) {
  let result = newDate();
  result.setMonth(0);
  result.setDate(1);
  result.setFullYear(newDate().getFullYear());
  if (absprache.von) {
    result = absprache.von;
  } else if (absprache.zeitraumKategorie?.anfang) {
    result = absprache.zeitraumKategorie.anfang;
  }

  return format(result, 'yyyy-MM-dd');
}

function getEnde(absprache: any) {
  let result = null;

  if (absprache.bis) {
    result = absprache.bis;
  } else if (absprache.zeitraumKategorie?.ende) {
    result = absprache.zeitraumKategorie.ende;
  }

  return format(result, 'yyyy-MM-dd');
}

function getTimeFromDate(date: Date | string) {
  const dateObj = newDate(date);
  return format(dateObj, 'HH:mm');
}

function addAnfangEndeToNichtEinteilenAbsprache(absprache: any) {
  absprache['anfang'] = getAnfang(absprache);
  absprache['ende'] = getEnde(absprache);
  absprache.von = format(absprache.von, 'yyyy-MM-dd');
  absprache.bis = format(absprache.bis, 'yyyy-MM-dd');
  return absprache;
}

function transformArbeitszeitAbsprachen(absprache: any) {
  absprache['anfang'] = getAnfang(absprache);
  absprache['ende'] = getEnde(absprache);
  absprache.arbeitszeit_von_time = getTimeFromDate(absprache.arbeitszeit_von);
  absprache.arbeitszeit_bis_time = getTimeFromDate(absprache.arbeitszeit_bis);
  absprache.von = format(absprache.von, 'yyyy-MM-dd');
  absprache.bis = format(absprache.bis, 'yyyy-MM-dd');
  return absprache;
}

async function getAllApiData(userId: number) {
  const res: any = {};

  const user = await getUserById(userId, {
    account_info: true,
    dienstplaners_teams: true,
    dienstplaner_user_settings: true,
    dienstplaner_user_farbgruppens: true,
    user_gruppes: {
      include: { gruppes: true }
    }
  });

  if (!user?.account_info) {
    console.log('User.account_info not found', userId, user);
    return '';
  }

  const userGroupsNames = user.user_gruppes.map((userGruppe: any) => userGruppe.gruppes.name);
  const isAdmin = userGroupsNames.includes('HAINS Admins');
  const canAcces =
    userGroupsNames.includes('Dienstplaner Anästhesie HD') || userGroupsNames.includes('Urlaubsplaner Anästhesie HD');

  const bereicheArr = await getApiDataByKey('bereiches', {});
  const poDiensteArr = await getApiDataByKey('po_diensts', {
    include: {
      dienstbedarves: true,
      dienstratings: true
    }
  });

  const bereiche = processData('id', bereicheArr, [convertBereichPlanname]);
  const poDienste = processData('id', poDiensteArr, [convertDienstPlanname, transformPodienst]);

  res['MAX_RATING'] = 5;
  res['MAX_WOCHENENDEN'] = 2;

  res['arbeitsplaetze'] = processData('id', await getApiDataByKey('arbeitsplatzs'));
  res['arbeitszeit_absprachen'] = processData(
    'mitarbeiter_id',
    await getApiDataByKey('arbeitszeit_absprachens', {
      where: {
        mitarbeiters: {
          platzhalter: false
        }
      },
      orderBy: [{ mitarbeiter_id: 'asc' }, { von: 'desc' }, { bis: 'desc' }]
    }),
    [transformArbeitszeitAbsprachen],
    true
  );
  res['arbeitszeittypen'] = processData('id', await getApiDataByKey('arbeitszeittyps'));
  res['arbeitszeitverteilungen'] = processData('id', await getApiDataByKey('arbeitszeitverteilungs'));
  res['bereiche'] = bereiche;
  res['dienstgruppen'] = processData('id', await getApiDataByKey('dienstgruppes'));
  res['dienstkategorien'] = processData(
    'id',
    await getApiDataByKey('dienstkategories', {
      include: {
        dienstkategoriethemas: true
      }
    }),
    [transformDienstkategorie]
  );
  res['dienstplanpfade'] = processData('id', await getApiDataByKey('dienstplan_paths'));
  res['dienstverteilungstypen'] = processData('id', await getApiDataByKey('dienstverteilungstyps'));
  res['einteilungskontexte'] = processData('id', await getApiDataByKey('einteilungskontexts'));
  res['einteilungsstatuse'] = processData('id', await getApiDataByKey('einteilungsstatuses'));
  res['freigaben'] = processData(
    'id',
    await getApiDataByKey('dienstfreigabes', {
      where: {
        freigabestatuses: {
          qualifiziert: true
        },
        mitarbeiters: {
          platzhalter: false
        }
      }
    })
  );
  res['freigabestatuse'] = processData('id', await getApiDataByKey('freigabestatuses'));
  res['freigabetypen'] = processData('id', await getApiDataByKey('freigabetyps'));
  res['funktionen'] = processData('id', await getApiDataByKey('funktions'));
  res['kontingente'] = processData(
    'id',
    await getApiDataByKey('kontingents', {
      include: {
        kontingent_po_diensts: true
      }
    })
  );
  res['kostenstellen'] = processData('id', await getApiDataByKey('kostenstelles'));
  res['mitarbeiters'] = await processAsyncData(
    'id',
    await getApiDataByKey('mitarbeiters', {
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
        dienstfreigabes: true,
        dienstratings: true,
        vertrags: {
          include: {
            vertrags_phases: true,
            vertrags_arbeitszeits: true
          }
        }
      }
    }),
    [transformMitarbeiter]
  );
  res['monatsplan_ansichten'] = MONATSPLAN_ANSICHTEN;
  res['monatsplanung_settings'] = await getMonatsplanungSettings(user, isAdmin, canAcces);
  res['nicht_einteilen_absprachen'] = processData(
    'mitarbeiter_id',
    await getApiDataByKey('nicht_einteilen_absprachens', {
      where: {
        mitarbeiters: {
          platzhalter: false
        }
      },
      include: {
        nicht_einteilen_standort_themen: true
      },
      orderBy: [{ mitarbeiter_id: 'asc' }, { von: 'desc' }, { bis: 'desc' }]
    }),
    [addAnfangEndeToNichtEinteilenAbsprache],
    true
  );
  // res['nicht_einteilen_absprachen'] = {};
  res['po_dienste'] = poDienste;
  res['publicvorlagen'] = isAdmin ? {} : await getPublicVorlagen(user);
  res['ratings'] = processData('id', await getApiDataByKey('dienstratings'));

  res['standorte'] = processData('id', await getApiDataByKey('standorts'));
  res['teams'] = processData(
    'id',
    await getApiDataByKey('teams', {
      include: {
        po_diensts: true,
        team_funktions: true,
        kontingents: true,
        team_kw_krankpuffers: true
      }
    }),
    [transformTeams]
  );
  res['themen'] = processData('id', await getApiDataByKey('themas'));
  res['vertraege'] = processData('id', await getApiDataByKey('vertrags'));
  res['vertragsphasen'] = processData('id', await getApiDataByKey('vertrags_phases'));
  res['vertrags_arbeitszeiten'] = processData('id', await getApiDataByKey('vertrags_arbeitszeits'));
  res['vertragsstufen'] = processData('id', await getApiDataByKey('vertragsstuves'));
  const vertragsvarianten = await getApiDataByKey('vertrags_variantes');
  res['vertragstyp_varianten'] = vertragsvarianten.reduce((hashObj: any, vertragsvariante: any) => {
    const key = vertragsvariante.vertragstyp_id;
    if (key !== undefined && (typeof key === 'string' || typeof key === 'number')) {
      if (!hashObj[key]) {
        hashObj[key] = [];
      }
      hashObj[key].push(key);
    }
    return hashObj;
  }, {});
  res['vertragsvarianten'] = processData('id', vertragsvarianten);
  res['zeitraumkategorien'] = processData('id', await getApiDataByKey('zeitraumkategories'));

  return res;
}

export { getAllApiData };
