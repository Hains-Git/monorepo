import React, { useEffect, useState } from "react";
import { UseRegister } from "../../../../../../hooks/use-register";
import { UseTooltip } from "../../../../../../hooks/use-tooltip";

function CheckBox({
  label,
  id,
  name,
  title,
  onChange,
  checked,
  readOnly = false,
  parent = false
}) {
  const update = UseRegister(parent?.push, parent?.pull, parent);
  const [thisChecked, setThisChecked] = useState(checked);
  const [
    onOver,
    onOut
  ] = UseTooltip(title);

  useEffect(() => {
    setThisChecked(() => checked);
  }, [checked]);

  useEffect(() => {
    if (parent?.getChecked) setThisChecked(() => parent.getChecked());
  }, [update]);

  return (
    <div className="table-custom-feld-auswahl-form-checkbox">
      <input
        id={id}
        name={name}
        type="checkbox"
        checked={thisChecked}
        onChange={onChange}
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

export default CheckBox;
