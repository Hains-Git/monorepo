import React from 'react';
import { UseTooltip } from '../../../../hooks/use-tooltip';
import styles from '../einteilungauswahl.module.css';

function WunschHinweis({ wunsch = false }) {
  const [onOver, onOut] = UseTooltip(wunsch?.msg || '');

  if (!wunsch?.label) return null;
  return (
    <span
      className={`${styles.counter} ${wunsch.labelClasses}`}
      onMouseOver={onOver}
      onMouseOut={onOut}
    >
      {wunsch.label}
    </span>
  );
}

export default WunschHinweis;
