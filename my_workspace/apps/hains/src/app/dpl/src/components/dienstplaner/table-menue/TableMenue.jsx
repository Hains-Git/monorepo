import React from 'react';
import { UseDropdown } from '../../../hooks/use-dropdown';
import FilterPopup from '../filter-popup/FilterPopup';
import KonfliktFilter from '../konflikt-filter/KonfliktFilter';
import CustomFelder from './customfelder/CustomFelder';
import Farbgruppen from './farbgruppen/Farbgruppen';
import Name from './name/Name';
import SaveSettings from './savesettings/SaveSettings';
import ToggleBody from './togglebody/ToggleBody';
import Toggles from './toggles/Toggles';
import StandardSelectField from '../../utils/standard-select-field/StandardSelectField';

function TableMenue({
  farbgruppen = false,
  konfliktFilter = false,
  filterVorlage = false,
  table = false,
  className = ''
}) {
  const { caret, show, handleClick } = UseDropdown(false, true);

  const customFelder = table?.getCustomFelder?.();

  const sortHandler = (item) => {
    item?.fkt?.();
  };

  return (
    <div
      className={`table-menue ${className}`}
      // ref={thisRef}
      // style={style}
    >
      <p onClick={handleClick}>
        <span>Menü</span>
        <span className="caret">{caret}</span>
      </p>
      {show && (
        <div
          className="table-menue-dropdown"
          onClick={(evt) => {
            evt.stopPropagation();
          }}
        >
          <Name table={table} />
          <KonfliktFilter konfliktFilter={konfliktFilter} />
          <FilterPopup label="Filter" filterVorlage={filterVorlage} />
          <Farbgruppen farbgruppen={farbgruppen} />
          <CustomFelder
            label="Zeilen"
            title="Zeile"
            el={customFelder}
            row
            tooltip="Erstelle/Lösche benutzerdefinierte Zeilen"
          />
          <CustomFelder
            label="Spalten"
            title="Spalte"
            el={customFelder}
            row={false}
            tooltip="Erstelle/Lösche benutzerdefinierte Spalten"
          />
          {table.sortings && (
            <StandardSelectField
              name="Sortierung Mitarbeiter"
              options={table.sortings}
              optionKey="name"
              itemHandler={sortHandler}
              start={table.sortStart}
              readOnly
              title="Wähle eine Sortierung für die Mitarbeiter-Spalte!"
            />
          )}
          <Toggles table={table} />
          <ToggleBody table={table} />
          <SaveSettings table={table} />
        </div>
      )}
    </div>
  );
}

export default TableMenue;
