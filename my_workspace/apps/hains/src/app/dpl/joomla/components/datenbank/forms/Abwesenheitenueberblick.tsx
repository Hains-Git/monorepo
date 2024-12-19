import React from 'react';
import { TableData } from '../../utils/table/types/table';
import SelectInput from '../formelements/SelectInput';
import NumberInput from '../formelements/NumberInput';
import { cleanInactiveName } from '../../../helper/util';

function Abwesentheitenueberblick({
  row,
  formSelectOptions
}: {
  row: TableData | null;
  formSelectOptions: any;
}) {
  const mitarbeiter = Array.isArray(formSelectOptions?.mitarbeiter?.data)
    ? formSelectOptions.mitarbeiter.data
    : [];

  return (
    <>
      <fieldset>
        <SelectInput
          label="Mitarbeiter"
          row={row}
          required
          elKey="mitarbeiter_id"
          name="mitarbeiter_id"
          optionLabelKey="planname"
          optionValueKey="id"
          optionsTitleKey="name"
          options={mitarbeiter.map((m: any) => ({
            ...m,
            planname: cleanInactiveName(m.planname || '')
          }))}
        />
        <NumberInput
          label="Jahr"
          row={row}
          elKey="jahr"
          name="jahr"
          required
          min={1900}
          step={1}
          defaultValue={new Date().getFullYear()}
        />
      </fieldset>

      <fieldset>
        <NumberInput
          label="Zusatz Urlaubstage"
          row={row}
          elKey="uz"
          name="uz"
          required
          min={0}
          step={1}
          max={999}
          defaultValue={0}
        />
        <NumberInput
          label="Urlaubstage"
          row={row}
          elKey="u"
          name="u"
          required
          min={0}
          step={1}
          max={999}
          defaultValue={30}
        />
        <NumberInput
          label="Fortbildung Max."
          row={row}
          elKey="fo_max"
          name="fo_max"
          required
          min={0}
          max={999}
          step={1}
          defaultValue={3}
        />
      </fieldset>
    </>
  );
}

export default Abwesentheitenueberblick;
