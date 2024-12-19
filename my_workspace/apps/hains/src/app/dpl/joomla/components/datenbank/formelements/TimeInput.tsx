import React, { useEffect, useState } from 'react';
import { getNestedAttr } from '../../../helper/util';
import { TableData } from '../../utils/table/types/table';

export const timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

const getAsTime = (value: string) => {
  if (value.match(timePattern)) {
    return value;
  }
  return '00:00';
};

const getOptions = (length: number) =>
  Array.from({ length }, (_, i) => i).map((i) => (
    <option key={i} value={i.toString().padStart(2, '0')}>
      {i.toString().padStart(2, '0')}
    </option>
  ));

/**
 * @param param0 defaultValue Format: "00:00"
 */
function TimeInput({
  label,
  row,
  required,
  elKey,
  name,
  defaultValue = '00:00',
  onChange = undefined,
  labelBack = 'Uhr',
  title = ''
}: {
  label: string;
  row: TableData | null;
  required: boolean;
  elKey: string;
  name: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  labelBack?: string;
  title?: string;
}) {
  const defaultTime =
    defaultValue && defaultValue.match(timePattern) ? defaultValue : '00:00';

  const [value, setValue] = useState<string>(getAsTime(defaultValue || ''));
  const [hoursOptions, setHoursOptions] = useState(getOptions(24));
  const [minuteOptions, setMinuteOptions] = useState(getOptions(60));
  const [hours, minutes] = value.split(':');

  useEffect(() => {
    const rowValue = (row && getNestedAttr(row, elKey)?.toString?.()) || '';
    setValue(() => (rowValue.match(timePattern) ? rowValue : defaultTime));
  }, [row]);

  const handleTimeChange = (_hours: string, _minutes: string) => {
    const newTime = `${_hours}:${_minutes}`;
    setValue(() => newTime);
    if (onChange) {
      onChange(newTime);
    }
  };

  return (
    <label aria-label={label} title={title}>
      {label}
      {required ? '*' : ''}
      <div>
        <input type="hidden" value={value} name={name} />
        <select
          value={hours}
          onChange={(evt) => {
            handleTimeChange(evt.target.value, minutes);
          }}
          required={!!required}
        >
          {hoursOptions}
        </select>
        :
        <select
          value={minutes}
          onChange={(evt) => {
            handleTimeChange(hours, evt.target.value);
          }}
          required={!!required}
        >
          {minuteOptions}
        </select>
        {labelBack}
      </div>
    </label>
  );
}

export default TimeInput;
