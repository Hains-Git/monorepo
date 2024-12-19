import React from 'react';
import { TableData } from '../../utils/table/types/table';
import CheckBox from '../formelements/CheckBox';
import ColorInput from '../formelements/ColorInput';

function Einteilungsstatuse({ row }: { row: TableData | null }) {
  return (
    <fieldset>
      <ColorInput label="Farbe" row={row} elKey="color" name="color" />
      <CheckBox label="Wählbar" row={row} elKey="waehlbar" name="waehlbar" />
    </fieldset>
  );
}

export default Einteilungsstatuse;
