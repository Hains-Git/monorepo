import { mitarbeiters, einteilung_rotations, kontingents, teams, funktions } from '@prisma/client';
import {
  getWeiterbildungsjahr,
  automatischeEinteilungAnfang,
  automatischeEinteilungEnde,
  arbeitszeitAbspracheAnfang,
  arbeitszeitAbspracheEnde
} from './helpers/mitarbeiter';
import { rotationAm } from './einteilungrotation';
import {
  _kontingent,
  _dienstfreigabe,
  _automatische_einteilung,
  _arbeitszeit_absprache,
  _mitarbeiter_default_eingeteilt,
  _mitarbeiter,
  _po_dienst,
  _team,
  TResultEinteilungenInKontingente
} from '@my-workspace/prisma_cruds';

import {
  getDateStr,
  newDate,
  newDateYearMonthDay,
  processData,
  transformObject
} from '@my-workspace/utils';
import { formatDate } from 'date-fns';
import { Vertrag } from '..';

type TDefaultKontingents = (kontingents & { teams: teams | null }) | null;

export function addWeiterbildungsjahr(mitarbeiter: mitarbeiters) {
  const aSeit = mitarbeiter.a_seit;
  const anrechenbareZeit = mitarbeiter.anrechenbare_zeit;
  const weiterbildungsjahr = getWeiterbildungsjahr(aSeit, anrechenbareZeit);
  return weiterbildungsjahr;
}

async function getDefaultTeamForMitarbeiter(
  defaultTeam: teams | null = null,
  defaultKontingent: TDefaultKontingents = null
) {
  let team = null;
  if (!defaultTeam) {
    defaultTeam = await _team.getDefaultTeam();
  }
  if (!defaultTeam && !defaultKontingent) {
    defaultKontingent = await _kontingent.getDefaults();
  }

  if (defaultTeam) {
    team = defaultTeam;
  } else if (defaultKontingent?.teams) {
    team = defaultKontingent.teams;
  }
  return team;
}

type TRot = einteilung_rotations & {
  kontingents:
    | (kontingents & {
        teams?: teams | null;
      })
    | null;
};

export async function mitarbeiterTeamAm(
  date = newDate(),
  rotationen: TRot[] | null = null,
  defaultTeam: teams | null = null,
  defaultKontingent: TDefaultKontingents | null = null,
  mitarbeiterId: number
) {
  let team: teams | null = null;
  let rotation: TRot | undefined = undefined;
  date.setHours(12, 0, 0, 0);
  const mitarbeiter = await _mitarbeiter.getMitarbeiterById(mitarbeiterId, {
    funktion: {
      include: {
        teams: true
      }
    }
  });

  if (rotationen && rotationen.length > 0) {
    rotation = rotationen.find((er) => {
      if (er.von && er.bis) {
        er.von.setHours(12, 0, 0, 0);
        er.bis.setHours(12, 0, 0, 0);
        return er.von <= date && er.bis >= date;
      }
      return false;
    });
  } else {
    const rot = await rotationAm(date, mitarbeiterId);
    if (rot && rot?.length > 0) {
      rotation = rot?.[0];
    }
  }

  if (rotation?.kontingents?.teams) {
    team = rotation?.kontingents?.teams;
  } else if (mitarbeiter?.funktion?.teams) {
    team = mitarbeiter.funktion?.teams;
  }

  if (!team) {
    team = await getDefaultTeamForMitarbeiter(defaultTeam, defaultKontingent);
  }

  return team;
}

async function freigegebeneDienste(mitarbeiterId: number, preset = false) {
  const freigabeTypen = await _dienstfreigabe.getFreigabenTypenIdsByMitarbeiterId(mitarbeiterId);
  const freigabeTypenIds = freigabeTypen.map((ft) => ft.freigabetyp_id).filter(Boolean) as number[];
  const dienste = await _po_dienst.getByFreigabenTypenIds(freigabeTypenIds);
  return dienste;
}

export async function getFreigegebeneDienste(mitarbeiterId: number) {
  return await freigegebeneDienste(mitarbeiterId);
}

