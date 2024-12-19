import React from 'react';

function Radio({
  label,
  name,
  value,
  onChange,
  checked
}: {
  label: string;
  name: string;
  value: string;
  onChange: () => void;
  checked: boolean;
}) {
  return (
    <label>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      {label}
    </label>
  );
}

export default Radio;
