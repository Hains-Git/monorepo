import React from 'react';

function CheckBox({
  index,
  label,
  checked,
  handler
}: {
  index: number;
  label: string;
  checked: (index: number) => boolean;
  handler: (index: number) => void;
}) {
  return (
    <label aria-label={label}>
      <input
        type="checkbox"
        checked={checked(index)}
        onChange={() => handler(index)}
      />
      {label}
    </label>
  );
}

export default CheckBox;
