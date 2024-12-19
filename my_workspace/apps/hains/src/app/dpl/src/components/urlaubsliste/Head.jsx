import { useState, useEffect } from 'react';
import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md';
import styles from './urlaubsliste.module.css';
import Row from './Row';
import Cell from './Cell';
import VisibleColumns from './VisibleColumns';
import VisibleCounters from './VisibleCounters';
import SpinnerIcon from '../utils/spinner-icon/SpinnerIcon';
import TextYear from './util/TextYear';

import { UseRegisterKey } from '../../hooks/use-register';

function TableHead({ year, tablemodel, dates, team, urlaubsliste }) {
  const teamsFilter = tablemodel?.visibleTeamIds || [];
  const [isLoading, setIsLoading] = useState(false);
  const awColumnNames = urlaubsliste.awColumnNames;
  urlaubsliste.setLoader(setIsLoading);

  const visibleColumns = UseRegisterKey(
    'checkboxList',
    tablemodel.push,
    tablemodel.pull,
    tablemodel
  );

  const counterUpdate = UseRegisterKey(
    'counterUpdate',
    urlaubsliste.push,
    urlaubsliste.pull,
    urlaubsliste
  );

  useEffect(() => {
    if (!tablemodel.tableHtml) {
      return;
    }
    tablemodel.setFixColumns();
  }, [visibleColumns, counterUpdate]);

  const renderAndShowLoader = () => {
    const spinner = (
      <SpinnerIcon
        width={17}
        height={17}
        borderWidth="0.15rem"
        color="#00427a"
      />
    );
    return isLoading ? spinner : '';
  };

  const getCounterTitle = (counter) => {
    const title = [
      { txt: `Name: ${counter?.planname}` },
      { txt: `Desc: ${counter?.description}` },
      { txt: `${counter?.von} - ${counter?.bis}` }
    ];
    return title;
  };

  const renderHead = () => {
    const dateKeys = ['month', 'day', 'week_day'];
    const ckl = tablemodel.visibleColumns.length - 1;
    const dkl = dateKeys.length;
    const visibleCounters = Object.values(tablemodel.visibleCounters);
    const vcl = visibleCounters.length - 1;

    const head = [];
    for (let i = 0; i < dkl; i++) {
      head.push(
        <Row key={`row-${dateKeys[i]}`}>
          <Cell key={`row-year-${i}`} tag="th">
            {i === 0 ? <TextYear tablemodel={tablemodel} /> : ''}
            {i === 1 && renderAndShowLoader()}
          </Cell>
          <VisibleColumns
            tablemodel={tablemodel}
            awColumnNames={awColumnNames}
            ckl={ckl}
            i={i}
          />

          <VisibleCounters
            visibleCounters={visibleCounters}
            vcl={vcl}
            i={i}
            getCounterTitle={getCounterTitle}
          />

          {dates.map((day) => {
            const colorize = tablemodel.specialDay(day);
            const km = urlaubsliste.kalendermarkierung[day.id];
            const feiertagName = day?.feiertag?.name || '';

            let title = feiertagName ? [{ txt: feiertagName }] : [];
            if (km?.tooltip) {
              title = [...km.tooltip, ...title];
            }

            return (
              <Cell
                date={day.id}
                key={`row-${i}-${day.id}`}
                className={styles[colorize]}
                tag="th"
                title={title}
                color={km?.color}
              >
                {day[dateKeys[i]]}
              </Cell>
            );
          })}
        </Row>
      );
    }

    Object.values(team).forEach((t, i) => {
      if (teamsFilter.includes(t.id)) {
        head.push(
          <Row key={`row-team-${t.id}`}>
            <Cell tag="th">{t.name}</Cell>

            <VisibleColumns
              tablemodel={tablemodel}
              awColumnNames={awColumnNames}
              ckl={ckl}
              i={1}
            />

            <VisibleCounters
              visibleCounters={visibleCounters}
              vcl={vcl}
              i={1}
              getCounterTitle={getCounterTitle}
            />

            {dates.map((day) => {
              const colorize = tablemodel.specialDay(day);
              const saldo = urlaubsliste.getSaldo(t.id, day.id);
              const km = urlaubsliste.kalendermarkierung[day.id];
              return (
                <Cell
                  date={day.id}
                  key={`row-tema-${t.id}-${day.id}`}
                  className={styles[colorize]}
                  tag="th"
                  color={km?.color}
                  title={saldo?.title || ''}
                >
                  {saldo.saldo}
                </Cell>
              );
            })}
          </Row>
        );
      }
    });

    return head;
  };

  return <thead>{renderHead()}</thead>;
}
export default TableHead;
