import React from 'react';
import styles from './app.module.css';
import CustomButton from '../components/utils/custom-button/CustomButton';
import { History } from './types';
import HistoryItem from './HistoryItem';
import { numericLocaleCompare } from '../helper/util';

function HistoryPopup({
  history,
  label,
  closeHistory
}: {
  history: History[];
  label: string;
  closeHistory: () => void;
}) {
  if (!history?.length) return null;
  return (
    <div className={styles.popup}>
      <div>
        {label}
        <CustomButton clickHandler={closeHistory}>X</CustomButton>
      </div>
      <div>
        {history
          .sort((a, b) => numericLocaleCompare(b.Bearbeitet, a.Bearbeitet))
          .map((h, i) => (
            <HistoryItem key={`history-item-${i}`} history={h} />
          ))}
      </div>
    </div>
  );
}

export default HistoryPopup;
