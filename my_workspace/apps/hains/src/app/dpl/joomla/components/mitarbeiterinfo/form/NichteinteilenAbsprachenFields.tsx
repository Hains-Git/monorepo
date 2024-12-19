import React, { useEffect, useState } from 'react';
import { TNichtEinteilenAbspracheForm, TStandort, TThema, TZeitraumkategorie } from '../../../helper/api_data_types';
import Select from './Select';
import Input from './Input';
import NichtEinteilenStandorteThemen from '../../datenbank/formelements/NichtEinteilenStandorteThemen';
import styles from '../../../mitarbeiterinfo/app.module.css';
import { UseBeginEnde } from '../../../hooks/use-begin-ende';

function NichteinteilenAbsprachenFields({
  editData,
  zeitraumkategorie,
  themen,
  standorte
}: {
  editData: TNichtEinteilenAbspracheForm;
  zeitraumkategorie: TZeitraumkategorie[];
  themen: TThema[];
  standorte: TStandort[];
}) {
  const [formSelectOptions, setFormSelectOptions] = useState({
    standorte: { data: standorte },
    themen: { data: themen }
  });

  useEffect(() => {
    setFormSelectOptions({
      standorte: { data: standorte },
      themen: { data: themen }
    });
  }, [standorte, themen]);
  const { beginn, ende, onChangeBeginn, onChangeEnde } = UseBeginEnde();

  return (
    <fieldset>
      <NichtEinteilenStandorteThemen
        row={editData}
        formSelectOptions={formSelectOptions}
        className={styles.nicht_einteilen_standort_themens}
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
        max={ende}
        callback={onChangeBeginn}
        value={editData.von || ''}
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
    </fieldset>
  );
}

export default NichteinteilenAbsprachenFields;
