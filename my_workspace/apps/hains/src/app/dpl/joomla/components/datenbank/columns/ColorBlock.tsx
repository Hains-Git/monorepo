import React from 'react';
import styles from '../datenbank.module.css';
import { getFontColorByWhite } from '../../../helper/util';

function ColorBlock({ color }: { color: string }) {
  if (!color) return '';
  const { color: calColor, contrastRatio } = getFontColorByWhite(color);
  return (
    <div
      className={styles.color_block}
      style={{
        backgroundColor: color,
        color: calColor
      }}
    >
      {contrastRatio.toFixed(2)}
    </div>
  );
}

export default ColorBlock;
