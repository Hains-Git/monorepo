import React, { useCallback, useEffect, useState } from 'react';
import { debounce, wait } from '../../../tools/debounce';

function Checkbox({
  element,
  group,
  toggleChecked,
  label,
  callSearch,
  updateCheckboxes,
  input
}) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(() => group.checked.includes(element));
  }, [group, updateCheckboxes]);

  const debouncedUpdate = useCallback(
    debounce((_input) => {
      callSearch(_input);
    }, wait),
    [callSearch]
  );

  return (
    <label>
      <input
        type="checkbox"
        checked={checked}
        onChange={() => {
          toggleChecked(group, element, !checked);
          setChecked(() => group.checked.includes(element));
          debouncedUpdate(input);
        }}
      />
      {label}
    </label>
  );
}
export default Checkbox;
