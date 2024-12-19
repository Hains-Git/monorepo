import React from 'react';
import {
  Column,
  ColumnsLeftPositions,
  HeadOptions,
  HeadRow,
  SetFixCell,
  SetSortFunction,
  Sort
} from './types/table';
import ColumnSort from './ColumnSort';

const defaultOptions = {};

function HeadCell({
  column,
  addSort,
  row,
  index,
  options = defaultOptions,
  setSort,
  sort,
  setFixCell,
  columnsLeftPositions
}: {
  column: Column;
  addSort: boolean;
  row: HeadRow;
  index: number;
  setSort: SetSortFunction;
  sort: Sort;
  setFixCell: SetFixCell;
  columnsLeftPositions: ColumnsLeftPositions;
  options?: HeadOptions;
}) {
  const columnOptions: Column = {
    id: index.toString(),
    className: '',
    style: {},
    type: 'th',
    dataKey: '',
    sortable: true,
    ...column
  };
  const { title, id, type, className, style } = columnOptions;

  const columnClass =
    columnOptions?.getColumnClass?.(row, columnOptions, index) || '';

  const columnStyle =
    columnOptions?.getColumnStyle?.(row, columnOptions, index) || {};

  let cellStyle = {
    ...style,
    ...columnStyle
  };

  if (columnsLeftPositions[index] !== undefined) {
    cellStyle = {
      ...cellStyle,
      position: 'sticky',
      left: `${columnsLeftPositions[index]}px`,
      zIndex: 1
    };
  }

  const Tag = type?.includes?.('th') ? 'th' : 'td';
  return (
    <Tag
      id={id}
      className={`${className} ${columnClass}`.trim()}
      style={cellStyle}
      title={column?.hoverTitle || ''}
      ref={setFixCell(addSort ? index : -1)}
    >
      {columnOptions?.headRender?.(row, columnOptions, index) || title}
      {addSort && columnOptions?.sortable && (
        <ColumnSort
          multiSort={!!options?.multiSort}
          column={index}
          setSort={setSort}
          direction={sort?.[index] || ''}
        />
      )}
    </Tag>
  );
}

export default HeadCell;
