import React, { useEffect, useState, useContext } from 'react';
import styles from './vorlagen.module.css';
import HeightAdjustWrapper from '../../utils/height-adjust-wrapper/HeightAdjustWrapper';
import StandardSelectField from '../../utils/standard-select-field/StandardSelectField';
import { UseRegister } from '../../../hooks/use-register';
import Vorlage from './Vorlage';
import CustomButton from '../../utils/custom_buttons/CustomButton';

import { VerteilerFastContext } from '../../../contexts/VerteilerFastProvider';

function Vorlagen() {
  const { useVerteilerFastContextFields, verteiler } =
    useContext(VerteilerFastContext);
  const { showVorlagen } = useVerteilerFastContextFields(['showVorlagen']);

  const vorlagen = showVorlagen.get && verteiler?.vorlagen;
  const update = UseRegister(vorlagen?._push, vorlagen?._pull, vorlagen);
  const [vorlage, setVorlage] = useState(false);

  useEffect(() => {
    setVorlage(() => vorlagen?.vorlage);
  }, [vorlagen, update]);

  const itemHandler = (item) => {
    item?.fkt?.();
  };

  if (!vorlagen?.vorlagen) return null;
  return (
    <HeightAdjustWrapper className="einteilungsstatus-auswahl-einteilungen-container">
      <div className={styles.content}>
        <div className={styles.head}>
          <div>
            <h3>Vorlagen</h3>
            <StandardSelectField
              name="Vorlage"
              readOnly
              options={vorlagen.vorlagen}
              optionKey="name"
              itemHandler={itemHandler}
              start={vorlagen.vorlageIndex}
              title="Wähle den Einteilungsstatus für deine Einteilungen aus!"
            />
            <CustomButton
              spinner={{ show: true }}
              clickHandler={(evt, setLoading) => {
                showVorlagen.set(false);
                setLoading?.(() => false);
              }}
            >
              X
            </CustomButton>
          </div>
        </div>
        {vorlage ? (
          <Vorlage vorlage={vorlage} />
        ) : (
          <div className={styles.body}>Keine Vorlage ausgewählt</div>
        )}
      </div>
    </HeightAdjustWrapper>
  );
}

export default Vorlagen;
