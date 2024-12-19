import React, { ReactElement, useState } from 'react';
import { FaCloudDownloadAlt } from 'react-icons/fa';
import styles from './datenbank.module.css';
import { Reason } from '../../helper/ts_types';
import { returnError } from '../../helper/hains';
import Loader from '../utils/loader/Loader';
import CustomButton from '../utils/custom-button/CustomButton';

const currentYear = new Date().getFullYear();

const options = Array.from(Array(7)).reduce((acc: ReactElement[], _, i) => {
  const year = currentYear + i - 2;
  acc.push(
    <option key={year} value={year}>
      {year}
    </option>
  );
  return acc;
}, []);

function Preview({
  route,
  hainsOAuth,
  setData
}: {
  route: string;
  hainsOAuth: any;
  setData: (res: any) => void;
}) {
  const [year, setYear] = useState(new Date().getFullYear());
  const [showLoader, setShowLoader] = useState(false);

  const loadData = () => {
    if (!hainsOAuth?.api) return;
    setShowLoader(() => true);
    setData(false);
    hainsOAuth.api(
      route,
      'get',
      { year },
      (res: any) => {
        setData(res);
        setShowLoader(() => false);
      },
      (err: Reason) => {
        setShowLoader(() => false);
        returnError(err);
      }
    );
  };

  return (
    <div className={styles.preview}>
      <select
        value={year}
        onChange={(evt) => setYear(() => parseInt(evt.target.value, 10))}
      >
        {options}
      </select>
      <CustomButton clickHandler={loadData}>
        {showLoader ? (
          <Loader className={styles.date_loader} />
        ) : (
          <FaCloudDownloadAlt title="Vorschau Laden" />
        )}
      </CustomButton>
    </div>
  );
}

export default Preview;
