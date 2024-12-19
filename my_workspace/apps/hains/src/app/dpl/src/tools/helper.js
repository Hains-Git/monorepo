import hello from 'hellojs';
import {
  possibleConflict,
  seriousConflict,
  wunschErfuellt
} from '../styles/basic';
import {
  formatDate,
  getMonth,
  getTagLabel,
  getWeek,
  getWeekday,
  toDate,
  today
} from './dates';
import { debounce, wait } from './debounce';
import { isArray, isFunction, isObject } from './types';
import { returnError } from './hains';

export const keinTeamName = 'Ohne Team';

/**
 * Die Farben werden durch eine 6-stellige HEX-Zahl bestimmt
 */
export const HEX = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'a',
  'b',
  'c',
  'd',
  'e',
  'f'
];

/**
 * Exportiert hello("hains")
 */
export const hainsOAuth = hello('hains');

/**
 * ruft den Api-Endpunkt auf und liefert die Daten zurück.
 * Dabei wird nur der letzte Aufruf ausgeführt.
 * @param {String} path
 * @param {String} method
 * @returns Function (data, respFkt, errFkt)
 */
const cancellableApiCall = (path = '', method = 'get') => {
  let nonce = {};
  return (data = {}, respFkt = () => {}, errFkt = () => {}) => {
    const thisNonce = {};
    nonce = thisNonce;
    hainsOAuth?.api?.(path, method, data).then(
      (res) => {
        if (nonce === thisNonce) {
          respFkt(res);
        }
      },
      (err) => {
        if (nonce === thisNonce) {
          if (errFkt) errFkt?.(err);
          else returnError(err);
        }
      }
    );
  };
};

export const getVorschlaegeGroupTitle = (tr) => {
  const defaultReturn = 'ignore';
  if (!tr) return defaultReturn;
  const prev = tr.previousElementSibling;
  const abwesend = tr.getAttribute('data-abwesend') === 'true';
  const notDienstteam = tr.getAttribute('data-not-dienstteam') === 'true';
  const aktiv = tr.getAttribute('data-aktiv') === 'true';
  const title = [];
  aktiv ? title.push('aktiv') : title.push('inaktiv');
  abwesend ? title.push('abwesend') : title.push('anwesend');
  notDienstteam
    ? title.push('nicht im Dienstteam')
    : title.push('im Dienstteam');
  if (!title.length) return defaultReturn;
  if (prev) {
    if (prev.className.includes('ignore_check_row')) return defaultReturn;
    const prevAbwesend = prev.getAttribute('data-abwesend') === 'true';
    const prevNotDienstteam =
      prev.getAttribute('data-not-dienstteam') === 'true';
    if (prevAbwesend === abwesend && prevNotDienstteam === notDienstteam)
      return defaultReturn;
  }
  return title.join(', ');
};

/**
 * Api-Endpunkte
 */
export const apiMe = debounce(cancellableApiCall('me', 'get'), wait);
export const apiAppData = cancellableApiCall('app_data', 'get');
export const apiUpdateVerteiler = cancellableApiCall(
  'update_verteiler',
  'post'
);
export const apiGetAntraege = cancellableApiCall('get_antraege', 'post');
export const apiRotationen = debounce(
  cancellableApiCall('rotationen', 'post'),
  wait
);
export const apiGetDienstplaene = cancellableApiCall('get_dienstplaene', 'get');
export const apiGetEinteilungenOhneBedarf = cancellableApiCall(
  'get_einteilungen_ohne_bedarf',
  'post'
);
export const loadAbwesentheiten = cancellableApiCall(
  'load_abwesentheiten',
  'post'
);
export const saveAbwesentheitenSettings = cancellableApiCall(
  'save_abwesentheiten_settings',
  'post'
);
export const createNewCounterAbwesentheiten = cancellableApiCall(
  'create_counter_abwesentheiten',
  'post'
);
export const removeCounterAbwesentheiten = cancellableApiCall(
  'remove_counter_abwesentheiten',
  'post'
);
export const getEinteilungenForAntraege = debounce(
  cancellableApiCall('get_einteilungen_for_antraege', 'post'),
  wait
);

