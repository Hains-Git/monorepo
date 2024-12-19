import React from 'react';
import EinteilungenInfos from './EinteilungenInfo';

function EinteilungenInfosRow({ einteilungAuswahl }) {
  const currentFeld = einteilungAuswahl?.feld;
  const currentMitarbeiter = currentFeld?.mitarbeiter;
  const mitarbeiterAuswahl = einteilungAuswahl.type === 'mitarbeiter';
  if (!(currentMitarbeiter && !mitarbeiterAuswahl)) return null;

  return (
    <tr>
      <EinteilungenInfos
        einteilungen={currentMitarbeiter?.getEinteilungenInfoScore?.(
          currentFeld
        )}
      />
    </tr>
  );
}

export default EinteilungenInfosRow;
