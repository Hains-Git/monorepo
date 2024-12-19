import React, { useEffect, useState } from 'react';
import CustomButton from '../../../components/utils/custom_buttons/CustomButton';
import { UseRegister } from '../../../hooks/use-register';
import Info from '../../../components/utils/info/Info';
import styles from './screenshot.module.css';
import { UseMounted } from '../../../hooks/use-mounted';

function Screenshot({ dienstplan, user }) {
  const [showLoader, setShowLoader] = useState(false);
  const mounted = UseMounted();
  const screenshot = dienstplan?.screenshot;
  UseRegister(screenshot?._push, screenshot?._pull, screenshot);

  useEffect(() => {
    if (dienstplan && user && screenshot) {
      setShowLoader(() => true);
      screenshot.getScreenshot(() => mounted && setShowLoader(() => false));
    }
  }, [screenshot, user, dienstplan]);

  if (!screenshot) return null;
  return (
    <div className={styles.screenshot_page}>
      <Info parent={screenshot} />
      <div className={styles.screenshot_datetime}>
        <input
          type="datetime-local"
          pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
          onChange={(evt) => {
            evt.stopPropagation();
            screenshot.setTime(evt.target.value);
          }}
          value={screenshot.time}
        />
        <CustomButton
          title="Screenshot laden"
          spinner={{ show: true, default: !!showLoader }}
          clickHandler={(evt, setLoading) => {
            evt.stopPropagation();
            screenshot.getScreenshot(() => setLoading?.(() => false));
          }}
        >
          Laden
        </CustomButton>
      </div>
      <div className={styles.screenshot_tables}>
        {screenshot.tables.sort((a, b) => a.props.sort - b.props.sort)}
      </div>
    </div>
  );
}

export default Screenshot;
