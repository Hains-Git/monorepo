import React, { useEffect, useState } from 'react';
import { UseDropdown } from '../../../../../hooks/use-dropdown';
import CustomInput from '../../../../utils/custom-input/CustomInput';
import CustomButton from '../../../../utils/custom_buttons/CustomButton';
import SaveButton from '../../../../utils/custom_buttons/SaveButton';

function FeldName({ customFelder, update }) {
  const feld = customFelder?.feld;
  const [name, setName] = useState(feld?.name || '');
  const { caret, show, handleClick } = UseDropdown(false, false);

  useEffect(() => {
    setName(() => feld?.name || '');
  }, [update]);

  if (!feld?.setName) return null;
  const label = feld?.row ? 'Zeilenname' : 'Spaltenname';
  return (
    <div onClick={handleClick} className="table-custom-feld-auswahl-name">
      <p className="table-custom-feld-auswahl-label" onClick={handleClick}>
        {label} ändern
        <span className="caret">{caret}</span>
      </p>
      {show && (
        <div>
          <CustomInput
            onClick={(evt) => {
              evt.stopPropagation();
            }}
            onChange={(evt) => {
              evt.stopPropagation();
              const value = evt.target.value;
              setName(() => value);
            }}
            value={name}
          />
          <SaveButton
            spinner={{ show: true }}
            clickHandler={(evt, setLoading) => {
              evt.stopPropagation();
              feld.setName(name.trim(), true);
              setLoading?.(() => false);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default FeldName;
