import React from 'react';
import { UseRegister } from '../../../../hooks/use-register';
import styles from './customfeld.module.css';

function CustomCounterTitle({ customFelder, feld, cell, rowIndex, colIndex }) {
  UseRegister(feld?._push, feld?._pull, feld);

  const openSettings = () => {
    customFelder?.setInfo?.(feld, cell, rowIndex, colIndex);
  };

  if (!feld || !cell) return null;
  return (
    <div className={styles.table_custom_counter_title}>
      <p onDoubleClick={openSettings}>{feld?.name}</p>
    </div>
  );
}

export default CustomCounterTitle;