export const apiGetSaldi = debounce(
  cancellableApiCall('get_saldi', 'post'),
  wait
);
const apiAutoEinteilen = debounce(
  cancellableApiCall('auto_einteilen', 'post'),
  wait
);

/**
 * Aktiviert die automatischen Einteilungen des Dienstplans in der API
 * @param {String} start
 * @param {String} ende
 * @param {Funktion} setLoading
 */
export const autoEinteilen = (start, ende, setLoading) => {
  apiAutoEinteilen(
    {
      start,
      ende
    },
    () => {
      setLoading(false);
    },
    (err) => {
      setLoading(false);
      returnError(err);
    }
  );
};

/**
 * Liefert die RGB-Werte einer HEX-Farbe
 * @param {String} str
 * @returns Array
 */
export const getRGB = (str) => {
  const rgb = [];
  if (typeof str !== 'string') return rgb;
  const thisStr = str.trim().toLowerCase();
  if (/^#[0-9a-f]{6}$/.test(thisStr)) {
    const hex = thisStr.replace('#', '');
    rgb[0] = parseInt(hex.substring(0, 2), 16);
    rgb[1] = parseInt(hex.substring(2, 4), 16);
    rgb[2] = parseInt(hex.substring(4, 6), 16);
  } else if (/^#[0-9a-f]{3}$/.test(thisStr)) {
    const hex = thisStr.replace('#', '');
    rgb[0] = parseInt(hex.substring(0, 1), 16) * 17;
    rgb[1] = parseInt(hex.substring(1, 2), 16) * 17;
    rgb[2] = parseInt(hex.substring(2, 3), 16) * 17;
  }

  return rgb;
};

export const isSeriousConflict = (className) => className === seriousConflict;

export const isPossibleConflict = (className) => className === possibleConflict;

export const isWunschErfuellt = (className) => className === wunschErfuellt;

/**
 * Macht einen Deep-Clone des Javascript-Objekts, wobei Funktionen nicht
 * geklont werden
 * @param {Object} obj
 * @returns Object
 */
export const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

/**
 * Test: [true, false, true, false, false].sort((a,b) => a && !b ? -1 : b && !a ? 1 : 0)
 * => [true, true, false, false, false]
 * Sortiert die Boolean. True ist vorne.
 * @param {Boolean} a
 * @param {Boolean} b
 * @returns -1 or 0 or 1
 */
export const booleanSort = (a, b) => {
  if (a && !b) {
    return -1;
  }
  if (b && !a) {
    return 1;
  }
  return 0;
};

