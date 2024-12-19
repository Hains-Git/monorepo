import React from 'react';
import CustomButton from '../../../../../components/utils/custom_buttons/CustomButton';
import AuswahlContainer from '../auswahl-container/AuswahlContainer';
import WeitereDienste from './WeitereDienste';
import SaveButton from '../../../../../components/utils/custom_buttons/SaveButton';
import styles from '../../vorlagen_manager.module.css';

function DiensteContainer({
  handleSpeichern,
  handleAbbrechen,
  abbrechen,
  speichern = true,
  handleAllesAuswaehlen,
  handleAllesAbwaehlen,
  team,
  renderDienste
}) {
  return (
    <div className="vorlage-dienste-container-container">
      <AuswahlContainer
        render={() => renderDienste(true)}
        handleAllesAbwaehlen={(evt, setLoading) => {
          handleAllesAbwaehlen(true);
          setLoading?.(() => false);
        }}
        handleAllesAuswaehlen={(evt, setLoading) => {
          handleAllesAuswaehlen(true);
          setLoading?.(() => false);
        }}
      />

      {team ? (
        <WeitereDienste
          renderDienste={() => renderDienste(false)}
          handleAllesAbwaehlen={(evt, setLoading) => {
            handleAllesAbwaehlen(false);
            setLoading?.(() => false);
          }}
          handleAllesAuswaehlen={(evt, setLoading) => {
            handleAllesAuswaehlen(false);
            setLoading?.(() => false);
          }}
          label="Weitere Dienste"
        />
      ) : null}

      <div className="save-cancel">
        <hr />
        <div className={styles.vorlage_btn_container}>
          {speichern ? (
            <SaveButton
              spinner={{ show: true }}
              clickHandler={handleSpeichern}
            />
          ) : null}
          {abbrechen ? (
            <CustomButton
              spinner={{ show: true }}
              clickHandler={handleAbbrechen}
            >
              Abbrechen
            </CustomButton>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default DiensteContainer;
