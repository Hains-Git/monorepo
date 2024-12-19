import React from "react";
import { UseDienstplanVorlagen } from "../../../hooks/use-dienstplan-vorlagen";

function VorlagenManager({
  user,
  dienstplan
}) {
  const [
    getVorschau,
    showFormular,
    getVorlageFormular
  ] = UseDienstplanVorlagen(dienstplan, user);

  if (!dienstplan) return null;
  return (
    <div className="dienstplan-vorlage-manager-page">
      <div className="vorlage-formular my-container">
        {showFormular ? getVorlageFormular(true) : getVorschau()}
      </div>
    </div>

  );
}

export default VorlagenManager;
