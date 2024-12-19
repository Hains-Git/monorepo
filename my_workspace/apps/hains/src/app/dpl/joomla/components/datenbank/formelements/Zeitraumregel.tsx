import React, { useEffect, useState } from 'react';
import { TableData } from '../../utils/table/types/table';
import styles from '../datenbank.module.css';
import EveryContainer from './zeitraumregel/EveryContainer';
import EveryKW, { KWSetting, kwSettings } from './zeitraumregel/EveryKW';
import EveryMonthDay, { MonthDaySetting } from './zeitraumregel/EveryMonthDay';
import HolidayRadios, {
  HolidaySetting,
  holidaySettings
} from './zeitraumregel/HolidayRadios';
import { getNestedAttr } from '../../../helper/util';

/*
#fm_m1_m2_m3_m4_m5_m6_m7_m8_m9_m10_m11_m12_
#fkw_kw1_kw2_kw3_kw4_kw5_kw6_kw8_kw9_
#immer_
#tr_1_
#neu_3_4_
#ende_
#wr_Mo_Di_Mi_Do_Fr_Sa_So_
#ft_
#nicht_heilige drei könige_karfreitag_ostersonntag_ostermontag_tag der arbeit
-> #fm_m(1-12)_fkw_kw(1-53)_#(immer|gemein|extra)_#tr_(-25-31)_(#neu)_(0-X)_(-25-31)_(#ende)_#wr_(Mo-So)_#ft_#(nicht|auch|nur)_nameinlowercase
*/

const monthLabels = Array.from({ length: 12 }, (_, i) => {
  const date = new Date(new Date().getFullYear(), i, 1);
  return date.toLocaleDateString('de-DE', { month: 'long' });
});

const weekdayLabels = [
  'Montag',
  'Dienstag',
  'Mittwoch',
  'Donnerstag',
  'Freitag',
  'Samstag',
  'Sonntag'
];

const holidays = [
  'Neujahr',
  'Heilige Drei Könige',
  'Karfreitag',
  'Karsamstag',
  'Ostersonntag',
  'Ostermontag',
  'Tag der Arbeit',
  'Christi Himmelfahrt',
  'Pfingstsonntag',
  'Pfingstmontag',
  'Fronleichnam',
  'Tag der Deutschen Einheit',
  'Allerheiligen',
  'Heiligabend',
  'Erster Weihnachtstag',
  'Zweiter Weihnachtstag',
  'Silvester'
];

const setLowerCaseOrPattern = (str: string, value: string) => {
  const lowerCaseValue = value.toLowerCase();
  return str ? `${str}|${lowerCaseValue}` : lowerCaseValue;
};

