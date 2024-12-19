import React from 'react';
import { TableData } from '../../utils/table/types/table';
import SelectInput from '../formelements/SelectInput';
import NumberInput from '../formelements/NumberInput';
import ColorInput from '../formelements/ColorInput';

function WochenverteilerUntergruppen({
  row,
  formSelectOptions
}: {
  row: TableData | null;
  formSelectOptions: any;
}) {
  const contentLayoutOptions = Array.isArray(
    formSelectOptions?.contentLayoutOptions?.data
  )
    ? formSelectOptions.contentLayoutOptions.data
    : [];
  const bereiche = Array.isArray(formSelectOptions?.bereiche?.data)
    ? formSelectOptions.bereiche.data
    : [];
  const dienste = Array.isArray(formSelectOptions?.dienste?.data)
    ? formSelectOptions.dienste.data
    : [];

  return (
    <>
      <fieldset>
        <ColorInput
          label="Farbe Gruppe"
          row={row}
          elKey="color_hl"
          name="color_hl"
        />
        <ColorInput
          label="Farbe Untergruppe"
          row={row}
          elKey="color_bg"
          name="color_bg"
        />
        <NumberInput
          required
          label="Position"
          row={row}
          elKey="order"
          name="order"
          defaultValue={0}
          min={0}
        />
      </fieldset>
      <fieldset>
        <SelectInput
          required
          label="Content Layout"
          row={row}
          elKey="content_layout"
          name="content_layout"
          optionLabelKey="name"
          optionValueKey="id"
          options={contentLayoutOptions}
        />
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

export default WochenverteilerUntergruppen;
