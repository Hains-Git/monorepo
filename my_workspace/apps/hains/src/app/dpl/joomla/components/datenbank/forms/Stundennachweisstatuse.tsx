import React from 'react';
import { TableData } from '../../utils/table/types/table';
import TextInput from '../formelements/TextInput';
import CheckBox from '../formelements/CheckBox';

function Stundennachweisstatuse({ row }: { row: TableData | null }) {
  return (
    <fieldset>
      <TextInput required label="Name" row={row} elKey="name" name="name" />
      <CheckBox
        label="Eingereicht"
        row={row}
        elKey="submitted"
        name="submitted"
      />
      <CheckBox
        label="Bestätigt"
        row={row}
        elKey="confirmed"
        name="confirmed"
      />
    </fieldset>
  );
}

export default Stundennachweisstatuse;
