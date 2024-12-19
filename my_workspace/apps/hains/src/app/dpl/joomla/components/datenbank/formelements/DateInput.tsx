import React, { useEffect, useState } from 'react';
import { TableData } from '../../utils/table/types/table';
import { getNestedAttr } from '../../../helper/util';
import styles from '../datenbank.module.css';

function DateInput({
  label,
  row,
  required,
  elKey,
  name,
  title = ''
}: {
  label: string;
  row: TableData | null;
  required: boolean;
  elKey: string;
  name: string;
  title?: string;
}) {
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    setValue((row && getNestedAttr(row, elKey)) || '');
  }, [row]);

  return (
    <label aria-label={label} title={title} className={styles.date_input_label}>
      {label}
      {required ? '*' : ''}
      <div>
        <input
          type="date"
          value={value}
          onChange={(evt) => setValue(() => evt.target.value)}
          required={!!required}
          name={name}
        />
        <span
          title="Datum leeren"
          className={styles.date_close}
          onClick={() => setValue(() => '')}
        >
          X
        </span>
      </div>
    </label>
  );
}

export default DateInput;
