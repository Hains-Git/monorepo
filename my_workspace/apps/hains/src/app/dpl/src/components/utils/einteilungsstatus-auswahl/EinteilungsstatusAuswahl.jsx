import { RiListSettingsLine } from 'react-icons/ri';
import { UseRegister } from '../../../hooks/use-register';
import useEventListener from '../../../hooks/use-event-listener';
import Info from './Info';
import { UseDropdown } from '../../../hooks/use-dropdown';

import styles from './einteilungsstatus-auswahl.module.css';
import { UseTooltip } from '../../../hooks/use-tooltip';

function EinteilungsstatusAuswahl({ auswahl, publishButton = null }) {
  UseRegister(auswahl?._push, auswahl?._pull, auswahl);
  const [onOver, onOut] = UseTooltip(
    `Status: ${auswahl?.einteilungsstatus?.name || 'kein Status'}`
  );
  const { show, caret, handleClick } = UseDropdown(false, true);

  const itemHandler = (item) => {
    item?.fkt?.();
  };

  const setInfo = () => {
    auswahl?.setInfoFkt?.(true);
  };

  const keyHandler = (evt) => {
    if (evt.altKey) {
      const key = evt.code.slice(3).toLowerCase();
      const status = auswahl?.einteilungsstatuse?.find((_status) => {
        const name = _status.name.toLowerCase();
        if (name.includes(`(${key})`)) {
          return _status;
        }
        return undefined;
      });
      if (status) {
        itemHandler(status);
      }
    }
  };

  useEventListener('keydown', keyHandler, document);

  if (!auswahl?.groupEinteilungen) return null;
  const statusClass = `status_${auswahl?.statusLetter?.toLowerCase() || ''}`;

  return (
    <div className={styles.auswahl}>
      <div className={`${styles[statusClass]} ${styles.auswahl_btn}`}>
        <span onClick={handleClick} onMouseOver={onOver} onMouseOut={onOut}>
          {auswahl?.statusLetter || 'NA'} {caret}
        </span>
        <span>{publishButton}</span>
        <span onClick={setInfo} onMouseOver={onOver} onMouseOut={onOut}>
          <RiListSettingsLine />
        </span>
      </div>

      {show && (
        <div className={styles.dropdown_container}>
          {auswahl?.einteilungsstatuse?.map?.((es) => (
            <div
              key={es.id}
              className={styles.dropdown_item}
              onClick={() => itemHandler(es)}
            >
              {es.name}
            </div>
          )) || null}
        </div>
      )}
      <Info auswahl={auswahl} itemHandler={itemHandler} />
    </div>
  );
}

export default EinteilungsstatusAuswahl;
