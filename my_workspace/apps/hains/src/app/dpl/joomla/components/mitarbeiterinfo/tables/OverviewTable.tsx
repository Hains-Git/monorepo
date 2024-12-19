import React, { useEffect, useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { HeadRow, TableData } from '../../utils/table/types/table';
import Table from '../../utils/table/Table';

import styles from '../../../mitarbeiterinfo/app.module.css';

import {
  TEinteilung,
  TKontingent,
  TRotation
} from '../../../helper/api_data_types';

type TKontingentM = TKontingent & {
  einteilungen?: TEinteilung[];
};

type TProps = {
  kontingente: TKontingentM[] | undefined;
  freigabenRotationen: any;
};

function renderGewesen(row: any) {
  const icon = row.gewesen === 'ja' ? <FaCheck /> : '';
  return icon;
}

const headObjRows: HeadRow[] = [
  {
    columns: [
      { title: 'Kontingent/Bereich', dataKey: 'name' },
      { title: 'Gewesen', dataKey: 'gewesen', bodyRender: renderGewesen },
      {
        title: 'Zuletzt',
        dataKey: 'last',
        getColumnClass: () => styles.no_wrap
      },
      { title: 'Tage', dataKey: 'tage' },
      {
        title: 'Eingeteilt während Rotationen',
        dataKey: 'einteilungen.while_in_rotation.eingeteilt_sum',
        className: styles.wrap
      },
      {
        title: 'Eingeteilt insgesamt',
        dataKey: 'einteilungen.all.eingeteilt_sum',
        className: styles.wrap
      }
    ]
  }
];

export default function OverviewTable({
  freigabenRotationen,
  kontingente
}: TProps) {
  const [headRows, setHeadRows] = useState<HeadRow[]>(headObjRows);
  const [tableData, setTableData] = useState<TableData[]>([]);

  const getDateDiff = (date1: Date, date2: Date) => {
    const firstDateInMs = date1.getTime();
    const secondDateInMs = date2.getTime();
    const differenceBtwDates = secondDateInMs - firstDateInMs;
    const aDayInMs = 24 * 60 * 60 * 1000;
    const daysDiff = Math.round(differenceBtwDates / aDayInMs);
    return daysDiff;
  };

  const getErfahrung = () => {
    let total = 0;
    const today = new Date();
    const res: any = [];
    kontingente?.forEach((kontingent: TKontingentM) => {
      const rots = freigabenRotationen?.[kontingent?.id];
      const resRow: any = {};
      if (rots?.length) {
        resRow.name = kontingent.name;
        resRow.id = kontingent.id;
        resRow.tage = 0;
        resRow.percent = 0;
        resRow.einteilungen = kontingent.einteilungen;
        const first = rots[0];
        const firstDate = new Date(first.von);
        if (firstDate < today) {
          resRow.gewesen = 'ja';
          resRow.first = first.von;
          resRow.tage = 0;
          rots.forEach((rot: TRotation) => {
            const begin = new Date(rot.von);
            if (begin < today) {
              const end = new Date(rot.bis);
              if (end < today) {
                resRow.last = rot.bis;
                const diff = getDateDiff(begin, end);
                resRow.tage += diff;
                total += diff;
              } else {
                resRow.last = 'Heute';
                const diff = getDateDiff(begin, today);
                resRow.tage += diff;
                total += diff;
              }
            }
          });
        } else {
          resRow.gewesen = 'geplant';
          resRow.first = first.von;
          resRow.last = '-';
        }
        res.push(resRow);
      }
    });
    if (res.length === 0) {
      const no = 0;
      res[no] = {};
      res[no].name = 'keine';
      res[no].id = 'Informationen';
      res[no].gewesen = null;
      res[no].tage = 0;
      res[no].first = '-';
      res[no].last = '-';
      res[no].percent = 0;
      res[no].einteilungen = {
        einteilungen: {
          all: {
            eingeteilt_sum: 0,
            default_eingeteilt: 0,
            eingeteilt: 0,
            rotationen: []
          },
          while_in_rotation: { eingeteilt_sum: 0, default_eingeteilt: 0 }
        }
      };
    }
    res.total = total;

    return res;
  };

  useEffect(() => {
    const erfahrungen = getErfahrung();
    setTableData(erfahrungen);
  }, [freigabenRotationen]);

  return (
    <Table
      headRows={headRows}
      data={tableData}
      options={{
        hasDefaultSearch: true,
        defaultSort: { 2: 'desc' },
        className: `${styles.full_width} ${styles.cell_left} table_noborder`
      }}
    />
  );
}
