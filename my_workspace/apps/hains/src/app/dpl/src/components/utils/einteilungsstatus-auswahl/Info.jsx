import React from 'react';
import CustomButton from '../custom_buttons/CustomButton';
import { UseTooltip } from '../../../hooks/use-tooltip';
import StandardSelectField from '../standard-select-field/StandardSelectField';
import { reply, toggleOn, toggleOff } from './icons';
import { UseEinteilungsstatusAuswahlInfo } from '../../../hooks/use-einteilungsstatus-auswahl';
import HeightAdjustWrapper from '../height-adjust-wrapper/HeightAdjustWrapper';
import Search from '../search/Search';
import styles from './einteilungsstatus-auswahl.module.css';
import { isObject } from '../../../tools/types';
import { nonBreakSpace } from '../../../tools/htmlentities';
import Spinner from '../spinner/Spinner';

const countEinteilungen = (auswahl) => {
  const result = {
    nichtVeroeffentlicht: 0,
    countMehrfacheEinteilungen: 0
  };
  if (isObject(auswahl?.einteilungen)) {
    for (const key in auswahl.einteilungen) {
      const isPublic = auswahl.einteilungen[key]?.einteilungsstatus?.public;
      if (!isPublic) {
        const einteilungenCount =
          auswahl.einteilungen[key]?.einteilungen?.length || 0;
        result.nichtVeroeffentlicht += einteilungenCount;
      }
      const countMehrfacheEinteilungen =
        auswahl.einteilungen[key]?.mehrfacheEnteilungen?.einteilungen?.length ||
        0;
      result.countMehrfacheEinteilungen += countMehrfacheEinteilungen;
    }
  }
  result.nichtVeroeffentlicht = result.nichtVeroeffentlicht.toString();
  result.countMehrfacheEinteilungen =
    result.countMehrfacheEinteilungen.toString();
  return result;
};

function Info({ auswahl, itemHandler }) {
  const {
    showInfo,
    setShowInfo,
    einteilungen,
    onlyDoubles,
    toggleOnlyDoubles,
    showLoader
  } = UseEinteilungsstatusAuswahlInfo(auswahl);

  const { nichtVeroeffentlicht, countMehrfacheEinteilungen } =
    countEinteilungen(auswahl);

  const [onOver, onOut] = UseTooltip(
    `Nicht veröffentlichte Einteilungen: ${nichtVeroeffentlicht}\n
     Mehrfache Einteilungen: ${countMehrfacheEinteilungen}`
  );

  const statusClass = `status_${auswahl?.statusLetter?.toLowerCase() || ''}`;
  const statusName = auswahl?.einteilungsstatus?.name || '';
  return (
    showInfo && (
      <HeightAdjustWrapper className="einteilungsstatus-auswahl-einteilungen-container">
        <div className={styles.content}>
          <div className={styles.head}>
            <h3>Einteilungsstatusauswahl</h3>

            <div className={styles.head_middle}>
              <div className={styles.head_auswahl}>
                <div
                  onMouseOver={onOver}
                  onMouseOut={onOut}
                  className={styles.status_auswahl_div}
                >
                  <p>Einteilungsstatus ändern zu {nonBreakSpace}</p>
                  <StandardSelectField
                    className={`${statusClass ? styles[statusClass] : ''}`}
                    name=""
                    readOnly
                    options={auswahl.einteilungsstatuse}
                    optionKey="name"
                    itemHandler={itemHandler}
                    start={auswahl.einteilungsstatusStart}
                    title="Wähle den Einteilungsstatus für deine Einteilungen aus!"
                  />
                </div>
                <CustomButton
                  spinner={{ show: true }}
                  clickHandler={(e, setLoading) => {
                    auswahl.publishAllVisible(setLoading);
                  }}
                  title={`Ändert den Status aller angezeigten zu ${statusName}.`}
                  className="primary as_icon"
                >
                  {reply}
                </CustomButton>
              </div>
              <CustomButton
                clickHandler={toggleOnlyDoubles}
                title={`Toggle angezeigte Einteilungen (Status: ${
                  onlyDoubles
                    ? 'Nur doppelte Einteilungen'
                    : 'Alle Einteilungen'
                })`}
                className="primary as_icon"
              >
                {onlyDoubles ? toggleOn : toggleOff}
              </CustomButton>
              <Search
                className={styles.search_container}
                search={auswahl?.search}
                groups={auswahl?.searchGroups}
                startInput={auswahl?.mainSearchValue || ''}
              />
            </div>

            <CustomButton
              clickHandler={(evt, setLoading) => {
                setShowInfo(false);
                auswahl?.setInfoFkt?.(false);
                setLoading?.(() => false);
              }}
              spinner={{ show: true }}
              title="Schließe die Info"
            >
              X
            </CustomButton>
          </div>
          {showLoader ? (
            <Spinner showText text="... Daten werden überprüft ..." />
          ) : (
            <div className={styles.body}>{einteilungen}</div>
          )}
        </div>
      </HeightAdjustWrapper>
    )
  );
}

export default Info;
