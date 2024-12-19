import React, { useContext, useEffect, useRef, useState } from 'react';
import { showExtraClass } from '../../../../styles/basic';
import { DienstplanContext } from '../../../../contexts/dienstplan';

function Add({ feld }) {
  const refInput = useRef(null);
  const [showClass, setShowClass] = useState('');
  const { currentFeld } = useContext(DienstplanContext);

  useEffect(() => {
    feld?.setRef?.(refInput?.current || false);
    return () => {
      feld?.setRef?.(false);
    };
  }, [refInput, feld]);

  const focusOnInput = () => {
    refInput?.current?.focus?.();
  };

  const handleBlur = () => {
    setShowClass(() => '');
  };

  const focusHandler = (evt, bool) => {
    evt.stopPropagation();
    feld?.setFocus?.(bool);
    setShowClass(() => showExtraClass);
  };

  const add = (evt) => {
    if (feld?.hasAddFkt) feld?.debouncedAdd?.(evt);
    else focusHandler(evt, true);
  };

  if (!feld) return null;
  return (
    <div
      className={`dienstplan-add-einteilung ${showClass} ${currentFeld === feld ? showExtraClass : ''}`}
      onClick={focusOnInput}
    >
      <input
        ref={refInput}
        type="button"
        onBlur={handleBlur}
        onFocus={(evt) => focusHandler(evt, false)}
        onDoubleClick={(evt) => focusHandler(evt, true)}
        onClick={(evt) => {
          evt.stopPropagation();
          add(evt);
        }}
        value="+"
      />
    </div>
  );
}
export default Add;
