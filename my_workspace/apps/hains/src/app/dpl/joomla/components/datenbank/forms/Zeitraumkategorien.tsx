import React from 'react';
import { TableData } from '../../utils/table/types/table';
import TextInput from '../formelements/TextInput';
import CheckBox from '../formelements/CheckBox';
import NumberInput from '../formelements/NumberInput';
import TextArea from '../formelements/TextArea';
import DateInput from '../formelements/DateInput';
import Zeitraumregel from '../formelements/Zeitraumregel';

function Zeitraumkategorien({ row }: { row: TableData | null }) {
  return (
    <>
      <fieldset>
        <TextInput required label="Name" row={row} elKey="name" name="name" />
        <CheckBox label="Sys" row={row} elKey="sys" name="sys" />
        <NumberInput
          required
          title="Priorität des Bedarfs, Bedarfe höherer Priorität überschreiben Bedarfe niedrigerer Priorität"
          label="Priorität"
          row={row}
          elKey="prio"
          name="prio"
          defaultValue={0}
          min={0}
        />
        <p>Beschreibung</p>
        <TextArea
          required
          label=""
          row={row}
          elKey="beschreibung"
          name="beschreibung"
        />
        <DateInput
          label="Anfang"
          row={row}
          elKey="anfang"
          name="anfang"
          required={false}
        />
        <DateInput
          label="Ende"
          row={row}
          elKey="ende"
          name="ende"
          required={false}
        />
      </fieldset>

      <Zeitraumregel row={row} />
    </>
  );
}

export default Zeitraumkategorien;
