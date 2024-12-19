import React from 'react';
import { numericLocaleCompare } from '../../../../tools/helper';
import styles from '../screenshot.module.css';

function DateTableCom({ table, sort }) {
  const handleClick = (evt) => {
    evt.stopPropagation();
    table?.setInfo?.(evt);
  };

  return (
    <div
      className={styles.screenshot_table}
      data-sort={sort}
      data-id={table.tag}
    >
      <div
        className={styles.screenshot_table_column}
        data-sort=""
        data-id="first"
        key="first"
      >
        <p className={styles.screenshot_table_dienst}>Dienst:</p>
        <p className={styles.screenshot_table_breich}>Bereich:</p>
        <div className={styles.screenshot_table_column_date}>
          <p onClick={handleClick} className={styles.screenshot_table_date}>
            {table.label}
          </p>
        </div>
      </div>
      {table.columns.sort((a, b) =>
        numericLocaleCompare(a.props.sort, b.props.sort)
      )}
    </div>
  );
}

export default DateTableCom;
