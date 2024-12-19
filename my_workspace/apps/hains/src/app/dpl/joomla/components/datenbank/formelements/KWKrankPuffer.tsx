import React, { ReactElement, useEffect, useState } from 'react';
import { getNestedAttr } from '../../../helper/util';
import styles from '../datenbank.module.css';
import NumberInput from './NumberInput';
import CustomButton from '../../utils/custom-button/CustomButton';

function KWKrankPuffer({
  row,
  formSelectOptions,
  min
}: {
  row: any;
  formSelectOptions: any;
  min: number;
}) {
  const [count, setCount] = useState<number>(min);

  useEffect(() => {
    const kwPuffer = getNestedAttr(row, 'team_kw_krankpuffers') || [];
    if (Array.isArray(kwPuffer)) {
      const l = kwPuffer.length;
      setCount(() => (l > min ? l : min));
    } else {
      setCount(() => min);
    }
  }, [row, formSelectOptions]);

  const createKWPuffer = () => {
    const result: ReactElement[] = [];
    for (let i = 0; i < count; i++) {
      result.push(
        <div
          key={i}
          title="Krank Puffer für Ausfall durch Krankheit im Urlaubssaldo für bestimmte Kalenderwochen"
        >
          <NumberInput
            required
            label="KW"
            row={row}
            elKey={`team_kw_krankpuffers.${i}.kw`}
            name={`team_kw_krankpuffers[${i}].kw`}
            defaultValue={1}
            min={1}
            max={53}
          />
          <NumberInput
            required
            label=""
            row={row}
            elKey={`team_kw_krankpuffers.${i}.puffer`}
            name={`team_kw_krankpuffers[${i}].puffer`}
            defaultValue={1}
            min={1}
          />
        </div>
      );
    }
    return result;
  };

  return (
    <fieldset>
      <p>KW Krank Puffer</p>
      <div className={styles.kw_krank_puffer}>{createKWPuffer()}</div>
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
    </fieldset>
  );
}

export default KWKrankPuffer;
