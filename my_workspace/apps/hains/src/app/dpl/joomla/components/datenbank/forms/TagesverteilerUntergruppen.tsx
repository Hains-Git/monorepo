import React from 'react';
import { TableData } from '../../utils/table/types/table';
import ColorInput from '../formelements/ColorInput';
import SelectInput from '../formelements/SelectInput';

function TagesverteilerUntergruppen({
  row,
  formSelectOptions
}: {
  row: TableData | null;
  formSelectOptions: any;
}) {
  const dienste = Array.isArray(formSelectOptions?.dienste?.data)
    ? formSelectOptions.dienste.data
    : [];
  const bereiche = Array.isArray(formSelectOptions?.bereiche?.data)
    ? formSelectOptions.bereiche.data
    : [];
  const tagesverteilerHeadlines = Array.isArray(
    formSelectOptions?.tagesverteilerHeadlines?.data
  )
    ? formSelectOptions.tagesverteilerHeadlines.data
    : [];
  const contentLayoutOptions = Array.isArray(
    formSelectOptions?.contentLayoutOptions?.data
  )
    ? formSelectOptions.contentLayoutOptions.data
    : [];
  return (
    <>
      <fieldset>
        <ColorInput label="Farbe" row={row} elKey="color" name="color" />
        <SelectInput
          required
          label="Tagesverteiler Gruppe"
          row={row}
          elKey="tagesverteiler.id"
          name="tagesverteiler_id"
          optionLabelKey="name"
          optionValueKey="id"
          options={tagesverteilerHeadlines}
        />
        <SelectInput
          required
          label="Content Layout"
          row={row}
          elKey="content_layout"
          name="content_layout"
          optionLabelKey=""
          optionValueKey=""
          options={contentLayoutOptions}
        />
      </fieldset>
      <fieldset>
        <SelectInput
          required={false}
          label="Bereich"
          row={row}
          elKey="bereich_id"
          name="bereich_id"
          optionLabelKey="planname"
          optionsTitleKey="name"
          optionValueKey="id"
          options={bereiche}
          groupBy="standort.name"
        />
        <SelectInput
          required={false}
          label="Dienst"
          row={row}
          elKey="po_dienst_id"
          name="po_dienst_id"
          optionLabelKey="planname"
          optionsTitleKey="name"
          optionValueKey="id"
          options={dienste}
        />
      </fieldset>
    </>
  );
}

export default TagesverteilerUntergruppen;
