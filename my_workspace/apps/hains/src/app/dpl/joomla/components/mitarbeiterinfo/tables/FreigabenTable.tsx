import React, { useState, useContext, useEffect } from 'react';
import { HeadRow, TableData } from '../../utils/table/types/table';
import Table from '../../utils/table/Table';
import Select from '../form/Select';
import { ApiContext } from '../../../context/mitarbeiterinfo/ApiProvider';

import styles from '../../../mitarbeiterinfo/app.module.css';

export default function FreigabenTable() {
  const { freigaben, statuse, onChangeFreigaben, user } =
    useContext(ApiContext);
  const canEdit =
    user.is_admin || user.is_dienstplaner || user.is_rotationsplaner;

  const handleStatusChange = (val: string, row: any) => {
    const statusId = Number(val);
    onChangeFreigaben(statusId, row);
  };

  function renderStatus(row: any) {
    const statuseArr = (statuse && Object.values(statuse)) || [];
    const freigabestatus_id = row.freigabestatus_id;
    const statusName = statuse?.[freigabestatus_id]?.name || statuse?.[1].name;
    if (!canEdit) {
      return <p>{statusName}</p>;
    }
    return (
      <Select
        style={{ width: '130px' }}
        label=""
        data={statuseArr}
        value={freigabestatus_id}
        keyExtractor="id"
        optionText="name"
        callback={(val) => {
          handleStatusChange(val, row);
        }}
      />
    );
  }

  function renderMark(row: any) {
    const freigabestatus_id = row.freigabestatus_id;
    const color = statuse?.[freigabestatus_id]?.color || 'red';
    const cssStyle = {
      width: '20px',
      height: '20px',
      display: 'block',
      borderRadius: '50%',
      backgroundColor: color
    };
    return <span style={cssStyle} />;
  }

  const headObjRows: HeadRow[] = [
    {
      columns: [
        { title: 'Freigabename', dataKey: 'name' },
        {
          title: 'Status',
          dataKey: 'freigabestatus_id',
          bodyRender: renderStatus
        },
        {
          title: '',
          dataKey: 'freigabestatus_id',
          bodyRender: renderMark
        }
      ]
    }
  ];

  const [headRows] = useState<HeadRow[]>(headObjRows);
  const [tableData, setTableData] = useState<TableData[]>(freigaben || []);

  useEffect(() => {
    if (freigaben) {
      setTableData(freigaben);
    }
  }, [freigaben]);

  return (
    <Table
      data={tableData}
      headRows={headRows}
      options={{
        hasDefaultSearch: true,
        className: `${styles.full_width} ${styles.cell_left} table_noborder`
      }}
    />
  );
}
