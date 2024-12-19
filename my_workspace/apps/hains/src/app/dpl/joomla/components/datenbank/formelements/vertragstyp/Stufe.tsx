import React from 'react';
import { FaCaretDown, FaCaretUp, FaTrash } from 'react-icons/fa';
import NumberInput from '../NumberInput';
import CustomButton from '../../../utils/custom-button/CustomButton';
import styles from './vertragstyp.module.css';
import SelectInput from '../SelectInput';
import {
  TVertragsstufe,
  TVertragsvariante
} from '../../../../helper/api_data_types';

function Stufe({
  stufe,
  baseName,
  removeStufe,
  varianten
}: {
  stufe: TVertragsstufe;
  baseName: string;
  varianten: TVertragsvariante[];
  removeStufe: (stufe: TVertragsstufe) => void;
}) {
  const [show, setShow] = React.useState(false);

  return (
    <div className={styles.vertragsstufe}>
      <div>
        <input type="hidden" name={`${baseName}.id`} value={stufe.id} />
        <CustomButton
          className="as_icon"
          clickHandler={() => setShow((curr) => !curr)}
        >
          {show ? <FaCaretUp /> : <FaCaretDown />}
        </CustomButton>
        <NumberInput
          label=""
          row={stufe}
          elKey="stufe"
          name={`${baseName}.stufe`}
          required
          min={1}
          step={1}
          max={999}
          defaultValue={1}
        />
        <SelectInput
          required
          label=""
          row={stufe}
          title="Vertragsvariante"
          elKey="vertrags_variante_id"
          name={`${baseName}.vertrags_variante_id`}
          optionLabelKey="name"
          optionValueKey="id"
          options={varianten}
        />
        <CustomButton
          clickHandler={() => removeStufe(stufe)}
          className="red as_icon"
        >
          <FaTrash />
        </CustomButton>
      </div>
      <div
        className={show ? styles.vertragsstufe_show : styles.vertragsstufe_hide}
      >
        <NumberInput
          label="Gehalt/Monat"
          row={stufe}
          elKey="monatsgehalt"
          name={`${baseName}.monatsgehalt`}
          min={0}
          step={1}
          required
          defaultValue={0}
        />
        <NumberInput
          label="Jahre"
          row={stufe}
          elKey="nach_jahren"
          name={`${baseName}.nach_jahren`}
          min={0}
          step={1}
          required
          defaultValue={0}
        />
      </div>
    </div>
  );
}

export default Stufe;
