import React, { useEffect, useState } from 'react';
import { UseRegisterKey } from '../../../hooks/use-register';
import StringListing from '../../utils/string-listing/StringListing';
import { UseMounted } from '../../../hooks/use-mounted';
import styles from './alert.module.css';
import CustomButton from '../../utils/custom_buttons/CustomButton';

function Alert({ dienstplan }) {
  const update = UseRegisterKey(
    'warning',
    dienstplan?.push,
    dienstplan?.pull,
    dienstplan
  );
  const [warning, setWarning] = useState('');
  const mounted = UseMounted();

  const reset = (evt, setLoading) => {
    mounted && setWarning(() => '');
    setLoading?.(() => false);
  };

  useEffect(() => {
    setWarning(() => mounted && dienstplan?.warning);
  }, [update, dienstplan]);

  useEffect(() => {
    if (warning && mounted) {
      setTimeout(reset, 30000);
    }
  }, [warning]);

  return warning ? (
    <div className={styles.alert}>
      <div className={styles.msg}>
        <StringListing str={warning} seperator="\n" />
      </div>
      <CustomButton spinner={{ show: true }} clickHandler={reset}>
        X
      </CustomButton>
    </div>
  ) : null;
}

export default Alert;
