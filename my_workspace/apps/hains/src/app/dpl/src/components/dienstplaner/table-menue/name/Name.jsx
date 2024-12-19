import React from "react";
import { UseTooltip } from "../../../../hooks/use-tooltip";

function Name({ table }) {
  const {
    name,
    title
  } = table?.showName || { name: "", title: "" };
  const [
    onOver,
    onOut
  ] = UseTooltip(title);

  return (
    <div className="dienstplan-table-name-container">
      <p
        onMouseOver={onOver}
        onMouseOut={onOut}
      >
        {name}
      </p>
    </div>
  );
}

export default Name;
