import React from 'react';
import { TableData } from '../../utils/table/types/table';
import TextInput from '../formelements/TextInput';
import NumberInput from '../formelements/NumberInput';
import TextArea from '../formelements/TextArea';
import SelectInput from '../formelements/SelectInput';
import ColorInput from '../formelements/ColorInput';

function Funktionen({
  row,
  formSelectOptions
}: {
  row: TableData | null;
  formSelectOptions: any;
}) {
  const teams = Array.isArray(formSelectOptions?.teams?.data)
    ? formSelectOptions.teams.data
    : [];
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
          elKey="prio"
          name="prio"
          defaultValue={0}
          min={0}
        />
        <ColorInput label="Farbe" row={row} elKey="color" name="color" />
        <SelectInput
          required
          label="Teams"
          row={row}
          elKey="team_id"
          name="team_id"
          optionLabelKey="name"
          optionValueKey="id"
          options={teams}
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

export default Funktionen;
