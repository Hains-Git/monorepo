import React from 'react';
import { TableData } from '../../utils/table/types/table';
import TextArea from '../formelements/TextArea';
import TextInput from '../formelements/TextInput';
import NumberInput from '../formelements/NumberInput';
import CheckBox from '../formelements/CheckBox';
import ColorInput from '../formelements/ColorInput';
import TimeInput from '../formelements/TimeInput';
import MultipleSelectInput from '../formelements/MultipleSelectInput';
import SelectInput from '../formelements/SelectInput';

function Dienste({
  row,
  formSelectOptions
}: {
  row: TableData | null;
  formSelectOptions: any;
}) {
  const teams = Array.isArray(formSelectOptions?.teams?.data)
    ? formSelectOptions.teams.data
    : [];
  const kostenstellen = Array.isArray(formSelectOptions?.kostenstellen?.data)
    ? formSelectOptions.kostenstellen.data
    : [];
  const freigabetypen = Array.isArray(formSelectOptions?.freigabetypen?.data)
    ? formSelectOptions.freigabetypen.data
    : [];
  const themen = Array.isArray(formSelectOptions?.themen?.data)
    ? formSelectOptions.themen.data
    : [];
  return (
    <>
      <fieldset>
        <TextInput required label="Name" row={row} elKey="name" name="name" />
        <TextInput
          required
          label="Planname"
          row={row}
          elKey="planname"
          name="planname"
        />
        <TextInput
          required
          label="Aneasy Name"
          row={row}
          elKey="aneasy_name"
          name="aneasy_name"
        />
        <TextInput
          required={false}
          label="PEP Name"
          row={row}
          elKey="pep_name"
          name="pep_name"
        />
        <p>Beschreibung</p>
        <TextArea
          required={false}
          label=""
          row={row}
          elKey="beschreibung"
          name="beschreibung"
        />
        <ColorInput label="Farbe" row={row} elKey="color" name="color" />
        <ColorInput
          label="PEP Farbe"
          row={row}
          elKey="pep_color"
          name="pep_color"
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
          label="Teams"
          row={row}
          elKey="team_id"
          name="team_id"
          optionLabelKey="name"
          optionValueKey="id"
          options={teams}
        />
        <NumberInput
          required
          label="Aufwand"
          row={row}
          elKey="aufwand"
          name="aufwand"
          defaultValue={0}
          min={0}
        />
        <NumberInput
          required
          label="Reihenfolge"
          row={row}
          elKey="order"
          name="order"
          defaultValue={0}
          min={0}
        />
        <CheckBox label="Preset" row={row} elKey="preset" name="preset" />
        <CheckBox label="Sys" row={row} elKey="sys" name="sys" />
      </fieldset>

      <fieldset>
        <p>Dienstplanung</p>
        <CheckBox
          label="Priorisiere Wunsch"
          title="Damit wird ein Mitarbeiter mit diesem Dienst im Dienstplaner nicht als abwesend gekennzeichnet, wenn er einen zum einzuteilenden Dienst und Tag entsprechenden Wunsch hat"
          row={row}
          elKey="priorisiere_wunsch"
          name="priorisiere_wunsch"
        />
        <CheckBox
          label="Vorhergehende Tage ignorieren"
          row={row}
          title="Ignoriere im Dienstplaner-Tool die vorhergehenden Tage bei der Konflikt-Auswertung?"
          elKey="ignore_before"
          name="ignore_before"
        />
        <CheckBox
          label="Frei eintragbar"
          title="Können die Dienste im Dienstplaner ohne Bedarf eingetragen werden?"
          row={row}
          elKey="frei_eintragbar"
          name="frei_eintragbar"
        />
        <CheckBox
          label="Für alle Teams"
          title="Dienst kann ohne Team-Konflikt für alle Teams eingetragen werden?"
          row={row}
          elKey="dpl_all_teams"
          name="dpl_all_teams"
        />
        <CheckBox
          label="Schwacher Konflikt"
          title="Gilt im Dienstplan als schwacher Konflikt, wenn zwei Dienste mit dieser Eigenschaft eingeteilt werden?"
          row={row}
          elKey="weak_parallel_conflict"
          name="weak_parallel_conflict"
        />
        <br />
        <p>Stundennachweis</p>
        <CheckBox
          label="Urlaub"
          row={row}
          elKey="stundennachweis_urlaub"
          name="stundennachweis_urlaub"
        />
        <CheckBox
          label="Krank"
          row={row}
          elKey="stundennachweis_krank"
          name="stundennachweis_krank"
        />
        <CheckBox
          label="Sonstiges"
          row={row}
          elKey="stundennachweis_sonstig"
          name="stundennachweis_sonstig"
        />
        <NumberInput
          required
          label="Stundennachweis"
          labelBack="Std."
          title="Vorlage für die Anzahl Stunden im Stundennachweis"
          row={row}
          elKey="stundennachweis_default_std"
          name="stundennachweis_default_std"
          defaultValue={0}
          min={0}
          step={0.1}
        />
        <CheckBox
          title="Soll das Tagessaldo im Stundennachweis berechnet werden?"
          label="Tagessaldo"
          row={row}
          elKey="use_tagessaldo"
          name="use_tagessaldo"
        />
        <TimeInput
          label="Von"
          row={row}
          elKey="stundennachweis_default_von"
          name="stundennachweis_default_von"
          required
        />
        <TimeInput
          label="Bis"
          row={row}
          elKey="stundennachweis_default_bis"
          name="stundennachweis_default_bis"
          required
        />
      </fieldset>

      <fieldset>
        <MultipleSelectInput
          label="Freigabetypen"
          row={row}
          elKey="freigabetypen_ids"
          name="freigabetypen_ids"
          optionLabelKey="name"
          optionValueKey="id"
          options={freigabetypen}
          required={false}
          min={0}
        />
      </fieldset>

      <fieldset>
        <MultipleSelectInput
          label="Themen"
          row={row}
          elKey="thema_ids"
          name="thema_ids"
          optionLabelKey="name"
          optionValueKey="id"
          options={themen}
          required={false}
          min={0}
        />
      </fieldset>
    </>
  );
}

export default Dienste;
