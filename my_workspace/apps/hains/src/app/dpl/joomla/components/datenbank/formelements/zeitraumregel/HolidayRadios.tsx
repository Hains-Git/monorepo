import React from 'react';
import Radio from './Radio';

export type HolidaySetting = '#nicht' | '#auch' | '#nur';
export const holidaySettings: HolidaySetting[] = ['#nicht', '#auch', '#nur'];

function HolidayRadios({
  holidaySetting,
  setHolidaySetting
}: {
  holidaySetting: HolidaySetting;
  setHolidaySetting: (value: HolidaySetting) => void;
}) {
  return (
    <div>
      {[
        'Gilt nicht an den Feiertagen',
        'Gilt unabhängig auch an den Feiertagen',
        'Gilt nur an Feiertagen'
      ].map((label, index) => (
        <Radio
          key={label}
          label={label}
          value={holidaySettings[index]}
          name="holiday_settting"
          checked={holidaySetting === holidaySettings[index]}
          onChange={() => setHolidaySetting(holidaySettings[index])}
        />
      ))}
    </div>
  );
}

export default HolidayRadios;