export const sortAuswahlDropdown = (arr, wunschPriorisieren = false) =>
  arr?.sort?.((a, b) => {
    const mitarbeiterA = a?.props?.mitarbeiter;
    const mitarbeiterB = b?.props?.mitarbeiter;
    const feldA = a?.props?.feld;
    const feldB = b?.props?.feld;
    const dienstIdA = feldA?.dienstId || 0;
    const dienstIdB = feldB?.dienstId || 0;
    const tagA = feldA?.tag || '';
    const tagB = feldB?.tag || '';
    // Von aktiv nach inaktiv sortieren
    const aktiv = booleanSort(mitarbeiterA?.aktivAm?.(tagA), mitarbeiterB?.aktivAm?.(tagB));
    if (aktiv !== 0) return aktiv;
    // In Team des Dienstes -> vorne
    const inTeam = booleanSort(
      !!mitarbeiterA?.isTrulyInTeam?.(feldA?.dienst?.team, tagA),
      !!mitarbeiterB?.isTrulyInTeam?.(feldB?.dienst?.team, tagB)
    );
    if (inTeam !== 0) return inTeam;
    // Von anwesend nach abwesend sortieren
    const abwesend = booleanSort(
      a?.props?.score?.props?.anwesend,
      b?.props?.score?.props?.anwesend
    );
    if (abwesend !== 0) return abwesend;
    // Von Mit Bedarf nach Ohne Bedarf sortieren
    const bedarf = booleanSort(
      feldA?.dienst?.hasBedarf,
      feldB?.dienst?.hasBedarf
    );
    if (bedarf !== 0) return bedarf;
    // Nach Freigaben sortieren absteigend
    // Freigaben 1 (alle), 0.5 (manche) und 0 (keine)
    const aFreigaben = mitarbeiterA?.anteilFreigaben?.(dienstIdA, true) || 0;
    const bFreigaben = mitarbeiterB?.anteilFreigaben?.(dienstIdB, true) || 0;
    const freigabe = bFreigaben - aFreigaben;
    if (freigabe !== 0) return freigabe;
    // Nach Wunsch erfüllt am Einteilungstag sortieren, absteigend
    // Wunsch erfüllt 1, kein Wunsch 0,5 und Wunsch nicht erfüllt 0
    const aWunsch = feldA?.wunschSuccess?.(mitarbeiterA, false)?.score || 0;
    const bWunsch = feldA?.wunschSuccess?.(mitarbeiterB, false)?.score || 0;
    const wunsch = bWunsch - aWunsch;
    if (wunschPriorisieren && wunsch !== 0) return wunsch;
    // Nach score sortieren absteigend
    const aScore = a?.props?.score?.value || 0;
    const bScore = b?.props?.score?.value || 0;
    const score = bScore - aScore;
    if (score !== 0) return score;
    // Falls bei Wunsch-Priorisiere nicht schon nach Wunsch sortiert wird,
    // wird es bei gleichem Score nochmal berücksichtigt
    return wunsch;
  }) || [];

export const compareArrays = (a, b) => {
  const hasArrays = isArray(a) && isArray(b);
  const sameLenght = hasArrays && a.length === b.length;
  const sameElements =
    sameLenght && a.every((element, index) => element === b[index]);
  return sameElements;
};

/**
 * Testet, ob value das valueToSearch enthält.
 * Wenn valuetoSearch in Anführungszeichen steckt, wird getestet,
 * ob es am Anfang des value steht.
 * @param {String} value
 * @param {String} valueToSearch
 * @returns True, wenn value das SearchValue entält
 */
export const stringIncludesSearchValue = (value, valueToSearch) => {
  const cleanedValue = value?.toString?.()?.trim?.()?.toLowerCase?.() || '';
  const searchValue =
    valueToSearch?.toString?.()?.trim?.()?.toLowerCase?.() || '';
  const l = searchValue.length - 1;
  if (l < 0) return true;
  if (l > 1 && searchValue.charAt(0) === '"' && searchValue.charAt(l) === '"') {
    return cleanedValue.indexOf(searchValue.substring(1, l).trim()) === 0;
  }
  return cleanedValue.indexOf(searchValue) >= 0;
};

/**
 * Testet Array aus Strings oder einen String auf das Enthaltensein
 * von valueToSearch.
 * @param {String|Array} value
 * @param {String} valueToSearch
 * @returns True, wenn value SearchValue enthält
 */
export const stringArrayOrStringIncludesSearchValue = (
  value,
  valueToSearch
) => {
  if (typeof value === 'string') {
    return stringIncludesSearchValue(value, valueToSearch);
  }
  let inSearch = false;
  value?.find?.((name) => {
    inSearch = stringIncludesSearchValue(name, valueToSearch);
    return inSearch;
  });
  return inSearch;
};

/**
 * Testet, ob der Value im valueToSearch enthalten ist.
 * valueToSearch kann ein Array aus Strings oder ein String sein.
 * Wenn der Suchbegriff in "" steckt, wird getestet, ob der Suchbegriff am Anfang
 * des String steckt.
 * Weiterhin können Suchbegriffe mit && und || verknüpft werden.
 * Wobei erst && und dann || ausgwertet werden.
 * @param {String|Array} value
 * @param {String} valueToSearch
 * @returns {Boolean} True, wenn der valueToSearch enthalten ist.
 */
