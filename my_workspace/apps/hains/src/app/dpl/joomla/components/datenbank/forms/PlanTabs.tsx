import React from 'react';
import { TableData } from '../../utils/table/types/table';
import TextInput from '../formelements/TextInput';
import NumberInput from '../formelements/NumberInput';

function PlanTabs({ row }: { row: TableData | null }) {
  return (
    <fieldset>
      <TextInput required label="Name" name="name" row={row} elKey="name" />
      <NumberInput
        required
        label="Position"
        name="position"
        row={row}
        elKey="position"
        min={0}
        max={999}
        title="Niedrigste Position wird zuerst angezeigt."
        defaultValue={0}
      />
    </fieldset>
  );
}

export default PlanTabs;
