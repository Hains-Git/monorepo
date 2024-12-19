import React from 'react';
import Every from './Every';
import CheckBox from './CheckBox';
import NumberInput from './Number';
import styles from '../../datenbank.module.css';

export type MonthDaySetting = {
  start: number;
  repeat: number;
  end: number;
  startEveryMonth: boolean;
  endEveryMonth: boolean;
};

function EveryMonthDay({
  everyMonthDay,
  monthDaySetting,
  setEveryMonthDay,
  setMonthDaySetting
}: {
  everyMonthDay: boolean;
  monthDaySetting: MonthDaySetting;
  setEveryMonthDay: React.Dispatch<React.SetStateAction<boolean>>;
  setMonthDaySetting: React.Dispatch<React.SetStateAction<MonthDaySetting>>;
}) {
  return (
    <Every
      checked={everyMonthDay}
      toggleChecked={() => setEveryMonthDay((cur) => !cur)}
      label="Jeden Monatstag"
    >
      {!everyMonthDay && (
        <div className={styles.month_day}>
          <NumberInput
            label="Tag des Beginns"
            title="Tag ab dem begonnen werden soll. x <= 0: letzter Tag des Monats - x, x > 0: Tag des Monats"
            value={monthDaySetting.start}
            handler={(value) =>
              setMonthDaySetting((cur) => ({ ...cur, start: value }))
            }
            min={-25}
            max={31}
          />
          <CheckBox
            label="Jeden Monat an diesem Tag beginnen"
            index={0}
            checked={() => monthDaySetting.startEveryMonth}
            handler={() =>
              setMonthDaySetting((cur) => ({
                ...cur,
                startEveryMonth: !cur.startEveryMonth
              }))
            }
          />
          <NumberInput
            label="Tage bis zur Wiederholung"
            title="Anzahl der Tage bis zur Widerholung. 0: Keine Wiederholung, 1: Jeden Tag"
            value={monthDaySetting.repeat}
            handler={(value) =>
              setMonthDaySetting((cur) => ({ ...cur, repeat: value }))
            }
            min={0}
            max={999}
          />
          <NumberInput
            label="Tag des Endes"
            title="Gilt bis einschließlich Ende, wenn das Ende auf einen gültigen Tag fällt. x <= 0: letzter Tag des Monats - x, x > 0: Tag des Monats"
            value={monthDaySetting.end}
            handler={(value) =>
              setMonthDaySetting((cur) => ({ ...cur, end: value }))
            }
            min={-25}
            max={31}
          />
          <CheckBox
            label="Jeden Monat an diesem Tag enden"
            index={1}
            checked={() => monthDaySetting.endEveryMonth}
            handler={() =>
              setMonthDaySetting((cur) => ({
                ...cur,
                endEveryMonth: !cur.endEveryMonth
              }))
            }
          />
        </div>
      )}
    </Every>
  );
}

export default EveryMonthDay;
