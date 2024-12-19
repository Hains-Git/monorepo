import React, { useCallback, useState, MouseEvent, useEffect, useContext } from 'react';
import styles from './app.module.css';
import Table, { TableOptions } from '../components/utils/table/Table';
import CustomButton from '../components/utils/custom-button/CustomButton';
import SearchData, { defaultSearch } from '../components/utils/table/SearchData';
import { HeadRow, TableData } from '../components/utils/table/types/table';
import FunktionsFilter from '../components/mitarbeiterinfo/FunktionsFilter';
import AktivFilter from '../components/mitarbeiterinfo/AktivFilter';
import TeamFilter from '../components/mitarbeiterinfo/TeamFilter';

import { TData } from './types';
import { AccountInfo } from '../components/utils/table/types/accountinfo';

import { DataContext } from '../context/mitarbeiterinfo/DataProvider';

type TProps = {
  headRows: HeadRow[];
  mitarbeiterInfosArr: TData['mitarbeiterInfosArr'];
  canViewForm: boolean;
};

export default function MitarbeiterInfoTable({ headRows, mitarbeiterInfosArr, canViewForm }: TProps) {
  const { changeView, data, setData, setMitarbeiterInfos, mitarbeiterInfos } = useContext(DataContext);

  const search = useCallback(
    (searchValue: string, _data: TableData[]) => {
      defaultSearch(searchValue, _data, headRows, (newData: TableData[]) => {
        setMitarbeiterInfos(newData);
      });
    },
    [headRows]
  );

  const [filter, setFilter] = useState({ funktion: '', aktiv: 'true' });

  const funktionen = data.funktionen;
  const teams = data.teams;

  const [bodyOptions] = useState<TableOptions>({
    containerClassname: styles.table_container,
    body: {
      onRowClick: (evt: MouseEvent, row: TableData) => {
        const currentRow = row as AccountInfo;
        changeView({ view: 'detail', id: currentRow.mitarbeiter_id });
      }
    },
    defaultSort: { 0: 'asc', 7: 'asc' }
  });

  const filterAktiv = (_data: AccountInfo[]) => {
    const val = filter.aktiv;
    const filtered = _data.filter((m) => String(m.mitarbeiter.aktiv) === val);
    return filtered;
  };

  const filterFunktion = (_data: AccountInfo[]) => {
    const val = filter.funktion;
    if (!val || val === '') {
      return _data;
    }
    const funktion_id = Number(val);
    const filteredData = _data.filter((m) => m?.mitarbeiter?.funktion_id === funktion_id);
    return filteredData;
  };

  const batchFilter = (_data: AccountInfo[]) => {
    const filterByAktiv = filterAktiv(_data);
    const filterByFunktion = filterFunktion(filterByAktiv);
    return filterByFunktion;
  };

  const updateMitarbeiterInfos = (filtered: AccountInfo[]) => {
    const dataFilteredAll = batchFilter(filtered);
    setMitarbeiterInfos(dataFilteredAll);
    setData(
      (state) =>
        state && {
          ...state,
          mitarbeiterInfosArr: dataFilteredAll as AccountInfo[]
        }
    );
  };

  useEffect(() => {
    const initialData: any = Object.values(data.mitarbeiter_infos);
    const lastFilter = batchFilter(initialData);
    updateMitarbeiterInfos(lastFilter as AccountInfo[]);
  }, [filter]);

  const createUserView = () => {
    changeView({ view: 'edit', id: 0 });
  };

  return (
    <div className={styles.table}>
      <div className={styles.content_header}>
        <div className={styles.filter_table}>
          <SearchData search={search} data={mitarbeiterInfosArr} />
          <FunktionsFilter funktionen={funktionen} setFilter={setFilter} />
          <AktivFilter setFilter={setFilter} />
          <TeamFilter setMitarbeiterInfos={updateMitarbeiterInfos} initialData={data.mitarbeiter_infos} teams={teams} />
        </div>
        {canViewForm && <CustomButton clickHandler={createUserView}>Neuer Benutzer</CustomButton>}
      </div>
      <Table options={bodyOptions} headRows={headRows} data={mitarbeiterInfos} />
    </div>
  );
}
