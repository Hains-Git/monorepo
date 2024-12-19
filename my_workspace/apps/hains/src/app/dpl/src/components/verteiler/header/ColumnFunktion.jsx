import React, { memo } from 'react';
import EmployeeNotAllocated from './EmployeeNotAllocated';
import Arrow from '../utils/Arrow';
import { UseRegisterKey } from '../../../hooks/use-register';

function ColumnFunktion({ funktion, verteiler, dateStr, teamsFiltered = [] }) {
  UseRegisterKey(
    'not-allowcated-employee',
    verteiler.data.push,
    verteiler.data.pull
  );
  const toggleFunktion = (evt) => {
    const columnFunktion = evt.target.closest('div.column-funktion');
    columnFunktion.classList.toggle('hide');

    const userLayout = document.querySelector('div.user-layout');
    const columnContainer = columnFunktion.querySelector(
      'div.column-container'
    );

    if (userLayout.classList.contains('top')) {
      const infoBox = document.querySelector('div.info');
      const divTop = document.querySelector('div.scrolling-window.top');
      if (!divTop) return;
      divTop.style.top = `${infoBox.getBoundingClientRect().height}px`;
    }

    if (
      userLayout.classList.contains('top') ||
      userLayout.classList.contains('bottom')
    ) {
      // columnContainer.style.height = `auto`;
      return;
    }

    const { top } = columnContainer.getBoundingClientRect();
    const columnFunktionHide = document.querySelector(
      'div.column-funktion.hide'
    );
    const height_hidden = columnFunktionHide.getBoundingClientRect().height;
    const notAllocated = document.querySelector('div.info div.not-allocated');
    const lastChildNum = parseInt(notAllocated.lastChild.dataset.funktion, 10);
    const curNum = parseInt(columnFunktion.dataset.funktion, 10);

    const siblings = lastChildNum - curNum;
    const diff = parseInt(top, 10) + siblings * height_hidden + 12 + 15;

    columnContainer.style.height = `calc(100vh - ${diff}px)`;
  };

  const nichtVerteilt = verteiler.getNichtVerteilte(dateStr) || [];

  const checkTeam = (m) => {
    const prioTeam = m?.getPrioTeamAm?.(dateStr);
    if (
      m.funktion_id === funktion.id &&
      (teamsFiltered.includes(prioTeam?.id) ||
        (teamsFiltered.includes(0) && m?.rotationenIds.length === 0))
    ) {
      return true;
    }
    return false;
  };

  const employeeNotAllocated = [];

  const filteredMitarbeiter = nichtVerteilt.filter((m) => {
    const result = checkTeam(m);
    if (result) {
      employeeNotAllocated.push(
        <EmployeeNotAllocated key={m.id} mitarbeiter={m} dateStr={dateStr} />
      );
    }
    return result;
  });

  return (
    <div className="column-funktion hide" data-funktion={funktion.id}>
      <h4 onClick={toggleFunktion}>
        {funktion.planname}
        <span className="m-length">({filteredMitarbeiter.length})</span>
        <Arrow />
      </h4>
      <div className="column-container">{employeeNotAllocated}</div>
    </div>
  );
}

export default memo(ColumnFunktion);