export async function getAutomatischeEinteilungen(mitarbeiterId: number) {
  let automatischeEinteilungen = await _automatische_einteilung.getByMitarbeiterId(mitarbeiterId);
  automatischeEinteilungen = automatischeEinteilungen.map((ae) => {
    const aeObj = transformObject(ae, [
      {
        key: 'anfang',
        method: automatischeEinteilungAnfang
      },
      {
        key: 'ende',
        method: automatischeEinteilungEnde
      },
      { key: 'von', method: (ae) => (ae?.von ? formatDate(ae.von, 'yyyy-MM-dd') : ae.von) },
      { key: 'bis', method: (ae) => (ae?.bis ? formatDate(ae.bis, 'yyyy-MM-dd') : ae.bis) }
    ]);
    return aeObj;
  });
  return automatischeEinteilungen;
}

export async function getArbeitszeitAbsprachen(mitarbeiterId: number) {
  let arbeitszeitAbsprachen = await _arbeitszeit_absprache.getByMitarbeiterId(mitarbeiterId);
  arbeitszeitAbsprachen = arbeitszeitAbsprachen.map((aa) => {
    const aaObj = transformObject(aa, [
      { key: 'anfang', method: arbeitszeitAbspracheAnfang },
      { key: 'ende', method: arbeitszeitAbspracheEnde },
      {
        key: 'arbeitszeit_von_time',
        method: (ae) =>
          ae?.arbeitszeit_von ? formatDate(ae.arbeitszeit_von, 'HH:mm') : ae.arbeitszeit_von
      },
      {
        key: 'arbeitszeit_bis_time',
        method: (ae) =>
          ae?.arbeitszeit_bis ? formatDate(ae.arbeitszeit_bis, 'HH:mm') : ae.arbeitszeit_bis
      }
    ]);
    return aaObj;
  });
  return arbeitszeitAbsprachen;
}

type THashObjType<T, IsArray extends boolean> = Record<string | number, IsArray extends true ? T[] : T>;

type TResult = {
  rotationen: {
    [key: number]: [];
  };
  kontingente: {
    [key: number]: ({
      id: number;
      name: string | null;
    } & {
      [K in Exclude<keyof kontingents, 'id' | 'name'>]?: kontingents[K];
    }) & {
      default_last_year?: number;
      einteilungen?: {
        while_in_rotation: {
          default_eingeteilt: number;
          eingeteilt_sum: number;
          rotationen: Record<
            number,
            {
              von: Date;
              bis: Date;
              eingeteilt: number;
              eingeteilt_sum: number;
              einteilungen: Record<
                number,
                {
                  tage: string[];
                  eingeteilt_count_factor: number;
                  value: number;
                  name: string;
                }
              >;
            }
          >;
        };
        all: {
          default_eingeteilt: number;
          eingeteilt_sum: number;
          einteilungen: {
            [key: number]: {
              tage: string[];
              eingeteilt_count_factor: number;
              value: number;
              name: string;
            };
          };
        };
      };
    };
  };
  defaults: THashObjType<
    {
      id: number;
      mitarbeiter_id: number;
      eingeteilt: number;
      year: number;
    },
    false
  >;
  counted_in_kontingent: {
    [key: number]: {
      [key: string]: {
        [key: string]: {
          all: number[];
          in_rot: number[];
        };
      };
    };
  };
};

function createKontingentEingeteiltDefault(
  kontingent: Partial<kontingents> & Pick<kontingents, 'id' | 'name'>,
  kontingentId = 0,
  resultObj: TResult
) {
  if (resultObj.kontingente[kontingentId]) {
    return resultObj;
  }
  const defaultValue = resultObj.defaults[kontingentId]?.eingeteilt || 0;
  const lastYear = resultObj.defaults[kontingentId]?.year || 0;
  resultObj.rotationen[kontingentId] = [];
  resultObj.kontingente[kontingentId] = kontingent;
  resultObj.kontingente[kontingentId]['default_last_year'] = lastYear;
  resultObj.kontingente[kontingentId]['einteilungen'] = {
    while_in_rotation: {
      default_eingeteilt: 0,
      eingeteilt_sum: 0,
      rotationen: {}
    },
    all: {
      default_eingeteilt: defaultValue,
      eingeteilt_sum: defaultValue,
      einteilungen: {}
    }
  };
}

function addAndRound(value: number, add: number, roundValue = 2) {
  return Number((value + add).toFixed(roundValue));
}

