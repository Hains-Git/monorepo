import React, { useState } from "react";
import { UseTooltip } from "../../../../../../hooks/use-tooltip";

function NumberInput({
  label,
  id,
  name,
  title,
  onChange,
  readOnly = false
}) {
  const [number, setNumber] = useState(onChange());
  const [
    onOver,
    onOut
  ] = UseTooltip(title);

  return (
    <div className="table-custom-feld-auswahl-form-number">
      <input
        id={id}
        name={name}
        type="number"
        value={number}
        onChange={(evt) => {
          evt.stopPropagation();
          setNumber(() => onChange(evt));
        }}
        readOnly={readOnly}
      />
      <label
        htmlFor={id}
        onMouseOver={onOver}
        onMouseOut={onOut}
      >
        {label}
      </label>
    </div>
  );
}

export default NumberInput;
