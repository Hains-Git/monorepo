import React from 'react';
import CustomComposedChart from '../../utils/composed-chart/CustomComposedChart';
import Table from './Table';
import { UseDropdown } from '../../../hooks/use-dropdown';
import CustomButton from '../../utils/custom_buttons/CustomButton';
import { UseRegister } from '../../../hooks/use-register';
import StandardSelectField from '../../utils/standard-select-field/StandardSelectField';
import { deleteBtnClass } from '../../../styles/basic';
import DeleteButton from '../../utils/custom_buttons/DeleteButton';

function Statistic({ statistic }) {
  const graphDropdown = UseDropdown(true, false);
  const tableDropdown = UseDropdown(false, false);
  UseRegister(statistic?._push, statistic?._pull, statistic);
  const id = statistic?.id || 'statistic';

  const itemHandler = (item) => {
    statistic?.change && statistic.change(item);
  };

  const sortHandler = (item) => {
    statistic?.setCurrentSort && statistic.setCurrentSort(item.index);
  };

  const createTableAndGraph = () => (
    <>
      {statistic?.table && (
        <div className="dienstplan-statistic-table">
          <p onClick={(evt) => tableDropdown.handleClick(evt)}>
            {`${tableDropdown.caret} Tabelle`}
          </p>
          {tableDropdown.show && (
            <Table key={`table-${statistic?.id}`} statistic={statistic} />
          )}
        </div>
      )}

      {statistic?.chart && (
        <div className="dienstplan-statistic-graph">
          <p onClick={(evt) => graphDropdown.handleClick(evt)}>
            {`${graphDropdown.caret} Diagramm`}
          </p>
          {graphDropdown.show && (
            <CustomComposedChart
              key={`chart-${statistic?.id}`}
              responsiveContainer={statistic?.responsiveContainer}
              chart={statistic?.chart}
              data={statistic?.data}
              id={id}
            />
          )}
        </div>
      )}
    </>
  );

  return (
    <div className="dienstplan-statistic-statistic">
      <div className="dienstplan-statistic-settings">
        <StandardSelectField
          name="Typ"
          className="statistik-add-auswahl"
          options={statistic?.models}
          optionKey="id"
          itemHandler={itemHandler}
          start={statistic?.current || 0}
          readOnly
          title="Ändert die Statistik!"
        />
        {statistic?.position ? (
          <DeleteButton
            spinner={{ show: true }}
            className={deleteBtnClass}
            title="Entfernt die Statistik"
            clickHandler={(evt, setLoading) => {
              evt.stopPropagation();
              statistic?.remove?.();
              setLoading?.(() => false);
            }}
          />
        ) : null}
        {statistic?.sort && (
          <StandardSelectField
            name="Sortierung"
            options={statistic.sort}
            optionKey="id"
            itemHandler={sortHandler}
            start={statistic?.currentSort || 0}
            readOnly
            title="Wähle eine Sortierung für die Daten aus!"
          />
        )}
        <CustomButton
          title={
            'Berechnet das Intervall entsprechend zu Sortierung' +
            '\nAlphabetisch: Ganzes Interval' +
            '\nAbsteigend: Max bis Min' +
            '\nAufsteigend: Min bis Max'
          }
          spinner={{ show: true }}
          clickHandler={(evt, setLoading) => {
            evt.stopPropagation();
            statistic?.resetBrushIndex?.();
            setLoading?.(() => false);
          }}
        >
          Berechne Intervall
        </CustomButton>
        <label
          htmlFor={`${id}-only-main-zeitraum`}
          className="dienstplan-statistic-settings-only-main-zeitraum-label"
        >
          <input
            id={`${id}-only-main-zeitraum`}
            type="checkbox"
            checked={statistic.onlyMainZeitraum}
            onChange={(evt) => {
              evt.stopPropagation();
              if (statistic?.toggleOnlyMainZeitraum) {
                statistic?.toggleOnlyMainZeitraum();
              }
            }}
          />
          {statistic?.monthLabel}
        </label>
      </div>
      {createTableAndGraph()}
    </div>
  );
}

export default Statistic;