export const booleanSearch = (value, valueToSearch) => {
  const isValid = valueToSearch?.trim?.() || '';
  if (!isValid) return true;
  const ors = valueToSearch.split('||').map((v) => v.split('&&'));
  let inSearch = false;
  ors.find((orValues) => {
    if (typeof orValues === 'string') {
      inSearch = stringArrayOrStringIncludesSearchValue(value, orValues);
      return inSearch;
    }
    inSearch = !!orValues?.reduce?.(
      (bool, andValue) =>
        bool && stringArrayOrStringIncludesSearchValue(value, andValue),
      true
    );
    return inSearch;
  });
  return inSearch;
};

/**
 * Führt ein BooleanSearch auf dem PlanerDate aus.
 * @param {Object} date PlanerDate
 * @param {String} valueToSearch
 * @param {String} typ kw
 * @returns {Boolean} True, wenn der valueToSearch enthalten ist.
 */
export const booleanPlanerDateSearch = (date, valueToSearch, typ = 'date') => {
  switch (typ) {
    case 'month':
      return booleanSearch(getMonth(date.id), valueToSearch);
    case 'weekday':
      return booleanSearch(getWeekday(date.id), valueToSearch);
    case 'week':
      return booleanSearch(getWeek(date.id), valueToSearch);
    default:
      return (
        booleanSearch(date.id, valueToSearch) ||
        booleanSearch(date?.label || '', valueToSearch) ||
        booleanSearch(date?.local_date_string || '', valueToSearch)
      );
  }
};

export const booleanSearchTitle =
  '\nSuchebegriff: Sucht nach einem Vorkommen des Begriffs irgendwo im Text.' +
  '\n"Suchebegriff": Sucht nach einem Vorkommen des Begriffs am Textanfang.' +
  '\nSuchebegriff1||Suchbegriff2: Durchsucht den Text nach dem Begriff1 ODER Begriff2.' +
  '\nSuchebegriff1&&Suchbegriff2: Durchsucht den Text nach dem Begriff1 UND Begriff2.';

export const cleanInactiveName = (name) => {
  const pattern =
    /(bis \d{4}-\d{1,2}-\d{1,2})|((OLD)?-\d{1,2}\.\d{1,2}\.\d{4})/;
  const pos = name.search(pattern);
  if (pos > 0) {
    return `${name.slice(0, pos).trim()} (NA)`;
  }

  return name.trim();
};

/**
 * Erstellt einen String mit entsprechenden Nachkommastellen
 * @param {Number} value
 * @param {Number} decimal
 * @returns {String} String
 */
export const toFixed = (value = 0, decimal = 0) => {
  const nr = parseFloat(value) || 0.0;
  return nr.toFixed(decimal);
};

/**
 * Führt die setWarning Methode der Page aus.
 * @param {Object} page
 * @param {String} warning
 */
export const setPageWarning = (page, warning) => {
  const thisWarning = typeof warning === 'string' ? warning : '';
  if (page?.setWarning) {
    page.setWarning(warning);
  } else {
    alert(thisWarning);
  }
};

/**
 * Vergleicht die String a und b numerisch
 * @param {String} a
 * @param {String} b
 */
export const numericLocaleCompare = (a, b) => {
  const result = a?.localeCompare?.(b, undefined, { numeric: true });
  return result === undefined ? 1 : result;
};

/**
 * Liefert den Monatsplanung-Query
 * @param {Object} query
 */
export const getMonatsplanungQueryParams = ({
  anfang = false,
  dienstplan_id = 0,
  force_refresh_bedarf = false,
  vorschlag = false
} = {}) => {
  const now = toDate(anfang) || today();
  now.setDate(1);
  return {
    anfang: formatDate(now),
    dienstplan_id,
    force_refresh_bedarf,
    vorschlag
  };
};

