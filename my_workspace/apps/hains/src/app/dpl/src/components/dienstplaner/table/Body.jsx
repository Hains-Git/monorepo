import React, { useEffect, useState } from 'react';
import { UseRegister } from '../../../hooks/use-register';
import Row from './Row';

function Body({ body, updateTable }) {
  const { id, isHead, isFoot, isBody, className, style } = body || {};
  const update = UseRegister(body?._push, body?._pull, body);
  const [rows, setRows] = useState([]);

  const getRows = () => {
    let lastLabel = '';
    if (!body.visible) return [];
    return (
      body?.eachRowFromIntervall?.((row, tableIndex, rowIndex) => {
        const cellLabel = (isBody && row?.cellLabel) || '';
        const result = (
          <Row
            row={row}
            key={`${row.id}_${tableIndex}-${rowIndex}`}
            updateTable={updateTable}
            updateBody={update}
            cellLabel={cellLabel !== lastLabel ? cellLabel : ''}
          />
        );
        lastLabel = cellLabel;
        return result;
      }) || []
    );
  };

  useEffect(() => {
    setRows(() => getRows());
  }, [update]);

  if (!body) return null;
  if (isHead) {
    return (
      <thead className={className} style={style} data-id={id}>
        {rows}
      </thead>
    );
  }
  if (isFoot) {
    return (
      <tfoot className={className} style={style} data-id={id}>
        {rows}
      </tfoot>
    );
  }

  return (
    <tbody className={className} style={style}>
      {rows}
    </tbody>
  );
}

export default Body;
