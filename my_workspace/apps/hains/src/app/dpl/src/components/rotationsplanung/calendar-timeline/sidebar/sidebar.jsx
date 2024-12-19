import React, { useEffect, useRef, useState } from 'react';

import RowContingentName from './RowContingentName';
import RowEmployeeName from './RowEmployeeName';
import Filter from './Filter';

import { UseRegisterKey } from '../../../../hooks/use-register';

function Sidebar({ rotationsplan }) {
  const sidebarEl = useRef(null);
  const [contingents, setContingents] = useState([]);
  const [employees, setEmployees] = useState([]);

  const scrollTopState = UseRegisterKey(
    'scroll-top',
    rotationsplan.timeline.push,
    rotationsplan.timeline.pull
  );
  const viewUpdate = UseRegisterKey(
    'view-update',
    rotationsplan.timeline.push,
    rotationsplan.timeline.pull
  );
  const employeeUpdate = UseRegisterKey(
    'employee-update',
    rotationsplan.timeline.push,
    rotationsplan.timeline.pull
  );
  const filterUpdate = UseRegisterKey(
    'filter-update',
    rotationsplan.timeline.push,
    rotationsplan.timeline.pull
  );

  const todayYear = rotationsplan.timeline.todayYear;
  const columnWidth = rotationsplan.timeline.years[todayYear].columnWidth;
  const maxColumnWidth = rotationsplan.timeline.rangeWidth[1];

  const headerRootHeight = columnWidth === maxColumnWidth ? '94' : '64';

  useEffect(() => {
    sidebarEl.current.scrollTop = rotationsplan.timeline.scrollTopPos;
  }, [scrollTopState]);

  useEffect(() => {
    if (rotationsplan.timeline.view === 'contingent') {
      setContingents(() =>
        rotationsplan.eachKontingent((contingent) => (
          <RowContingentName
            rotationsplan={rotationsplan}
            contingent={contingent}
            key={contingent.id}
          />
        ))
      );
    } else {
      setEmployees(() =>
        rotationsplan.eachEmployee((employee) => (
          <RowEmployeeName
            rotationsplan={rotationsplan}
            employee={employee}
            key={employee.id}
          />
        ))
      );
    }
  }, [viewUpdate, employeeUpdate, filterUpdate]);

  return (
    <div className="cct-sidebar" ref={sidebarEl}>
      <div className="header-block" style={{ height: `${headerRootHeight}px` }}>
        <Filter rotationsplan={rotationsplan} />
      </div>
      <div
        className={
          rotationsplan.timeline.view === 'contingent'
            ? 'contingents'
            : 'employees'
        }
        style={{
          marginTop: `${headerRootHeight}px`
        }}
      >
        {rotationsplan.timeline.view === 'contingent' ? contingents : employees}
      </div>
    </div>
  );
}

export default Sidebar;
