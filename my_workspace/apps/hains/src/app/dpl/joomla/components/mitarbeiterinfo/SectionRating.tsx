import React, { useState, useEffect, useContext } from 'react';
import { FaStar } from 'react-icons/fa';

import { ApiContext } from '../../context/mitarbeiterinfo/ApiProvider';
import Table from '../utils/table/Table';
import { HeadRow, TableData } from '../utils/table/types/table';

import styles from '../../mitarbeiterinfo/app.module.css';

export default function SectionRating() {
  const { ratings, onUpdateRating } = useContext(ApiContext);

  const onClickstar = (name: string, po_dienst_id: number, rating: number) => {
    onUpdateRating?.(name, po_dienst_id, rating);
  };

  const renderStars = (row: any) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const color = i <= row.rating ? '#00427a' : '#ccc';
      stars.push(
        <span
          className={styles.stars}
          key={`${row.id}_${i}`}
          onClick={() => onClickstar(row.name, row.id, i)}
        >
          <FaStar style={{ color }} size="1.4em" />
        </span>
      );
    }
    return stars;
  };

  const headObjRows: HeadRow[] = [
    {
      columns: [
        {
          title: 'Dienst',
          dataKey: 'name'
        },
        {
          title: 'Präferenzwertung',
          dataKey: 'rating',
          bodyRender: renderStars
        }
      ]
    }
  ];

  const [headRows] = useState<HeadRow[]>(headObjRows);
  const [tableData, setTableData] = useState<TableData[]>([]);

  useEffect(() => {
    setTableData(ratings);
  }, [ratings]);

  return (
    <Table
      options={{
        className: `${styles.table} ${styles.cell_left} table_noborder`,
        hasDefaultSearch: true
      }}
      data={tableData}
      headRows={headRows}
    />
  );
}
