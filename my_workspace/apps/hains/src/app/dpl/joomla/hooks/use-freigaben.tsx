import React, { useCallback, useEffect, useState } from 'react';
import {
  Freigaben,
  Freigabe,
  Freigabestatus,
  Freigabetyp,
  Funktion,
  Mitarbeiter,
  Rotation,
  TableMitarbeiter
} from '../components/utils/table/types/freigaben';
import {
  Column,
  HeadRow,
  TableData
} from '../components/utils/table/types/table';
import { UseMounted } from './use-mounted';
import { FormData } from '../components/freigaben/Form';
import { Reason, User } from '../helper/ts_types';
import { returnError } from '../helper/hains';
import { isObject } from '../helper/types';
import { defaultSearch } from '../components/utils/table/SearchData';
import { GroupResults, Route, groupedRequest } from '../helper/api_helper';
import Abwesend from '../components/freigaben/Abwesend';
import styles from '../freigaben/app.module.css';
import { getDateFromJSDate } from '../helper/dates';
import { getNestedAttr } from '../helper/util';

type Rotationen = {
  [key: number]: Rotation;
};

type FreigabeTypColumn = Column & {
  sort: number;
};

type AllowedHashes<T> = {
  [key: number]: T;
  original: T[];
  unqualifiziert?: T;
};

type ResultsDataHashesContainer = {
  funktionen: AllowedHashes<Funktion>;
  freigabestatuse: AllowedHashes<Freigabestatus>;
  freigabetypen: AllowedHashes<Freigabetyp>;
};

type ResultsDataContainer = {
  mitarbeiter: {
    [key: number]: TableMitarbeiter;
  };
  freigabeTypenHeader: FreigabeTypColumn[];
} & ResultsDataHashesContainer;

const getTwoMonthsInAdvance = () => {
  const date = new Date();
  date.setMonth(date.getMonth() + 2);
  return getDateFromJSDate(date);
};

const routes: Route[] = [
  {
    route: 'rotation_in_month',
    method: 'get',
    data: { date: getTwoMonthsInAdvance() }
  },
  { route: 'list_freigabetypen', method: 'get' },
  { route: 'list_aktive_arzte', method: 'get' },
  { route: 'list_funktionen', method: 'get' },
  { route: 'list_freigabestatus', method: 'get' },
  { route: 'freigaben', method: 'get' }
];

type HashDataCallback<T> = (obj: T) => void;

const hashData = <T extends Funktion | Freigabetyp | Freigabestatus>(
  data: T[],
  hash: AllowedHashes<T>,
  callback?: HashDataCallback<T>
): void => {
  hash.original = Array.isArray(data) ? data : [];
  data?.forEach?.((obj: T) => {
    hash[obj.id] = obj;
    if (callback) callback?.(obj);
  });
};

const dataFunctions = [
  {
    key: 'list_funktionen',
    fkt: (data: Funktion[], hashes: ResultsDataContainer) => {
      hashData<Funktion>(
        data.sort((a, b) => a.prio - b.prio),
        hashes.funktionen
      );
    }
  },
  {
    key: 'list_freigabestatus',
    fkt: (data: Freigabestatus[], hashes: ResultsDataContainer) => {
      hashData<Freigabestatus>(data, hashes.freigabestatuse);
      hashes.freigabestatuse.unqualifiziert = data?.find?.(
        (f) => !f?.qualifiziert
      );
    }
  },
  {
    key: 'list_freigabetypen',
    fkt: (
      data: Freigabetyp[],
      hashes: ResultsDataContainer,
      callback?: HashDataCallback<Freigabetyp>
    ) => {
      hashData<Freigabetyp>(
        data.sort((a, b) => a.name.localeCompare(b.name)),
        hashes.freigabetypen,
        callback
      );
    }
  },
  {
    key: 'list_aktive_arzte',
    fkt: (data: Mitarbeiter[], hashes: ResultsDataContainer) => {
      data?.forEach?.((m) => {
        hashes.mitarbeiter[m.id] = { ...m, freigaben: {} };
      });
    }
  },
  {
    key: 'rotation_in_month',
    fkt: (data: Rotationen, hashes: ResultsDataContainer) => {
      if (!isObject(data)) return;
      for (const mitarbeiter_id in data) {
        const rotation = data[mitarbeiter_id];
        if (hashes.mitarbeiter?.[mitarbeiter_id]) {
          hashes.mitarbeiter[mitarbeiter_id].rotation = rotation;
        }
      }
    }
  },
  {
    key: 'freigaben',
    fkt: (data: Freigabe[], hashes: ResultsDataContainer) => {
      data?.forEach?.((f) => {
        const mitarbeiter_id = f.mitarbeiter_id;
        const freigaben = hashes.mitarbeiter?.[mitarbeiter_id]?.freigaben;
        if (freigaben) {
          freigaben[f.freigabetyp_id] = {
            ...f,
            freigabetyp: hashes.freigabetypen[f.freigabetyp_id],
            freigabestatus: hashes.freigabestatuse[f.freigabestatus_id]
          };
        }
      });
    }
  }
];

