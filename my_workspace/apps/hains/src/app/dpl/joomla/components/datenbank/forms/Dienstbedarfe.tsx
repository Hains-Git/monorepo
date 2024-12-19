import React from 'react';
import { TableData } from '../../utils/table/types/table';
import NumberInput from '../formelements/NumberInput';
import DateInput from '../formelements/DateInput';
import CheckBox from '../formelements/CheckBox';
import SelectInput from '../formelements/SelectInput';

function Dienstbedarfe({
  row,
  formSelectOptions
}: {
  row: TableData | null;
  formSelectOptions: any;
}) {
  const bereiche = Array.isArray(formSelectOptions?.bereiche?.data)
    ? formSelectOptions.bereiche.data
    : [];
  const dienste = Array.isArray(formSelectOptions?.dienste?.data)
    ? formSelectOptions.dienste.data
    : [];
  const kostenstellen = Array.isArray(formSelectOptions?.kostenstellen?.data)
    ? formSelectOptions.kostenstellen.data
    : [];
  const dienstverteilungstypen = Array.isArray(
    formSelectOptions?.dienstverteilungstypen?.data
  )
    ? formSelectOptions.dienstverteilungstypen.data
    : [];
  const zeitraumkategorien = Array.isArray(
    formSelectOptions?.zeitraumkategorien?.data
  )
    ? formSelectOptions.zeitraumkategorien.data
    : [];
  const arbeitszeitverteilung = Array.isArray(
    formSelectOptions?.arbeitszeitverteilung?.data
  )
    ? formSelectOptions.arbeitszeitverteilung.data
    : [];

  return (
    <>
      <fieldset>
        <NumberInput
          required
          label="Mindestbedarf"
          row={row}
          elKey="min"
          name="min"
          defaultValue={0}
          min={0}
        />
        <NumberInput
          required
          label="Optionaler Zusatzbedarf"
          row={row}
          elKey="opt"
          name="opt"
          defaultValue={0}
          min={0}
        />
        <DateInput
          required={false}
          label="Ungültig ab"
          row={row}
          elKey="end_date"
          name="end_date"
        />
        <CheckBox
          label="In Urlaubssaldo ignorieren"
          row={row}
          elKey="ignore_in_urlaubssaldo"
          name="ignore_in_urlaubssaldo"
        />
      </fieldset>

      <fieldset>
        <SelectInput
          required
          label="Dienst"
          row={row}
          elKey="po_dienst_id"
          name="po_dienst_id"
          optionLabelKey="planname"
          optionsTitleKey="name"
          optionValueKey="id"
          options={dienste}
        />
        <SelectInput
          required
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
          required
          label="Kostenstelle"
          row={row}
          elKey="kostenstelle_id"
          name="kostenstelle_id"
          optionLabelKey="name"
          optionValueKey="id"
          options={kostenstellen}
        />
        <SelectInput
          required
          label="Arbeitszeitverteilung"
          row={row}
          elKey="arbeitszeitverteilung_id"
          name="arbeitszeitverteilung_id"
          optionLabelKey="name"
          optionValueKey="id"
          options={arbeitszeitverteilung}
        />
        <SelectInput
          required
          label="Zeitraumkategorie"
          row={row}
          elKey="zeitraumkategories_id"
          name="zeitraumkategories_id"
          optionLabelKey="name"
          optionValueKey="id"
          options={zeitraumkategorien}
        />
      </fieldset>

      <fieldset>
        <SelectInput
          required
          label="Dienstverteilungstyp"
          row={row}
          elKey="dienstverteilungstyp_id"
          name="dienstverteilungstyp_id"
          optionLabelKey="name"
          optionValueKey="id"
          optionsTitleKey="beschreibung"
          options={dienstverteilungstypen}
        />
        <NumberInput
          required
          label="Verteilungscode"
          row={row}
          elKey="verteilungscode"
          name="verteilungscode"
          defaultValue={0}
          min={0}
        />
      </fieldset>
    </>
  );
}

export default Dienstbedarfe;
