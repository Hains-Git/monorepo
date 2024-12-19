import React from "react";
import { UseDropdown } from "../../../../../../hooks/use-dropdown";
import { UseTooltip } from "../../../../../../hooks/use-tooltip";

function CounterOptionen({
  name,
  title,
  getChildren
}) {
  const {
    caret,
    show,
    handleClick
  } = UseDropdown(false, false);

  const [
    onOver,
    onOut
  ] = UseTooltip(title);

  return (
    <div className="table-custom-feld-auswahl-counter-optionen-container">
      <div onClick={handleClick}>
        <p
          className="table-custom-feld-auswahl-label"
          onMouseOver={onOver}
          onMouseOut={onOut}
        >
          {name}
          {' '}
          <span className="caret">{caret}</span>
        </p>
      </div>

      <div className="table-custom-feld-auswahl-counter-optionen">
        {show && getChildren()}
      </div>
    </div>
  );
}

export default CounterOptionen;
