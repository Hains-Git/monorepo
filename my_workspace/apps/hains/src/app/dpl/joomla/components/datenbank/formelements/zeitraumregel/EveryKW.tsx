import React from 'react';
import Every from './Every';
import CheckBoxen from './CheckBoxen';
import styles from '../../datenbank.module.css';
import Radio from './Radio';

const kws = Array.from({ length: 53 }, (_, i) => `KW ${i + 1}`);

const filterByIndex = (
  index: number,
  setState: React.Dispatch<React.SetStateAction<number[]>>
) => {
  setState((cur) =>
    cur.includes(index) ? cur.filter((i) => i !== index) : [...cur, index]
  );
};

export type KWSetting = '#immer' | '#gemein' | '#extra';
export const kwSettings: KWSetting[] = ['#immer', '#gemein', '#extra'];

function EveryKW({
  everyWeek,
  setEveryWeek,
  kwIds,
  setKwIds,
  kwSetting,
  setKwSetting
}: {
  everyWeek: boolean;
  setEveryWeek: React.Dispatch<React.SetStateAction<boolean>>;
  kwIds: number[];
  setKwIds: React.Dispatch<React.SetStateAction<number[]>>;
  kwSetting: KWSetting;
  setKwSetting: (value: KWSetting) => void;
}) {
  return (
    <Every
      checked={everyWeek}
      toggleChecked={() => {
        setEveryWeek((cur) => !cur);
      }}
      label="Jede Woche"
    >
      {!everyWeek && (
        <>
          <div>
            {[
              'Gilt bei Jahren mit 52 und 53 KWs',
              'Gilt nur bei Jahren mit 52 KWs',
              'Gilt nur bei Jahren mit 53 KWs'
            ].map((label, index) => (
              <Radio
                key={label}
                label={label}
                value={kwSettings[index]}
                name="kw_setting"
                checked={kwSetting === kwSettings[index]}
                onChange={() => setKwSetting(kwSettings[index])}
              />
            ))}
          </div>
          <div className={styles.weeks}>
            <CheckBoxen
              labels={kws.slice(0, 18)}
              checked={(index) => kwIds.includes(index)}
              handler={(index) => filterByIndex(index, setKwIds)}
            />
            <CheckBoxen
              labels={kws.slice(18, 36)}
              checked={(index) => kwIds.includes(index + 18)}
              handler={(index) => filterByIndex(index + 18, setKwIds)}
            />
            <CheckBoxen
              labels={kws.slice(36)}
              checked={(index) => kwIds.includes(index + 36)}
              handler={(index) => filterByIndex(index + 36, setKwIds)}
            />
          </div>
        </>
      )}
    </Every>
  );
}

export default EveryKW;
