import React from "react";
import { UseTooltip } from "../../../../../hooks/use-tooltip";

function StandardDropdownItem({
  className,
  styleObj = null,
  value,
  handleOnClick = () => {},
  title,
  text
}) {
  const [
    onOver,
    onOut
  ] = UseTooltip(title);

  return (
    <button
      className={className}
      type="button"
      style={styleObj}
      value={value}
      onClick={handleOnClick}
      onMouseOver={onOver}
      onMouseOut={onOut}
    >
      {text}
    </button>
  );
}

export default StandardDropdownItem;
