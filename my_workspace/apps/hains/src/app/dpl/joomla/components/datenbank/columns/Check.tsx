import React from 'react';
import styles from '../datenbank.module.css';

function Check({ checked }: { checked: boolean }) {
  return (
    <input
      className={styles.check}
      type="checkbox"
      checked={!!checked}
      disabled
    />
  );
}

export default Check;
