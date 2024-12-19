import React, { useEffect, useState } from 'react';
import { TableData } from '../../utils/table/types/table';
import { getNestedAttr } from '../../../helper/util';

function TextArea({
  label,
  row,
  required,
  elKey,
  name,
  cols = 30,
  rows = 4,
  title = ''
}: {
  label: string;
  row: TableData | null;
  required: boolean;
  elKey: string;
  name: string;
  cols?: number;
  rows?: number;
  title?: string;
}) {
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    setValue(() => (row && getNestedAttr(row, elKey))?.toString?.() || '');
  }, [row]);

  return (
    <label aria-label={label} title={title}>
      {label}
      {required ? '*' : ''}
      <textarea
        value={value}
        onChange={(evt) => setValue(() => evt.target.value)}
        required={!!required}
        rows={rows}
        cols={cols}
        name={name}
      />
    </label>
  );
}

export default TextArea;
