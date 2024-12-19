import React from 'react';
import { History } from './types';
import styles from './app.module.css';

const getDateTime = (value: string) => {
  const [date, time] = value.split('T');
  const timeCleaned = time.split('.')[0];
  return `${new Date(date).toLocaleDateString()}, ${timeCleaned} Uhr`;
};

function HistoryItem({ history }: { history: History }) {
  const [show, setShow] = React.useState(false);
  return (
    <div>
      <h3 onClick={() => setShow((cur) => !cur)}>
        {history.PepDienst} {getDateTime(history.Bearbeitet)} {history.Nutzer}
      </h3>
      {show ? (
        <div className={styles.history_dropdown}>
          {Object.entries(history).map(([key, value], j) => (
            <p key={`history-element-${j}`}>
              {key}: {key === 'Bearbeitet' ? getDateTime(value) : value}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default HistoryItem;
