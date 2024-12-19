import React, { ReactElement, useEffect, useState } from 'react';
import { TableData } from '../../utils/table/types/table';
import { getNestedAttr, numericLocaleCompare } from '../../../helper/util';

function SelectInput({
  label,
  row,
  required,
  elKey,
  name,
  options,
  optionValueKey,
  optionLabelKey,
  onChange = undefined,
  children = null,
  title = '',
  groupBy = '',
  renderLabel = undefined,
  optionsTitleKey = ''
}: {
  label: string;
  row: TableData | null;
  required: boolean;
  elKey: string;
  name: string;
  options: any[];
  optionValueKey: string;
  optionLabelKey: string;
  onChange?: (value: string) => void;
  children?: React.ReactNode;
  title?: string;
  groupBy?: string;
  renderLabel?: (option: any) => string;
  optionsTitleKey?: string;
}) {
  const [value, setValue] = useState<string>('');
  const [currentOptions, setCurrentOptions] = useState<any[]>([]);

  useEffect(() => {
    setValue((row && getNestedAttr(row, elKey)) || '');
  }, [row, elKey]);

  useEffect(() => {
    const nextOptions = Array.isArray(options)
      ? [...options].sort((a, b) => {
          const isAObject = typeof a === 'object';
          const isBObject = typeof b === 'object';
          if (groupBy) {
            const aGroup =
              (isAObject ? getNestedAttr(a, groupBy) : a)?.toString?.() || '';
            const bGroup =
              (isBObject ? getNestedAttr(b, groupBy) : b)?.toString?.() || '';
            const result = numericLocaleCompare(aGroup, bGroup);
            if (result !== 0) return result;
          }
          const aLabel =
            (isAObject ? getNestedAttr(a, optionLabelKey) : a)?.toString?.() ||
            '';
          const bLabel =
            (isBObject ? getNestedAttr(b, optionLabelKey) : b)?.toString?.() ||
            '';
          return numericLocaleCompare(aLabel, bLabel);
        })
      : [];
    if (!required && nextOptions.length) {
      if (typeof nextOptions[0] === 'object') {
        nextOptions.unshift({ [optionValueKey]: '', [optionLabelKey]: '' });
      } else {
        nextOptions.unshift('');
      }
    }
    setCurrentOptions(() => nextOptions);
  }, [options, optionLabelKey, optionValueKey, required]);

  if (!currentOptions.length) return null;
  return (
    <label aria-label={label} title={title}>
      {label}
      {required ? '*' : ''}
      <select
        required={!!required}
        name={name}
        value={value}
        onChange={(evt) => {
          setValue(() => evt.target.value);
          if (onChange) {
            onChange(evt.target.value);
          }
        }}
      >
        {
          currentOptions.reduce(
            (
              acc: {
                groups: ReactElement[];
                options: { [key: string]: ReactElement[] };
              },
              option,
              index
            ) => {
              const isObject = typeof option === 'object';
              const optionValue = isObject
                ? getNestedAttr(option, optionValueKey)
                : option;
              const optionLabel = isObject
                ? getNestedAttr(option, optionLabelKey)
                : option;
              const _title =
                isObject && optionsTitleKey
                  ? getNestedAttr(option, optionsTitleKey)
                  : '';
              const optionElement = (
                <option key={optionValue} title={_title} value={optionValue}>
                  {renderLabel ? renderLabel(option) : optionLabel}
                </option>
              );
              if (groupBy && isObject) {
                const groupName = getNestedAttr(option, groupBy);
                if (!acc.options[groupName]) {
                  acc.options[groupName] = [optionElement];
                  acc.groups.push(
                    <optgroup key={index} label={groupName}>
                      {acc.options[groupName]}
                    </optgroup>
                  );
                } else {
                  acc.options[groupName].push(optionElement);
                }
              } else {
                acc.groups.push(optionElement);
              }
              return acc;
            },
            {
              groups: [],
              options: {}
            }
          ).groups
        }
      </select>
      {children}
    </label>
  );
}

export default SelectInput;
