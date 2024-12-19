import React from 'react';
import styles from '../einteilungauswahl.module.css';
import { UseRegisterKey } from '../../../../hooks/use-register';
import { nonBreakSpace } from '../../../../tools/htmlentities';

function ContextComment({ einteilungAuswahl }) {
  UseRegisterKey(
    'comment',
    einteilungAuswahl?.push,
    einteilungAuswahl?.pull,
    einteilungAuswahl
  );

  return (
    <label
      className={styles.comment}
      title={einteilungAuswahl?.contextComment || ''}
    >
      {nonBreakSpace}
      <input
        type="text"
        onChange={(evt) => {
          einteilungAuswahl?.setContextComment?.(evt.target.value);
        }}
        placeholder="Kontext Kommentar..."
        value={einteilungAuswahl?.contextComment || ''}
      />
    </label>
  );
}

export default ContextComment;
