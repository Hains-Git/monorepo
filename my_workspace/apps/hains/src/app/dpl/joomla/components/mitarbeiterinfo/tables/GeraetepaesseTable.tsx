import React, { useContext } from 'react';
import { HeadRow, TableData } from '../../utils/table/types/table';
import Table, { TableOptions } from '../../utils/table/Table';
import { ApiContext } from '../../../context/mitarbeiterinfo/ApiProvider';
import { TGeraetepass } from '../../../helper/api_data_types';

function renderMark(row: TableData) {
  const pass = row as TGeraetepass;
  const cssStyle = {
    width: '20px',
    height: '20px',
    display: 'block',
    borderRadius: '50%',
    backgroundColor: pass.table_color
  };
  return <span title={pass.table_title} style={cssStyle} />;
}

const headObjRows: HeadRow[] = [
  {
    columns: [
      { title: '', dataKey: '', bodyRender: renderMark, sortKey: 'table_sort' },
      { title: 'Name', dataKey: 'name' },
      { title: 'Typ', dataKey: 'typ' },
      { title: 'Hersteller', dataKey: 'hersteller' }
    ]
  }
];

const options: TableOptions = {
  hasDefaultSearch: true,
  defaultSort: { 1: 'asc', 2: 'asc', 3: 'asc' },
  fixColumns: [0]
};

function GeraetepaesseTable() {
  const { geraetepaesse } = useContext(ApiContext);
  return (
    <Table data={geraetepaesse} headRows={headObjRows} options={options} />
  );
}

export default GeraetepaesseTable;
