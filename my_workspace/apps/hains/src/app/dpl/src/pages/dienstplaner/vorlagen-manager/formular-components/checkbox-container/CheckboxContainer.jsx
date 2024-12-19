import React, { useEffect, useState } from 'react';
import { UseTooltip } from '../../../../../hooks/use-tooltip';

function CheckboxContainer({
  txt,
  title,
  containerClass = '',
  inputId = '',
  value,
  callback,
  handleChange
}) {
  const [onOver, onOut] = UseTooltip(title);
  const [checked, setChecked] = useState(!!value);

  useEffect(() => {
    setChecked(() => {
      if (typeof callback === 'function') {
        return callback();
      }
      return value;
    });
  }, [value]);

  return (
    <div className={containerClass}>
      <input
        type="checkbox"
        id={inputId}
        checked={checked}
        onChange={handleChange}
      />
      <label htmlFor={inputId} onMouseOver={onOver} onMouseOut={onOut}>
        {txt}
      </label>
    </div>
  );
}

export default CheckboxContainer;
