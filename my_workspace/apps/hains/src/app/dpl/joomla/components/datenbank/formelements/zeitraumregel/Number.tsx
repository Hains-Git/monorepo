import React, { useEffect, useState } from 'react';

function NumberInput({
  value,
  label,
  title,
  handler,
  min = undefined,
  max = undefined
}: {
  title: string;
  label: string;
  value: number;
  handler: (value: number) => void;
  min?: number;
  max?: number;
}) {
  const [currentValue, setCurrentValue] = useState<string>(value.toString());

  useEffect(() => {
    setCurrentValue(() => value.toString());
  }, [value, title, label, handler]);

  return (
    <label aria-label={label} title={title}>
      {label}
      <input
        type="number"
        value={currentValue}
        min={min}
        max={max}
        onChange={(evt) => {
          const _value = evt.target.value;
          setCurrentValue(() => _value);
          const number = parseInt(_value, 10);
          if (!Number.isNaN(number)) {
            handler(parseInt(_value, 10));
          }
        }}
      />
    </label>
  );
}

export default NumberInput;
