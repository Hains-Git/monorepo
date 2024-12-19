import React, { useContext } from 'react';
import Select from './Select';
import Input from './Input';
import { VertragContext } from '../../../context/mitarbeiterinfo/VertragProvider';
import CustomButton from '../../utils/custom-button/CustomButton';
import { numericLocaleCompare } from '../../../helper/util';
import styles from '../../../mitarbeiterinfo/app.module.css';
import Textarea from './Textarea';
import { UseBeginEnde } from '../../../hooks/use-begin-ende';

function VertragForm() {
  const { vertragsTyp, formConfig, updateVertrag } = useContext(VertragContext);
  const { beginn, ende, onChangeBeginn, onChangeEnde } = UseBeginEnde();

  if (!formConfig) return null;
  const vertrag = formConfig.vertrag;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const _form: HTMLFormElement = event.currentTarget;
    const _formData = new FormData(_form);
    _formData.append('id', vertrag.id.toString());
    updateVertrag(_formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Anfang"
        name="anfang"
        value={vertrag.anfang || ''}
        type="date"
        max={ende}
        callback={onChangeBeginn}
        required
      />
      <Input
        label="Ende"
        name="ende"
        value={vertrag.ende || ''}
        type="date"
        min={beginn}
        callback={onChangeEnde}
        required
      />
      <Select
        label="Typ"
        name="vertragstyp_id"
        data={vertragsTyp.sort((a: any, b: any) => numericLocaleCompare(a.name, b.name))}
        keyExtractor="id"
        optionText="name"
        value={vertrag.vertragstyp_id}
        required
      />
      <Input
        label="Unbefristet"
        name="unbefristet"
        type="checkbox"
        isChecked={vertrag.unbefristet}
        showHidden
        value="true"
      />
      <Textarea label="Kommentar" name="kommentar" value={vertrag.kommentar || ''} />
      <CustomButton type="submit" className={`primary ${styles.btn}`}>
        Speichern
      </CustomButton>
    </form>
  );
}

export default VertragForm;
