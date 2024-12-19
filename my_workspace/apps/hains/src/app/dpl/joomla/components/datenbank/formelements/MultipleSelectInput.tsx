import React, { ReactElement, useEffect, useState } from 'react';
import { TableData } from '../../utils/table/types/table';
import styles from '../datenbank.module.css';
import SelectInput from './SelectInput';
import { getNestedAttr } from '../../../helper/util';
import CustomButton from '../../utils/custom-button/CustomButton';

function MultipleSelectInput({
  label,
  row,
  required,
  elKey,
  name,
  options,
  optionValueKey,
  optionLabelKey,
  optionsTitleKey = '',
  onChange = undefined,
  children = null,
  title = '',
  groupBy = '',
  min,
  elKeyBack = '',
  renderLabel = undefined
}: {
  label: string;
  row: TableData | null;
  required: boolean;
  elKey: string;
  name: string;
  options: any[];
  optionValueKey: string;
  optionLabelKey: string;
  optionsTitleKey?: string;
  onChange?: (value: string) => void;
  children?: React.ReactNode;
  title?: string;
  groupBy?: string;
  min: number;
  elKeyBack?: string;
  renderLabel?: (option: any) => string;
}) {
  const [count, setCount] = useState<number>(min);

  useEffect(() => {
    const arr = getNestedAttr(row, elKey) || [];
    if (Array.isArray(arr)) {
      const l = arr.length;
      setCount(() => (l > min ? l : min));
    } else {
      setCount(() => min);
    }
  }, [row, options]);

  const createSelects = () => {
    const result: ReactElement[] = [];
    for (let i = 0; i < count; i++) {
      result.push(
        <SelectInput
          key={i}
          label=""
          row={row}
          required={i === 0 && required}
          elKey={`${elKey}.${i}${elKeyBack ? `.${elKeyBack}` : ''}`}
          name={`${name}[${i}]`}
          options={options}
          optionValueKey={optionValueKey}
          optionLabelKey={optionLabelKey}
          optionsTitleKey={optionsTitleKey}
          onChange={onChange}
          title={title}
          groupBy={groupBy}
          renderLabel={renderLabel}
        >
          {children}
        </SelectInput>
      );
    }
    return result;
  };

  if (!options.length) return null;
  return (
    <div className={styles.multi_select_input}>
      <p>{label}</p>
      <div>{createSelects()}</div>
      <div className={styles.add_remove_button}>
        <CustomButton
          clickHandler={() => {
            setCount((prev) => prev + 1);
          }}
        >
          +
        </CustomButton>
        <CustomButton
          clickHandler={() => {
            setCount((prev) => (prev > min ? prev - 1 : min));
          }}
        >
          -
        </CustomButton>
      </div>
    </div>
  );
}

export default MultipleSelectInput;
