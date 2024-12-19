import React, { ReactElement, useState } from 'react';
import { FaCloudDownloadAlt } from 'react-icons/fa';
import styles from './date_input.module.css';
import { addDays, getDateFromJSDate, today } from '../../../helper/dates';
import { UseMounted } from '../../../hooks/use-mounted';
import CustomButton from '../custom-button/CustomButton';

export type Dates = {
  von: string;
  bis: string;
};

export type GetData = (dates: Dates, finishLoading: () => void) => void;

const defaultLabel = <FaCloudDownloadAlt title="Laden" />;

function DateInput({
  getData,
  diffDays,
  label = defaultLabel,
  withButton = true,
  interval = false
}: {
  getData: GetData;
  label?: ReactElement | string;
  withButton?: boolean;
  interval?: boolean;
  diffDays?: number;
}) {
  const [von, setVon] = useState(today());
  const [bis, setBis] = useState(today());
  const [showLoader, setShowLoader] = useState(false);
  const mounted = UseMounted();

  const finishLoading = () => {
    mounted && setShowLoader(() => false);
  };

  return (
    <form
      className={styles.date}
      onSubmit={(evt) => {
        evt.preventDefault();
        setShowLoader(() => true);
        getData({ von, bis }, () => {
          finishLoading();
        });
      }}
    >
      <input
        type="date"
        value={von}
        onChange={(evt) => {
          const newVon = evt.target.value;
          setVon(() => newVon);
          if (!withButton) {
            setShowLoader(() => true);
            getData(
              { von: newVon, bis: interval ? bis : newVon },
              finishLoading
            );
          }
        }}
        min={diffDays ? getDateFromJSDate(addDays(bis, -diffDays)) : undefined}
        max={interval ? bis : undefined}
      />
      {interval ? (
        <input
          type="date"
          value={bis}
          onChange={(evt) => {
            const newBis = evt.target.value;
            setBis(() => newBis);
            if (!withButton) {
              setShowLoader(() => true);
              getData({ von, bis: newBis }, finishLoading);
            }
          }}
          min={von}
          max={diffDays ? getDateFromJSDate(addDays(von, diffDays)) : undefined}
        />
      ) : null}
      {withButton && (
        <CustomButton
          spinner={{ show: true, default: !!showLoader }}
          type="submit"
        >
          {label}
        </CustomButton>
      )}
    </form>
  );
}

export default DateInput;
