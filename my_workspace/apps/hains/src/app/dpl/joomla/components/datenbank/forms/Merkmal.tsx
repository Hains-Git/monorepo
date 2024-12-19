import React, { useState } from 'react';
import { TableData } from '../../utils/table/types/table';
import TextInput from '../formelements/TextInput';
import CheckBox from '../formelements/CheckBox';
import SelectInput from '../formelements/SelectInput';

import styles from '../datenbank.module.css';

function Merkmal({ row }: { row: TableData | null }) {
  //   checkbox
  // radiobox
  // selectbox
  // textbox
  // checkbox_with_text
  // radiobox_with_text

  const [hinweis, setHinweis] = useState('');

  const optionsArr = [
    { id: 'checkbox', name: 'Checkbox' },
    { id: 'radiobox', name: 'Radiobox' },
    { id: 'selectbox', name: 'Selectbox' },
    { id: 'textbox', name: 'Freitext' },
    { id: 'selectbox_with_text', name: 'Selectbox mit Freitext' },
    { id: 'radiobox_with_text', name: 'Radiobox mit Freitext' }
  ];

  const onChangeTyp = (value: string) => {
    if (
      value === 'selectbox' ||
      value === 'radiobox' ||
      value === 'radiobox_with_text' ||
      value === 'selectbox_with_text'
    ) {
      setHinweis(
        'Fügen Sie nach dem Speichern die zugehörigen Optionen zum Merkmal hinzu.'
      );
    } else {
      setHinweis('');
    }
  };

  return (
    <fieldset>
      <p className={styles.hint}>{hinweis}</p>
      <TextInput row={row} label="Name" name="name" elKey="name" required />
      <TextInput
        row={row}
        label="Beschreibung"
        name="beschreibung"
        elKey="beschreibung"
        required={false}
      />
      <CheckBox
        row={row}
        name="can_edit"
        label="Editierbar durch Mitarbeiter"
        elKey="can_edit"
      />
      <SelectInput
        row={row}
        label="Typ"
        name="typ"
        required
        elKey="typ"
        options={optionsArr}
        optionLabelKey="name"
        optionValueKey="id"
        onChange={onChangeTyp}
      />
    </fieldset>
  );
}
export default Merkmal;
