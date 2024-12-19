import React from 'react';
import { TableData } from '../../utils/table/types/table';
import TextInput from '../formelements/TextInput';
import NumberInput from '../formelements/NumberInput';
import SelectInput from '../formelements/SelectInput';
import Arbeitszeitverteilung from '../formelements/Arbeitszeitverteilung';

function Arbeitszeitverteilungen({
  row,
  formSelectOptions
}: {
  row: TableData | null;
  formSelectOptions: any;
}) {
  const max = 25;
  const [dauer, setDauer] = React.useState(1);
  const dienstgruppen = Array.isArray(formSelectOptions?.dienstgruppen?.data)
    ? formSelectOptions.dienstgruppen.data
    : [];

  return (
    <>
      <fieldset>
        <TextInput required label="Name" row={row} elKey="name" name="name" />
        <label
          aria-label="Dauer in Tagen"
          title={`Dauer in Tagen\nMin: 1\nMax: ${max}`}
        >
          Dauer in Tagen
          <div>
            <input
              required
              type="number"
              value={dauer}
              readOnly
              name="dauer"
              min={1}
              max={max}
              step={1}
            />
          </div>
        </label>
        <SelectInput
          required={false}
          label="Dienstgruppe"
          title="Blockiert im Anschluss an die aktuelle Verteilung einen bestimmten Zeitraum, sodass nur Dienste aus der Dienstgruppe erlaubt sind."
          row={row}
          elKey="dienstgruppe_id"
          name="dienstgruppe_id"
          optionLabelKey="name"
          optionValueKey="id"
          options={dienstgruppen}
        />
        <NumberInput
          required
          label="Dienstgruppe Zeit"
          labelBack="Std."
          row={row}
          elKey="std"
          name="std"
          defaultValue={0}
          min={0}
          max={100}
          step={0.1}
        />
      </fieldset>

      <fieldset>
        <SelectInput
          required={false}
          label="Dienstgruppe vorher"
          title="Fordert vorher einen Dienst aus dieser Dienstgruppe. Hierbei kann eine gewisse Überschneidung erlaubt werden."
          row={row}
          elKey="pre_dienstgruppe_id"
          name="pre_dienstgruppe_id"
          optionLabelKey="name"
          optionValueKey="id"
          options={dienstgruppen}
        />
        <NumberInput
          required
          label="Dienstgruppe vorher Zeit"
          labelBack="Std."
          row={row}
          elKey="pre_std"
          name="pre_std"
          defaultValue={0}
          min={0}
          max={100}
          step={0.1}
        />
        <NumberInput
          required
          label="Überschneidung vorher"
          labelBack="Minuten"
          row={row}
          elKey="pre_ueberschneidung_minuten"
          name="pre_ueberschneidung_minuten"
          defaultValue={30}
          min={0}
          max={480}
        />
      </fieldset>

      <Arbeitszeitverteilung
        row={row}
        formSelectOptions={formSelectOptions}
        setDauer={setDauer}
        max={max}
      />
    </>
  );
}

export default Arbeitszeitverteilungen;
