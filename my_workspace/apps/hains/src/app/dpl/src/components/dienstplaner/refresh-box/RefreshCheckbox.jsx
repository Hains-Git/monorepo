import React from "react";
import { UseTooltip } from "../../../hooks/use-tooltip";
import { UseRegister } from "../../../hooks/use-register";

function RefreshCheckbox({
  el,
  title = "",
  getChecked = () => false,
  clickHandler = false,
  className = "",
  style = null,
  text = "Bedarfe aktualisieren",
  id = "dienstplan-refresh-box"
}) {
  UseRegister(el?._push, el?._pull, el);
  const [
    onOver,
    onOut
  ] = UseTooltip(title);

  if (!el) return null;
  return (
    <div
      className={`my-refresh-box ${className}`}
      style={style}
    >
      <label
        onMouseOver={onOver}
        onMouseOut={onOut}
        htmlFor={id}
      >
        <input
          type="checkbox"
          onMouseOver={onOver}
          onMouseOut={onOut}
          checked={getChecked()}
          onChange={clickHandler || null}
          id={id}
        />
        {text}
      </label>
    </div>
  );
}

export default RefreshCheckbox;
