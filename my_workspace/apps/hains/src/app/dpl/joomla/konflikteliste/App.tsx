import React, { useCallback, useState } from 'react';
import Table from '../components/utils/table/Table';
import { TableData } from '../components/utils/table/types/table';
import { TableEinteilung } from '../components/utils/table/types/konflikteliste';
import { Reason, User } from '../helper/ts_types';
import { returnError } from '../helper/hains';
import DateInput, { GetData } from '../components/utils/date-input/DateInput';
import { UseMounted } from '../hooks/use-mounted';
import SearchData, {
  defaultSearch
} from '../components/utils/table/SearchData';

import styles from './app.module.css';

const headRows = [
  {
    columns: [
      { title: 'Datum', dataKey: 'tag' },
      { title: 'Name', dataKey: 'mitarbeiter.planname' },
      { title: 'Dienst', dataKey: 'po_dienst.planname' },
      { title: 'Bereich', dataKey: 'bereich.name' },
      { title: 'Arbeitsplatz', dataKey: 'arbeitsplatz.name' },
      { title: 'Status', dataKey: 'einteilungsstatus.name' },
      { title: 'Kontext', dataKey: 'einteilungskontext.name' },
      { title: 'Dienstplan', dataKey: 'dienstplan.name' }
    ]
  }
];

const options = {
  fixColumns: [0, 1]
};

function App({ user, hainsOAuth }: { user: User; hainsOAuth: any }) {
  const [data, setData] = useState<TableEinteilung[]>([]);
  const [currentData, setCurrentData] = useState<TableData[]>([]);
  const mounted = UseMounted();

  const getData: GetData = (dates, finishLoading) => {
    hainsOAuth.api('monatskonflikte', 'get', { date: dates.von }).then(
      (_data: TableEinteilung[]) => {
        if (mounted) {
          const newData = Array.isArray(_data) ? _data : [];
          setData(() => newData);
          setCurrentData(() => newData);
        }
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
    <div>
      {user?.is_dienstplaner ? (
        <div>
          <div className={styles.options}>
            <SearchData search={search} data={data} />
            <DateInput getData={getData} />
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