const getFormData = (
  freigabetyp: Freigabetyp,
  evt: React.MouseEvent<Element, MouseEvent>,
  row: TableData
): FormData => {
  const freigaben = 'freigaben' in row ? row.freigaben : {};
  const freigabetypId = freigabetyp.id;
  const freigabe =
    typeof freigaben === 'object' ? freigaben[freigabetypId] : null;
  const mitarbeiterId = typeof row.id === 'number' ? row.id : 0;
  return {
    row,
    planname: 'planname' in row ? row.planname?.toString?.() : '',
    mitarbeiter_id: mitarbeiterId,
    freigabetyp_id: freigabetypId,
    freigabestatus_id: freigabe?.freigabestatus_id || 0,
    freigabe_id: freigabe?.id || 0,
    freigabetyp: freigabetyp.name,
    position: [evt.clientX, evt.clientY]
  };
};

const renderTitle = (title: string, className: string) => {
  return (
    <div key={title} className={className}>
      <p>{title}</p>
    </div>
  );
};

const renderStyle = (
  row: HeadRow | TableData,
  freigabetyp: Freigabetyp,
  hashes: ResultsDataContainer
) => {
  if ('columns' in row) return {};
  const statusColor =
    getNestedAttr(row, `freigaben.${freigabetyp.id}.freigabestatus.color`) ||
    '';
  const color = statusColor || hashes.freigabestatuse?.unqualifiziert?.color;
  return color
    ? {
        backgroundColor: color,
        color,
        borderRadius: '25%'
      }
    : {};
};

const createFreigabe = (
  freigabe: any,
  hashes: ResultsDataContainer
): Freigabe => {
  return {
    freigabestatus_id: parseInt(freigabe?.freigabestatus_id, 10) || 0,
    freigabetyp_id: parseInt(freigabe?.freigabetyp_id, 10) || 0,
    id: parseInt(freigabe?.id, 10) || 0,
    mitarbeiter_id: parseInt(freigabe?.mitarbeiter_id, 10) || 0,
    standort_id: parseInt(freigabe?.standort_id, 10) || null,
    user_id: parseInt(freigabe?.user_id, 10) || null,
    freigabestatus: hashes.freigabestatuse[freigabe?.freigabestatus_id],
    freigabetyp: hashes.freigabetypen[freigabe?.freigabetyp_id]
  };
};

const prepareData = (
  result: GroupResults,
  createFreigabetypHeader: (
    freigabetyp: Freigabetyp,
    hashes: ResultsDataContainer
  ) => FreigabeTypColumn
) => {
  const hashes: ResultsDataContainer = {
    mitarbeiter: {},
    funktionen: { original: [] },
    freigabestatuse: { original: [] },
    freigabetypen: { original: [] },
    freigabeTypenHeader: []
  };
  dataFunctions.forEach(({ key, fkt }) => {
    const error = result?.[key]?.error;
    const _data = result?.[key]?.data;
    if (_data) {
      fkt(_data, hashes, (freigabetyp: Freigabetyp) => {
        hashes.freigabeTypenHeader.push(
          createFreigabetypHeader(freigabetyp, hashes)
        );
      });
    } else {
      console.error('REQUEST_ERROR (key, result, error)', key, result, error);
    }
  });
  return hashes;
};

