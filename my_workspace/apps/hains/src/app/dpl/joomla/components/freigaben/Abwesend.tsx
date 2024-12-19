import React, { useState } from 'react';
import { TableData } from '../utils/table/types/table';
import { UseMounted } from '../../hooks/use-mounted';
import Loader from '../utils/loader/Loader';
import styles from './freigaben.module.css';

function Abwesend({
  row,
  sendAbwesend
}: {
  row: TableData;
  sendAbwesend: (row: TableData, finishLoading: () => void) => void;
}) {
  const [showLoader, setShowLoader] = useState(false);
  const mounted = UseMounted();

  const abwesend = 'abwesend' in row && !!row.abwesend;
  return showLoader ? (
    <Loader className={styles.abwesend_loader} />
  ) : (
    <input
      type="checkbox"
      name="abwesend"
      checked={abwesend}
      onChange={() => {
        setShowLoader(() => true);
        sendAbwesend(row, () => {
          mounted && setShowLoader(() => false);
        });
      }}
    />
  );
}

export default Abwesend;
