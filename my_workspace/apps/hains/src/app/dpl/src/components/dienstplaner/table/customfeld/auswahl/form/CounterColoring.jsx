import React, { useEffect, useState } from 'react';
import { UseDropdown } from '../../../../../../hooks/use-dropdown';
import { UseRegisterKey } from '../../../../../../hooks/use-register';
import { UseTooltip } from '../../../../../../hooks/use-tooltip';
import CustomButton from '../../../../../utils/custom_buttons/CustomButton';
import ColorChooser from './ColorChooser';

function CounterColoring({ counter }) {
  const [thisColors, setThisColors] = useState([]);
  const [addPos, setAddPos] = useState(-1);
  const update = UseRegisterKey('farbe', counter?.push, counter?.pull, counter);
  const [onOver, onOut] = UseTooltip(
    'Regeln, nach denen Zähler ihre Farbe anpassen. Dabei wird die Farbe der ersten zutreffenden Regel angewendet.'
  );

  const [onOverNumber, onOutNumber] = UseTooltip(
    'Position zum Einfügen neuer Regeln. -1 Fügt Regel am Ende hinzu.'
  );

  const { caret, show, handleClick } = UseDropdown(false, false);

  useEffect(() => {
    setThisColors(() =>
      counter?.colors?.map
        ? counter.colors.map((colorFeld, i) => (
            <ColorChooser key={`${colorFeld}_${i}`} counter={counter} pos={i} />
          ))
        : []
    );
  }, [counter, update]);

  useEffect(() => {
    const l = thisColors.length;
    setAddPos((current) => (current > l ? l : current));
  }, [thisColors]);

  if (!counter?.colors?.map) return null;
  return (
    <div className="table-custom-feld-auswahl-coloring">
      <p
        className="table-custom-feld-auswahl-coloring-label"
        onMouseOver={onOver}
        onMouseOut={onOut}
        onClick={handleClick}
      >
        Farbregeln:
        <span className="caret">{caret}</span>
      </p>

      {show && (
        <div className="table-custom-feld-auswahl-coloring-dropdown">
          <div className="table-custom-feld-auswahl-coloring-groups">
            {thisColors}
          </div>

          {thisColors.length < counter.COLORS_MAX && (
            <div className="table-custom-feld-auswahl-coloring-add">
              <CustomButton
                spinner={{ show: true }}
                title="Füge neue Regel hinzu, nach denen sich die Zähler einfärben."
                clickHandler={(evt, setLoading) => {
                  evt.stopPropagation();
                  counter?.addFarbe?.(addPos);
                  setLoading?.(() => false);
                }}
              >
                +
              </CustomButton>
              <input
                onMouseOver={onOverNumber}
                onMouseOut={onOutNumber}
                type="number"
                onChange={(evt) => {
                  evt.stopPropagation();
                  let value = parseInt(evt.target.value, 10);
                  const l = thisColors.length;
                  if (!Number.isNaN(value)) {
                    if (value > l) value = l;
                    if (value < -1) value = -1;
                  }
                  setAddPos((current) =>
                    Number.isNaN(value) ? current : value
                  );
                }}
                step={1}
                min={-1}
                max={thisColors.length}
                value={addPos}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CounterColoring;
