import React, { useState } from 'react';

import styles from './toggle-switch.module.css';

function ToggleSwitch({ children, cb, text, size = 6.3 }) {
  const [isActive, setActive] = useState(false);
  const toggle = () => {
    const toggled = !isActive;
    setActive(toggled);
    cb(toggled);
  };

  return (
    <div
      className={styles.toogle_switch_wrapper}
      style={{ fontSize: `${size}px` }}
    >
      <div
        title="Färbt die zu besetzten Dienste farblich ein. "
        className={`${styles.toggle_switch} ${isActive ? styles.active : ''}`}
        onClick={toggle}
      />
      {children}
      <span
        title="Die Anzahl der zu besetzten Dienste"
        className={styles.number}
      >
        {text}
      </span>
    </div>
  );
}
export default ToggleSwitch;
