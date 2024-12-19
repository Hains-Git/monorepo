import React from 'react';
import { UseTooltip } from '../../../../hooks/use-tooltip';
import styles from '../einteilungauswahl.module.css';

function Counter({ el }) {
  const [onOver, onOut] = UseTooltip(el.title);

  return (
    <td onMouseOver={onOver} onMouseOut={onOut} className={styles.counter_td}>
      <span className={`${styles.counter} ${el?.className || ''}`.trim()}>
        {el.anzahl}
      </span>
    </td>
  );
}

export default Counter;
