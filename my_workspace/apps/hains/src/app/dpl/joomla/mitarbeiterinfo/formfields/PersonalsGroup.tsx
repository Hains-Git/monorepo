import React from 'react';

import styles from '../app.module.css';
import Input from '../../components/mitarbeiterinfo/form/Input';
import Select from '../../components/mitarbeiterinfo/form/Select';

import { AccountInfo } from '../../components/utils/table/types/accountinfo';

function PersonalsGroup({ accountInfo }: { accountInfo?: AccountInfo }) {
  const anredeVal = accountInfo?.anrede || '';
  const titelPraefix = accountInfo?.titelPraefix || '';
  const titelPostfix = accountInfo?.titelPostfix || '';
  const mittelname = accountInfo?.mittelname || '';
  const geburtsdatum = accountInfo?.geburtsdatum || '';
  const adresseStrasse = accountInfo?.adresseStrasse || '';
  const adressePlz = accountInfo?.adressePlz || '';
  const adresseOrt = accountInfo?.adresseOrt || '';
  const telephone = accountInfo?.telephone || '';
  const privateTelephone = accountInfo?.privateTelephone || '';
  const mobileTelefon = accountInfo?.mobileTelefon || '';

  const anrede = [
    { value: 'Hr.', text: 'Herr' },
    { value: 'Fr.', text: 'Frau' }
  ];

  return (
    <div className={`${styles.group}`}>
      <h4>Personalien</h4>
      <fieldset className={styles.columns}>
        <Select
          label="Anrede"
          data={anrede}
          keyExtractor="value"
          optionText="text"
          value={anredeVal}
          preName="user"
        />
        <Input
          preName="user"
          label="Titel"
          value={titelPraefix}
          name="titelPraefix"
        />
        <Input
          preName="user"
          label="Titel Nach"
          value={titelPostfix}
          name="titelPostfix"
        />
      </fieldset>
      <fieldset className={styles.columns}>
        <Input
          preName="user"
          type="text"
          value={mittelname}
          label="Mittelname"
        />
        <Input
          preName="user"
          type="date"
          value={geburtsdatum}
          label="Geburtsdatum"
          required
        />
      </fieldset>
      <fieldset className={styles.columns}>
        <Input
          preName="user"
          value={adresseStrasse}
          name="adresseStrasse"
          label="Straße"
        />
        <Input
          preName="user"
          value={adressePlz}
          name="adressePlz"
          label="PLZ"
        />
        <Input
          preName="user"
          value={adresseOrt}
          name="adresseOrt"
          label="Ort"
        />
      </fieldset>
      <fieldset className={styles.columns}>
        <Input
          label="Mobil Telefon"
          value={mobileTelefon}
          name="mobileTelefon"
          preName="user"
          title="Format: +49123 456 789 0123 456 789"
          pattern="^\+?(\d)+(( )\d+)*$"
        />
        <Input
          label="Sekundäres Telefon"
          value={privateTelephone}
          preName="user"
          name="privateTelephone"
          title="Format: +49123 456 789 0123 456 789"
          pattern="^\+?(\d)+(( )\d+)*$"
        />
      </fieldset>
    </div>
  );
}
export default PersonalsGroup;
