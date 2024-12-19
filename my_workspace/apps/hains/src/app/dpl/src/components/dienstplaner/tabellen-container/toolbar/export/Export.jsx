import React, { useEffect, useState } from 'react';
import { TbFileExport } from 'react-icons/tb';
import CustomButton from '../../../../utils/custom_buttons/CustomButton';
import DatentypAbfrage from './DatentypAbfrage';
import { UseMounted } from '../../../../../hooks/use-mounted';
import { UseRegister } from '../../../../../hooks/use-register';
import styles from '../toolbar.module.css';

function Export({ table, title = '' }) {
  UseRegister(table?._push, table?._pull, table);
  const [abfrageDatentyp, setAbfrageDatentyp] = useState(null);
  const mounted = UseMounted();

  const hideAbfrage = (evt, setLoading) => {
    mounted && setAbfrageDatentyp(() => null);
    setLoading?.(() => false);
  };

  const exportFkt = (
    pdf = true,
    onlyMainZeitraum = false,
    checkBedarfe = true,
    withCounter = false,
    withWunsch = false,
    withColor = false
  ) => {
    if (
      table.export(
        pdf,
        onlyMainZeitraum,
        checkBedarfe,
        withCounter,
        withWunsch,
        withColor
      )
    ) {
      hideAbfrage();
    }
  };

  const createAbfrage = (evt, setLoading) => {
    evt?.stopPropagation?.();
    setAbfrageDatentyp(() => (
      <DatentypAbfrage
        exportFkt={exportFkt}
        hideAbfrage={hideAbfrage}
        showAbfrageTypen={table?.exportAbfrage || {}}
      />
    ));
    setLoading?.(() => false);
  };

  useEffect(() => {
    if (abfrageDatentyp) {
      document.body.addEventListener('click', hideAbfrage);
    }

    return () => {
      document.body.removeEventListener('click', hideAbfrage);
    };
  }, [abfrageDatentyp]);

  if (!table?.export) return null;

  return (
    <div className={styles.export_container}>
      <CustomButton
        spinner={{ show: true }}
        className="as_icon"
        clickHandler={createAbfrage}
        title={title}
      >
        <TbFileExport />
      </CustomButton>
      {abfrageDatentyp}
    </div>
  );
}

export default Export;
