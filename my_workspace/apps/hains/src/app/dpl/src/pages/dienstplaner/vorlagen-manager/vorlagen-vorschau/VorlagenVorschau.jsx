import React from 'react';
import CustomButton from '../../../../components/utils/custom_buttons/CustomButton';
import VorlagenContainer from '../vorlagen-container/VorlagenContainer';
import styles from '../vorlagen_manager.module.css';

function VorlagenVorschau({
  handleNeueVorlage,
  handleBearbeiten,
  handleLoeschen,
  vorlagen,
  handleStandardChange,
  handlePositionChange
}) {
  return (
    <div>
      <div className={styles.vorlage_btn_container}>
        <CustomButton spinner={{ show: true }} clickHandler={handleNeueVorlage} title="Neue Vorlage erstellen">
          Neue Vorlage
        </CustomButton>
      </div>

      <div>
        <h3>Meine Vorlagen</h3>
        {vorlagen.map((v, i) => (
          <VorlagenContainer
            key={`${v.name}_${v.id}_${i}`}
            vorlage={v}
            handleBearbeiten={handleBearbeiten}
            handleLoeschen={handleLoeschen}
            handleStandardChange={handleStandardChange}
            handlePositionChange={handlePositionChange}
          />
        ))}
      </div>
    </div>
  );
}

export default VorlagenVorschau;
