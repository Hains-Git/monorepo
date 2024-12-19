import React from 'react';
import { UseRegister } from '../../../hooks/use-register';
import Body from './Body';

function Table({ table }) {
  const { id, style, className } = table || {};
  const update = UseRegister(table?._push, table?._pull, table);

  const getBody = (key = 'body') =>
    table?.[key] && (
      <Body
        key={`${table[key]?.id}_${key}`}
        body={table[key]}
        updateTable={update}
      />
    );

  if (!table?.visible) return null;
  return (
    <table
      data-id={id}
      className={className}
      style={style}
      onScroll={() => table?.updateLastCells?.()}
    >
      {[getBody('head', table), getBody('body', table), getBody('foot', table)]}
    </table>
  );
}

export default Table;
