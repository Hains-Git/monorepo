import React, { useContext } from 'react';

import styles from '../../../mitarbeiterinfo/app.module.css';
import CustomButton from '../../utils/custom-button/CustomButton';
import { VertragContext } from '../../../context/mitarbeiterinfo/VertragProvider';

type TProps = {
  children: React.ReactNode;
};

function VertragPopupWrapper({ children }: TProps) {
  const { formConfig, hide } = useContext(VertragContext);

  return (
    <div className={styles.popup_wrapper}>
      <div className={styles.popup_content}>
        <div className={styles.popup_header}>
          <h2>{formConfig?.title || 'Neuer Vertrag fuer Motsch J'}</h2>
          <CustomButton clickHandler={() => hide()}>X</CustomButton>
        </div>
        {children}
      </div>
    </div>
  );
}

export default VertragPopupWrapper;
