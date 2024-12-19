import React, { useState, useEffect, useContext } from 'react';
import GridTemplateLayout from './GridTemplateLayout';
import HeightAdjustWrapper from '../../utils/height-adjust-wrapper/HeightAdjustWrapper';

import CustomButton from '../../utils/custom_buttons/CustomButton';

import styles from './settings-view.module.css';
import { UseRegister } from '../../../hooks/use-register';
import { isFunction } from '../../../tools/types';
import { UseMounted } from '../../../hooks/use-mounted';

import { VerteilerFastContext } from '../../../contexts/VerteilerFastProvider';

function SettingsView() {
  const { useVerteilerFastContextFields, verteiler } =
    useContext(VerteilerFastContext);
  const { isOpen } = useVerteilerFastContextFields(['isOpen']);

  const collections = verteiler?.data?.collections;
  const vorlagen = verteiler?.vorlagen;
  const grid = verteiler?.grid;
  const upadte = UseRegister(vorlagen?._push, vorlagen?._pull, vorlagen);
  const [options, setOptions] = useState([]);
  const mounted = UseMounted();

  useEffect(() => {
    mounted && setOptions(() => collections?.createOptionVals?.() || []);
  }, [verteiler, upadte, isOpen.get]);

  const onSaveLayout = (evt, setLoading) => {
    if (isFunction(grid?.updateLayout)) {
      grid.updateLayout(setLoading);
    } else {
      setLoading?.(() => false);
    }
  };

  const close = (evt, setLoading) => {
    isOpen.set(false);
    setLoading?.(() => false);
    grid?.reset?.();
  };

  const desktop = grid?.desktop;
  const tablet = grid?.tablet;
  const mobile = grid?.mobile;
  if (!isOpen.get || !verteiler?.vorlage || (!desktop && !tablet && !mobile))
    return null;

  return (
    <HeightAdjustWrapper>
      <div>
        <div className={`settings-container ${isOpen.get ? 'open' : ''}`}>
          <div className={styles.content}>
            <div className={styles.header}>
              <h3>Einstellungen</h3>
              <div className={styles.right}>
                <CustomButton
                  spinner={{ show: true }}
                  className="primary"
                  clickHandler={onSaveLayout}
                >
                  Speichern
                </CustomButton>
                <CustomButton spinner={{ show: true }} clickHandler={close}>
                  X
                </CustomButton>
              </div>
            </div>
            <div className={`${styles.block} ${styles.grid}`}>
              <h4>Grid Vorschau</h4>
              <GridTemplateLayout options={options} gridTemplate={desktop} />
              <GridTemplateLayout options={options} gridTemplate={tablet} />
              <GridTemplateLayout options={options} gridTemplate={mobile} />
            </div>
          </div>
        </div>
      </div>
    </HeightAdjustWrapper>
  );
}

export default SettingsView;
