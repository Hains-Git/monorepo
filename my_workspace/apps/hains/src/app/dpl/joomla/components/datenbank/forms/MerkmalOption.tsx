import React from 'react';
import { TableData } from '../../utils/table/types/table';
import TextInput from '../formelements/TextInput';
import SelectInput from '../formelements/SelectInput';

function MerkmalOption({
  row,
  formSelectOptions
}: {
  row: TableData | null;
  formSelectOptions: any;
}) {
  console.log('AA', formSelectOptions);

  const optionsArr = formSelectOptions?.merkmalopt?.data || [];

  return (
    <fieldset>
      <TextInput row={row} label="Wert" name="wert" elKey="wert" required />
      <SelectInput
        row={row}
        label="Merkmal"
        name="merkmal_id"
        required
        elKey="merkmal_id"
        options={optionsArr}
        optionLabelKey="name"
        optionValueKey="id"
      />
    </fieldset>
  );
}
export default MerkmalOption;
