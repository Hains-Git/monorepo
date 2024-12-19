import React from 'react';
import { FaCaretDown, FaCaretUp, FaTrash } from 'react-icons/fa';
import TextInput from '../TextInput';
import NumberInput from '../NumberInput';
import CustomButton from '../../../utils/custom-button/CustomButton';
import DateInput from '../DateInput';
import styles from './vertragstyp.module.css';
import { TVertragsvariante } from '../../../../helper/api_data_types';

function Variante({
  variante,
  baseName,
  removeVariante
}: {
  variante: TVertragsvariante;
  baseName: string;
  removeVariante: (variante: TVertragsvariante) => void;
}) {
  const [show, setShow] = React.useState(false);

  return (
    <div className={styles.vertrags_variante}>
      <div>
        <input type="hidden" name={`${baseName}.id`} value={variante.id} />
        <CustomButton
          className="as_icon"
          clickHandler={() => setShow((curr) => !curr)}
        >
          {show ? <FaCaretUp /> : <FaCaretDown />}
        </CustomButton>
        <TextInput
          required
          label=""
          row={variante}
          elKey="name"
          name={`${baseName}.name`}
        />
        <CustomButton
          clickHandler={() => removeVariante(variante)}
          className="red as_icon"
        >
          <FaTrash />
        </CustomButton>
      </div>
      <div
        className={
          show ? styles.vertrags_variante_show : styles.vertrags_variante_hide
        }
      >
        <NumberInput
          required
          label="Std./Woche"
          row={variante}
          elKey="wochenstunden"
          name={`${baseName}.wochenstunden`}
          min={0}
          max={168}
          step={1}
          defaultValue={0}
        />
        <NumberInput
          required
          label="Urlaubstage/Monat"
          row={variante}
          elKey="tage_monat"
          name={`${baseName}.tage_monat`}
          min={0}
          step={0.01}
          max={30}
          defaultValue={0}
        />
        <DateInput
          required
          label="Von"
          row={variante}
          elKey="von"
          name={`${baseName}.von`}
        />
        <DateInput
          required={false}
          label="Bis"
          row={variante}
          elKey="bis"
          name={`${baseName}.bis`}
        />
      </div>
    </div>
  );
}

export default Variante;