/**
 * Sortiert nach dem Namen des Mitarbeiters
 * @param {Object} a
 * @param {Object} b
 * @returns Number
 */
export const sortEinteilungenByPlanname = (a, b) => {
  return numericLocaleCompare(
    a?.mitarbeiter?.planname || 'zzz',
    b?.mitarbeiter?.planname || 'zzz'
  );
};

/**
 * Sortiert nach dem Namen des Arbeitsplatzes
 * @param {Object} a
 * @param {Object} b
 * @returns Number
 */
export const sortByRoom = (a, b) => {
  return numericLocaleCompare(
    a?.arbeitsplatz?.name || 'zzz',
    b?.arbeitsplatz?.name || 'zzz'
  );
};

export const getDefaultGroupSearchFkt = (group) => (element, value) =>
  booleanSearch(element?.[group.labelKey] || '', value);

/**
 * Liefert eine vordefinierte Searchgroup für ein Basic-Objekt.
 * @param {Object} basic
 * @param {String} key Keys = dienste, mitarbeiter, dates, kws, funktionen, mitarbeiterTeam, dienstTeam
 * @param {Boolean} Ob nur aktive Mitarbeiter betrachtet werden sollen
 * @returns Object
 * * {
 * *   label: String,
 * *   labelKey: String,
 * *   checked: Array,
 * *   searchValue: String,
 * *   data: Function (callback) => Array || Array
 * * Optional Properties:
 * *    sort: Function (a, b) => Number,
 * *    search: Function (value, searchValue) => Boolean
 * * }
 */
export const createSearchGroup = (basic, key, mActive = false) => {
  const groups = {
    dienste: {
      label: 'Dienste',
      labelKey: 'planname',
      checked: [],
      searchValue: '',
      data: (callback) => {
        const result = [];
        if (!isFunction(callback)) return result;
        const dienste = basic?._dienste || basic?._po_dienste;
        dienste?._each?.((dienst) => {
          result.push(callback(dienst));
        });
        return result;
      }
    },
    mitarbeiter: {
      label: 'Mitarbeiter',
      labelKey: 'cleanedPlanname',
      checked: [],
      searchValue: '',
      data: (callback) => {
        const result = [];
        if (!isFunction(callback)) return result;
        const mitarbeiter = basic?._mitarbeiter || basic?._mitarbeiters;
        mitarbeiter?._each?.((m) => {
          if (!mActive || (m?.aktiv && !m?.platzhalter)) {
            result.push(callback(m));
          }
        });
        return result;
      }
    },
    dates: {
      label: 'Tage',
      labelKey: 'label',
      checked: [],
      searchValue: '',
      data: (callback) => {
        const result = [];
        if (!isFunction(callback)) return result;
        basic?._dates?._each?.((date) => {
          result.push(callback(date));
        });
        return result;
      },
      sort: (date1, date2) => date1._zahl - date2._zahl,
      search: (date, value) => booleanPlanerDateSearch(date, value, 'day')
    },
    kws: {
      label: 'KWs',
      labelKey: 'week',
      checked: [],
      searchValue: '',
      data: (callback) => {
        const result = [];
        if (!isFunction(callback)) return result;
        const weeks = {};
        basic?._dates?._each?.((date) => {
          if (!weeks[date.week]) {
            weeks[date.week] = true;
            result.push(callback(date));
          }
        });
        return result;
      },
      sort: (date1, date2) => date1._zahl - date2._zahl,
      search: (date, value) => booleanPlanerDateSearch(date, value, 'week')
    },
    funktionen: {
      label: 'Funktionen',
      labelKey: 'planname',
      checked: [],
      searchValue: '',
      data: (callback) => {
        const result = [];
        if (!isFunction(callback)) return result;
        basic?._funktionen?._each?.((f) => {
          result.push(callback(f));
        });
        return result;
      }
    },
    mitarbeiterTeam: {
      label: 'Mitarbeiter-Team',
      labelKey: 'name',
      checked: [],
      searchValue: '',
      data: (callback) => {
        const result = [];
        if (!isFunction(callback)) return result;
        basic?._teams?._each?.((t) => {
          result.push(callback(t));
        });
        return result;
      }
    },
    dienstTeam: {
      label: 'Dienst-Team',
      labelKey: 'name',
      checked: [],
      searchValue: '',
      data: (callback) => {
        const result = [];
        if (!isFunction(callback)) return result;
        basic?._teams?._each?.((t) => {
          result.push(callback(t));
        });
        return result;
      }
    }
  };
  const group = isObject(groups?.[key]) ? groups[key] : groups.dienste;
  if (!isFunction(group?.search)) {
    group.search = getDefaultGroupSearchFkt(group);
  }
  return group;
};

