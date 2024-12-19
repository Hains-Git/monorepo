import React from 'react';
import AuswahlLeiste from '../../../components/dienstplaner/auswahl-leiste/AuswahlLeiste';
import StandardSelectField from '../../../components/utils/standard-select-field/StandardSelectField';
import TabellenContainer from '../../../components/dienstplaner/tabellen-container/TabellenContainer';
import { UseDienstplan } from '../../../hooks/use-dienstplan';
import Search from '../../../components/utils/search/Search';
import Toolbar from '../../../components/dienstplaner/tabellen-container/toolbar/Toolbar';
import styles from './dienstplan.module.css';

function Dienstplan({ dienstplan, user }) {
  const [vorlagenOptions, itemHandler, ansichtHandler] = UseDienstplan(
    dienstplan,
    user
  );
  const table = dienstplan?.table;
  if (!table) return null;

  return (
    <div className={`dienstplan-page ${styles.dienstplan_page}`}>
      <AuswahlLeiste className={styles.auswahl_leiste_row}>
        <div>
          <input
            title="Tabelle filtern?"
            type="checkbox"
            checked={!dienstplan?.tableSearchHighlight}
            onChange={dienstplan?.toggleTableSearchHighlight}
          />
          <Search
            search={table?.search}
            groups={table?.searchGroups}
            startInput={table?.searchValue || ''}
          />
          <Toolbar table={table} />
        </div>

        <div>
          {dienstplan?.ansichten && (
            <StandardSelectField
              name="Ansicht"
              options={dienstplan.ansichten}
              optionKey="id"
              itemHandler={ansichtHandler}
              start={dienstplan.ansichtenStart}
              readOnly
              title="Wähle eine Ansicht für den Dienstplan aus!"
            />
          )}
          {vorlagenOptions && (
            <StandardSelectField
              name="Vorlage"
              options={vorlagenOptions}
              optionKey="name"
              itemHandler={itemHandler}
              start={dienstplan.startVorlage}
              readOnly
              title="Wähle eine Vorlage für die Dienste aus!"
            />
          )}
        </div>
      </AuswahlLeiste>
      <TabellenContainer dienstplan={dienstplan} />
    </div>
  );
}

export default Dienstplan;
