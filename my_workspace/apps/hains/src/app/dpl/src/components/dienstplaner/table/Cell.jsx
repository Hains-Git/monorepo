import React, { useEffect, useRef } from 'react';
import { UseRegister } from '../../../hooks/use-register';

function Cell({ cell, updateTable, updateBody, updateRow, label }) {
  const {
    cellClassName,
    cellStyle,
    clickHandler,
    id,
    header,
    colspan,
    rowspan,
    visible
  } = cell || {};
  const thisRef = useRef(null);
  const update = UseRegister(cell?._push, cell?._pull, cell);
  const getContent = () => (visible && cell?.getContent?.(true)) || '';

  useEffect(() => {
    if (thisRef?.current) {
      cell?.checkRef?.(thisRef.current);
      cell?.getPosition?.(thisRef.current);
    }
  }, [cell, thisRef, update, updateTable, updateBody, updateRow]);

  if (!cell) return null;
  return header ? (
    <th
      ref={thisRef}
      className={cellClassName}
      style={cellStyle}
      onClick={clickHandler}
      data-id={id}
      rowSpan={rowspan}
      colSpan={colspan}
    >
      {label ? <p className="_cell_label">{label}</p> : null}
      {getContent()}
    </th>
  ) : (
    <td
      ref={thisRef}
      className={cellClassName}
      style={cellStyle}
      onClick={clickHandler}
      data-id={id}
      rowSpan={rowspan}
      colSpan={colspan}
    >
      {label ? <p>{label}</p> : null}
      {getContent()}
    </td>
  );
}

export default Cell;
