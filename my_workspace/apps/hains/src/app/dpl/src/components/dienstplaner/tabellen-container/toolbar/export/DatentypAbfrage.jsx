import React, { useState } from 'react';
import { UseAbfrageBox } from '../../../../../hooks/use-abfrage-box';
import CustomButton from '../../../../utils/custom_buttons/CustomButton';
import AbfrageCheckbox from './AbfrageCheckbox';
import { debounce, noWait } from '../../../../../tools/debounce';
import styles from '../toolbar.module.css';

function DatentypAbfrage({
  exportFkt,
  hideAbfrage,
  showAbfrageTypen: {
    checkBedarfeAbfrage,
    onlyMainZeitraumAbfrage,
    withCounterAbfrage,
    withWunschAbfrage,
    withColorAbfrage
  } = {}
}) {
  const [withCounter, setWithCounter] = useState(false);
  const [withWunsch, setWithWunsch] = useState(false);
  const [withColor, setWithColor] = useState(false);
  const [checkBedarfe, setCheckBedarfe] = useState(true);
  const [onlyMainZeitraum, setOnlyMainZeitraum] = useState(false);
  const [style, myRef] = UseAbfrageBox();

  const pdfExport = debounce((callback) => {
    exportFkt(
      true,
      onlyMainZeitraum,
      checkBedarfe,
      withCounter,
      withWunsch,
      withColor
    );
    callback?.(() => false);
  }, noWait);

  const csvExport = debounce((callback) => {
    exportFkt(
      false,
      onlyMainZeitraum,
      checkBedarfe,
      withCounter,
      withWunsch,
      false
    );
    callback?.(() => false);
  }, noWait);

  return (
    <div
      className={styles.export}
      onClick={(evt) => evt.stopPropagation()}
      style={style}
      ref={myRef}
    >
      <p className={styles.export_title}>Einstellungen Export</p>
      <div className={styles.export_checkbox_container}>
        {checkBedarfeAbfrage && (
          <AbfrageCheckbox
            check={checkBedarfe}
            name="checkbedarfe"
            setCheck={setCheckBedarfe}
            label="Bedarfe überprüfen"
          />
        )}
        {onlyMainZeitraumAbfrage && (
          <AbfrageCheckbox
            check={onlyMainZeitraum}
            name="onlyMainZeitraum"
            setCheck={setOnlyMainZeitraum}
            label="Nur Hauptmonat exportieren"
          />
        )}
        {withCounterAbfrage && (
          <AbfrageCheckbox
            check={withCounter}
            name="counter"
            setCheck={setWithCounter}
            label="Zähler exportieren"
          />
        )}
        {withWunschAbfrage && (
          <AbfrageCheckbox
            check={withWunsch}
            name="wunsch"
            setCheck={setWithWunsch}
            label="Wünsche exportieren"
          />
        )}
        {withColorAbfrage && (
          <AbfrageCheckbox
            check={withColor}
            name="color"
            setCheck={setWithColor}
            label="Farben von Einteilungen und Wünschen bei PDF exportieren"
          />
        )}
      </div>

      <CustomButton
        spinner={{ show: true }}
        clickHandler={(evt, setLoading) => {
          pdfExport(setLoading);
        }}
      >
        PDF
      </CustomButton>
      <CustomButton
        spinner={{ show: true }}
        clickHandler={(evt, setLoading) => {
          csvExport(setLoading);
        }}
      >
        CSV
      </CustomButton>
      <CustomButton spinner={{ show: true }} clickHandler={hideAbfrage}>
        Abbrechen
      </CustomButton>
    </div>
  );
}

export default DatentypAbfrage;
