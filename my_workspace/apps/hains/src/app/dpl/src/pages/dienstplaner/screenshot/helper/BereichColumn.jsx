import React from 'react';
import styles from '../screenshot.module.css';

function BereichColumnCom({ column, sort }) {
  return (
    <div
      className={styles.screenshot_table_bereich}
      data-sort={sort}
      data-id={column.id}
    >
      <p className={styles.screenshot_table_bereich}>{column.label}</p>
      <div className={styles.screenshot_table_mitarbeiter}>
        {column.rows.sort((a, b) => (b.props.sort || 0) - (a.props.sort || 0))}
      </div>
    </div>
  );
}

export default BereichColumnCom;
