import React from 'react';
import { TableData } from '../../utils/table/types/table';
import TextInput from '../formelements/TextInput';
import SelectInput from '../formelements/SelectInput';
import NumberInput from '../formelements/NumberInput';
import CheckBox from '../formelements/CheckBox';

const pathPattern = /^([\w \-]+(\/[\w \-]+)*)$/.toString().slice(1, -1);

function Dienstplanpaths({
  row,
  formSelectOptions
}: {
  row: TableData | null;
  formSelectOptions: any;
}) {
  const planintervals = Array.isArray(formSelectOptions?.planintervals?.data)
    ? formSelectOptions.planintervals.data
    : [];
  const plantabs = Array.isArray(formSelectOptions?.plantabs?.data)
    ? formSelectOptions.plantabs.data
    : [];
  const intervalPatterns =
    typeof formSelectOptions?.intervalpatterns?.data === 'object'
      ? formSelectOptions.intervalpatterns.data
      : {};

  const getIntervalle = () => {
    let title = '';
    Object.values(intervalPatterns).forEach((pattern: any) => {
      if (
        typeof pattern?.str === 'string' &&
        typeof pattern?.regex === 'string'
      ) {
        title += `\n${pattern.str} = ${pattern.regex}`;
      }
    });
    return title;
  };
  return (
    <>
      <fieldset>
        <TextInput required label="Name" name="name" row={row} elKey="name" />
        <TextInput
          required
          label="Pfad"
          name="path"
          row={row}
          elKey="path"
          pattern={pathPattern}
          title={`Format: ${pathPattern}, z.B. "Dienstplaner/Plaene Mai-2023`}
        />
        <SelectInput
          required={false}
          label="Gruppe"
          name="plan_tab_id"
          row={row}
          options={plantabs}
          optionValueKey="id"
          optionLabelKey="name"
          elKey="plan_tab_id"
        />
        <SelectInput
          required
          label="Intervall"
          name="planinterval_id"
          row={row}
          options={planintervals}
          optionValueKey="id"
          optionLabelKey="typ"
          elKey="planinterval_id"
        />
        <TextInput
          required={false}
          label="Planmuster"
          name="plan_pattern"
          row={row}
          elKey="plan_pattern"
          title={`Regulärer Ausdruck (RegExp) für die Zuordnung des Plans. Die Ausdrücke ({AUSDRUCK}): ${getIntervalle()} \nwerden zur Bestimmung des Intervalls aus dem Dateinamen verwendet und entsprechen den gelisteten RegExp.`}
        />
        <TextInput
          required={false}
          label="Kalender Titel"
          name="kalender_name"
          row={row}
          elKey="kalender_name"
        />
      </fieldset>
      <fieldset>
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
        <NumberInput
          required
          label="Anzahl"
          name="nr_intervall"
          row={row}
          elKey="nr_intervall"
          min={1}
          max={999}
          defaultValue={1}
        />
        <NumberInput
          required
          label="Anzahl Versionen"
          name="nr_versions"
          row={row}
          elKey="nr_versions"
          min={1}
          max={999}
          defaultValue={1}
        />
        <NumberInput
          required
          label="Offset"
          title="Offset zu dem aktuellen Datum in Einheiten des Intervalls"
          name="offset_to_now"
          row={row}
          elKey="offset_to_now"
          min={-999}
          max={999}
          defaultValue={0}
        />
        <CheckBox
          label="Beginnt Montags"
          name="begin_on_monday"
          row={row}
          elKey="begin_on_monday"
          title="Soll der erste Tag der Woche auf Montag gesetzt werden? (Nur für tageweise Pläne)"
        />
      </fieldset>
    </>
  );
}

export default Dienstplanpaths;
