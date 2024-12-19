import React, { useCallback, useEffect, useState } from 'react';
import { UseTooltip } from '../../../../hooks/use-tooltip';
import { debounce, wait } from '../../../../tools/debounce';

function Toggle({ title, label, checked, toggleChecked }) {
  const [currentChecked, setCurrentChecked] = useState(checked);
  const [onOver, onOut] = UseTooltip(title);

  useEffect(() => {
    setCurrentChecked(() => checked);
  }, [checked]);

  const debouncedToggleChecked = useCallback(
    debounce(() => {
      toggleChecked();
    }, wait),
    [toggleChecked]
  );

  return (
    <label
      onMouseOver={onOver}
      onMouseOut={onOut}
      className="toggle-dienste-wuensche-container"
    >
      <input
        type="checkbox"
        checked={currentChecked}
        onChange={(evt) => {
          evt.stopPropagation();
          setCurrentChecked(!currentChecked);
          debouncedToggleChecked();
        }}
      />
      {label}
    </label>
  );
}

export default Toggle;
