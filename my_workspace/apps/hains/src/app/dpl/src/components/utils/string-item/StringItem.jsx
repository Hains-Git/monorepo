import React from "react";
import { UseTooltip } from "../../../hooks/use-tooltip";

function Stringitem({ label = "", title = "", className = "" }) {
  const [
    onOver,
    onOut
  ] = UseTooltip(title);

  return (
    <p
      className={className || null}
      onMouseOver={onOver}
      onMouseOut={onOut}
    >
      {label}
    </p>
  );
}

export default Stringitem;