const searchHeadRows: HeadRow[] = [
  {
    columns: [{ title: 'Mitarbeiter', dataKey: 'planname' }]
  }
];

export const UseFreigaben = (user: User, hainsOAuth: any) => {
  const [data, setData] = useState<TableMitarbeiter[]>([]);
  const [filteredData, setFilteredData] = useState<TableData[]>([]);
  const [currentData, setCurrentData] = useState<TableData[]>([]);
  const [formData, setFormData] = useState<FormData>(null);
  const [lastScroll, setLastScroll] = useState([0, 0]);
  const [hashes, setHashes] = useState<ResultsDataContainer>({
    mitarbeiter: {},
    funktionen: { original: [] },
    freigabestatuse: { original: [] },
    freigabetypen: { original: [] },
    freigabeTypenHeader: []
  });
  const [freigabetypenIds, setFreigabetypenIds] = useState<number[]>([]);
  const [funktionenIds, setFunktionenIds] = useState<number[]>([]);
  const [headRows, setHeadRows] = useState<HeadRow[]>([]);
  const [currentHeadRows, setCurrentHeadRows] = useState<HeadRow[]>([]);
  const [showLoader, setShowLoader] = useState(false);

  const mounted = UseMounted();

  const cleanUp = () => {
    setFormData(() => null);
    setData(() => []);
    setFilteredData(() => []);
    setCurrentData(() => []);
    setFreigabetypenIds(() => []);
    setFunktionenIds(() => []);
    setHashes(() => ({
      mitarbeiter: {},
      funktionen: { original: [] },
      freigabestatuse: { original: [] },
      freigabetypen: { original: [] },
      freigabeTypenHeader: []
    }));
  };

  const updateFilteredData = () => {
    const table = document.querySelector('table');
    if (table) {
      setLastScroll(() => [table.scrollLeft, table.scrollTop]);
    }
    setFilteredData(() =>
      data.filter((row) => {
        if (!('funktion_id' in row)) return false;
        const funktionId = parseInt(row.funktion_id?.toString?.() || '0', 10);
        return funktionenIds.includes(funktionId);
      })
    );
  };

  const updateAbwesend = (_data: any, row: TableData) => {
    if (!(mounted && user)) return;
    if (!(_data.abwesend !== undefined && 'abwesend' in row)) return;
    row.abwesend = !!_data.abwesend;
    if (Array.isArray(_data?.dienstfreigabes)) {
      const freigaben: Freigaben = {};
      _data.dienstfreigabes.forEach((freigabe: any) => {
        const freigabetypId = parseInt(freigabe.freigabetyp_id, 10) || 0;
        freigaben[freigabetypId] = createFreigabe(freigabe, hashes);
      });
      row.freigaben = freigaben;
      updateFilteredData();
    }
  };

  const sendAbwesend = (row: TableData, finishLoading: () => void) => {
    const id = row?.id;
    if (!id) {
      finishLoading();
      return;
    }
    hainsOAuth
      .api('toggle_abwesend', 'get', {
        id
      })
      .then(
        (_data: any) => {
          updateAbwesend(_data, row);
          finishLoading();
        },
        (err: Reason) => {
          returnError(err);
          finishLoading();
        }
      );
  };

  const createFreigabetypHeader = (
    freigabetyp: Freigabetyp,
    _hashes: ResultsDataContainer
  ): FreigabeTypColumn => {
    let sort = 0;
    if ('sort' in freigabetyp) {
      sort = freigabetyp.sort;
    }
    return {
      title: freigabetyp.name,
      dataKey: `freigaben.${freigabetyp.id}.freigabestatus_id`,
      hoverTitle: freigabetyp.beschreibung,
      sort,
      id: freigabetyp.id.toString(),
      headRender: () => renderTitle(freigabetyp.name, styles.head_freigabetyp),
      getColumnStyle: (row) => renderStyle(row, freigabetyp, _hashes),
      bodyOnClick: (evt, row) => {
        evt.stopPropagation();
        setFormData(() => getFormData(freigabetyp, evt, row));
      }
    };
  };

  const updateFormDataByResponse = (
    freigabe: any,
    newFormData: FormData,
    freigabetyp_id: number
  ) => {
    if (!(isObject(freigabe) && freigabe?.id && newFormData)) return;
    const freigaben =
      'freigaben' in newFormData.row ? newFormData.row.freigaben : null;
    if (!(freigaben && typeof freigaben === 'object')) return;
    freigaben[freigabetyp_id] = createFreigabe(freigabe, hashes);
    updateFilteredData();
  };

  const formHandler = (
    freigabestatus_id: number,
    setLoader: (bool: boolean) => void
  ) => {
    const newFormData = formData ? { ...formData, freigabestatus_id } : null;
    setFormData(() => newFormData);
    const mitarbeiter_id = newFormData?.mitarbeiter_id;
    const freigabetyp_id = newFormData?.freigabetyp_id;
    if (!mitarbeiter_id || !freigabetyp_id || !freigabestatus_id) return;
    hainsOAuth
      .api('update_freigabe', 'post', {
        freigabestatus_id,
        freigabetyp_id,
        mitarbeiter_id
      })
      .then(
        (freigabe: any) => {
          if (!(mounted && user)) return;
          updateFormDataByResponse(freigabe, newFormData, freigabetyp_id);
          setLoader(false);
          setFormData(() => null);
        },
        (err: any) => {
          returnError(err);
          if (!(mounted && user)) return;
          setLoader(false);
          setFormData(() => null);
        }
      );
  };

  useEffect(() => {
    if (user && mounted && hainsOAuth.api) {
      setShowLoader(() => true);
      groupedRequest(hainsOAuth, routes, (result: GroupResults) => {
        if (!(mounted && user)) return;
        const _hashes = prepareData(result, createFreigabetypHeader);
        setHashes(() => _hashes);
        setData(() => Object.values(_hashes.mitarbeiter));
        setFunktionenIds(() =>
          _hashes.funktionen.original.reduce((acc: number[], f) => {
            if (f.id !== 6) acc.push(f.id);
            return acc;
          }, [])
        );
        setFreigabetypenIds(() =>
          _hashes.freigabetypen.original.map((f) => f.id)
        );
        setShowLoader(() => false);
      });
    }
    return cleanUp;
  }, [mounted, user, hainsOAuth]);

  useEffect(() => {
    const defaultColumns: Column[] = [
      { title: 'Mitarbeiter', dataKey: 'planname' },
      {
        title: 'Abw',
        dataKey: 'abwesend',
        hoverTitle: 'Abwesend',
        bodyRender: (row: TableData) => Abwesend({ row, sendAbwesend })
      },
      {
        title: 'Rotation',
        dataKey: 'rotation.kontingent.name',
        defaultValue: 'Keine'
      }
    ];
    const columns = [
      ...defaultColumns,
      ...hashes.freigabeTypenHeader.sort((a, b) => a.sort - b.sort)
    ];
    const newHeader = [{ columns }];
    setHeadRows(() => newHeader);
  }, [data, hashes, funktionenIds]);

  const search = useCallback(
    (searchValue: string, _data: TableData[]) => {
      if (!mounted) return;
      defaultSearch(
        searchValue,
        _data,
        searchHeadRows,
        (newData: TableData[]) => {
          mounted && setCurrentData(() => newData);
        }
      );
    },
    [searchHeadRows, mounted, setCurrentData]
  );

  useEffect(() => {
    const table = document.querySelector('table');
    if (table) {
      table.scrollLeft = lastScroll[0];
      table.scrollTop = lastScroll[1];
    }
  }, [lastScroll]);

  useEffect(() => {
    updateFilteredData();
  }, [funktionenIds, data]);

  useEffect(() => {
    if (headRows.length) {
      setCurrentHeadRows(() => {
        const columns = headRows[0].columns.filter((column) => {
          return (
            !column.id || freigabetypenIds.includes(parseInt(column.id, 10))
          );
        });
        return [{ columns }];
      });
    }
  }, [freigabetypenIds, headRows]);

  return {
    setFormData,
    hashes,
    funktionenIds,
    setFunktionenIds,
    freigabetypenIds,
    setFreigabetypenIds,
    search,
    filteredData,
    currentData,
    currentHeadRows,
    formData,
    formHandler,
    showLoader
  };
};
