import React, { useEffect, useState } from 'react';
import { TableData } from '../../utils/table/types/table';
import { getFontColorByWhite, getNestedAttr } from '../../../helper/util';

const defaultValue = '#ffffff';

function ColorInput({
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
  const [value, setValue] = useState<string>(defaultValue);
  const [contrast, setContrast] = useState({
    color: '#000000',
    contrastRatio: 21
  });

  useEffect(() => {
    setValue(() => (row && getNestedAttr(row, elKey)?.toString?.()) || defaultValue);
  }, [row]);

  useEffect(() => {
    const { color, contrastRatio } = getFontColorByWhite(value);
    setContrast({ color, contrastRatio });
  }, [value]);

  return (
    <label aria-label={label} title={title}>
      {label}
      <div style={{ position: 'relative' }}>
        <input type="color" value={value} onChange={(evt) => setValue(() => evt.target.value)} name={name} />
        <span
          style={{
            position: 'absolute',
            left: 0,
            width: '100%',
            textAlign: 'center',
            color: contrast.color
          }}
        >
          {contrast.contrastRatio.toFixed(2)}
        </span>
      </div>
    </label>
  );
}

export default ColorInput;
