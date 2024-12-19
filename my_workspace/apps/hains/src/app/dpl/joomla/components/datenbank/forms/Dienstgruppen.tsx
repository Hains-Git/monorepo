import React from 'react';
import { TableData } from '../../utils/table/types/table';
import TextInput from '../formelements/TextInput';
import MultipleSelectInput from '../formelements/MultipleSelectInput';
import CheckBox from '../formelements/CheckBox';
import NumberInput from '../formelements/NumberInput';
import ColorInput from '../formelements/ColorInput';

function Dienstgruppen({
  row,
  formSelectOptions
}: {
  row: TableData | null;
  formSelectOptions: any;
}) {
  const dienste = Array.isArray(formSelectOptions?.dienste?.data)
    ? formSelectOptions.dienste.data
    : [];

  return (
    <>
      <fieldset>
        <TextInput required label="Name" row={row} elKey="name" name="name" />
        <TextInput
          required={false}
          label="Label (Veröffentlichen)"
          title="Gruppe in PDF-Ansicht verstecken durch leeres Label"
          row={row}
          elKey="publish_label"
          name="publish_label"
        />
        <CheckBox
          label="Aktivieren (Veröffentlichen)"
          title="Gruppieren der Dienste unter der Dienstgruppe in der PDF-Ansicht"
          row={row}
          elKey="use_in_publish"
          name="use_in_publish"
        />
        <NumberInput
          required
          label="Priorität (Veröffentlichen)"
          title="Priorität in Veröffentlichen (0 = höchste Priorität)"
          row={row}
          elKey="publish_prio"
          name="publish_prio"
          defaultValue={0}
          min={0}
        />
        <ColorInput
          label="Farbe BG (Veröffentlichen)"
          row={row}
          elKey="publish_color_bg"
          name="publish_color_bg"
        />
        <ColorInput
          label="Farbe HL (Veröffentlichen)"
          row={row}
          elKey="publish_color_hl"
          name="publish_color_hl"
        />
      </fieldset>
      <fieldset>
        <MultipleSelectInput
          required
          label="Dienste"
          row={row}
          elKey="dienste"
          name="dienste"
          optionLabelKey="planname"
          optionsTitleKey="name"
          optionValueKey="id"
          options={dienste}
          min={1}
        />
      </fieldset>
    </>
  );
}

export default Dienstgruppen;
