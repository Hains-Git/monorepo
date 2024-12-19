import React, { ReactElement, useEffect, useState } from 'react';
import SelectInput from './SelectInput';
import { getNestedAttr } from '../../../helper/util';
import styles from '../datenbank.module.css';
import NumberInput from './NumberInput';
import CustomButton from '../../utils/custom-button/CustomButton';
import CheckBox from './CheckBox';

function KontingentDienste({
  row,
  formSelectOptions
}: {
  row: any;
  formSelectOptions: any;
}) {
  const [count, setCount] = useState<number>(1);

  useEffect(() => {
    const kontingentDienste = getNestedAttr(row, 'kontingent_po_dienst') || [];
    if (Array.isArray(kontingentDienste)) {
      setCount(() => kontingentDienste.length || 1);
    } else {
      setCount(() => 1);
    }
  }, [row, formSelectOptions]);

  const dienste = Array.isArray(formSelectOptions?.dienste?.data)
    ? formSelectOptions.dienste.data
    : [];

  const createKontingentDienste = () => {
    const result: ReactElement[] = [];
    for (let i = 0; i < count; i++) {
      result.push(
        <div key={i}>
          <SelectInput
            required={false}
            label=""
            row={row}
            elKey={`kontingent_po_dienst.${i}.po_dienst_id`}
            name={`dienste[${i}].id`}
            optionLabelKey="planname"
            optionsTitleKey="name"
            optionValueKey="id"
            options={dienste}
          />
          <NumberInput
            required
            label=""
            row={row}
            elKey={`kontingent_po_dienst.${i}.eingeteilt_count_factor`}
            name={`dienste[${i}].eingeteilt_count_factor`}
            defaultValue={1}
            min={1}
            max={1000}
            title="Gewichtung wie der Dienst als eingeteilt gezählt wird. (Hoher Wert = kleines Gewicht)"
          />
          <CheckBox
            label=""
            title="Kann automatisch eingeteilt werden?"
            row={row}
            elKey={`kontingent_po_dienst.${i}.magic_einteilung`}
            name={`dienste[${i}].magic_einteilung`}
          />
        </div>
      );
    }
    return result;
  };

  return (
    <fieldset>
      <p>Dienste (Eingeteilt-Gewichtung)</p>
      <div className={styles.kontingent_po_dienst}>
        {createKontingentDienste()}
      </div>
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
            setCount((prev) => (prev > 1 ? prev - 1 : 1));
          }}
        >
          -
        </CustomButton>
      </div>
    </fieldset>
  );
}

export default KontingentDienste;
