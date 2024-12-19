import React from 'react';
import styles from '../toolbar.module.css';

function AbfrageCheckbox({ check, setCheck, name, label }) {
  const id = `export-datentyp-abfrage-${name}-checkbox`;
  return (
    <div className={styles.export_checkbox}>
      <input
        type="checkbox"
        id={id}
        checked={check}
        onChange={(evt) => {
          evt.stopPropagation();
          setCheck((current) => !current);
        }}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

export default AbfrageCheckbox;
