import React, { useEffect, useState } from 'react';
import { TableData } from '../../utils/table/types/table';
import { getNestedAttr } from '../../../helper/util';

function TextInput({
  label,
  row,
  required,
  elKey,
  name,
  labelBack = '',
  title = '',
  disabled = false,
  pattern = undefined
}: {
  label: string;
  row: TableData | null;
  required: boolean;
  elKey: string;
  name: string;
  labelBack?: string;
  title?: string;
  disabled?: boolean;
  pattern?: string;
}) {
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    setValue(() => (row && getNestedAttr(row, elKey)) || '');
  }, [row]);

  return (
    <label aria-label={label} title={title}>
      {label}
      {required ? '*' : ''}
      <div>
        <input
          type="text"
          value={value}
          onChange={(evt) => setValue(() => evt.target.value)}
          required={!!required}
          name={name}
          disabled={disabled}
          pattern={pattern}
        />
        {labelBack}
      </div>
    </label>
  );
}

export default TextInput;
