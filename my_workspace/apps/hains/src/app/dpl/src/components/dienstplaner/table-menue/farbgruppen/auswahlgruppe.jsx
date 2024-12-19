import React from 'react';
import { UseDropdown } from '../../../../hooks/use-dropdown';
import CheckField from './CheckField';
import { numericLocaleCompare } from '../../../../tools/helper';
import CustomButton from '../../../utils/custom_buttons/CustomButton';

function AuswahlGruppe({ dienste = true, index, label, farbgruppen }) {
  const key = dienste ? 'dienste' : 'dienstkategorien';

  const { caret, show, handleClick } = UseDropdown(false, true);

  const setAll = (evt, value, setLoading) => {
    evt.stopPropagation();
    farbgruppen?.setAll?.(key, index, value);
    farbgruppen?.updateColors?.(index);
    setLoading?.(() => false);
  };

  const handleChange = (evt, handleKey, id, handleIndex) => {
    evt.stopPropagation();
    farbgruppen?.changeGruppe?.(handleKey, id, handleIndex);
    farbgruppen?.updateColors?.(index);
  };

  const createFiled = (elObj, el, id) => {
    return (
      <CheckField
        key={`${key}_${id}`}
        label={dienste ? elObj?.planname : elObj?.initialien}
        id={`farbgruppe${index}_${key}_checkbox${id}`}
        getCheck={() => el === index}
        title={elObj?.name}
        handleChange={(evt) => {
          handleChange(evt, key, id, index);
        }}
      />
    );
  };

  const getFields = () => {
    let result = [];
    if (dienste) {
      result = farbgruppen?.getDienste?.(createFiled) || [];
    } else {
      result = farbgruppen?.getDienstkategorien?.(createFiled) || [];
    }

    return result.sort((a, b) =>
      numericLocaleCompare(a.props.label, b.props.label)
    );
  };

  if (!farbgruppen) return null;
  return (
    <div className="farbgruppen-colorfield-dropdown">
      <p key={`${key}-head`} onClick={handleClick}>
        <span>{label}</span>
        <span className="caret">{caret}</span>
      </p>
      {show ? (
        <>
          <CustomButton
            spinner={{ show: true }}
            title="Alle aktivieren"
            clickHandler={(evt, setLoading) => setAll(evt, true, setLoading)}
          >
            Alle
          </CustomButton>
          <CustomButton
            spinner={{ show: true }}
            title="Alle deaktivieren"
            clickHandler={(evt, setLoading) => setAll(evt, false, setLoading)}
          >
            Keine
          </CustomButton>
          {getFields()}
        </>
      ) : null}
    </div>
  );
}

export default AuswahlGruppe;
