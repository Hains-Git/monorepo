import React from "react";
import { UseRegister } from "../../../hooks/use-register";
import { UseTooltip } from "../../../hooks/use-tooltip";

function Konflikt({ konflikt }) {
  const {
    msg,
    label,
    title,
    id,
    index,
    check,
    handleChange,
    _push,
    _pull
  } = konflikt || {};
  UseRegister(_push, _pull, konflikt);

  const [
    onOver,
    onOut
  ] = title ? UseTooltip(title) : [null, null];

  const thisId = `${id}_${index !== undefined ? index : ""}`;
  if (!konflikt) return null;
  return (
    <div className="konflikt-filter-konflikt">
      <div className="konflikte-filter-konflikt-head">
        <input
          type="checkbox"
          name={thisId}
          id={thisId}
          onChange={handleChange}
          checked={check}
        />
        <label
          htmlFor={thisId}
          onMouseOver={onOver}
          onMouseOut={onOut}
        >
          {msg || label}
        </label>
      </div>
    </div>
  );
}

export default Konflikt;
