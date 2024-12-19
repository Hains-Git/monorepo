import React, {
  useEffect,
  useState
} from 'react';

import RowContingent from './row-contingent';
import RowEmployee from './RowEmployee';
import { UseRegisterKey } from '../../../../hooks/use-register';

function Body({ rotationsplan }) {
  const [contingents, setContingents] = useState([]);
  const [employees, setEmployees] = useState([]);

  const columnWidth = UseRegisterKey("column-width", rotationsplan.timeline.push, rotationsplan.timeline.pull);
  const viewUpdate = UseRegisterKey("view-update", rotationsplan.timeline.push, rotationsplan.timeline.pull);
  const employeeUpdate = UseRegisterKey("employee-update", rotationsplan.timeline.push, rotationsplan.timeline.pull);
  const filterUpdate = UseRegisterKey("filter-update", rotationsplan.timeline.push, rotationsplan.timeline.pull);

  useEffect(() => {
    if (rotationsplan.timeline.view === "contingent") {
      setContingents(() => rotationsplan.eachKontingent(
        (contingent) => (
          <RowContingent
            rotationsplan={rotationsplan}
            contingent={contingent}
            key={contingent.id}
          />
        )
      ));
    } else {
      setEmployees(() => rotationsplan.eachEmployee((employee) => (
        <RowEmployee rotationsplan={rotationsplan} employee={employee} key={employee.id} />
      )));
    }
  }, [columnWidth, viewUpdate, employeeUpdate, filterUpdate]);

  return (
    <div
      className="cct-body"
      style={{
        width: `${rotationsplan.timeline.fullWidth}px`
      }}
    >
      { rotationsplan.timeline.view === "contingent" ? contingents : employees}
    </div>
  );
}

export default Body;
