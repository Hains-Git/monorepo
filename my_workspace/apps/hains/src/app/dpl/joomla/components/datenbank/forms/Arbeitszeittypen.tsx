import React from 'react';
import { TableData } from '../../utils/table/types/table';
import TextInput from '../formelements/TextInput';
import TextArea from '../formelements/TextArea';
import CheckBox from '../formelements/CheckBox';
import NumberInput from '../formelements/NumberInput';

function Arbeitszeittypen({ row }: { row: TableData | null }) {
  return (
    <>
      <fieldset>
        <TextInput required label="Name" row={row} elKey="name" name="name" />
        <TextArea
          required={false}
          label="Beschreibung"
          row={row}
          elKey="beschreibung"
          name="beschreibung"
        />
      </fieldset>

      <fieldset>
        <CheckBox label="Zählen" row={row} elKey="count" name="count" />
        <NumberInput
          label="Min"
          row={row}
          required
          elKey="min"
          name="min"
          min={0}
          defaultValue={0}
        />
        <NumberInput
          label="Max"
          required
          row={row}
          elKey="max"
          name="max"
          min={0}
          defaultValue={0}
        />
      </fieldset>

      <fieldset>
        <CheckBox label="Sys" row={row} elKey="sys" name="sys" />
        <CheckBox
          label="Dienstzeit"
          row={row}
          elKey="dienstzeit"
          name="dienstzeit"
        />
        <CheckBox
          label="Arbeitszeit"
          row={row}
          elKey="arbeitszeit"
          name="arbeitszeit"
        />
        <CheckBox
          label="Bereitschaft"
          row={row}
          elKey="bereitschaft"
          name="bereitschaft"
        />
        <CheckBox
          label="Rufbereitschaft"
          row={row}
          elKey="rufbereitschaft"
          name="rufbereitschaft"
        />
      </fieldset>
    </>
  );
}

export default Arbeitszeittypen;
