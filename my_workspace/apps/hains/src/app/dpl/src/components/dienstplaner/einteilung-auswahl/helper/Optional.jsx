import React from 'react';
import styles from '../einteilungauswahl.module.css';
import { UseRegisterKey } from '../../../../hooks/use-register';

function Optional({ einteilungAuswahl }) {
  UseRegisterKey(
    'optional',
    einteilungAuswahl?.push,
    einteilungAuswahl?.pull,
    einteilungAuswahl
  );

  if (!einteilungAuswahl?.feld?.bedarf?.addOpt) return null;
  return (
    <label className={styles.optional}>
      Optional:
      <input
        type="checkbox"
        onChange={(evt) => {
          einteilungAuswahl?.setOptional?.(evt.target.checked);
        }}
        checked={!!einteilungAuswahl?.optional}
      />
    </label>
  );
}

export default Optional;