/**
 * @param {Object} e
 * @returns True, wenn die Einteilung zum Filter passt
 */
export const isInFilter = (e, mainSearchValue, searchGroups) => {
  const checkGroup = (group) => {
    if (
      group.searchValue === '' &&
      mainSearchValue === '' &&
      !group.checked.length
    )
      return true;
    return !!group.checked.find((el) => {
      switch (group.label) {
        case 'Dienste':
          return parseInt(el.id, 10) === parseInt(e?.po_dienst_id, 10);
        case 'Mitarbeiter':
          return parseInt(el.id, 10) === parseInt(e?.mitarbeiter_id, 10);
        case 'Tage':
          return el.id === e?.tag;
        case 'KWs':
          return parseInt(el.week, 10) === parseInt(e?.date?.week, 10);
        case 'Funktionen':
          return (
            parseInt(el.id, 10) === parseInt(e?.mitarbeiter?.funktion_id, 10)
          );
        case 'Mitarbeiter-Team':
          return el?.hasMitarbeiter?.(parseInt(e?.mitarbeiter_id, 10) || 0);
        case 'Dienst-Team':
          return el?.hasDienst?.(parseInt(e?.po_dienst_id, 10) || 0);
      }
      return true;
    });
  };
  const main = { checked: false, size: 0 };
  const groups = { checked: true, size: 0 };
  // Haupt-Suche muss auf einer der Gruppen zutreffen (OR)
  // Suche auf Gruppe muss über alle zutreffen (AND)
  for (const key in searchGroups) {
    const group = searchGroups[key];
    const checked = checkGroup(group);
    if (group.searchValue === '') {
      main.checked = main.checked || checked;
      main.size++;
    } else {
      groups.checked = groups.checked && checked;
      groups.size++;
    }
  }
  return (!main.size || main.checked) && (!groups.size || groups.checked);
};

/**
 * Berechnet die Team-Bedarfe
 * @param {Object} team
 * @param {Object} teamBedarf
 * @param {Object} dateResult
 * @returns Object
 */
const addToTeamBedarf = (team, teamBedarf, dateResult) => {
  const result = teamBedarf || team?.defaultBedarf;
  if (!result) return false;
  if (dateResult) {
    const min = dateResult?.bedarfe_min || 0;
    const eingeteilt = dateResult?.bedarfe_eingeteilt || 0;
    result.Min += dateResult?.bedarfe_min || 0;
    result.Opt += dateResult?.bedarfe_opt || 0;
    // result.Bedarf += dateResult?.bedarfe_eingeteilt || 0;
    const bedarf = min - eingeteilt;
    result.Bedarf += bedarf > 0 ? bedarf : 0;
    result.Einteilung += dateResult?.einteilungen || 0;
    result.Krank += dateResult?.krank || 0;
    result.Urlaub += dateResult?.urlaub || 0;
    result.Sonstig += dateResult?.sonstige || 0;
    result.Verfuegbar += dateResult?.verfuegbar || 0;
    if (dateResult.funktionen) {
      if (!result.Funktionen) result.Funktionen = {};
      for (const fId in dateResult.funktionen) {
        const funktion = dateResult.funktionen[fId]?.funktion;
        const count = dateResult.funktionen[fId]?.count || 0;
        if (!result.Funktionen[fId])
          result.Funktionen[fId] = {
            count: 0,
            label: funktion?.planname || 'ERROR',
            order: funktion?.prio || 0,
            id: funktion?.id || fId
          };
        result.Funktionen[fId].count += count;
      }
    }
  }
  return result;
};

