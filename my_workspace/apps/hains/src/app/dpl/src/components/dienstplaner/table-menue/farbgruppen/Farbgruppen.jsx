import React, { useState } from 'react';
import { UseDropdown } from '../../../../hooks/use-dropdown';
import { UseRegister } from '../../../../hooks/use-register';
import { UseTooltip } from '../../../../hooks/use-tooltip';
import CustomButton from '../../../utils/custom_buttons/CustomButton';
import AuswahlGruppe from './auswahlgruppe';
import CheckField from './CheckField';
import ColorField from './ColorField';

function Farbgruppen({ farbgruppen }) {
  const { caret, show, handleClick } = UseDropdown(false, true);
  UseRegister(farbgruppen?._push, farbgruppen?._pull, farbgruppen);
  const [colorPicker, setColorPicker] = useState(false);
  const [onOver, onOut] = UseTooltip('Gruppiere Dienste und Wünsche nach Farben');
  const options = farbgruppen?.options;

  const toggleShowFarben = (evt, type = 0) => {
    evt.stopPropagation();
    farbgruppen?.debouncedToogle?.(type);
  };

  const setColor = (index, evt) => {
    evt.stopPropagation();
    farbgruppen?.debouncedSetGruppenColor?.(index, evt.target.value);
  };

  const setCheckbox = (index, evt) => {
    evt.stopPropagation();
    farbgruppen?.debouncedSetGruppenShow?.(index, evt.target.checked);
  };

  const getFields = (index) => [
    <AuswahlGruppe key="farbauswahlgruppe-dienste" dienste index={index} label="Dienste" farbgruppen={farbgruppen} />,
    <AuswahlGruppe
      key="farbauswahlgruppe-dienstkategorien"
      dienste={false}
      index={index}
      label="Wünsche"
      farbgruppen={farbgruppen}
    />
  ];

  if (!farbgruppen || !options) return null;
  return (
    <div className="farbrguppen-container">
      <div className="farbgruppen-header" onClick={handleClick}>
        <p className="farbgruppen-label" onMouseOver={onOver} onMouseOut={onOut}>
          Farben
          <span className="caret">{caret}</span>
        </p>
      </div>
      {show && (
        <div className="farbgruppen-optionen">
          <div className="farbgruppen-defaultfarben">
            {options?.dienste ? (
              <CheckField
                label="Zeige Dienstfarben"
                id="Dienstfarben_Checkbox"
                getCheck={() => !!farbgruppen?.showDienstfarben}
                title="Dienste ohne Farben, werden entweder in ihrer jeweiligen Standardfarbe angezeigt oder sind Farblos"
                handleChange={(evt) => toggleShowFarben(evt, 0)}
              />
            ) : null}
            {options?.einteilungskontext ? (
              <CheckField
                label="Zeige Einteilungskontextfarben"
                id="Einteilungskontextfarben_Checkbox"
                getCheck={() => !!farbgruppen?.showEinteilungskontextFarben}
                title="Einteilungskontext ohne Farben, werden entweder in ihrer jeweiligen Standardfarbe angezeigt oder sind Farblos"
                handleChange={(evt) => toggleShowFarben(evt, 1)}
              />
            ) : null}
            {options?.dienstkategorien ? (
              <CheckField
                label="Zeige Wunschfarben"
                id="Dienstkategoriefarben_Checkbox"
                getCheck={() => !!farbgruppen?.showDienstkategoriefarben}
                title="Wünsche ohne Farben, werden entweder in ihrer jeweiligen Standardfarbe angezeigt oder sind Farblos"
                handleChange={(evt) => toggleShowFarben(evt, 2)}
              />
            ) : null}
          </div>

          {options?.farbgruppen ? (
            <div className="farbgruppen-gruppen">
              {farbgruppen?.getGruppen?.((el, id) => (
                <ColorField
                  key={`Farbgruppe_${id}`}
                  label={`Gruppe ${id}`}
                  title="Dienste und Wünsche aus dieser Farbgruppe werden in dieser Farbe dargestellt"
                  id={id}
                  farbgruppen={farbgruppen}
                  setColorPicker={setColorPicker}
                  colorPicker={colorPicker}
                  handleChange={(evt) => setColor(id, evt)}
                  handleCheckbox={(evt) => setCheckbox(id, evt)}
                  getFields={getFields}
                />
              ))}
              <div className="farbgruppen-buttons">
                <CustomButton
                  spinner={{ show: true }}
                  title="Erstellt neue Farbgruppe"
                  clickHandler={(evt, setLoading) => {
                    evt.stopPropagation();
                    farbgruppen?.addGruppe?.(false, true);
                    setLoading?.(() => false);
                  }}
                >
                  +
                </CustomButton>
                <CustomButton
                  title="Entfernt letzte Farbgruppe"
                  spinner={{ show: true }}
                  clickHandler={(evt, setLoading) => {
                    evt.stopPropagation();
                    farbgruppen?.removeGruppe?.();
                    setLoading?.(() => false);
                  }}
                >
                  -
                </CustomButton>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default Farbgruppen;
