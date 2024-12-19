import React from 'react';
import { UseRegisterKey } from '../../../../../../hooks/use-register';
import CustomButton from '../../../../../utils/custom_buttons/CustomButton';
import { deleteBtnClass } from '../../../../../../styles/basic';

function ColorChooser({ counter, pos }) {
  if (
    !counter?.splitFarbe ||
    !counter.changeFarbRegel ||
    !counter?.FARBE_BEDINGUNGEN?.map ||
    !counter?.removeFarbe
  )
    return null;
  UseRegisterKey(`farbregel_${pos}`, counter?.push, counter?.pull, counter);
  const [typ, bedingung, zahl, farbe] = counter.splitFarbe(pos);
  const max = 1000000;

  const bedingungTitle = (bed) => {
    switch (bed) {
      case '=':
        return 'Gleich';
      case '>':
        return 'Größer';
      case '<':
        return 'Kleiner';
      case '>=':
        return 'Größer oder gleich';
      case '<=':
        return 'Kleiner oder gleich';
      case '!=':
        return 'Ungleich';
    }
  };

  return (
    <div className="table-custom-feld-auswahl-coloring-color-chooser">
      <p>{pos.toString()}: </p>
      <select
        name="farbregel-typen"
        value={typ}
        onChange={(evt) => {
          evt.stopPropagation();
          const value = evt.target.value;
          counter.changeFarbRegel(value, pos, bedingung, zahl, farbe);
        }}
      >
        {counter.getFarbTypen().map(({ value, label }, i) => (
          <option value={value} key={`${value}_${i}`}>
            {label}
          </option>
        ))}
      </select>
      <select
        name="farbregel-bedingungen"
        value={bedingung}
        onChange={(evt) => {
          evt.stopPropagation();
          const value = evt.target.value;
          counter.changeFarbRegel(typ, pos, value, zahl, farbe);
        }}
      >
        {counter.FARBE_BEDINGUNGEN.map((value, i) => (
          <option
            value={value}
            title={bedingungTitle(value)}
            key={`dienstplaner-farb-bedingung_${value}_${i}`}
          >
            {value}
          </option>
        ))}
      </select>
      <input
        type="number"
        value={zahl}
        max={max}
        min={-max}
        step={0.1}
        onChange={(evt) => {
          evt.stopPropagation();
          let value = evt.target.value;

          if (value !== '') {
            value = parseFloat(value);
            if (!Number.isNaN(value)) {
              if (value > max) value = max;
              if (value < -max) value = -max;
            }
          }

          if (value === '' || !Number.isNaN(value)) {
            counter.changeFarbRegel(typ, pos, bedingung, value, farbe);
          }
        }}
      />
      <input
        type="color"
        value={farbe}
        onChange={(evt) => {
          evt.stopPropagation();
          const value = evt.target.value;
          counter.changeFarbRegel(typ, pos, bedingung, zahl, value);
        }}
      />

      <CustomButton
        className={deleteBtnClass}
        title="Entfernt Regel"
        spinner={{ show: true }}
        clickHandler={(evt, setLoading) => {
          evt.stopPropagation();
          counter.removeFarbe(pos);
          setLoading?.(() => false);
        }}
      >
        X
      </CustomButton>
    </div>
  );
}

export default ColorChooser;
