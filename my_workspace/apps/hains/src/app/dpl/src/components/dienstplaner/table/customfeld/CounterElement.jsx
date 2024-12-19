import React from "react";
import { UseTooltip } from "../../../../hooks/use-tooltip";

function CounterElement({ title = "", label = "", color = false }) {
  const [
    onOver,
    onOut
  ] = UseTooltip(title);

  return (
    <p
      onMouseOver={onOver}
      onMouseOut={onOut}
      style={color ? { backgroundColor: color } : null}
    >
      {label}
    </p>
  );
}

export default CounterElement;
