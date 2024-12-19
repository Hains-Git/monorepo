import React from 'react';
import { UseTooltip } from '../../../hooks/use-tooltip';
import styles from './tabs.module.css';

function Tabs({ children, title = '' }) {
  const [onOver, onOut] = UseTooltip(title);

  return (
    <div
      className={styles.dienstplan_tabs}
      onMouseOver={onOver}
      onMouseOut={onOut}
    >
      {children}
    </div>
  );
}

export default Tabs;
