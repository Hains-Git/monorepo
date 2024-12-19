import React, { useEffect, useState } from 'react';
import { TableData } from '../../utils/table/types/table';
import { getNestedAttr } from '../../../helper/util';

function NumberInput({
  label,
  row,
  required,
  elKey,
  name,
  min = undefined,
  max = undefined,
  step = undefined,
  defaultValue,
  labelBack = '',
  title = ''
}: {
  label: string;
  row: TableData | null;
  required: boolean;
  elKey: string;
  name: string;
  min?: number;
  max?: number;
  step?: number;
  title?: string;
  defaultValue: number;
  labelBack?: string;
}) {
  const defaultValueString = defaultValue.toString();
  const [value, setValue] = useState<string>(defaultValueString);

  useEffect(() => {
    const rowValue = row && getNestedAttr(row, elKey)?.toString?.();
    setValue(() =>
      Number.isNaN(parseFloat(rowValue)) ? defaultValueString : rowValue
    );
  }, [row]);

  return (
    <label aria-label={label} title={title}>
      {label}
      {required ? '*' : ''}
      <div>
        <input
          type="number"
          value={value}
          onChange={(evt) => setValue(() => evt.target.value)}
          required={!!required}
          name={name}
          min={min}
          max={max}
          step={step}
        />
        {labelBack}
      </div>
    </label>
  );
}

export default NumberInput;