/**
 * Sortiert die Saldi nach Tag und Team.
 * saldi = {tag: {teamId: Saldi}}
 * @param {Object} resSaldi
 * @param {Array} resDates
 * @param {Object} statistiken
 * @param {Object} teams
 * @param {Function} newTeam
 * @returns Object
 */
export const prepareUrlaubsSaldi = (
  resSaldi,
  resDates,
  statistiken,
  teams,
  newTeam = (team) => team
) => {
  const saldi = {};
  let defaultTeam = false;
  if (
    isObject(resSaldi) &&
    isArray(resDates) &&
    isFunction(newTeam) &&
    isObject(teams) &&
    isObject(statistiken)
  ) {
    const keinTeamDates = resSaldi?.[0]?.dates || {};
    const keinTeamIsEmpty = !Object.keys(keinTeamDates).length;
    if (keinTeamIsEmpty && resSaldi?.[0]) {
      delete resSaldi[0];
    }
    for (const teamId in resSaldi) {
      const data = resSaldi[teamId];
      const team = data?.team && newTeam?.(data?.team);
      if (!team) return saldi;
      teams[teamId] = team;
      if (team.default) defaultTeam = team;
      resDates.forEach((tag) => {
        if (!saldi[tag]) saldi[tag] = {};
        saldi[tag][teamId] = addToTeamBedarf(
          team,
          saldi?.[tag]?.[teamId],
          data?.dates?.[tag]
        );
      });
    }
    resDates.forEach((tag) => {
      statistiken?.verteilenUrlaubsStatistikTeams?.(
        saldi[tag],
        defaultTeam?.label || keinTeamName,
        teams,
        tag
      );
    });
  }
  return saldi;
};

/**
 * Berechnet das Saldo für ein Team und erstellt dessen Titel
 * @param {Number} teamId
 * @param {String} tag
 * @param {Object} saldi
 * @param {Object} statistiken
 * @param {Object} teams
 * @returns Object
 */
export const getSaldo = (teamId, tag, saldi, statistiken, teams) => {
  const teamSaldi = saldi?.[tag]?.[teamId];
  const { saldo, puffer, teamKrankPuffer } = (teamSaldi &&
    statistiken?.getUrlaubssaldo?.(teamSaldi, teams, tag)) || {
    saldo: 0,
    puffer: 0
  };
  const title =
    (teamSaldi &&
      statistiken?.createUrlaubssaldoTitle?.(
        teamSaldi,
        teamSaldi.label,
        saldo,
        puffer,
        [
          {
            txt: `Tag: ${getTagLabel(tag)}`
          }
        ],
        teamKrankPuffer
      )) ||
    [];
  return {
    saldo,
    title,
    label: teamSaldi?.label || 'ERROR'
  };
};

export const getRandomNumberNotInSet = (max = 100, set = new Set()) => {
  const number = Math.floor(Math.random() * max);
  if (set.has(number)) {
    return getRandomNumberNotInSet(max, set);
  }
  set.add(number);
  return number;
};

export const getPrioRotationHelper = (
  rotationen = {},
  rotationenIds = [],
  check = () => true
) => {
  let prioRot = false;
  rotationenIds.forEach((rId) => {
    const r = rotationen?.[rId];
    let prio = parseInt(r?.prioritaet, 10);
    if (Number.isNaN(prio)) prio = Infinity;
    let prioRotPrio = parseInt(prioRot?.prioritaet, 10);
    if (Number.isNaN(prioRotPrio)) prioRotPrio = Infinity;
    if (r && check(r) && (!prioRot || prio < prioRotPrio)) {
      prioRot = r;
    }
  });
  return prioRot;
};

