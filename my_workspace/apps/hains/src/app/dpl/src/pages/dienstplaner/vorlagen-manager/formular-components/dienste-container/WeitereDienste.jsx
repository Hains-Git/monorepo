import React from "react";
import { UseDropdown } from "../../../../../hooks/use-dropdown";
import AuswahlContainer from "../auswahl-container/AuswahlContainer";

function WeitereDienste({
  renderDienste,
  handleAllesAbwaehlen,
  handleAllesAuswaehlen,
  label = ""
}) {
  const {
    caret,
    show,
    handleClick
  } = UseDropdown(false, false);

  return (
    <>
      <hr />
      <div
        className="vorlage-weitere-dienste"
        onClick={handleClick}
      >
        {label}
        {' '}
        <span className="caret">{caret}</span>
      </div>

      {show
        ? (
          <AuswahlContainer
            render={renderDienste}
            handleAllesAbwaehlen={handleAllesAbwaehlen}
            handleAllesAuswaehlen={handleAllesAuswaehlen}
          />
        ) : null}
    </>
  );
}

export default WeitereDienste;
