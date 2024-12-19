import React from 'react';
import Input from './Input';
import Select from './Select';

import {
  TAutoEinteilungForm,
  TDienst,
  TZeitraumkategorie
} from '../../../helper/api_data_types';
import { UseBeginEnde } from '../../../hooks/use-begin-ende';

function AutoEinteilenFields({
  editData,
  dienste,
  zeitraumkategorie
}: {
  editData: TAutoEinteilungForm;
  dienste: TDienst[];
  zeitraumkategorie: TZeitraumkategorie[];
}) {
  const { beginn, ende, onChangeBeginn, onChangeEnde } = UseBeginEnde();
  const autoEinteilen = UseBeginEnde();

  return (
    <>
      <fieldset>
        <Select
          data={dienste}
          label="Dienst"
          keyExtractor="id"
          optionText="planname"
          name="po_dienst_id"
          value={editData.po_dienst_id}
        />
        <Select
          data={zeitraumkategorie}
          label="Zeitraumkategorie"
          keyExtractor="id"
          optionText="name"
          name="zeitraumkategorie_id"
          value={editData.zeitraumkategorie_id}
        />
        <Input
          label="Von"
          required
          type="date"
          name="von"
          value={editData.von || ''}
          callback={onChangeBeginn}
          max={ende}
        />
        <Input
          label="Bis"
          required
          type="date"
          name="bis"
          value={editData.bis || ''}
          min={beginn}
          callback={onChangeEnde}
        />
      </fieldset>
      <fieldset>
        <legend>Auto Einteilen (Task)</legend>
        <Input
          label="Tage"
          name="days"
          type="number"
          min={0}
          step={1}
          value={editData.days.toString()}
        />
      </fieldset>
      <fieldset>
        <legend>Einteilen beim Speichern</legend>
        <Input
          label="Von"
          type="date"
          name="auto_einteilen_von"
          max={autoEinteilen.ende}
          callback={autoEinteilen.onChangeBeginn}
        />
        <Input
          label="Bis"
          type="date"
          name="auto_einteilen_bis"
          min={autoEinteilen.beginn}
          callback={autoEinteilen.onChangeEnde}
        />
      </fieldset>
    </>
  );
}
export default AutoEinteilenFields;
