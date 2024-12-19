import React from 'react';
import { TableData } from '../../utils/table/types/table';
import TextInput from '../formelements/TextInput';
import SelectInput from '../formelements/SelectInput';

function Arbeitsplaetze({
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
    <fieldset>
      <TextInput
        required={false}
        label="Name"
        row={row}
        elKey="name"
        name="name"
      />
      <SelectInput
        required
        label="Bereich"
        row={row}
        elKey="bereich.id"
        name="bereich_id"
        optionLabelKey="planname"
        optionsTitleKey="name"
        optionValueKey="id"
        options={bereiche}
      />
      <SelectInput
        required={false}
        label="Standort"
        row={row}
        elKey="standort.id"
        name="standort_id"
        optionLabelKey="name"
        optionValueKey="id"
        options={standorte}
      />
    </fieldset>
  );
}

export default Arbeitsplaetze;
