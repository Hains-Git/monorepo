import React from 'react';
import AuswahlRow from '../AuswahlRow';
import styles from '../einteilungauswahl.module.css';

function CurrentEinteilung({ einteilungAuswahl }) {
  const currentFeld = einteilungAuswahl?.feld;
  const currentMitarbeiter = currentFeld?.mitarbeiter;
  const mitarbeiterAuswahl = einteilungAuswahl.type === 'mitarbeiter';
  if (!(currentMitarbeiter && mitarbeiterAuswahl)) return null;
  return (
    <>
      <tr className={styles.no_hover}>
        <td>Aktuelle Einteilung:</td>
      </tr>
      <AuswahlRow
        mitarbeiter={currentMitarbeiter}
        infoParent={mitarbeiterAuswahl ? currentMitarbeiter : currentFeld}
        feld={currentFeld}
        type={einteilungAuswahl.type}
        score={currentMitarbeiter.getScore(currentFeld)}
        showBedarfe={!mitarbeiterAuswahl}
        readOnly
      />
    </>
  );
}

export default CurrentEinteilung;
