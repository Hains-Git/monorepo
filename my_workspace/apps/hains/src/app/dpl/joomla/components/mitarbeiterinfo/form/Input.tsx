import type { ComponentPropsWithoutRef } from 'react';
import React, { useState, useEffect } from 'react';
import styles from '../../../mitarbeiterinfo/app.module.css';

import { isFunction } from '../../../helper/types';

interface InputProps extends ComponentPropsWithoutRef<'input'> {
  label: string;
  preName?: string;
  cssClass?: string;
  initialVal?: string;
  isChecked?: boolean | undefined;
  readOnly?: boolean | undefined;
  title?: string;
  showHidden?: boolean;
  callback?: (label: string, val: string) => void | undefined;
}

function Input({
  label,
  preName = '',
  initialVal,
  cssClass = '',
  isChecked,
  readOnly,
  callback,
  title = '',
  showHidden = false,
  ...rest
}: InputProps) {
  const [value, setValue] = useState(rest?.value || initialVal || '');
  const [checked, setChecked] = useState(isChecked);
  const isCheckBox = rest?.type === 'checkbox';
  const isCheckBoxOrRadio = isCheckBox || rest?.type === 'radio';

  const createInputName = () => {
    const labelTrimmed = label.toLowerCase().trim();
    const _name = labelTrimmed.split(' ').join('_');
    let inputName = _name;
    if (rest?.name) {
      inputName = rest?.name;
    }
    if (preName) {
      inputName = `${preName}[${_name}]`;
    }
    if (rest?.name && preName) {
      inputName = `${preName}[${rest.name}]`;
    }
    return inputName;
  };

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement> | undefined) => {
    let inputVal = e?.target?.value || '';
    if (isCheckBox) {
      const targetChecked = !checked;
      setChecked(targetChecked);
      inputVal = String(targetChecked);
    } else {
      setValue(inputVal);
    }
    if (isFunction?.(callback)) {
      callback && callback(label, inputVal);
    }
  };

  useEffect(() => {
    if (rest?.value) {
      if (typeof rest.value === 'string') {
        setValue(rest.value.trim());
      }
    }
    if (initialVal) {
      setValue(initialVal.trim());
    }
  }, [rest?.value, initialVal]);

  useEffect(() => {
    if (isCheckBoxOrRadio) {
      setChecked(isChecked);
    }
  }, [isChecked]);

  return (
    <fieldset className={`${styles[cssClass] || ''}`}>
      {isCheckBox && showHidden && !checked ? <input type="hidden" value="" name={createInputName()} /> : null}
      {isCheckBoxOrRadio ? (
        <label title={title}>
          <input
            onChange={onChangeInput}
            readOnly={readOnly}
            {...rest}
            checked={checked}
            name={checked ? createInputName() : ''}
            value={value}
          />
          <span>
            {label} {rest?.required ? '*' : ''}
          </span>
        </label>
      ) : (
        <label title={title}>
          <span>
            {label} {rest?.required ? '*' : ''}
          </span>
          <input
            type="text"
            readOnly={readOnly}
            onChange={onChangeInput}
            {...rest}
            value={value}
            name={createInputName()}
          />
        </label>
      )}
    </fieldset>
  );
}
export default Input;
