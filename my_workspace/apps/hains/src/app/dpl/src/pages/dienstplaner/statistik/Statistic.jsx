import React, { useEffect, useRef } from 'react';
import AuswahlLeiste from '../../../components/dienstplaner/auswahl-leiste/AuswahlLeiste';
import { UseRegister } from '../../../hooks/use-register';
import StandardSelectField from '../../../components/utils/standard-select-field/StandardSelectField';
import Statistic from '../../../components/dienstplaner/statistic/Statistic';
import Info from '../../../components/utils/info/Info';
import FilterPopup from '../../../components/dienstplaner/filter-popup/FilterPopup';
import SaveButton from '../../../components/utils/custom_buttons/SaveButton';

function DienstplanStatistic({ dienstplan }) {
  const statistic = dienstplan?.statistic;
  const thisRef = useRef(null);
  UseRegister(statistic?._push, statistic?._pull, statistic);

  const itemHandler = (item) => {
    statistic?.setCurrent && statistic.setCurrent(item.index);
  };

  const getStatistiken = () =>
    (statistic?.eachStatistic &&
      statistic.eachStatistic((st, i) => (
        <Statistic key={`${st?.id}-${i}`} statistic={st} />
      ))) ||
    [];

  useEffect(() => {
    statistic?.setRef && statistic.setRef(thisRef?.current);
    return () => {
      statistic?.setRef && statistic.setRef(false);
    };
  }, [thisRef, statistic]);

  if (!statistic?.eachStatistic) return null;
  return (
    <div className="dienstplan-statistic-page" ref={thisRef}>
      <AuswahlLeiste>
        <Info parent={dienstplan?.table} />
      </AuswahlLeiste>
      <FilterPopup label="Filter" filterVorlage={statistic?.filterVorlage} />
      <div className="dienstplan-statistic-container">{getStatistiken()}</div>
      <div className="dienstplan-statistic-page-add-stastic">
        <StandardSelectField
          name="Statistiken"
          className="statistik-add-auswahl"
          options={statistic.models}
          optionKey="id"
          itemHandler={itemHandler}
          start={statistic?.current || 0}
          readOnly
          title="Wähle eine Statistik aus, die hinzugefügt werden soll!"
        />
        <SaveButton
          className="statistik-add-btn"
          clickHandler={(evt) => {
            evt.stopPropagation();
            statistic?.addStatistic && statistic.addStatistic();
          }}
        />
      </div>
    </div>
  );
}

export default DienstplanStatistic;
