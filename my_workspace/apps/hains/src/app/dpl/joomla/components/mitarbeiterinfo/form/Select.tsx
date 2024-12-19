import type { ComponentPropsWithoutRef } from 'react';
import React, { useState, useEffect } from 'react';
import styles from '../../../mitarbeiterinfo/app.module.css';
import { isFunction } from '../../../helper/types';
import { getNestedAttr } from '../../../helper/util';

type TOptGroup = {
  keyExtractor: string;
  optionText: string | string[];
  accessKey: string;
  visiblePattern: 'Default' | 'ShowParentInChild';
};
type TObjectIndex = {
  [key: number | string]: any;
};

interface ISelectProps extends ComponentPropsWithoutRef<'select'> {
  label: string;
  preName?: string;
  callback?: (val: string, label: string) => void;
  cssClass?: string;
  data: TObjectIndex[];
  keyExtractor: string;
  optionText: string;
  optgroup?: TOptGroup;
  placeholderOption?: boolean;
  title?: string;
}

function Select({
  label,
  preName = '',
  keyExtractor,
  optionText,
  callback = () => {},
  data,
  cssClass = '',
  optgroup,
  placeholderOption = false,
  title = '',
  ...rest
}: ISelectProps) {
  const [value, setValue] = useState(rest?.value || '');

  useEffect(() => {
    setValue(rest?.value || '');
  }, [rest?.value]);

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

  const getOptionText = (group: TObjectIndex, option: TObjectIndex) => {
    let text = '';
    if (!optgroup) return text;
    const groupText = Array.isArray(optgroup.optionText)
      ? optgroup.optionText
      : [optgroup.optionText];
    if (optgroup.visiblePattern === 'Default') {
      text = `${groupText.map((_text) => getNestedAttr(group, _text)).join(', ')}`;
    } else {
      text = `${getNestedAttr(option, optionText)} ${groupText.map((_text) => getNestedAttr(group, _text)).join(', ')}`;
    }
    return text;
  };

  const onChangeHandler = (e: any) => {
    const val = e.target.value.trim();
    setValue(val);
    if (callback && isFunction(callback)) {
      callback(val, label);
    }
  };

  return (
    <fieldset className={`${styles[cssClass] || ''}`}>
      <label title={title}>
        <span>
          {' '}
          {label} {rest?.required ? '*' : ''}{' '}
        </span>
        <select
          onChange={onChangeHandler}
          {...rest}
          value={value}
          name={createInputName()}
        >
          {placeholderOption && <option aria-label="empty" value="" />}
          {data.map((option) => {
            const arr = optgroup?.accessKey
              ? getNestedAttr(option, optgroup.accessKey)
              : [];
            return optgroup && Object?.values?.(optgroup)?.length > 0 ? (
              <optgroup
                label={option?.[optionText]}
                key={option?.[keyExtractor]}
              >
                {arr?.map?.((group: TObjectIndex) => {
                  return (
                    <option
                      key={group[optgroup.keyExtractor]}
                      value={group[optgroup.keyExtractor]}
                    >
                      {getOptionText(group, option)}
                    </option>
                  );
                })}
              </optgroup>
            ) : (
              <option key={option[keyExtractor]} value={option[keyExtractor]}>
                {option[optionText]}
              </option>
            );
          })}
        </select>
      </label>
    </fieldset>
  );
}
export default Select;
