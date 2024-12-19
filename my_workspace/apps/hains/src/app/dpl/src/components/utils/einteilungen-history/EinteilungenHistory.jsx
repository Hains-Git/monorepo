import React, { useState } from 'react';
import { MdHistory } from 'react-icons/md';
import { UseDropdown } from '../../../hooks/use-dropdown';
import { UseMounted } from '../../../hooks/use-mounted';
import { UseTooltip } from '../../../hooks/use-tooltip';
import Loader from '../loader/Loader';
import { UseRegister } from '../../../hooks/use-register';
import styles from './einteilung-history.module.css';

function EinteilungenHistory({
  size = '1.5em',
  history,
  feld = {},
  type = 'mitarbeiter',
  fontSize = '1em',
  children
}) {
  const [loader, setLoader] = useState(null);
  const mounted = UseMounted();
  UseRegister(history?._push, history?._pull, history);
  const [onOver, onOut] = UseTooltip('Einteilungsgeschichte laden!');
  const { caret, show, handleClick } = UseDropdown(false, true);

  const resetLoader = (showLoader) => {
    if (mounted) setLoader(() => (showLoader ? <Loader /> : null));
  };

  const loadHistory = () => {
    resetLoader(true);
    history?.loadHistory?.(feld, () => resetLoader(false));
  };

  if (!history?.loadHistory || !history?.eachVersion) return null;
  const einteilungen = history.eachVersion(
    (version, i) => version?.createAuswahl?.(feld, type, i) || null
  );
  return (
    <div className={styles.dienstplan_history}>
      <div className={styles.dienstplan_history_button}>
        {children}
        <MdHistory
          onMouseOver={onOver}
          onMouseOut={onOut}
          onClick={loadHistory}
          size={size}
        />

        <span
          className={styles.caret}
          onClick={(evt) => {
            handleClick(evt);
            if (!history?.data?.length) {
              loadHistory();
            }
          }}
        >
          {loader || caret}
        </span>
      </div>

      {show && (
        <div
          className={styles.dienstplan_history_dropdown}
          onClick={(evt) => evt.stopPropagation()}
          style={{ fontSize }}
        >
          <table className={styles.table}>
            <tbody>{einteilungen}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default EinteilungenHistory;
