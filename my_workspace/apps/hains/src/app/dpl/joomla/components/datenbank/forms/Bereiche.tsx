import React from 'react';
import { TableData } from '../../utils/table/types/table';
import SelectInput from '../formelements/SelectInput';
import TextInput from '../formelements/TextInput';
import TextArea from '../formelements/TextArea';
import CheckBox from '../formelements/CheckBox';

function Bereiche({
  row,
  formSelectOptions
}: {
  row: TableData | null;
  formSelectOptions: any;
}) {
  const bereiche = Array.isArray(formSelectOptions?.bereiche?.data)
    ? formSelectOptions.bereiche.data
    : [];

  const standorte = Array.isArray(formSelectOptions?.standorte?.data)
    ? formSelectOptions.standorte.data
    : [];

  return (
    <>
      <fieldset>
        <TextInput required label="Name" row={row} elKey="name" name="name" />
        <TextInput
          required
          label="URL-Name"
          row={row}
          elKey="name_url"
          name="name_url"
        />
        <TextInput
          required
          label="Planname"
          row={row}
          elKey="planname"
          name="planname"
        />
      </fieldset>

      <fieldset>
        <p>Info</p>
        <TextArea
          required={false}
          label=""
          row={row}
          elKey="info"
          name="info"
        />
      </fieldset>

      <fieldset>
        <SelectInput
          required={false}
          label="Überg. Bereich"
          title="Übergeordneter Bereich"
          row={row}
          elKey="bereich_id"
          name="bereich_id"
          optionLabelKey="planname"
          optionsTitleKey="name"
          optionValueKey="id"
          groupBy="standort.name"
          options={bereiche}
        />
        <SelectInput
          required
          label="Standort"
          row={row}
          elKey="standort_id"
          name="standort_id"
          optionLabelKey="name"
          optionValueKey="id"
          options={standorte}
        />
        <CheckBox
          label="Verteiler Dienstfrei"
          title="Dienstfrei im Verteiler zeigt die Mitarbeiter, die aufgrund von Ausgleichszeiten freigestellt sind."
          row={row}
          elKey="verteiler_frei"
          name="verteiler_frei"
        />
      </fieldset>
    </>
  );
}

export default Bereiche;
