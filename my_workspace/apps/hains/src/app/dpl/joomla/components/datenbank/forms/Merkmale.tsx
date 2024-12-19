import React from 'react';
import { TableData } from '../../utils/table/types/table';
import TextInput from '../formelements/TextInput';
import TextArea from '../formelements/TextArea';

function Merkmale({ row }: { row: TableData | null }) {
  return (
    <fieldset>
      <TextInput required label="Name" row={row} elKey="name" name="name" />
      <TextArea
        required
        label="Beschreibung"
        row={row}
        elKey="beschreibung"
        name="beschreibung"
      />
    </fieldset>
  );
}

export default Merkmale;
