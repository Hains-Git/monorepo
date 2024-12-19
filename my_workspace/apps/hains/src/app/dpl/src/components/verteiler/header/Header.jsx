import React, { useState, useMemo, useContext } from 'react';
import { IconContext } from 'react-icons';
import {
  MdGridView,
  MdPictureAsPdf,
  MdToggleOff,
  MdToggleOn
} from 'react-icons/md';
import { PiFileCsvFill } from 'react-icons/pi';
import { FaUserCog, FaInfo } from 'react-icons/fa';
import { TbDatabaseExclamation, TbDatabaseExport } from 'react-icons/tb';

import Calendar from '../../utils/calendar/Calendar';
import DienstplanAuswahl from '../../utils/dienstplan-auswahl/DienstplanAuswahl';
import { formatDate } from '../../../tools/dates';
import Zoom from '../../utils/zoom/Zoom';
import PageHeader from '../../page-header/PageHeader';

import CustomButton from '../../utils/custom_buttons/CustomButton';

import EinteilungsstatusAuswahl from '../../utils/einteilungsstatus-auswahl/EinteilungsstatusAuswahl';
import VorlageAuswahlButton from '../vorlagen/VorlageAuswahlButton';
import { UseDropdown } from '../../../hooks/use-dropdown';
import styles from './header.module.css';
import MagicBtn from '../../utils/magic-einteilungen/MagicBtn';
import ToggleSwitch from '../../utils/toggle-switch/ToggleSwitch';

import { VerteilerFastContext } from '../../../contexts/VerteilerFastProvider';
import { UseRegisterKey } from '../../../hooks/use-register';

