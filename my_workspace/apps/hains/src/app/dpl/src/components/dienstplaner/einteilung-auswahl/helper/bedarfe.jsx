import React from 'react';
import { UseTooltip } from '../../../../hooks/use-tooltip';
import { possibleConflict } from '../../../../styles/basic';
import styles from '../einteilungauswahl.module.css';

function Bedarfe({ feld }) {
  const [onOverBedarf, onOutBedarf] = UseTooltip('Mindest-Bedarf');

  const [onOverBedarfRest, onOutBedarfRest] = UseTooltip(
    'Optionaler Zusatz-Bedarf'
  );

  if (!feld?.getBedarf || !feld?.getBedarfOpt) return null;
  const min = feld.getBedarf();
  return (
    <>
      <td
        onMouseOver={onOverBedarf}
        onMouseOut={onOutBedarf}
        className={styles.counter_td}
      >
        <span
          className={`${styles.counter} ${min > 0 ? possibleConflict : ''}`.trim()}
        >
          {min}
        </span>
      </td>
      <td
        onMouseOver={onOverBedarfRest}
        onMouseOut={onOutBedarfRest}
        className={styles.counter_td}
      >
        <span className={styles.counter}>{feld.getBedarfOpt()}</span>
      </td>
    </>
  );
}

export default Bedarfe;
