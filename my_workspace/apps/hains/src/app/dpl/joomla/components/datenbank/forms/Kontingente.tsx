import React from 'react';
import { TableData } from '../../utils/table/types/table';
import CheckBox from '../formelements/CheckBox';
import SelectInput from '../formelements/SelectInput';
import MultipleSelectInput from '../formelements/MultipleSelectInput';
import KontingentDienste from '../formelements/KontingentDienste';
import NumberInput from '../formelements/NumberInput';

function Kontingente({
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
        <CheckBox label="Default" row={row} elKey="default" name="default" />
        <CheckBox
          label="Sonderrotation"
          row={row}
          elKey="sonderrotation"
          name="sonderrotation"
        />
        <CheckBox
          label="Alle Rotationen anzeigen"
          title="Der Monatsplan und die Verteiler laden alle Rotationen, wenn Mitarbeiter dieses Kontingent hat."
          row={row}
          elKey="show_all_rotations"
          name="show_all_rotations"
        />
        <NumberInput
          required
          label="Position"
          row={row}
          defaultValue={0}
          elKey="position"
          name="position"
        />
        <SelectInput
          required
          label="Team"
          row={row}
          elKey="team_id"
          name="team_id"
          optionLabelKey="name"
          optionValueKey="id"
          options={teams}
        />
      </fieldset>

      <fieldset>
        <MultipleSelectInput
          label="Themen"
          row={row}
          elKey="thema_ids"
          name="thema_ids"
          optionLabelKey="name"
          optionValueKey="id"
          options={themen}
          required={false}
          min={0}
        />
      </fieldset>

      <KontingentDienste row={row} formSelectOptions={formSelectOptions} />
    </>
  );
}

export default Kontingente;
