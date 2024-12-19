import React from 'react';
import { TableData } from '../../utils/table/types/table';
import TextInput from '../formelements/TextInput';
import Vertragsgruppen from '../formelements/Vertragsgruppen';
import Vertragsvarianten from '../formelements/Vertragsvarianten';

function Vertragstypen({ row }: { row: TableData | null }) {
  return (
    <>
      <fieldset>
        <TextInput required label="Name" row={row} elKey="name" name="name" />
      </fieldset>
      <fieldset>
        <Vertragsvarianten row={row} />
      </fieldset>
      <fieldset>
        <Vertragsgruppen row={row} />
      </fieldset>
    </>
  );
}

export default Vertragstypen;
