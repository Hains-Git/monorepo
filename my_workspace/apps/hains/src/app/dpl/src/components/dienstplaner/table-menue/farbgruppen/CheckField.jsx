import React from "react";
import { UseTooltip } from "../../../../hooks/use-tooltip";
import { UseRegister } from "../../../../hooks/use-register";

function CheckField({
  label,
  id,
  handleChange,
  title = "",
  getCheck = () => {},
  pull = false,
  push = false
}) {
  const [
    onOver,
    onOut
  ] = UseTooltip(title);
  UseRegister(push, pull);

  const check = getCheck(id);
  return (
    <div className="farbgruppen-checkbox">
      <label
        htmlFor={id}
        onMouseOver={onOver}
        onMouseOut={onOut}
      >
        <input
          type="checkbox"
          name={id}
          id={id}
          onChange={handleChange}
          checked={check}
        />
        {label}
      </label>
    </div>
  );
}

export default CheckField;
