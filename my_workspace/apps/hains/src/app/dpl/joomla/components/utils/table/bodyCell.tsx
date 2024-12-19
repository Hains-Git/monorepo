import React, { MouseEvent } from 'react';
import {
  Column,
  ColumnsLeftPositions,
  SetFixCell,
  TableData
} from './types/table';
import { getNestedAttr } from '../../../helper/util';
import { isFunction } from '../../../helper/types';

function BodyCell({
  column,
  row,
  index,
  checkFixCell,
  setFixCell,
  columnsLeftPositions
}: {
  column: Column;
  row: TableData;
  index: number;
  checkFixCell: boolean;
  setFixCell: SetFixCell;
  columnsLeftPositions: ColumnsLeftPositions;
}) {
  const columnClass = column?.getColumnClass?.(row, column, index) || '';

  const clickHandler = isFunction(column?.bodyOnClick)
    ? (evt: MouseEvent) => {
        evt.stopPropagation();
        column?.bodyOnClick?.(evt, row, column, index);
      }
    : undefined;

  let columnStyle = column?.getColumnStyle?.(row, column, index) || {};
  if (columnsLeftPositions[index] !== undefined) {
    columnStyle = {
      ...columnStyle,
      position: 'sticky',
      left: `${columnsLeftPositions[index]}px`,
      zIndex: 1
    };
  }

  return (
    <td
      className={columnClass}
      style={columnStyle}
      onClick={clickHandler}
      ref={setFixCell(checkFixCell ? index : -1)}
      colSpan={column?.bodyColspan}
    >
      {column?.bodyRender?.(row, column, index) ||
        getNestedAttr(row, column?.dataKey || '')?.toString?.() ||
        ''}
    </td>
  );
}

export default BodyCell;
