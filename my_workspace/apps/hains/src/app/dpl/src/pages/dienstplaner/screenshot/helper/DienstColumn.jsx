import React from 'react';
import { numericLocaleCompare } from '../../../../tools/helper';
import styles from '../screenshot.module.css';

function DienstColumnCom({ table, column, sort }) {
  const handleClick = (evt) => {
    evt.stopPropagation();
    table?.setInfo?.(evt);
  };

  return (
    <div
      className={styles.screenshot_table_column}
      data-sort={sort}
      data-id={column.id}
    >
      <p onClick={handleClick} className={styles.screenshot_table_dienst}>
        {column.label}
      </p>
      <div className={styles.screenshot_table_bereich}>
        {column.columns.sort((a, b) =>
          numericLocaleCompare(a.props.sort, b.props.sort)
        )}
      </div>
    </div>
  );
}

export default DienstColumnCom;
