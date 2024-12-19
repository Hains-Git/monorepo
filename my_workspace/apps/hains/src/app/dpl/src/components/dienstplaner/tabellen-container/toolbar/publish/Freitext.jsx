import React, { useState } from 'react';
import { UseAbfrageBox } from '../../../../../hooks/use-abfrage-box';
import CustomButton from '../../../../utils/custom_buttons/CustomButton';
import styles from '../toolbar.module.css';

function FreitextAbfrage({ table, publish, abbrechen }) {
  const [style, myRef] = UseAbfrageBox();
  const [txt, setTxt] = useState(
    (table?.getFreitext && table?.getFreitext()) || ''
  );
  const max = 3000;

  if (!table?.getFreitext) return null;
  return (
    <div
      className={styles.export}
      onClick={(evt) => evt.stopPropagation()}
      style={style}
      ref={myRef}
    >
      <p
        className={styles.export_title}
      >{`Kommentar: (max. ${max} Zeichen)`}</p>
      <textarea
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        rows={5}
        cols={50}
        maxLength={max}
        onChange={(evt) => {
          setTxt(() => evt.target.value);
        }}
        value={txt}
      />
      <CustomButton
        spinner={{ show: true }}
        clickHandler={(evt, setLoading) => {
          publish(txt, setLoading);
        }}
      >
        OK
      </CustomButton>
      <CustomButton clickHandler={abbrechen}>Abbrechen</CustomButton>
    </div>
  );
}

export default FreitextAbfrage;
