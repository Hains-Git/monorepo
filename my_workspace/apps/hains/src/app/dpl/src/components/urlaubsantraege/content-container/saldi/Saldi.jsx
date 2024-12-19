import React, { useEffect, useState } from 'react';
import { MdOutlineSync } from 'react-icons/md';
import { UseRegisterKey } from '../../../../hooks/use-register';
import { isFunction, isObject } from '../../../../tools/types';
import { getFullDate, getWeekdayShort } from '../../../../tools/dates';
import Saldo from './Saldo';
import styles from '../contentcontainer.module.css';
import { nonBreakSpace } from '../../../../tools/htmlentities';
import CustomButton from '../../../utils/custom_buttons/CustomButton';
import { UseMounted } from '../../../../hooks/use-mounted';

function Saldi({ formDataState, antraege, getMitarbeiterId = () => 0 }) {
  const [showLoader, setShowLoader] = useState(false);
  const [disable, setDisable] = useState(false);
  const [start, setStart] = useState(formDataState.start);
  const [ende, setEnde] = useState(formDataState.ende);

  const mounted = UseMounted();
  UseRegisterKey('updateSaldi', antraege.push, antraege.pull);

  const finishLoading = () => {
    if (mounted) {
      setShowLoader(() => false);
      setDisable(() => false);
    }
  };

  useEffect(() => {
    antraege?.resetSalid?.();
    antraege?.resetEinteilungen?.();
  }, []);

  useEffect(() => {
    if (formDataState.start === start && formDataState.ende === ende) {
      return;
    }

    if (isFunction(antraege?.getSaldi)) {
      setShowLoader(() => true);
      setDisable(() => true);
      antraege.getSaldi(formDataState, finishLoading);
      setStart(formDataState.start);
      setEnde(formDataState.ende);
    } else {
      finishLoading();
    }
    return () => {
      // antraege?.resetSalid?.();
    };
  }, [formDataState]);

  const createTable = () => {
    if (!isObject(antraege?.saldi)) return null;
    console.log('antraege.response', antraege.saldiResponse);
    const head = [<th key="head-default">{nonBreakSpace}</th>];
    const bodyRows = [];
    const body = [];
    for (const tag in antraege.saldi) {
      const headLabel = `${getWeekdayShort(tag)} ${getFullDate(tag)}`;
      head.push(
        <th key={`head-label-${tag}`}>
          <div>
            <span>{headLabel}</span>
          </div>
        </th>
      );
      let i = 0;
      for (const teamId in antraege.saldi[tag]) {
        const { saldo, title, label } = antraege.getSaldo(teamId, tag);
        if (!bodyRows[i]) {
          bodyRows[i] = [
            <th
              key={`body-label-${teamId}`}
              onClick={() => {
                const originalSaldi = antraege?.saldiResponse?.saldi || {};
                console.log(
                  'Kompletter Datensatz aus API',
                  antraege?.saldiResponse
                );
                Object.values(originalSaldi).forEach((item) => {
                  console.log('Team', item?.team?.name, item.dates);
                });
              }}
            >
              {label}
            </th>
          ];
          body.push(<tr key={`body-row-${teamId}`}>{bodyRows[i]}</tr>);
        }
        bodyRows[i].push(
          <Saldo key={`body-${teamId}-${tag}`} saldo={saldo} title={title} />
        );
        i++;
      }
    }

    if (!body.length) return null;
    return (
      <table className={styles.urlaubssaldi_table}>
        <colgroup>
          <col />
        </colgroup>
        <thead>
          <tr>{head}</tr>
        </thead>
        <tbody>{body}</tbody>
      </table>
    );
  };

  const getInfos = () => {
    const mitarbeiterId = getMitarbeiterId();
    const rotationen = antraege?.getRotationenMsg?.(mitarbeiterId) || 'Keine';
    const teams = antraege?.getTeamMsg?.(mitarbeiterId) || 'Keine';
    return (
      <div>
        <p>Rotationen: {rotationen}</p>
        <p>Teams: {teams}</p>
      </div>
    );
  };

  return (
    <div className={styles.urlaubssaldi}>
      <p>
        {'Urlaubssaldi '}
        <span>
          <CustomButton
            disable={disable}
            spinner={{ show: true, default: !!showLoader }}
            clickHandler={(e, setLoading) => {
              if (disable || !isFunction(antraege?.getSaldi)) return;
              setDisable(() => true);
              setShowLoader(() => true);
              antraege.getSaldi(formDataState, () => {
                setLoading(false);
                finishLoading();
              });
            }}
          >
            <MdOutlineSync />
          </CustomButton>
        </span>
      </p>

      {showLoader ? null : (
        <>
          {getInfos()}
          <div className={styles.urlaubssaldi_table_container}>
            {createTable()}
          </div>
        </>
      )}
    </div>
  );
}

export default Saldi;
