import React from 'react';
import { TableData } from '../../utils/table/types/table';
import TextArea from '../formelements/TextArea';
import TextInput from '../formelements/TextInput';
import NumberInput from '../formelements/NumberInput';

function Freigabetypen({ row }: { row: TableData | null }) {
  return (
    <>
      <fieldset>
        <TextInput required label="Name" row={row} elKey="name" name="name" />
        <TextInput
          required
          label="Planname"
          row={row}
          elKey="planname"
          name="planname"
        />
        <NumberInput
          required
          label="Reihenfolge"
          row={row}
          elKey="sort"
          name="sort"
          defaultValue={0}
          min={0}
        />
      </fieldset>
      <fieldset>
        <p>Beschreibung</p>
        <TextArea
          required={false}
          label=""
          row={row}
          elKey="beschreibung"
          name="beschreibung"
        />
      </fieldset>
    </>
  );
}

export default Freigabetypen;
