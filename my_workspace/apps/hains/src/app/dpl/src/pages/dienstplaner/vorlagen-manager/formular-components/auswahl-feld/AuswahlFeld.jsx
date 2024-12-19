import React, { useEffect, useState } from 'react';
import { UseTooltip } from '../../../../../hooks/use-tooltip';

function AuswahlFeld({
  el,
  nameKey = 'name',
  auswahl,
  setAuswahl,
  title = ''
}) {
  const checkAuswahl = () => auswahl.indexOf(el.id) >= 0;

  const [onOver, onOut] = UseTooltip(title);
  const [checked, setChecked] = useState(checkAuswahl());
  const name = el[nameKey];

  useEffect(() => {
    setChecked(() => checkAuswahl());
  }, [auswahl]);

  const handleChange = (evt) => {
    const value = parseInt(evt.target.value, 10);

    setAuswahl((currentAuswahl) => {
      const newAuswahl = [...currentAuswahl];
      const i = newAuswahl.indexOf(value);
      if (checked && i >= 0) {
        newAuswahl.splice(i, 1);
      } else if (!checked && i < 0) {
        newAuswahl.push(value);
      }

      return newAuswahl;
    });

    setChecked((currentChecked) => !currentChecked);
  };

  return (
    <label onMouseOver={onOver} onMouseOut={onOut}>
      <input
        type="checkbox"
        onChange={handleChange}
        checked={checked}
        value={el.id}
      />
      {name}
    </label>
  );
}

export default AuswahlFeld;
