import React from 'react';
import styles from '../einteilungauswahl.module.css';
import { UseRegisterKey } from '../../../../hooks/use-register';

function Comment({ einteilungAuswahl }) {
  UseRegisterKey(
    'comment',
    einteilungAuswahl?.push,
    einteilungAuswahl?.pull,
    einteilungAuswahl
  );

  return (
    <label className={styles.comment} title={einteilungAuswahl?.comment || ''}>
      Kommentar:
      <input
        type="text"
        onChange={(evt) => {
          einteilungAuswahl?.setComment?.(evt.target.value);
        }}
        value={einteilungAuswahl?.comment || ''}
      />
    </label>
  );
}

export default Comment;