function countEinteilungInKontingent(
  mitarbeiterId: number,
  einteilung: TResultEinteilungenInKontingente,
  hash: TResult
) {
  const konId = einteilung.kontingent_id;
  let factor = 0;
  let eingeteiltCountFactor = 0;
  if (einteilung.factor > 0) {
    eingeteiltCountFactor = einteilung.factor;
    factor = Number((1 / eingeteiltCountFactor).toFixed(2));
  }

  const countedInKontingent = hash.counted_in_kontingent;
  createKontingentEingeteiltDefault(
    {
      name: einteilung.kontingent_name,
      id: konId
    },
    konId,
    hash
  );

  let einteilungenHash = hash.kontingente[konId].einteilungen;
  let allEinteilungenHash = einteilungenHash?.all?.einteilungen;
  const defaultLastYear = hash.kontingente[konId].default_last_year || 0;

  if (einteilung.mitarbeiter_id === mitarbeiterId || hash.kontingente[konId] || factor > 0) {
    if (!countedInKontingent[konId]) {
      countedInKontingent[konId] = {};
    }
    const rotId = einteilung.id;
    const dateTag = einteilung.tag;
    const tag = formatDate(dateTag, 'yyyy-MM-dd');
    const dienstId = einteilung.po_dienst_id;
    const isInRot = einteilung.in_rot;

    if (!countedInKontingent[konId][tag]) {
      countedInKontingent[konId][tag] = {};
    }
    if (!countedInKontingent[konId][tag][dienstId]) {
      countedInKontingent[konId][tag][dienstId] = {
        all: [],
        in_rot: []
      };
    }

    if (!allEinteilungenHash) {
      allEinteilungenHash = {};
    }

    if (!einteilungenHash) {
      einteilungenHash = {
        while_in_rotation: {
          default_eingeteilt: 0,
          eingeteilt_sum: 0,
          rotationen: {}
        },
        all: {
          default_eingeteilt: 0,
          eingeteilt_sum: 0,
          einteilungen: {}
        }
      };
    }

    if (!allEinteilungenHash?.[dienstId]) {
      allEinteilungenHash[dienstId] = {
        tage: [],
        eingeteilt_count_factor: eingeteiltCountFactor,
        value: factor,
        name: einteilung.po_dienst_name
      };
    }

    const isTagBiggerLastDefaultYear = newDate(einteilung.tag).getFullYear() > defaultLastYear;
    if (countedInKontingent[konId][tag][dienstId].all.length === 0 && isTagBiggerLastDefaultYear) {
      einteilungenHash.all.eingeteilt_sum = addAndRound(einteilungenHash.all.eingeteilt_sum, factor, 2);
      allEinteilungenHash[dienstId].tage.push(tag);
    }

    if (isInRot) {
      if (!einteilungenHash.while_in_rotation.rotationen[rotId]) {
        einteilungenHash.while_in_rotation.rotationen[rotId] = {
          von: einteilung.von,
          bis: einteilung.bis,
          eingeteilt: 0,
          eingeteilt_sum: 0,
          einteilungen: {}
        };
      }
      const inRotCounter = einteilungenHash.while_in_rotation.rotationen[rotId];
      if (!inRotCounter.einteilungen[dienstId]) {
        inRotCounter.einteilungen[dienstId] = {
          tage: [],
          eingeteilt_count_factor: eingeteiltCountFactor,
          value: factor,
          name: einteilung.po_dienst_name
        };
      }

      if (countedInKontingent[konId][tag][dienstId].in_rot.length === 0) {
        einteilungenHash.while_in_rotation.eingeteilt_sum = addAndRound(
          einteilungenHash.while_in_rotation.eingeteilt_sum,
          factor,
          2
        );
        einteilungenHash.while_in_rotation.rotationen[rotId].eingeteilt_sum = addAndRound(
          einteilungenHash.while_in_rotation.rotationen[rotId].eingeteilt_sum,
          factor,
          2
        );
      }

      if (!inRotCounter.einteilungen[dienstId].tage.includes(tag)) {
        inRotCounter.einteilungen[dienstId].tage.push(tag);
        einteilungenHash.while_in_rotation.rotationen[rotId].eingeteilt = addAndRound(
          einteilungenHash.while_in_rotation.rotationen[rotId].eingeteilt,
          factor,
          2
        );
      }
      countedInKontingent[konId][tag][dienstId].in_rot.push(rotId);
    }
    countedInKontingent[konId][tag][dienstId].all.push(rotId);
  }
  return hash;
}

