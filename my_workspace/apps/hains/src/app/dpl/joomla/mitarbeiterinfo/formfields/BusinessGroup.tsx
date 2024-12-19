import React, { useState, useContext } from 'react';

import styles from '../app.module.css';
import Input from '../../components/mitarbeiterinfo/form/Input';
import Select from '../../components/mitarbeiterinfo/form/Select';
import Textarea from '../../components/mitarbeiterinfo/form/Textarea';
import UrlaubstageJahr from '../../components/mitarbeiterinfo/UrlaubstageJahr';
import CustomButton from '../../components/utils/custom-button/CustomButton';
import { DataContext } from '../../context/mitarbeiterinfo/DataProvider';
import MerkmalGroup from './MerkmalGroup';
import { sortVertragsstufen } from '../../helper/util';

type TProps = {
  accountInfo: any;
  funktionen: any;
  vertragsTyps: any;
};

function BusinessGroup({ accountInfo, funktionen, vertragsTyps }: TProps) {
  const funktionId = accountInfo?.mitarbeiter?.funktion_id;
  const aSeit = accountInfo?.mitarbeiter?.a_seit;
  const personalnummer = accountInfo?.mitarbeiter?.personalnummer;
  const dienstEmail = accountInfo?.dienstEmail;
  const dienstTelefon = accountInfo?.dienstTelefon;
  const anrechenbareZeit = accountInfo?.mitarbeiter?.anrechenbare_zeit;
  const zeitKommentar = accountInfo?.mitarbeiter?.zeit_kommentar || '';
  const month_start = accountInfo?.mitarbeiter?.vk_and_vgruppe_am?.month_start;
  const month_end = accountInfo?.mitarbeiter?.vk_and_vgruppe_am?.month_end;
  const vk = accountInfo?.mitarbeiter?.vk_and_vgruppe_am?.vk;

  const [beginn, setBeginn] = useState('');
  const [ende, setEnde] = useState('');
  const [tageWoche, setTageWoche] = useState('5');

  const { changeView } = useContext(DataContext);

  const getWeiterbildungsjahr = () => {
    const toDay = new Date();
    const year = toDay.getFullYear();
    const month = toDay.getMonth() + 1;

    const aSeitArr = aSeit?.split('-');
    const aSeitYear = Number(aSeitArr?.[0]);
    const aSeitMonth = Number(aSeitArr?.[1]);

    if (!aSeit) {
      return '';
    }

    const diffInMonths = month - aSeitMonth + 12 * (year - aSeitYear) + anrechenbareZeit;

    if (diffInMonths === '') return '';
    const aSeitMonthDisplay = diffInMonths % 12;
    const aSeitYearDisplay = Math.floor(diffInMonths / 12);
    return `${aSeitYearDisplay}.Jahr : ${aSeitMonthDisplay}.Monat`;
  };

  const onChangeBeginn = (label: string, val: string) => {
    setBeginn(val);
  };
  const onChangeEnde = (label: string, val: string) => {
    setEnde(val);
  };
  const onChangeTageWoche = (val: string) => {
    setTageWoche(val);
  };

  return (
    <div className={`${styles.group}`}>
      <h4>Geschäftlich</h4>
      <fieldset className={styles.columns}>
        <Select
          label="Funktion"
          preName="user"
          value={`${funktionId}`}
          required
          keyExtractor="id"
          optionText="planname"
          data={funktionen}
          name="funktion_id"
          title="Mitarbeiter-Funktion"
        />
        <Input
          value={personalnummer}
          preName="user"
          label="Personalnummer"
          name="personalnummer"
          title="Mitarbeiter Personalnummer"
          required
        />
        <Input
          value={aSeit}
          preName="user"
          label="Anästhesie seit"
          name="a_seit"
          title="Seit wann in der Anästhesie?"
          type="date"
        />
      </fieldset>
      <fieldset className={styles.columns}>
        <Input
          label="Dienst Email"
          preName="user"
          value={dienstEmail}
          name="dienstEmail"
          required
          type="email"
          title="Dienstliche Email"
        />
        <Input
          value={dienstTelefon}
          preName="user"
          label="Dienst Telefon"
          name="dienstTelefon"
          title="Dienstliche Telefonnummer"
          pattern="[0-9.]+"
        />
      </fieldset>
      <fieldset className={styles.columns}>
        <Input
          label="Anrechenbarezeit in Monaten"
          value={anrechenbareZeit}
          preName="user"
          type="number"
          min="0"
          name="anrechenbare_zeit"
          title="Auf die Ausbildung anrechenbare Zeit"
          placeholder="Anrechenbarezeit"
        />
        {accountInfo?.id && (
          <Input
            label="Weiterbildungsjahr"
            value={getWeiterbildungsjahr()}
            preName="user"
            disabled
            name="Weiterbildungsjahr"
            placeholder="Weiterbildungsjahr"
            title='Weiterbildungsjahr "X.Jahr : Y.Monat"'
          />
        )}
      </fieldset>
      <fieldset className={styles.columns}>
        <Textarea
          value={zeitKommentar}
          preName="user"
          label="Kommentar"
          name="zeit_kommentar"
          title="Kommentar zur anrechenbaren Zeit"
        />
      </fieldset>
      {!accountInfo?.id && (
        <>
          <h4>Vertrag</h4>
          <fieldset className={styles.columns}>
            <Input
              value={month_start}
              type="date"
              label="Beginn"
              aria-label="vertrag-von"
              max={ende}
              required
              name="vertrag[anfang]"
              title="Vertragsbeginn"
              callback={onChangeBeginn}
            />
            <Input
              value={month_end}
              type="date"
              label="Ende"
              aria-label="vertrag-bis"
              min={beginn}
              required
              title="Vertragsende"
              name="vertrag[ende]"
              callback={onChangeEnde}
            />
            <Input
              label="Unbefristet"
              type="checkbox"
              showHidden
              name="vertrag[unbefristet]"
              isChecked={false}
              value="true"
            />
            <Input
              type="number"
              label="VK"
              required
              value={vk}
              name="vertrag[vk]"
              title="Vollkraft-Äquivalent < 1 entspricht Teilzeit"
              step="0.01"
              max="1"
              min="0"
              initialVal="1"
            />
          </fieldset>
          <fieldset className={styles.columns}>
            <Select
              label="Typ Gruppe, Stufe"
              required
              name="vertrag[vertragsstufe_id]"
              data={vertragsTyps.map((typ: any) => {
                typ.vertragsstuves?.sort?.(sortVertragsstufen);
                return typ;
              })}
              keyExtractor="id"
              optionText="name"
              title="Vertragstyp, Vertragsgruppe, Vertragsstufe"
              optgroup={{
                keyExtractor: 'id',
                optionText: ['vertragsgruppe.name', 'stufe', 'von_bis'],
                accessKey: 'vertragsstuves',
                visiblePattern: 'ShowParentInChild'
              }}
            />
            <Select
              label="Tagewoche"
              aria-label="tagewoche"
              required
              name="vertrag[tage_woche]"
              title='Arbeitstage pro Woche "1-5"'
              data={[
                { id: 1, val: 1 },
                { id: 2, val: 2 },
                { id: 3, val: 3 },
                { id: 4, val: 4 },
                { id: 5, val: 5 }
              ]}
              value={5}
              keyExtractor="id"
              optionText="val"
              callback={onChangeTageWoche}
            />
          </fieldset>
          <fieldset>
            <h5 style={{ marginBottom: '10px', marginTop: '10px' }}>Urlaubstage pro Jahr:</h5>
            <fieldset className={styles.columns}>
              <UrlaubstageJahr beginn={beginn} ende={ende} tageWoche={tageWoche} />
            </fieldset>
          </fieldset>
        </>
      )}
      {accountInfo?.mitarbeiter_id ? (
        <fieldset>
          <CustomButton
            clickHandler={() => {
              if (!accountInfo.mitarbeiter_id) return;
              changeView({
                view: 'vertrag',
                id: Number(accountInfo.mitarbeiter_id)
              });
            }}
            className="primary"
          >
            Zu den Verträgen
          </CustomButton>
        </fieldset>
      ) : null}
      <div className={styles.merkamle}>
        <h4>Eigenschaften</h4>
        <MerkmalGroup accountInfo={accountInfo} />
      </div>
    </div>
  );
}
export default BusinessGroup;
