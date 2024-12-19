import React from 'react';
import CustomButton from '../../../../../components/utils/custom_buttons/CustomButton';
import styles from '../../vorlagen_manager.module.css';

function AuswahlContainer({
  render,
  handleAllesAbwaehlen,
  handleAllesAuswaehlen
}) {
  return (
    <div className="vorlage-dienste-container">
      <div className={styles.vorlage_btn_container}>
        <CustomButton clickHandler={handleAllesAuswaehlen}>
          Alle auswählen
        </CustomButton>
        <CustomButton clickHandler={handleAllesAbwaehlen}>
          Alle abwählen
        </CustomButton>
      </div>
      <div className="vorlage-dienste-row">{render()}</div>
    </div>
  );
}

export default AuswahlContainer;
