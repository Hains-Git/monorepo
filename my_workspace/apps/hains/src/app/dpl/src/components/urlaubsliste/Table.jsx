import { useEffect, useRef, useMemo, useState } from 'react';
import { IconContext } from 'react-icons';
import { FaUserCog } from 'react-icons/fa';
import styles from './urlaubsliste.module.css';
import { UseRegisterKey } from '../../hooks/use-register';
import TableHead from './Head';
import TableBody from './Body';
import Search from '../utils/search/Search';
import CustomButton from '../utils/custom_buttons/CustomButton';

function Table({ urlaubsliste, tablemodel }) {
  const iconSize = '1em';
  const einteilungen = urlaubsliste.einteilungenNachMitarbeiter;
  const dates = urlaubsliste.datesArr;
  const team = urlaubsliste.team;

  const mitarbeiters = urlaubsliste.activeMitarbeiters;
  const table = useRef();
  const [year, setYear] = useState('');

  const ui = UseRegisterKey(
    'ui',
    urlaubsliste.push,
    urlaubsliste.pull,
    urlaubsliste
  );

  const wideScreen = UseRegisterKey(
    'wideScreen',
    urlaubsliste.push,
    urlaubsliste.pull,
    urlaubsliste
  );

  useEffect(() => {
    if (!table.current) {
      return;
    }
    tablemodel.initHtml(table.current);
  }, [table.current]);

  useEffect(() => {
    table?.current?.addEventListener('scroll', (e) => {
      tablemodel.checkForNewDates(e);
    });
    return () => {
      table?.current?.removeEventListener('scroll', (e) => {
        tablemodel.checkForNewDates(e);
      });
    };
  }, []);

  useEffect(() => {
    tablemodel.setEdgeDaysFromDates();
    tablemodel.createCellPositions();
  }, [ui]);

  useEffect(() => {
    tablemodel.scrollToInitialDate();
  }, []);

  useEffect(() => {
    tablemodel.loadDataForBiggerScreen();
  }, []);

  useEffect(() => {
    tablemodel.scrollToInitialDate();
    tablemodel.setFixColumns();
  }, [wideScreen]);

  const iconSizeMemo = useMemo(() => ({ size: iconSize }), []);

  return (
    <>
      <div className={styles.table_top_content}>
        <Search
          search={tablemodel.search}
          groups={tablemodel.searchGroups}
          startInput=""
        />
        <div className="right-content">
          <CustomButton
            className="as_icon"
            addStyles=""
            id=""
            // clickHandler={() => setIsOverlayOpen((val) => !val)}
            clickHandler={() => tablemodel.toggleSettings()}
            title="User Einstellungen"
          >
            <IconContext.Provider value={iconSizeMemo}>
              <FaUserCog />
            </IconContext.Provider>
          </CustomButton>
        </div>
      </div>
      <div className={styles.table_content}>
        <table ref={table} className={styles.table}>
          <TableHead
            year={year}
            dates={dates}
            team={team}
            urlaubsliste={urlaubsliste}
            tablemodel={tablemodel}
          />
          <TableBody
            tablemodel={tablemodel}
            urlaubsliste={urlaubsliste}
            styles={styles}
            dates={dates}
            mitarbeiters={mitarbeiters}
            einteilungen={einteilungen}
          />
        </table>
      </div>
    </>
  );
}
export default Table;
