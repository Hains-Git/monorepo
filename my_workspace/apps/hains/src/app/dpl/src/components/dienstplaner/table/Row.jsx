import React from 'react';
import { UseRegister } from '../../../hooks/use-register';
import Cell from './Cell';

function Row({ row, updateTable, updateBody, cellLabel }) {
  const { className, style, clickHandler, id } = row || {};
  const update = UseRegister(row?._push, row?._pull, row);
  if (!row?.visible) return null;

  const getCells = () =>
    row?.eachCellFromIntervall?.((cell, tableIndex, cellIndex) => (
      <Cell
        cell={cell}
        key={`${cell.id}_${tableIndex}_${cellIndex}`}
        pos={cellIndex}
        updateTable={updateTable}
        updateBody={updateBody}
        updateRow={update}
        label={cellIndex === 0 && cellLabel}
      />
    )) || null;

  return (
    <tr
      className={className}
      style={style}
      onClick={clickHandler}
      data-id={id}
      data-celllabel={cellLabel}
    >
      {getCells()}
    </tr>
  );
}

export default Row;
