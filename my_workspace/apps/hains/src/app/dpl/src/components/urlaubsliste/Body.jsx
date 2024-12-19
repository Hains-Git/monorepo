import { useEffect } from 'react';
import { UseRegisterKey } from '../../hooks/use-register';

import Row from './Row';
import Cell from './Cell';
import VisibleColumnsBody from './VisibleColumnsBody';
import VisibleCountersBody from './VisibleCountersBody';

import { isInFilter } from '../../tools/helper';

function TableBody({ tablemodel, urlaubsliste, einteilungen, mitarbeiters, dates, styles }) {
  const abwesentheiten = urlaubsliste.abwesentheiten;

  UseRegisterKey('newAbwesentheiten', urlaubsliste.push, urlaubsliste.pull, urlaubsliste);

  const filterUpdate = UseRegisterKey('renderBody', tablemodel.push, tablemodel.pull, tablemodel);

  const visibleColumns = UseRegisterKey('checkboxList', tablemodel.push, tablemodel.pull, tablemodel);

  const counterUpdate = UseRegisterKey('counterUpdate', urlaubsliste.push, urlaubsliste.pull, urlaubsliste);

  useEffect(() => {
    if (!tablemodel.tableHtml) {
      return;
    }
    tablemodel.setFixColumns();
  }, [visibleColumns, filterUpdate, counterUpdate]);

  const createTitle = (m, _einteilungen) => {
    const title = [];
    _einteilungen.forEach((e) => {
      const planname = e?.dienst?.planname || '';
      const dienstName = e?.dienst?.name || '';
      const obj = { txt: `Dienst: ${dienstName} (${planname})` };
      title.push(obj);
    });
    return title;
  };

  const renderDienst = (day, m) => {
    const mitarbeiterEinteilungen = einteilungen?.[m.id]?.[day.id];
    const colorize = tablemodel.specialDay(day);
    const km = urlaubsliste.kalendermarkierung[day.id];
    let title = [];
    const feiertagName = day?.feiertag?.name || '';
    if (!mitarbeiterEinteilungen) {
      if (km?.tooltip) {
        title.push(...km.tooltip);
      }
      if (feiertagName) {
        title.push({ txt: feiertagName });
      }
      return (
        <Cell title={title} color={km?.color} className={styles[colorize]} key={`${m?.id}_${day.id}`} tag="td">
          {false || ''}
        </Cell>
      );
    }
    let mehrereEinteilungen = false;

    if (mitarbeiterEinteilungen.length > 1) {
      mehrereEinteilungen = true;
      title = createTitle(m, mitarbeiterEinteilungen);
    }

    const einteilung = mitarbeiterEinteilungen[0];
    const planname = einteilung?.dienst?.planname || '';
    const dienstName = einteilung?.dienst?.name || '';

    if (title.length < 1) {
      title.push({
        txt: `Dienst: ${dienstName} (${planname} : ${einteilung?.po_dienst_id})`
      });
    }

    let plannameKurz = planname.length > 3 ? planname.slice(0, 3) : planname;
    plannameKurz = mehrereEinteilungen ? `(${plannameKurz})` : plannameKurz;
    const key = `${m?.id}_${day.id}`;

    if (km?.tooltip) {
      title.push(...km.tooltip);
    }

    if (feiertagName) {
      title.push({ txt: feiertagName });
    }

    return (
      <Cell color={km?.color || ''} className={styles[colorize]} key={key} title={title} tag="td">
        {plannameKurz}
      </Cell>
    );
  };

  const getCounterTitle = (counter) => {
    const title = [
      { txt: `Name: ${counter?.planname}` },
      { txt: `Desc: ${counter?.description}` },
      { txt: `${counter?.von} - ${counter?.bis}` }
    ];
    return title;
  };

  const renderBody = () => {
    const ckl = tablemodel.visibleColumns.length - 1;
    const visibleCounters = Object.values(tablemodel.visibleCounters);
    const awCounterPoDienst = tablemodel.awCounterPoDienst;
    const vcl = visibleCounters.length - 1;
    const body = [];

    mitarbeiters.forEach((m) => {
      if (!isInFilter({ mitarbeiter_id: m.id, mitarbeiter: m }, tablemodel.searchVal, tablemodel.searchGroups)) {
        return;
      }
      body.push(
        <Row key={`row-${m?.id}`}>
          <Cell className="visible-column-body" tag="th">
            {m?.planname}
          </Cell>

          <VisibleColumnsBody tablemodel={tablemodel} abwesentheiten={abwesentheiten} m={m} ckl={ckl} />

          <VisibleCountersBody
            visibleCounters={visibleCounters}
            vcl={vcl}
            awCounterPoDienst={awCounterPoDienst}
            m={m}
            getCounterTitle={getCounterTitle}
          />

          {dates.map((day) => {
            return renderDienst(day, m);
          })}
        </Row>
      );
    });

    return body;
  };

  return <tbody>{renderBody()}</tbody>;
}
export default TableBody;
