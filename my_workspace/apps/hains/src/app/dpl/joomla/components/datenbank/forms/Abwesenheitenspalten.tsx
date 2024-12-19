import React from 'react';
import { TableData } from '../../utils/table/types/table';
import TextInput from '../formelements/TextInput';
import TextArea from '../formelements/TextArea';
import { getNestedAttr } from '../../../helper/util';

function Abwesenheitenspalten({ row }: { row: TableData | null }) {
  return (
    <fieldset>
      <label htmlFor="abwesenheiten-spalte-planname">
        Planname
        <p>{getNestedAttr(row, 'planname')}</p>
      </label>
      <TextInput required label="Name" row={row} elKey="name" name="name" />
      <TextArea
        required
        label="Beschreibung"
        row={row}
        elKey="beschreibung"
        name="beschreibung"
      />
    </fieldset>
  );
}

export default Abwesenheitenspalten;
