import { useState, useEffect } from 'react';
import styles from '../urlaubsliste.module.css';
import Block from './Block';
import CheckboxList from './CheckboxList';
import CustomButton from '../../utils/custom_buttons/CustomButton';
import HeightAdjustWrapper from '../../utils/height-adjust-wrapper/HeightAdjustWrapper';

import { UseRegisterKey } from '../../../hooks/use-register';
import Counter from './Counter';
import CounterList from './CounterList';

function prepareObj(arr) {
  const columnObj = arr.reduce((prevVal, curVal, index) => {
    if (!prevVal[index]) {
      prevVal[curVal] = {
        id: curVal,
        name: curVal
      };
    }
    return prevVal;
  }, {});
  return columnObj;
}

function SettingsOverlay({ tablemodel, urlaubsliste }) {
  const initialVisibleColumns = urlaubsliste?.allCustomColumns;
  const columnObj = prepareObj(initialVisibleColumns);
  const visibleColumns = urlaubsliste?.settings?.visible_columns;

  const teamObj = urlaubsliste.team;
  const teamIds = urlaubsliste?.settings?.visible_team_ids;

  const isSettingsOverlayOpen = tablemodel.isSettingsOverlayOpen;

  UseRegisterKey(
    'toggleSettingsOverlay',
    tablemodel.push,
    tablemodel.pull,
    tablemodel
  );

  const handleClick = (evt, setLoading) => {
    evt.stopPropagation();
    tablemodel.saveSettings(setLoading);
  };

  if (!isSettingsOverlayOpen) return null;
  return (
    <HeightAdjustWrapper>
      <div className={styles.overlay}>
        <div className={styles.buttons}>
          <CustomButton
            clickHandler={() => {
              // setIsOverlayOpen(false);
              tablemodel.toggleSettings();
            }}
          >
            X
          </CustomButton>
        </div>
        <Block headline="Counter">
          <Counter tablemodel={tablemodel} urlaubsliste={urlaubsliste} />
          <CounterList tablemodel={tablemodel} urlaubsliste={urlaubsliste} />
        </Block>
        <Block>
          <div className={styles.buttons}>
            <CustomButton
              spinner={{ show: true, color: '#fff' }}
              clickHandler={handleClick}
              className="primary"
            >
              Speichern
            </CustomButton>
          </div>
          <Block headline="Teams:">
            <CheckboxList
              dataObj={teamObj}
              values={teamIds}
              name="visibleTeamIds"
              tablemodel={tablemodel}
            />
          </Block>
          <Block headline="Spalten:">
            <CheckboxList
              dataObj={columnObj}
              values={visibleColumns}
              name="visibleColumns"
              tablemodel={tablemodel}
            />
          </Block>
        </Block>
      </div>
    </HeightAdjustWrapper>
  );
}

export default SettingsOverlay;
