import React from 'react';
import { TableData } from '../../utils/table/types/table';
import ColorInput from '../formelements/ColorInput';
import TextInput from '../formelements/TextInput';
import NumberInput from '../formelements/NumberInput';
import DateInput from '../formelements/DateInput';

function Kalendermarkierungen({ row }: { row: TableData | null }) {
  return (
    <fieldset>
      <TextInput required label="Name" row={row} elKey="name" name="name" />
      <TextInput
        required
        label="Kategorie"
        row={row}
        elKey="category"
        name="category"
      />
      <NumberInput
        required
        label="Jahr"
        row={row}
        elKey="year"
        name="year"
        defaultValue={new Date().getFullYear()}
        min={2000}
      />
      <NumberInput
        required
        label="Priorität"
        row={row}
        elKey="prio"
        name="prio"
        defaultValue={1}
        min={1}
      />
      <ColorInput label="Farbe" row={row} elKey="color" name="color" />
      <DateInput label="Von" row={row} elKey="start" name="start" required />
      <DateInput label="Bis" row={row} elKey="ende" name="ende" required />
    </fieldset>
  );
}

export default Kalendermarkierungen;
