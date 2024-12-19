import React, { useEffect, useState } from 'react';
import { TableData } from '../../utils/table/types/table';
import { getNestedAttr } from '../../../helper/util';

function CheckBox({
  label,
  row,
  elKey,
  name,
  title = ''
}: {
  label: string;
  row: TableData | null;
  elKey: string;
  name: string;
  title?: string;
}) {
  const [value, setValue] = useState<boolean>(false);

  useEffect(() => {
    setValue(() => !!(row && getNestedAttr(row, elKey)));
  }, [row]);

  return (
    <label aria-label={label} title={title}>
      {label}
      <input
        type="checkbox"
        checked={value}
        onChange={(evt) => setValue(() => evt.target.checked)}
      />
      <input type="hidden" value={value.toString()} name={name} />
    </label>
  );
}

export default CheckBox;
