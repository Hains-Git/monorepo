import React from 'react';
import { TableData } from '../../utils/table/types/table';
import TextInput from '../formelements/TextInput';
import ColorInput from '../formelements/ColorInput';

function TagesverteilerGruppen({ row }: { row: TableData | null }) {
  return (
    <fieldset>
      <TextInput required label="Name" row={row} elKey="name" name="name" />
      <TextInput
        required
        label="Planname"
        row={row}
        elKey="planname"
        name="planname"
      />
      <ColorInput label="Farbe" row={row} elKey="color" name="color" />
    </fieldset>
  );
}

export default TagesverteilerGruppen;
