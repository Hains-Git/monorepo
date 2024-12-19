import React, { ReactElement, useEffect, useState } from 'react';
import SelectInput from './SelectInput';
import { TableData } from '../../utils/table/types/table';
import { getNestedAttr } from '../../../helper/util';
import styles from '../datenbank.module.css';
import CustomButton from '../../utils/custom-button/CustomButton';

function SelectPerGroup({
  label,
  row,
  required,
  elKey,
  name,
  groups,
  groupsValueKey,
  groupsLabelKey,
  groupOptions,
  groupOptionsValueKey,
  groupOptionsLabelKey,
  onChange = undefined,
  onChangeGroup = undefined,
  defaultOptions,
  titleGroups = '',
  titleGroupOptions = ''
}: {
  label: string;
  row: TableData | null;
  required: boolean;
  elKey: string;
  name: string;
  groups: any[];
  groupsValueKey: string;
  groupsLabelKey: string;
  groupOptions: any[];
  groupOptionsValueKey: string;
  groupOptionsLabelKey: string;
  onChange?: (value: string) => void;
  onChangeGroup?: (arr: string[], currentGroup: string) => void;
  defaultOptions: string[];
  titleGroups?: string;
  titleGroupOptions?: string;
}) {
  const [selectedOptions, setSelectedOptions] =
    useState<string[]>(defaultOptions);
  const [currentGroup, setCurrentGroup] = useState<string>('');

  useEffect(() => {
    setSelectedOptions(() => defaultOptions);
    setCurrentGroup(() => getNestedAttr(row, elKey)?.toString?.() || '');
  }, [groups, groupOptions, defaultOptions]);

  if (!groups.length) return null;
  return (
    <div className={styles.select_per_group_container}>
      <SelectInput
        label={label}
        row={row}
        elKey={elKey}
        name=""
        optionLabelKey={groupsLabelKey}
        optionValueKey={groupsValueKey}
        options={groups}
        required={required}
        onChange={(value) => {
          if (onChange) onChange(value);
          setCurrentGroup(() => value);
        }}
        title={titleGroups}
      >
        {currentGroup && (
          <select
            className={styles.select_width}
            onChange={(evt) => {
              const value = evt.target.value;
              const result = [...selectedOptions, value];
              if (onChangeGroup) onChangeGroup(result, currentGroup);
              setSelectedOptions(result);
            }}
            title={titleGroupOptions}
          >
            <option value="" aria-label="none" />
            {groupOptions.reduce((acc: ReactElement[], option) => {
              const optionValue: string =
                getNestedAttr(option, groupOptionsValueKey)?.toString?.() || '';
              if (selectedOptions.includes(optionValue)) return acc;
              const optionLabel = getNestedAttr(option, groupOptionsLabelKey);
              return acc.concat([
                <option key={optionValue} value={optionValue}>
                  {optionLabel}
                </option>
              ]);
            }, [])}
          </select>
        )}
      </SelectInput>
      {currentGroup && (
        <div>
          <div className={styles.selected_per_group}>
            {selectedOptions.map((optionValue, index) => {
              const option = groupOptions.find(
                (o) =>
                  getNestedAttr(o, groupOptionsValueKey)?.toString?.() ===
                  optionValue
              );
              if (!option) return null;
              const optionLabel = getNestedAttr(option, groupOptionsLabelKey);
              return (
                <div key={optionValue}>
                  <input
                    type="hidden"
                    name={`${name}.${currentGroup}[${index}]`}
                    value={optionValue}
                  />
                  <span>{optionLabel}</span>
                  <CustomButton
                    clickHandler={() => {
                      const result = selectedOptions.filter(
                        (v) => v !== optionValue
                      );
                      if (onChangeGroup) onChangeGroup(result, currentGroup);
                      setSelectedOptions(result);
                    }}
                  >
                    X
                  </CustomButton>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default SelectPerGroup;
