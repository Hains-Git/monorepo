import React from 'react';
import { CellHook, RowInput, UserOptions } from 'jspdf-autotable';
import { PiFilePdf } from 'react-icons/pi';
import CustomButton from './CustomButton';
import { Column, HeadRow, TableData } from '../table/types/table';
import { getNestedAttr } from '../../../helper/util';
import { createPDFTable } from '../../../helper/export';

export const createPDF = (
  data: TableData[],
  headRows: HeadRow[],
  filename: string,
  hooks: {
    didParseCell?: CellHook;
    didDrawCell?: CellHook;
    headCallBack?: (column: Column) => string;
    bodyCallBack?: (row: TableData, column: Column) => string;
  }
) => {
  const tableOptions: UserOptions = {
    head: [],
    body: [],
    theme: 'grid',
    tableWidth: 'wrap',
    horizontalPageBreak: true,
    styles: { cellWidth: 'wrap', fontSize: 16, font: 'helvetica' },
    columnStyles: { text: { cellWidth: 'auto' } }
  };

  if (hooks.didParseCell) tableOptions.didParseCell = hooks.didParseCell;
  if (hooks.didDrawCell) tableOptions.didDrawCell = hooks.didDrawCell;

  headRows.forEach((headRow) => {
    const row: RowInput = [];
    headRow.columns.forEach((column) => {
      const { title } = column;
      row.push({
        title: hooks.headCallBack ? hooks.headCallBack(column) : title
      });
    });
    if (!row.length) return;
    if (!tableOptions.head) tableOptions.head = [];
    tableOptions.head.push(row);
  });

  const lastHeadIndex = headRows.length - 1;

  data.forEach((row) => {
    const newRow: RowInput = [];
    headRows[lastHeadIndex].columns.forEach((column) => {
      const { dataKey } = column;
      newRow.push(
        hooks.bodyCallBack
          ? hooks.bodyCallBack(row, column)
          : getNestedAttr(row, dataKey || '') || ''
      );
    });
    if (!newRow.length) return;
    if (!tableOptions.body) tableOptions.body = [];
    tableOptions.body.push(newRow);
  });

  const doc = createPDFTable(tableOptions);
  doc.save(`${filename}.pdf`);
};

function TablePdfButton({
  data,
  filename,
  headRows,
  className = '',
  didParseCell,
  didDrawCell,
  headCallBack,
  bodyCallBack
}: {
  data: TableData[];
  filename: string;
  headRows: HeadRow[];
  className?: string;
  didParseCell?: CellHook;
  didDrawCell?: CellHook;
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
        createPDF(data, headRows, filename, {
          didParseCell,
          didDrawCell,
          headCallBack,
          bodyCallBack
        });
        setLoading(false);
      }}
    >
      <PiFilePdf />
    </CustomButton>
  );
}

export default TablePdfButton;