export async function getKontingentEingeteiltBasis(
  mitarbeiterId: number,
  einteilungenInKontingenten: TResultEinteilungenInKontingente[]
) {
  const kontingente = await _kontingent.getAll();
  const kontigentDefaultEingeteiltSum =
    await _mitarbeiter_default_eingeteilt.getKontingentDefaultEingeteiltsSum(mitarbeiterId);

  const defaults = processData('id', kontigentDefaultEingeteiltSum);

  const result: TResult = {
    rotationen: {},
    kontingente: {},
    defaults,
    counted_in_kontingent: {}
  };

  for (const kontingent of kontingente) {
    createKontingentEingeteiltDefault(kontingent, kontingent.id, result);
  }

  for (const einteilung of einteilungenInKontingenten) {
    countEinteilungInKontingent(mitarbeiterId, einteilung, result);
  }

  return result;
}
export async function mitarbeiterTeamAmByMitarbeiter(
  mitarbeiter: mitarbeiters & {
    einteilung_rotations: TRot[];
    funktion: {
      teams: teams | null;
    } | null;
  },
  date = newDate(),
  defaultTeam: teams | null = null,
  defaultKontingent: TDefaultKontingents | null = null
) {
  let team: teams | null = null;
  const tag = newDate(date);
  tag.setHours(12, 0, 0, 0);
  team =
    mitarbeiter.einteilung_rotations.find((rot) => {
      if (rot.von && rot.bis) {
        rot.von.setHours(12, 0, 0, 0);
        rot.bis.setHours(12, 0, 0, 0);
        return rot.von <= tag && rot.bis >= tag;
      }
      return false;
    })?.kontingents?.teams || null;
  if (!team && mitarbeiter.funktion?.teams) {
    team = mitarbeiter.funktion?.teams;
  }
  if (!team) {
    team = await getDefaultTeamForMitarbeiter(defaultTeam, defaultKontingent);
  }
  return team;
}

export function mitarbeiterAktivAm(
  mitarbeiter: _mitarbeiter.TMitarbeiterUrlaubssaldo,
  date = newDate()
) {
  let aktiv = !!mitarbeiter.aktiv;
  const tag = newDate(date);
  tag.setHours(12, 0, 0, 0);
  if (aktiv && mitarbeiter.aktiv_bis) {
    mitarbeiter.aktiv_bis.setHours(12, 0, 0, 0);
    aktiv = mitarbeiter.aktiv_bis >= tag;
  }
  if (aktiv && mitarbeiter.aktiv_von) {
    mitarbeiter.aktiv_von.setHours(12, 0, 0, 0);
    aktiv = mitarbeiter.aktiv_von <= tag;
  }
  if (aktiv) {
    aktiv = !!(
      Vertrag.vertragsPhaseAm(tag, mitarbeiter.vertrags) &&
      Vertrag.vertragsArbeitszeitAm(tag, mitarbeiter.vertrags)
    );
  }
  return aktiv;
}

export function mitarbeiterUrlaubssaldoAktivAm(
  mitarbeiter: _mitarbeiter.TMitarbeiterUrlaubssaldo,
  date = newDate()
) {
  const tag = newDate(date);
  tag.setHours(12, 0, 0, 0);
  const aktiv = !mitarbeiter.urlaubssaldo_abspraches.find((a) => {
    if (a.von && a.bis) {
      a.von.setHours(12, 0, 0, 0);
      a.bis.setHours(12, 0, 0, 0);
      return a.von <= tag && a.bis >= tag;
    }
    return false;
  });
  if (!aktiv) return aktiv;
  return mitarbeiterAktivAm(mitarbeiter, date);
}

