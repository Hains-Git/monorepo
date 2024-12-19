import React, { useEffect, useState } from 'react';
import { UseRegister } from '../../../hooks/use-register';
import CustomInput from '../../utils/custom-input/CustomInput';
import FarbenLegende from '../farben-legende/FarbenLegende';
import FilterPopup from '../filter-popup/FilterPopup';
import StandardSelectField from '../../utils/standard-select-field/StandardSelectField';
import { sortAuswahlDropdown } from '../../../tools/helper';
import EinteilungenHistory from '../../utils/einteilungen-history/EinteilungenHistory';
import styles from './einteilungauswahl.module.css';
import RemoveEinteilung from '../content-container/content/RemoveEinteilung';
import SaveEinteilung from './helper/SaveEinteilung';
import Comment from './helper/Comment';
import CurrentEinteilung from './helper/CurrentEinteilung';
import EinteilungenInfosRow from './helper/EinteilungenInfosRow';
import ContextComment from './helper/ContextComment';
// import Optional from './helper/Optional';

function EinteilungAuswahl({ einteilungAuswahl, table }) {
  const update = UseRegister(
    einteilungAuswahl?._push,
    einteilungAuswahl?._pull,
    einteilungAuswahl
  );
  const [input, setInput] = useState('');
  const fontSize = table?.style?.fontSize;
  const style = fontSize ? { fontSize } : null;

  const itemHandler = (item) => {
    item?.fkt?.();
  };

  const handleInput = (evt) => {
    evt.stopPropagation();
    const value = evt.target.value;
    setInput(() => value);
    einteilungAuswahl?.debouncedUpdateFilter?.(value);
  };

  useEffect(() => {
    setInput(() => einteilungAuswahl?.searchValue || '');
  }, [einteilungAuswahl, update, fontSize]);

  if (!einteilungAuswahl) return null;

  return (
    <div className={styles.container}>
      <div className={`einteilung-auswahl-head ${styles.head}`}>
        <FarbenLegende id="auswahl" />
        <StandardSelectField
          className={styles.next_field}
          name="Springe zu nächstem Feld"
          options={einteilungAuswahl.nextFieldAuswahl}
          optionKey="id"
          itemHandler={itemHandler}
          start={einteilungAuswahl.keyCodeIndex}
          readOnly
          title="Soll nach Klick auf eine Auswahl zum nächsten Feld gesprungen werden?"
        />

        {!einteilungAuswahl?.feld?.default && (
          <EinteilungenHistory
            history={einteilungAuswahl.history}
            feld={einteilungAuswahl?.feld}
            type={einteilungAuswahl?.type}
            fontSize={style?.fontSize || '1em'}
          >
            {einteilungAuswahl?.feld?.einteilung ? (
              <>
                <SaveEinteilung feld={einteilungAuswahl?.feld} style={null} />
                <RemoveEinteilung
                  feld={einteilungAuswahl?.feld}
                  className={styles.remove}
                  style={null}
                />
              </>
            ) : null}
          </EinteilungenHistory>
        )}

        <StandardSelectField
          name="Kontext"
          options={einteilungAuswahl.kontexte}
          optionKey="name"
          itemHandler={itemHandler}
          start={einteilungAuswahl.kontextStart}
          readOnly
          title="Der Kontext der Einteilung"
        />
        <ContextComment einteilungAuswahl={einteilungAuswahl} />
        <Comment einteilungAuswahl={einteilungAuswahl} />
        {/* <Optional einteilungAuswahl={einteilungAuswahl} /> */}

        <CustomInput placeholder="Suche" onChange={handleInput} value={input} />
        <StandardSelectField
          name="Filter"
          options={einteilungAuswahl.getFilter()}
          optionKey="id"
          itemHandler={itemHandler}
          start={einteilungAuswahl.auswahl}
          readOnly
          title="Welche Vorschläge sollen angezeigt werden?"
        />
        {einteilungAuswahl.showVorlage ? (
          <FilterPopup
            filterVorlage={einteilungAuswahl.filterVorlage}
            label="Einstellungen"
            saveBtn
          />
        ) : null}
        <label
          className={styles.count_main}
          htmlFor="einteilung-auswahl-count-main-checkbox"
        >
          <input
            type="checkbox"
            onChange={(evt) => {
              evt.stopPropagation();
              einteilungAuswahl.setCountOnlyMain(!evt.target.checked);
            }}
            checked={!einteilungAuswahl.countOnlyMain}
            id="einteilung-auswahl-count-main-checkbox"
          />
          Einteilungen aus Folgemonat zählen
        </label>
      </div>
      <table className={styles.table} style={style}>
        <tbody>
          <EinteilungenInfosRow einteilungAuswahl={einteilungAuswahl} />
          {sortAuswahlDropdown(einteilungAuswahl.currentAuswahl, true)}
          <CurrentEinteilung einteilungAuswahl={einteilungAuswahl} />
        </tbody>
      </table>
    </div>
  );
}

export default EinteilungAuswahl;
