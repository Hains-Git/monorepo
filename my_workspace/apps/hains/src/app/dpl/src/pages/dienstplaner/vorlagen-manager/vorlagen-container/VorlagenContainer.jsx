import React, { useEffect, useState } from 'react';
import { deleteBtnClass } from '../../../../styles/basic';
import DeleteButton from '../../../../components/utils/custom_buttons/DeleteButton';
import EditButton from '../../../../components/utils/custom_buttons/EditButton';
import { UseDropdown } from '../../../../hooks/use-dropdown';
import styles from '../vorlagen_manager.module.css';

function VorlagenContainer({
  handleBearbeiten,
  handleLoeschen,
  vorlage,
  handleStandardChange,
  handlePositionChange
}) {
  const { show, caret, handleClick } = UseDropdown(false, false);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    setPosition(() => vorlage?.position || 0);
  }, [vorlage?.position]);

  const createDiensteInfo = () => {
    const info = [];
    vorlage.getDienste((dienst) => {
      info.push(dienst.planname);
    });

    return info.sort();
  };

  const createExtraDiensteInfo = () => {
    const info = [];
    vorlage.getExtraDienste((dienst) => {
      info.push(dienst.planname);
    });

    return info.sort();
  };

  const clickBearbeiten = (evt, setLoading) => {
    handleBearbeiten(vorlage);
    setLoading?.(() => false);
  };

  const clickLoeschen = (evt, setLoading) => {
    handleLoeschen(vorlage);
    setLoading?.(() => false);
  };

  const clickChange = (evt) => {
    handleStandardChange(evt, vorlage);
  };

  return (
    <div className={styles.vorlage_container}>
      <div className={styles.vorlage_item}>
        <div onClick={handleClick}>
          <h3>{vorlage.name}</h3>
          <h4>
            ID:
            {vorlage.id} <span className="caret">{caret}</span>
          </h4>
        </div>
        {show && (
          <>
            {vorlage.is_public && (
              <>
                <p>Öffentliche Vorlage</p>
                {vorlage.publishable && (
                  <>
                    <p>{`Veröffentlichen: ${vorlage.publish.join(', ')}`}</p>
                    <p>
                      {`Veröffentlichungspfad: ${vorlage.veroeffentlichungspfad}`}
                    </p>
                    <div>
                      <p>Datei-Struktur: </p>
                      <p>{vorlage.filepattern}</p>
                    </div>
                  </>
                )}
                {vorlage.hasExtraDienste && (
                  <div>
                    <p>Zusatzdienste für die zu veröffentlichende PDF:</p>
                    <p>{createExtraDiensteInfo().join(', ')}</p>
                  </div>
                )}
                <br />
              </>
            )}
            <p>{`Startansicht: ${vorlage.ansicht}`}</p>
            <div>
              <p>Mitarbeiter-Funktionen:</p>
              <p>{vorlage.funktionenNamen}</p>
            </div>
            <div>
              <p>{`Dienste-Team: ${vorlage.teamName}`}</p>
              <p>Dienste:</p>
              <p>{createDiensteInfo().join(', ')}</p>
            </div>
          </>
        )}
        {vorlage.id > 0 && (
          <label
            htmlFor={`standard-vorlage-radio-${vorlage.id}`}
            className={styles.standard_vorlage_radio_container}
          >
            Standard-Vorlage
            <input
              type="radio"
              id={`standard-vorlage-radio-${vorlage.id}`}
              onChange={clickChange}
              name="standard-vorlage-radio"
              checked={vorlage.standard}
              value={vorlage.id}
            />
          </label>
        )}
        {vorlage?.editable && (
          <label className={styles.position}>
            Position:{' '}
            <input
              type="number"
              step={1}
              min={0}
              value={position}
              onChange={(evt) => {
                setPosition(() => evt.target.value);
              }}
              onBlur={() => handlePositionChange(position, vorlage)}
            />
          </label>
        )}
      </div>

      {vorlage?.editable && (
        <div className={styles.vorlage_btn_container}>
          <EditButton spinner={{ show: true }} clickHandler={clickBearbeiten} />
          <DeleteButton
            spinner={{ show: true }}
            className={deleteBtnClass}
            clickHandler={clickLoeschen}
          />
        </div>
      )}
    </div>
  );
}

export default VorlagenContainer;
