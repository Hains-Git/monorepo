import React from 'react';
import { TableData } from '../../utils/table/types/table';
import CheckBox from '../formelements/CheckBox';
import ColorInput from '../formelements/ColorInput';

function Einteilungskontexte({ row }: { row: TableData | null }) {
  return (
    <fieldset>
      <ColorInput label="Farbe" row={row} elKey="color" name="color" />
      <CheckBox
        label="TV"
        row={row}
        elKey="tagesverteiler"
        name="tagesverteiler"
      />
      <CheckBox
        label="Default"
        title="Wird als Default Einteilungskontext verwendet."
        row={row}
        elKey="default"
        name="default"
      />
    </fieldset>
  );
}

export default Einteilungskontexte;
