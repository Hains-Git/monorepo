import React from 'react';
import { TableData } from '../../utils/table/types/table';
import TextInput from '../formelements/TextInput';
import TextArea from '../formelements/TextArea';
import ColorInput from '../formelements/ColorInput';
import NumberInput from '../formelements/NumberInput';
import CheckBox from '../formelements/CheckBox';
import MultipleSelectInput from '../formelements/MultipleSelectInput';

function Dienstkategorien({
  row,
  formSelectOptions
}: {
  row: TableData | null;
  formSelectOptions: any;
}) {
  const teams = Array.isArray(formSelectOptions?.teams?.data)
    ? formSelectOptions.teams.data
    : [];
  const themen = Array.isArray(formSelectOptions?.themen?.data)
    ? formSelectOptions.themen.data
    : [];

  return (
    <>
      <fieldset>
        <TextInput required label="Name" row={row} elKey="name" name="name" />
        <TextInput
          required
          label="Planname"
          row={row}
          elKey="poppix_name"
          name="poppix_name"
        />
        <ColorInput label="Farbe" row={row} elKey="color" name="color" />
        <NumberInput
          required
          label="Reihenfolge"
          row={row}
          elKey="order"
          name="order"
          defaultValue={0}
          min={0}
        />
        <CheckBox
          label="Auswählbar"
          row={row}
          elKey="selectable"
          name="selectable"
        />
        <CheckBox
          label="Kalendermarkierung"
          row={row}
          elKey="mark"
          name="mark"
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

      <fieldset>
        <MultipleSelectInput
          required={false}
          label="Teams"
          row={row}
          elKey="dienstkategorie_teams"
          elKeyBack="team_id"
          name="dienstkategorie_teams"
          optionLabelKey="name"
          optionValueKey="id"
          options={teams}
          min={0}
        />
      </fieldset>

      <fieldset>
        <MultipleSelectInput
          required={false}
          label="Themen"
          row={row}
          elKey="dienstkategoriethemas"
          elKeyBack="thema_id"
          name="dienstkategoriethemas"
          optionLabelKey="name"
          optionValueKey="id"
          options={themen}
          min={0}
        />
      </fieldset>
    </>
  );
}

export default Dienstkategorien;
