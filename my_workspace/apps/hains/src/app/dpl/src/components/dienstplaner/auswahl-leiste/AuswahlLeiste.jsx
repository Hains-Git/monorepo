import React from "react";

function AuswahlLeiste({ children, className = "" }) {
  return (
    <div className={`auswahl-leiste-row ${className}`}>
      {children}
    </div>
  );
}

export default AuswahlLeiste;