export async function getVKOverview(von: Date, bis: Date) {
  const start = newDateYearMonthDay(von.getFullYear(), von.getMonth() + 1, 0);
  const ende = newDateYearMonthDay(bis.getFullYear(), bis.getMonth() + 1, 0);
  const result: Record<
    string,
    Record<
      number,
      ReturnType<typeof Vertrag.vkAndVgruppeInMonth> & {
        planname: string;
        aktiv: boolean;
        team: teams | null;
        funktion: funktions | null;
      }
    >
  > = {};
  if (start > ende) return result;
  const mitarbeiter = await _mitarbeiter.getMitarbeiterForUrlaubssaldis([], start, ende, true);

  const defaultTeam = await _team.getDefaultTeam();
  const defaultKontingent = await _kontingent.getDefaults();
  let date = start;
  const mitarbeiterLength = mitarbeiter.length;
  while (date <= ende) {
    const dateKey = getDateStr(date);
    result[dateKey] ||= {};
    for (let i = 0; i < mitarbeiterLength; i++) {
      const mit = mitarbeiter[i];
      result[dateKey][mit.id] = {
        ...Vertrag.vkAndVgruppeInMonth(date, mit.vertrags),
        planname: mit.planname || '',
        aktiv: !!(mit.account_info && mitarbeiterAktivAm(mit, date)),
        team: await mitarbeiterTeamAmByMitarbeiter(mit, date, defaultTeam, defaultKontingent),
        funktion: mit.funktion
      };
    }
    date = newDateYearMonthDay(date.getFullYear(), date.getMonth() + 2, 0);
  }

  return result;
}

type TTeamVKOverview = Record<
  string,
  Record<
    number,
    {
      vk: number;
      team: string;
      kontingente: Record<
        number,
        {
          vk: number;
          kontingent: string;
          mitarbeiter: Record<
            number,
            ReturnType<typeof Vertrag.vkAndVgruppeInMonth> & { planname: string }
          >;
        }
      >;
    }
  >
>;

function addToVKKontingentResult(
  result: TTeamVKOverview,
  team: teams | null,
  kontingent: kontingents | null,
  mit: _mitarbeiter.TMitarbeiterUrlaubssaldo,
  date: Date,
  vk: ReturnType<typeof Vertrag.vkAndVgruppeInMonth>
) {
  const dateKey = getDateStr(date);
  const teamId = team?.id || 0;
  const kontingentId = kontingent?.id || 0;
  result[dateKey][teamId] ||= {
    vk: 0.0,
    kontingente: {},
    team: team?.name || ''
  };
  result[dateKey][teamId].kontingente[kontingentId] ||= {
    vk: 0.0,
    mitarbeiter: {},
    kontingent: kontingent?.name || 'kein Kontingent'
  };
  const vkNumber = Number(vk.vk_month) || 0;
  result[dateKey][teamId].vk += vkNumber;
  result[dateKey][teamId].kontingente[kontingentId].vk += vkNumber;
  result[dateKey][teamId].kontingente[kontingentId].mitarbeiter[mit.id] ||= {
    ...vk,
    planname: mit.planname || ''
  };
}

export async function getTeamVkOverview(von: Date, bis: Date) {
  const start = newDateYearMonthDay(von.getFullYear(), von.getMonth() + 1, 0);
  const ende = newDateYearMonthDay(bis.getFullYear(), bis.getMonth() + 1, 0);
  const result: TTeamVKOverview = {};
  if (start > ende) return result;
  const mitarbeiter = await _mitarbeiter.getMitarbeiterForUrlaubssaldis([], start, ende, true);

  let date = start;
  while (date <= ende) {
    date.setHours(12, 0, 0, 0);
    const dateKey = getDateStr(date);
    result[dateKey] ||= {};
    mitarbeiter.forEach((mit) => {
      const vk = Vertrag.vkAndVgruppeInMonth(date, mit.vertrags);
      if (!vk.vk_month) return;
      const rotations = mit.einteilung_rotations.filter((rot) => {
        if (!rot.von || !rot.bis) return false;
        rot.von.setHours(12, 0, 0, 0);
        rot.bis.setHours(12, 0, 0, 0);
        if (rot.von <= date && rot.bis >= date) {
          addToVKKontingentResult(
            result,
            rot?.kontingents?.teams || null,
            rot?.kontingents || null,
            mit,
            date,
            vk
          );
          return true;
        }
        return false;
      });
      if (!rotations.length) {
        addToVKKontingentResult(result, mit?.funktion?.teams || null, null, mit, date, vk);
      }
    });
    date = newDateYearMonthDay(date.getFullYear(), date.getMonth() + 2, 0);
  }

  return result;
}