function Header() {
  const { useVerteilerFastContextFields, verteiler, user } =
    useContext(VerteilerFastContext);
  const { showInfoTable, isOpen, showUserSettings, showVorlagen } =
    useVerteilerFastContextFields([
      'showInfoTable',
      'isOpen',
      'showUserSettings',
      'showVorlagen'
    ]);

  const iconSize = '1em';
  const calendar = verteiler.calendar;
  const [showCalender, setShowCalender] = useState(true);
  const pdfOrCsv = UseDropdown(true, true);
  const showPdfOrCsv = pdfOrCsv.show;
  const handleClickPdfOrCsv = pdfOrCsv.handleClick;
  const data = verteiler?.data;
  const allEinteilungenPublic = data?.allEinteilungenPublic;

  UseRegisterKey('emptyWorkSpots', verteiler?.push, verteiler?.pull, verteiler);

  const toggleView = (evt, setLoading) => {
    const button = evt.target.closest('.toggle-view-btn');
    if (button.id === 'grid') {
      isOpen.set(!isOpen.get);
      showInfoTable.set(false);
      showVorlagen.set(false);
      showUserSettings.set(false);
    }
    if (button.id === 'info') {
      showInfoTable.set(!showInfoTable.get);
      isOpen.set(false);
      showVorlagen.set(false);
      showUserSettings.set(false);
    }
    if (button.id === 'user-settings') {
      showUserSettings.set(!showUserSettings.get);
      isOpen.set(false);
      showInfoTable.set(false);
      showVorlagen.set(false);
    }
    if (button.id === 'vorlagen-btn') {
      showVorlagen.set(!showVorlagen.get);
      isOpen.set(false);
      showInfoTable.set(false);
      showUserSettings.set(false);
    }
    setLoading?.(() => false);
  };

  const createPdf = (evt, setLoading) => {
    evt.stopPropagation();
    verteiler?.createPdf?.(true);
    setLoading?.(() => false);
  };

  const createCSV = (evt, setLoading) => {
    evt.stopPropagation();
    verteiler?.downloadCSV?.(true);
    setLoading?.(() => false);
  };

  const publish = (evt, setLoading) => {
    evt.stopPropagation();
    verteiler?.publish?.(() => setLoading?.(() => false));
  };

  const changeSize = (evt, setLoading) => {
    evt.stopPropagation();
    let button = evt.target;
    while (button && button.tagName !== 'BUTTON') {
      button = button.parentElement;
    }
    const txt = button.getAttribute('data-info');
    let multSize = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--mult-size')
    );
    if (txt === '-' && multSize > 0.5) {
      multSize -= 0.05;
    }
    if (txt === '+' && multSize < 1.5) {
      multSize += 0.05;
    }
    if (txt === '=') {
      multSize = verteiler.data.user_settings.zoom;
    }
    multSize = parseFloat(multSize.toFixed(2));
    document.documentElement.style.setProperty('--mult-size', multSize);
    setLoading?.(() => false);
  };

  // dateUpdated = () => {}
  const dateUpdated = (date, view, callback = false) => {
    verteiler.resetEmptyWorkSpots();
    calendar?.getDienstplaene?.(date, view, callback);
  };

  const dateConfirmed = (date) => {
    setShowCalender(() => false);
    const dateString = formatDate(date.day);
    calendar.setTag(dateString);
    verteiler.dateChanged(() => {});
  };

  const iconSizeMemo = useMemo(() => ({ size: iconSize }), []);
  const einteilungsstatusAuswahl = verteiler?.einteilungsstatusAuswahl;

  const showEmptySpots = (isActive) => {
    verteiler.toggleEmptyWorkSpots(isActive);
  };

  return (
    <div className="header">
      <PageHeader>
        <Zoom changeSize={changeSize} />
        <div className="date-selection">
          <div className="date-cal">
            <div className="columns">
              <Calendar
                dateUpdated={dateUpdated}
                dateConfirmed={dateConfirmed}
                showCalender={showCalender}
                setShowCalender={setShowCalender}
                range={false}
                arrows
                calendar={calendar}
                updateLocation
              >
                <DienstplanAuswahl
                  calendar={calendar}
                  dateUpdated={dateUpdated}
                >
                  {verteiler?.hasDienstplaene && user?.isAdmin && (
                    <CustomButton
                      className="api-auto-einteilen-btn"
                      spinner={{ show: true }}
                      clickHandler={(evt, setLoading) => {
                        verteiler?.autoEinteilen?.(setLoading);
                      }}
                      id="api-auto-einteilen-btn"
                      title="Automatisch Einteilungen ausführen"
                    >
                      Automatisch Einteilen
                    </CustomButton>
                  )}
                </DienstplanAuswahl>
              </Calendar>
            </div>
          </div>
        </div>
        <div className={`actions ${styles.actions}`}>
          <ToggleSwitch
            text={verteiler.emptyWorkSpots.length}
            cb={showEmptySpots}
          />
          {verteiler?.hasDienstplaene && (
            <>
              <EinteilungsstatusAuswahl
                auswahl={einteilungsstatusAuswahl}
                publishButton={
                  verteiler?.vorlage?.publishable ? (
                    <CustomButton
                      spinner={{ show: true }}
                      clickHandler={publish}
                      className={`as_icon ${allEinteilungenPublic ? styles.all_einteilungen_public : ''}`}
                      id="pdf-veröffentlichen"
                      title={
                        allEinteilungenPublic
                          ? `PDF veröffentlichen.\nAlle Einteilungen sind öffentlich.`
                          : 'PDf und alle Einteilungen veröffentlichen'
                      }
                    >
                      <IconContext.Provider value={iconSizeMemo}>
                        {allEinteilungenPublic ? (
                          <TbDatabaseExclamation />
                        ) : (
                          <TbDatabaseExport />
                        )}
                      </IconContext.Provider>
                    </CustomButton>
                  ) : null
                }
              />

              <MagicBtn
                minDate={data?.anfang}
                maxDate={data?.ende}
                von={data?.firstVerteilerDate}
                bis={data?.lastVerteilerDate}
                kontingente={data?.kontingente}
                callBack={data?.magicEinteilen}
              />

              <div className={styles.stacked_buttons}>
                <CustomButton
                  className="as_icon"
                  title="Toggle PDF/CSV erstellen"
                  id="toggle-pdf-csv"
                  clickHandler={handleClickPdfOrCsv}
                >
                  <IconContext.Provider value={iconSizeMemo}>
                    {showPdfOrCsv ? <MdToggleOn /> : <MdToggleOff />}
                  </IconContext.Provider>
                </CustomButton>
                <CustomButton
                  className="as_icon"
                  title={showPdfOrCsv ? 'PDF erstellen' : 'CSV erstellen'}
                  spinner={{ show: true }}
                  id={showPdfOrCsv ? 'pdf' : 'csv'}
                  clickHandler={showPdfOrCsv ? createPdf : createCSV}
                >
                  <IconContext.Provider value={iconSizeMemo}>
                    {showPdfOrCsv ? <MdPictureAsPdf /> : <PiFileCsvFill />}
                  </IconContext.Provider>
                </CustomButton>
              </div>
            </>
          )}
          <CustomButton
            spinner={{ show: true }}
            className="as_icon"
            addStyles="toggle-view-btn"
            id="user-settings"
            clickHandler={toggleView}
            title="User Einstellungen"
          >
            <IconContext.Provider value={iconSizeMemo}>
              <FaUserCog />
            </IconContext.Provider>
          </CustomButton>
          {verteiler.pageName === 'tagesverteiler' &&
          user?.isAdmin &&
          verteiler?.vorlage ? (
            <CustomButton
              spinner={{ show: true }}
              className="as_icon"
              addStyles="toggle-view-btn"
              id="grid"
              clickHandler={toggleView}
              title="Grid Einstellungen"
            >
              <IconContext.Provider value={iconSizeMemo}>
                <MdGridView />
              </IconContext.Provider>
            </CustomButton>
          ) : null}
          {verteiler?.hasDienstplaene && (
            <VorlageAuswahlButton
              className={styles.stacked_buttons}
              addStyles="toggle-view-btn"
              toggleView={toggleView}
              iconSizeMemo={iconSizeMemo}
            />
          )}
          <CustomButton
            spinner={{ show: true }}
            className="as_icon"
            addStyles="toggle-view-btn"
            id="info"
            clickHandler={toggleView}
            title="Info anzeigen"
          >
            <IconContext.Provider value={iconSizeMemo}>
              <FaInfo />
            </IconContext.Provider>
          </CustomButton>
        </div>
      </PageHeader>
    </div>
  );
}

export default Header;