const wkdaysShort = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const patterns = {
  months: /(#fm(_m(1[0-2]|[1-9]))*)/g,
  kws: new RegExp(
    `(#fkw(_kw(5[0-3]|[1-4][0-9]|[1-9]))*(_(${kwSettings.reduce(setLowerCaseOrPattern, '')})))`,
    'g'
  ),
  weekDays: /(#wr(_(Mo|Di|Mi|Do|Fr|Sa|So))*)/g,
  holidays: new RegExp(
    `(#ft(_(${holidaySettings.reduce(setLowerCaseOrPattern, '')}))(_(${holidays.reduce(setLowerCaseOrPattern, '')}))*)`,
    'g'
  ),
  monthDay: /(#tr_-?\d+(_#neu)?(_-?\d+){2}(_#ende)?)/g
};

const getIds = (
  regelCode: string,
  sliceStart: number,
  min: number,
  max: number
) =>
  regelCode.split('_').reduce((acc: number[], r: string, index: number) => {
    if (index > 0) {
      const id = (parseInt(r.slice(sliceStart), 10) || 0) - 1;
      if (id >= min && id < max) acc.push(id);
    }
    return acc;
  }, []);

const getSetting = <T extends KWSetting | HolidaySetting>(
  regelCode: string,
  settings: T[]
) =>
  settings.find((setting: T) => regelCode.includes(setting.toLowerCase())) ||
  settings[0];

const getHolidays = (regelCode: string) => {
  const lowerCaseHolidays = holidays.map((holiday) => holiday.toLowerCase());
  return regelCode.split('_').reduce((acc: number[], holiday, i) => {
    if (i > 1) {
      const index = lowerCaseHolidays.indexOf(holiday);
      if (index >= 0) {
        acc.push(index);
      }
    }
    return acc;
  }, []);
};

const splitRegelCode = (regelcode: string) => {
  const result: {
    months: number[];
    kws: number[];
    kwSetting: KWSetting;
    holidaySetting: HolidaySetting;
    weekDays: number[];
    holidays: number[];
    monthDay: MonthDaySetting & { exists: boolean };
  } = {
    months: [],
    kws: [],
    kwSetting: kwSettings[0],
    holidaySetting: holidaySettings[0],
    weekDays: [],
    holidays: [],
    monthDay: {
      start: 1,
      repeat: 0,
      end: 0,
      startEveryMonth: false,
      endEveryMonth: false,
      exists: false
    }
  };
  for (const key in patterns) {
    const pattern = patterns[key as keyof typeof patterns];

    const firstGroup = regelcode.match(pattern)?.[0];
    if (!firstGroup) {
      if (key === 'monthDay') result.monthDay.exists = false;
      continue;
    }
    switch (key) {
      case 'months':
        result.months = getIds(firstGroup, 1, 0, 12);
        break;
      case 'kws':
        result.kws = getIds(firstGroup, 2, 0, 53);
        result.kwSetting = getSetting<KWSetting>(firstGroup, kwSettings);
        break;
      case 'weekDays':
        result.weekDays = firstGroup
          .split('_')
          .slice(1)
          .map((day) => wkdaysShort.indexOf(day));
        break;
      case 'holidays':
        result.holidays = getHolidays(firstGroup);
        result.holidaySetting = getSetting<HolidaySetting>(
          firstGroup,
          holidaySettings
        );
        break;
      case 'monthDay': {
        const values = firstGroup
          .replace('_#neu', '')
          .replace('_#ende', '')
          .replace('#tr_', '')
          .split('_');
        const start = parseInt(values[0], 10);
        const repeat = parseInt(values[1], 10);
        const end = parseInt(values[2], 10);
        result.monthDay.exists = true;
        result.monthDay.startEveryMonth = firstGroup.includes('#neu');
        result.monthDay.endEveryMonth = firstGroup.includes('#ende');
        if (!Number.isNaN(start)) result.monthDay.start = start;
        if (!Number.isNaN(repeat)) result.monthDay.repeat = repeat;
        if (!Number.isNaN(end)) result.monthDay.end = end;
        break;
      }
    }
  }
  return result;
};

const sortNrAsc = (a: number, b: number) => a - b;

function Zeitraumregel({ row }: { row: TableData | null }) {
  const [everyMonth, setEveryMonth] = useState(true);
  const [everyWeek, setEveryWeek] = useState(true);
  const [everyMonthDay, setEveryMonthDay] = useState(true);
  const [everyWeekDay, setEveryWeekDay] = useState(true);
  const [everyHoliday, setEveryHoliday] = useState(true);
  const [monthIds, setMonthIds] = useState<number[]>([]);
  const [weekDays, setWeekDays] = useState<number[]>([]);
  const [kwIds, setKwIds] = useState<number[]>([]);
  const [holidayIds, setHolidayIds] = useState<number[]>([]);
  const [holidaySetting, setHolidaySetting] = useState<HolidaySetting>(
    holidaySettings[0]
  );
  const [kwSetting, setKwSetting] = useState<KWSetting>(kwSettings[0]);
  const [monthDaySetting, setMonthDaySetting] = useState<MonthDaySetting>({
    start: 1,
    repeat: 0,
    end: 0,
    startEveryMonth: false,
    endEveryMonth: false
  });

  useEffect(() => {
    const regelcode: string =
      getNestedAttr(row, 'regelcode')?.toString?.() || '';
    const values = splitRegelCode(regelcode);
    setEveryMonth(() => values.months.length === 0);
    setMonthIds(() => values.months);
    setEveryWeek(() => values.kws.length === 0);
    setKwIds(() => values.kws);
    setKwSetting(() => values.kwSetting);
    setEveryMonthDay(() => !values.monthDay.exists);
    setMonthDaySetting(() => values.monthDay);
    setEveryWeekDay(() => values.weekDays.length === 0);
    setWeekDays(() => values.weekDays);
    setEveryHoliday(() => values.holidays.length === 0);
    setHolidayIds(() => values.holidays);
    setHolidaySetting(() => values.holidaySetting);
  }, [row]);

  const getRegelCode = () => {
    let code = '';
    if (!everyMonth && monthIds.length > 0) {
      code += `#fm_${monthIds
        .sort(sortNrAsc)
        .map((id) => `m${id + 1}`)
        .join('_')}`;
    }
    if (!everyWeek && kwIds.length > 0) {
      if (code) code += '_';
      code += `#fkw_${kwIds
        .sort(sortNrAsc)
        .map((id) => `kw${id + 1}`)
        .join('_')}_${kwSetting}`;
    }
    if (!everyMonthDay) {
      if (code) code += '_';
      code += `#tr_${monthDaySetting.start}`;
      if (monthDaySetting.startEveryMonth) code += '_#neu';
      code += `_${monthDaySetting.repeat}`;
      code += `_${monthDaySetting.end}`;
      if (monthDaySetting.endEveryMonth) code += '_#ende';
    }
    if (!everyWeekDay && weekDays.length > 0) {
      if (code) code += '_';
      code += `#wr_${weekDays
        .sort(sortNrAsc)
        .map((id) => wkdaysShort[id])
        .join('_')}`;
    }
    if (!everyHoliday && holidayIds.length > 0) {
      if (code) code += '_';
      code += `#ft_${holidaySetting}_${holidayIds
        .sort(sortNrAsc)
        .map((id) => holidays[id].toLowerCase())
        .join('_')}`;
    }
    return code;
  };

  return (
    <fieldset>
      <p>Wähle einen Rhythmus aus:</p>
      <input type="hidden" name="regelcode" value={getRegelCode()} />
      <div className={styles.zeitraumregel}>
        <div>
          <EveryContainer
            label="Jeden Monat"
            checked={everyMonth}
            setChecked={setEveryMonth}
            setIds={setMonthIds}
            labels={monthLabels}
            ids={monthIds}
          />
          <EveryMonthDay
            everyMonthDay={everyMonthDay}
            monthDaySetting={monthDaySetting}
            setMonthDaySetting={setMonthDaySetting}
            setEveryMonthDay={setEveryMonthDay}
          />
          <EveryContainer
            label="Jeden Feiertag"
            checked={everyHoliday}
            setChecked={setEveryHoliday}
            setIds={setHolidayIds}
            labels={holidays}
            ids={holidayIds}
          >
            <HolidayRadios
              holidaySetting={holidaySetting}
              setHolidaySetting={(value: HolidaySetting) =>
                setHolidaySetting(() => value)
              }
            />
          </EveryContainer>
        </div>

        <div>
          <EveryKW
            everyWeek={everyWeek}
            setEveryWeek={setEveryWeek}
            kwIds={kwIds}
            setKwIds={setKwIds}
            kwSetting={kwSetting}
            setKwSetting={(value: KWSetting) => setKwSetting(() => value)}
          />
          <EveryContainer
            label="Jeden Wochentag"
            checked={everyWeekDay}
            setChecked={setEveryWeekDay}
            setIds={setWeekDays}
            labels={weekdayLabels}
            ids={weekDays}
          />
        </div>
      </div>
    </fieldset>
  );
}

export default Zeitraumregel;
