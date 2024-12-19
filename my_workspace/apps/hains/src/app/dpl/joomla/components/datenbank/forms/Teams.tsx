import React from 'react';
import { TableData } from '../../utils/table/types/table';
import TextInput from '../formelements/TextInput';
import CheckBox from '../formelements/CheckBox';
import NumberInput from '../formelements/NumberInput';
import SelectInput from '../formelements/SelectInput';
import MultipleSelectInput from '../formelements/MultipleSelectInput';
import KWKrankPuffer from '../formelements/KWKrankPuffer';

function Teams({
  row,
  formSelectOptions
}: {
  row: TableData | null;
  formSelectOptions: any;
}) {
  const kostenstellen = Array.isArray(formSelectOptions?.kostenstellen?.data)
    ? formSelectOptions.kostenstellen.data
    : [];
  const funktionen = Array.isArray(formSelectOptions?.funktionen?.data)
    ? formSelectOptions.funktionen.data
    : [];

  return (
    <>
      <fieldset>
        <TextInput required label="Name" row={row} elKey="name" name="name" />
        <CheckBox label="Default" row={row} elKey="default" name="default" />
        <NumberInput
          required
          label="Krank Puffer"
          title="Puffer für Ausfall durch Krankheit im Urlaubssaldo"
          row={row}
          elKey="krank_puffer"
          name="krank_puffer"
          defaultValue={0}
          min={0}
        />
        <SelectInput
          required
          label="Kostenstelle"
          row={row}
          elKey="kostenstelle_id"
          name="kostenstelle_id"
          optionLabelKey="name"
          optionValueKey="id"
          options={kostenstellen}
        />
      </fieldset>

      <fieldset>
        <MultipleSelectInput
          label="Funktionen"
          row={row}
          elKey="funktionen_ids"
          name="funktionen_ids"
          optionLabelKey="planname"
          optionsTitleKey="name"
          optionValueKey="id"
          options={funktionen}
          required={false}
          min={0}
        />
      </fieldset>

      <KWKrankPuffer row={row} formSelectOptions={formSelectOptions} min={0} />
    </>
  );
}

export default Teams;
