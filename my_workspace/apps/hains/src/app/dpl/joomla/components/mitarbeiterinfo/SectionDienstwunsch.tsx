import React from 'react';

import DienstwunschCalendar from './DienstwunschCalendar';
import CardWrapper from './CardWrapper';

import styles from '../../mitarbeiterinfo/app.module.css';

export default function SectionDienstwunsch() {
  const arrNums = Array.from({ length: 4 }, (value, index) => index);
  return (
    <div className={styles.grid_col4}>
      {arrNums.map((i: number) => {
        return (
          <CardWrapper key={`cardwrapper-${i}`}>
            <DienstwunschCalendar index={i} />
          </CardWrapper>
        );
      })}
    </div>
  );
}
