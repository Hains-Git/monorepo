import React, { useState } from 'react';
import Select from './Select';
import Input from './Input';
import {
  TArbeitszeitAbspracheForm,
  TZeitraumkategorie
} from '../../../helper/api_data_types';
import TimeInput from '../../datenbank/formelements/TimeInput';
import TextArea from '../../datenbank/formelements/TextArea';
import { UseBeginEnde } from '../../../hooks/use-begin-ende';

function AbreitszeitAbsprachenFields({
  editData,
  zeitraumkategorie
}: {
  editData: TArbeitszeitAbspracheForm;
  zeitraumkategorie: TZeitraumkategorie[];
}) {
  const { beginn, ende, onChangeBeginn, onChangeEnde } = UseBeginEnde();

  return (
    <fieldset>
      <fieldset>
        <TimeInput
          required
          label="Arbeitszeit (von)"
          elKey="arbeitszeit_von_time"
          name="arbeitszeit_von"
          row={editData}
        />
      </fieldset>
      <fieldset>
        <TimeInput
          required
          label="Arbeitszeit (bis)"
          elKey="arbeitszeit_bis_time"
          name="arbeitszeit_bis"
          row={editData}
        />
      </fieldset>

      <Input
        label="Pause"
        name="pause"
        type="number"
        min={0}
        max={720}
        step={1}
        required
        value={editData.pause.toString()}
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
        max={ende}
        callback={onChangeBeginn}
      />
      <Input
        label="Bis"
        required
        type="date"
        name="bis"
        min={beginn}
        callback={onChangeEnde}
        value={editData.bis || ''}
      />
      <fieldset>
        <TextArea
          required={false}
          label="Bemerkung"
          row={editData}
          elKey="bemerkung"
          name="bemerkung"
        />
      </fieldset>
    </fieldset>
  );
}

export default AbreitszeitAbsprachenFields;
