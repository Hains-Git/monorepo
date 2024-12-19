import React from 'react';
import { TableData } from '../../utils/table/types/table';
import MultipleSelectInput from '../formelements/MultipleSelectInput';
import { getNestedAttr } from '../../../helper/util';

function Dienstplaner({
  row,
  formSelectOptions
}: {
  row: TableData | null;
  formSelectOptions: any;
}) {
  const teams = Array.isArray(formSelectOptions?.teams?.data)
    ? formSelectOptions.teams.data
    : [];
  const verteilerVorlagen = Array.isArray(
    formSelectOptions?.verteilerVorlagen?.data
  )
    ? formSelectOptions.verteilerVorlagen.data
    : [];
  return (
    <>
      <fieldset>
        <MultipleSelectInput
          required={false}
          label="Teams"
          row={row}
          elKey="dienstplaners_teams"
          elKeyBack="id"
          name="dienstplaners_teams"
          optionLabelKey="name"
          optionValueKey="id"
          options={teams}
          min={0}
        />
      </fieldset>

      <fieldset>
        <MultipleSelectInput
          required={false}
          label="Verteiler Vorlagen"
          row={row}
          elKey="dienstplaners_verteiler_vorlagens"
          elKeyBack="id"
          name="dienstplaners_verteiler_vorlagens"
          optionLabelKey="name"
          optionValueKey="id"
          groupBy="typ"
          options={verteilerVorlagen}
          min={0}
          renderLabel={(option) => {
            const name = getNestedAttr(option, 'name');
            const typ = getNestedAttr(option, 'typ');
            return name && typ ? `${name} (${typ})` : '';
          }}
        />
      </fieldset>
    </>
  );
}

export default Dienstplaner;
