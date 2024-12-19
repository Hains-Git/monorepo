import React from 'react';
import { PiFileCsv } from 'react-icons/pi';
import CustomButton from './CustomButton';
import { Column, HeadRow, TableData } from '../table/types/table';
import { downloadCSV } from '../../../helper/export';
import { getNestedAttr } from '../../../helper/util';

export const createCSV = (
  data: TableData[],
  headRows: HeadRow[],
  filename: string,
  hooks: {
    headCallBack?: (column: Column) => string;
    bodyCallBack?: (row: TableData, column: Column) => string;
  }
) => {
  const csvRows: string[] = [];
  headRows.forEach((headRow) => {
    const row: string[] = [];
    headRow.columns.forEach((column) => {
      const { title } = column;
      row.push(hooks.headCallBack ? hooks.headCallBack(column) : title);
    });
    csvRows.push(row.join(';'));
  });

  const lastHeadIndex = headRows.length - 1;

  data.forEach((row) => {
    const newRow: string[] = [];
    headRows[lastHeadIndex].columns.forEach((column) => {
      const { dataKey } = column;
      newRow.push(
        hooks.bodyCallBack
          ? hooks.bodyCallBack(row, column)
          : getNestedAttr(row, dataKey || '') || ''
      );
    });
    csvRows.push(newRow.join(';'));
  });

  downloadCSV(csvRows.join('\n'), filename);
};

function TableCsvButton({
  data,
  filename,
  headRows,
  className = '',
  headCallBack,
  bodyCallBack
}: {
  data: TableData[];
  filename: string;
  headRows: HeadRow[];
  className?: string;
  headCallBack?: (column: Column) => string;
  bodyCallBack?: (row: TableData, column: Column) => string;
}) {
  if (!filename) return null;
  return (
    <CustomButton
      className={className}
      spinner={{ show: true }}
      title="PDF erstellen"
      clickHandler={(e, setLoading) => {
        createCSV(data, headRows, filename, {
          headCallBack,
          bodyCallBack
        });
        setLoading(false);
      }}
    >
      <PiFileCsv />
    </CustomButton>
  );
}

export default TableCsvButton;
