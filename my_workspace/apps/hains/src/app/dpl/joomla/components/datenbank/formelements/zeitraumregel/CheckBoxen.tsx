import React from 'react';
import CheckBox from './CheckBox';

function CheckBoxen({
  labels,
  checked,
  handler
}: {
  labels: string[];
  checked: (index: number) => boolean;
  handler: (index: number) => void;
}) {
  return (
    <div>
      {labels.map((label, index) => (
        <CheckBox
          key={label}
          index={index}
          label={label}
          checked={checked}
          handler={handler}
        />
      ))}
    </div>
  );
}

export default CheckBoxen;
