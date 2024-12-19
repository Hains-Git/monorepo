import React from 'react';
import { UseTooltip } from '../../../../hooks/use-tooltip';
import styles from '../screenshot.module.css';

function MitarbeiterRow({ row, id, sort, title }) {
  const [onOver, onOut] = UseTooltip(title);
  return (
    <p
      className={styles.screenshot_table_mitarbeiter}
      data-sort={sort}
      data-id={id}
      onMouseOver={onOver}
      onMouseOut={onOut}
    >
      {row.label}
    </p>
  );
}

export default MitarbeiterRow;
