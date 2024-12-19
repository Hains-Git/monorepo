import React, { useEffect, useRef } from 'react';
import styles from '../contentcontainer.module.css';

function Dropdown({ vorschlaege, focusedIndex }) {
  const thisRef = useRef(null);

  useEffect(() => {
    if (!vorschlaege?.length || !thisRef?.current) return;
    const auswahlOptionen = thisRef.current?.children;
    const l = auswahlOptionen?.length || 0;
    for (let i = 0; i < l; i++) {
      auswahlOptionen[i].removeAttribute('data-focused');
    }
    const auswahl = auswahlOptionen?.[focusedIndex];
    if (!auswahl) return;
    auswahl.setAttribute('data-focused', true);
    auswahl.scrollIntoView({ block: 'nearest' });
  }, [vorschlaege, focusedIndex, thisRef]);

  if (!vorschlaege?.length) return null;
  return (
    <div
      ref={thisRef}
      className={`dienstplan-einteilung-dropdown ${styles.dropdown}`}
    >
      <table className={styles.dropdown_table}>
        <tbody>{vorschlaege}</tbody>
      </table>
    </div>
  );
}

export default Dropdown;
