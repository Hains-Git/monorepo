import React from 'react';
import { TableData } from '../../utils/table/types/table';
import TextInput from '../formelements/TextInput';

function Kostenstellen({ row }: { row: TableData | null }) {
  return (
    <fieldset>
      <TextInput required label="Name" row={row} elKey="name" name="name" />
      <TextInput
        required
        label="Nummer"
        row={row}
        elKey="nummer"
        name="nummer"
      />
    </fieldset>
  );
}

export default Kostenstellen;
