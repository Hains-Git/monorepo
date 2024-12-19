import React, { useEffect, useRef, useState } from 'react';
import { MdOutlineSync } from 'react-icons/md';
import styles from '../contentcontainer.module.css';
import { UseRegisterKey } from '../../../../hooks/use-register';
import { UseMounted } from '../../../../hooks/use-mounted';
import { isFunction, isObject } from '../../../../tools/types';
import CustomButton from '../../../utils/custom_buttons/CustomButton';
import { getFullDate } from '../../../../tools/dates';

function EinteilungenCheck({ antraege, formDataState }) {
  const [disable, setDisable] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [start, setStart] = useState(formDataState.start);
  const [ende, setEnde] = useState(formDataState.ende);
  const mounted = UseMounted();
  const einteilungen_select_div = useRef();
  UseRegisterKey('einteilungenToReplace', antraege.push, antraege.pull);

  const finishLoading = () => {
    if (mounted) {
      setShowLoader(() => false);
      setDisable(() => false);
    }
  };

  useEffect(() => {
    if (isFunction(antraege?.getEinteilungen)) {
      if (formDataState.start === start && formDataState.ende === ende) {
        return;
      }
      setShowLoader(() => true);
      setDisable(() => true);
      antraege.getEinteilungen(formDataState, finishLoading);
      setStart(formDataState.start);
      setEnde(formDataState.ende);
    } else {
      finishLoading();
    }
    return () => {
      // antraege?.resetEinteilungen?.();
    };
  }, [formDataState]);

  const onChangeDienst = (e) => {
    const _date = e.target.name.split('_')[1];
    antraege.updateEinteilungenForDates(_date, e.target.value);
  };

  const einteilungenToReplace = antraege?.einteilungenToReplace;
  const einteilungenToCreateForDates = antraege?.einteilungenToCreateForDates;

  return (
    <div ref={einteilungen_select_div} className={styles.container_einteilung}>
      <p>
        Einteilungen
        <span>
          <CustomButton
            disable={antraege?.loading}
            spinner={{ show: true, default: !!showLoader }}
            clickHandler={(e, setLoading) => {
              if (disable || !isFunction(antraege?.getEinteilungen)) return;
              setDisable(() => true);
              antraege.getEinteilungen(formDataState, () => {
                setLoading(false);
                finishLoading();
              });
            }}
          >
            <MdOutlineSync />
          </CustomButton>
        </span>
      </p>
      {isObject(einteilungenToReplace)
        ? Object.keys(einteilungenToReplace).map((date) => {
            const dataObj = einteilungenToReplace[date];
            const holiday = dataObj.holiday;
            const holiday_day = dataObj?.feiertag?.name || '';
            return (
              <div key={date} className={styles.einteilung_content}>
                <p
                  title={holiday_day}
                  style={{ color: holiday ? 'gray' : 'initial' }}
                >
                  <span>{dataObj.week_day}.</span>
                  <span>{getFullDate(date)}</span>
                  {dataObj.select.length > 2 ? '*' : ''}
                </p>
                <select
                  onChange={(e) => onChangeDienst(e)}
                  name={`replace-dienst-for-date_${date}`}
                  className={styles.einteilung_select}
                  value={einteilungenToCreateForDates?.[date]?.dienst_id || ''}
                >
                  {dataObj.select.map((einteilung) => {
                    return (
                      <option
                        key={`${date}-${einteilung.po_dienst_id}`}
                        value={einteilung.po_dienst_id}
                      >
                        {einteilung.planname}
                      </option>
                    );
                  })}
                </select>
              </div>
            );
          })
        : null}
    </div>
  );
}

export default EinteilungenCheck;
