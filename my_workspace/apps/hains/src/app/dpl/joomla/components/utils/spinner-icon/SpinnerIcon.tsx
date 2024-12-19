import React from 'react';
import styles from './spinner-icon.module.css';

type TProps = {
  width: string | number;
  height: string | number;
  color: string;
  borderWidth: string | number;
};

function SpinnerIcon({ width, height, color, borderWidth }: TProps) {
  return (
    <div className={styles.spinner_wrapper}>
      <div className={styles.spinner_icon} style={{ width, height }}>
        <div
          className={styles.spinner}
          style={{ borderColor: color, borderWidth }}
        />
      </div>
    </div>
  );
}

export default SpinnerIcon;
