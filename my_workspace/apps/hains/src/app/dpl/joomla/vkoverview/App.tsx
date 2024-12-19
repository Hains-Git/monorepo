import React, { useCallback, useState } from 'react';
import { Reason, User } from '../helper/ts_types';
import { UseMounted } from '../hooks/use-mounted';
import { returnError } from '../helper/hains';
import Table, { TableOptions } from '../components/utils/table/Table';
import DateInput, { GetData } from '../components/utils/date-input/DateInput';
import {
  Column,
  HeadRow,
  TableData
} from '../components/utils/table/types/table';
import { getDateFromJSDate } from '../helper/dates';
import { isObject } from '../helper/types';
import SearchData, {
  defaultSearch
} from '../components/utils/table/SearchData';

import styles from './app.module.css';
import CustomButton from '../components/utils/custom-button/CustomButton';

type VkMitarbeiter = {
  month_mid: string;
  tag: string;
  vgruppe: string;
  vk: string;
  vk_month: string;
  von: string;
  planname: string;
  aktiv: boolean;
};

type VKData = {
  [key: string]: {
    [key: string]: VkMitarbeiter;
  };
};

type MitarbeiterRowIndex = {
  active: {
    [key: string]: number;
  };
  inactive: {
    [key: string]: number;
  };
};

/**
 * Erstellt eine Column für den Tabellenkopf.
 * @param {Date} date
 * @param {string} yearMonth
 * @returns {Column} - Die erstellte Column
 */
const createHeadColumn = (date: Date, yearMonth: string): Column => {
  const col: Column = {
    className: styles.head_column,
    title: date.toLocaleDateString('de-De', {
      year: 'numeric',
      month: 'short'
    }),
    dataKey: yearMonth,
    headRender: (row, column, index) => {
      return (
        <div className={styles.year_month_header}>
          {column.title.split(' ').map((t) => {
            return <div key={t}>{t}</div>;
          })}
        </div>
      );
    }
  };
  return col;
};

/**
 * Fügt die Mitarbeiterdaten in die Tabelle ein.
 * @param {TableData[]} tableBody
 * @param {number} rowIndex
 * @param {VkMitarbeiter} mitarbeiterData
 * @param {string} yearMonth
 * @returns {number} - Der Index der Zeile.
 */
const addMitarbeiterData = (
  tableBody: TableData[],
  rowIndex: number,
  mitarbeiterData: VkMitarbeiter,
  yearMonth: string
): number => {
  let index = rowIndex;
  if (tableBody[rowIndex]) {
    tableBody[rowIndex] = {
      ...tableBody[rowIndex],
      [yearMonth]: mitarbeiterData?.vk_month || ''
    };
  } else {
    index = tableBody.length;
    tableBody.push({
      planname: mitarbeiterData?.planname || 'Ohne Planname!',
      [yearMonth]: mitarbeiterData?.vk_month || ''
    });
  }
  return index;
};

const options: TableOptions = {
  fixColumns: [0],
  containerStyle: { maxHeight: '95vh' }
};

function App({ user, hainsOAuth }: { user: User; hainsOAuth: any }) {
  const [currentData, setCurrentData] = useState<TableData[]>([]);
  const [data, setData] = useState<TableData[]>([]);
  const [inactiveData, setInactiveData] = useState<TableData[]>([]);
  const [headRows, setHeadRows] = useState<HeadRow[]>([]);
  const [showActive, setShowActive] = useState<boolean>(true);
  const mounted = UseMounted();

  const setTable = (_data: VKData) => {
    const mitarbeiterRowIndizes: MitarbeiterRowIndex = {
      active: {},
      inactive: {}
    };
    const _headRows: HeadRow[] = [
      {
        columns: [
          {
            title: 'Mitarbeiter',
            dataKey: 'planname',
            className: styles.head_column
          }
        ]
      }
    ];
    const activeData: TableData[] = [];
    const _inactiveData: TableData[] = [];
    if (isObject(_data)) {
      for (const yearMonth in _data) {
        const date = new Date(yearMonth);
        _headRows[0].columns.push(createHeadColumn(date, yearMonth));
        const mitarbeiter = _data[yearMonth];
        if (isObject(mitarbeiter)) {
          for (const mitarbeiterId in mitarbeiter) {
            const mitarbeiterData = mitarbeiter[mitarbeiterId];
            const active = !!mitarbeiterData?.aktiv;
            const mitarbeiterRowIndex = active
              ? mitarbeiterRowIndizes.active
              : mitarbeiterRowIndizes.inactive;
            mitarbeiterRowIndex[mitarbeiterId] = addMitarbeiterData(
              active ? activeData : _inactiveData,
              mitarbeiterRowIndex[mitarbeiterId],
              mitarbeiterData,
              yearMonth
            );
          }
        }
      }
    }
    setHeadRows(() => _headRows);
    setData(() => activeData);
    setInactiveData(() => _inactiveData);
    setCurrentData(() => (showActive ? activeData : _inactiveData));
  };

  const getAnfangAndEnde = (date: string) => {
    const result = {
      anfang: new Date(date),
      ende: new Date(date)
    };
    result.anfang.setMonth(0);
    result.anfang.setDate(1);
    result.ende.setMonth(11);
    result.ende.setDate(31);
    result.ende.setFullYear(result.anfang.getFullYear() + 1);
    return result;
  };

  const getData: GetData = (dates, finishLoading) => {
    const { anfang, ende } = getAnfangAndEnde(dates.von);
    hainsOAuth
      .api('vk_overview', 'get', {
        anfang: getDateFromJSDate(anfang),
        ende: getDateFromJSDate(ende)
      })
      .then(
        (_data: VKData) => {
          if (mounted) setTable(_data);
          finishLoading();
        },
        (err: Reason) => {
          finishLoading();
          returnError(err);
        }
      );
  };

  const search = useCallback(
    (searchValue: string, _data: TableData[]) => {
      if (!mounted) return;
      defaultSearch(searchValue, _data, headRows, (newData: TableData[]) => {
        mounted && setCurrentData(() => newData);
      });
    },
    [headRows, mounted, setCurrentData]
  );

  return (
    <div className={styles.vk_overview}>
      {user ? (
        <div>
          <div className={styles.options}>
            <SearchData
              search={search}
              data={showActive ? data : inactiveData}
            />
            <DateInput getData={getData} />
            <div className={styles.toggle_active}>
              <CustomButton
                clickHandler={() => setShowActive((cur) => !cur)}
                className={showActive ? 'green' : 'red'}
              >
                {showActive ? 'Aktiv' : 'Inaktiv'}
              </CustomButton>
            </div>
          </div>
          <Table data={currentData} headRows={headRows} options={options} />
        </div>
      ) : (
        <p>Bitte einloggen!</p>
      )}
    </div>
  );
}

export default App;
