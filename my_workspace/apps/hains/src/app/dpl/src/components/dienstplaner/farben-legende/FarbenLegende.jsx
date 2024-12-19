import React from 'react';
import { UseDropdown } from '../../../hooks/use-dropdown';
import {
  abwesendClass,
  optionalClass,
  otherWunschDay,
  possibleConflict,
  seriousConflict,
  sonderstatusClass,
  warningClass,
  wunschErfuellt
} from '../../../styles/basic';

function FarbenLegende({ id, className = '' }) {
  const { caret, show, handleClick } = UseDropdown(false, false);

  const getLegende = () => {
    switch (id) {
      case 'table':
        return (
          <>
            <p className={wunschErfuellt}>Wunsch Erfüllt</p>
            <p className={possibleConflict}>Schwacher Konflikt</p>
            <p className={seriousConflict}>Starker Konflikt</p>
            <p className={sonderstatusClass}>Sonderstatus (abwesend)</p>
            <p className={warningClass}>Warnung</p>
            <p className={optionalClass}>Optionaler Bedarf</p>
          </>
        );
      case 'auswahl':
        return (
          <>
            <p className={wunschErfuellt}>Wunsch Erfüllt</p>
            <p className={wunschErfuellt + otherWunschDay}>
              Wunsch Erfüllt an anderem Tag
            </p>
            <p className={possibleConflict + otherWunschDay}>
              Wunsch-Konflikt an anderem Tag
            </p>
            <p className={wunschErfuellt + possibleConflict + otherWunschDay}>
              Wunsch-Erfüllt und Wunsch-Konflikt bei mehreren Wunschtagen
            </p>
            <p className={possibleConflict}>Schwacher Konflikt</p>
            <p className={seriousConflict}>Starker Konflikt</p>
            <p className={sonderstatusClass}>Sonderstatus (abwesend)</p>
            <p className={abwesendClass}>Abwesend</p>
          </>
        );
    }
    return null;
  };

  return (
    <div className={`farben-legende-container ${className}`}>
      <p className="farben-legende-container-label" onClick={handleClick}>
        {'Legende: '}
        <span className="caret">{caret}</span>
      </p>
      {show && (
        <div className="farben-legende-container-farben">{getLegende()}</div>
      )}
    </div>
  );
}

export default FarbenLegende;
