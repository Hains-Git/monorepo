import React from "react";
import { UseTooltip } from "../../../../../hooks/use-tooltip";
import AuswahlContainer from "../auswahl-container/AuswahlContainer";

function FunktionenContainer({
  renderFunktionen,
  handleAllesAbwaehlen,
  handleAllesAuswaehlen
}) {
  const [
    onOver,
    onOut
  ] = UseTooltip("Welche Funktionen sollen die angezeigten Mitarbeiter erfüllen?");
  return (
    <div className="vorlage-funktionen-auswahl">
      <p
        className="vorlage-funktionen-hinweis"
        onMouseOver={onOver}
        onMouseOut={onOut}
      >
        Mitarbeiter-Funktionen
      </p>

      <AuswahlContainer
        render={renderFunktionen}
        handleAllesAbwaehlen={handleAllesAbwaehlen}
        handleAllesAuswaehlen={handleAllesAuswaehlen}
      />

      <hr />
    </div>
  );
}

export default FunktionenContainer;
