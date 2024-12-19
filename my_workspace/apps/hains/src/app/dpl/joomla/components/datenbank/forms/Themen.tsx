import React from 'react';
import { TableData } from '../../utils/table/types/table';
import TextInput from '../formelements/TextInput';
import TextArea from '../formelements/TextArea';
import ColorInput from '../formelements/ColorInput';

function Themen({ row }: { row: TableData | null }) {
  return (
    <fieldset>
      <TextInput required label="Name" row={row} elKey="name" name="name" />
      <ColorInput label="Farbe" row={row} elKey="color" name="color" />
      <p>Beschreibung</p>
      <TextArea
        required={false}
        label=""
        row={row}
        elKey="beschreibung"
        name="beschreibung"
      />
    </fieldset>
  );
}

export default Themen;
