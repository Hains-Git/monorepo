import React, {
  useState,
  useEffect
} from 'react';

import GetColumns from '../get-columns';
import Rotation from '../rotation';

import { UseRegisterKey } from '../../../../hooks/use-register';

function RowEmployee({ employee, rotationsplan }) {
  const [height, setHeight] = useState(1);
  const [rotationen, setRotationen] = useState([]);

  const columnWidth = UseRegisterKey("column-width", rotationsplan.timeline.push, rotationsplan.timeline.pull);
  const employeeUpdate = UseRegisterKey("employee-update", rotationsplan.timeline.push, rotationsplan.timeline.pull);

  useEffect(() => {
    setRotationen(() => {
      const arr = employee.eachRotation((rotation) => (
        <Rotation
          key={rotation.id}
          rotation={rotation}
          contingent={rotation.kontingent_id}
          rotationsplan={rotationsplan}
        />
      ));
      return arr;
    });
    setHeight(() => employee.getHeight() || 1);
  }, [columnWidth, employeeUpdate]);

  useEffect(() => {
    employee.update("sidebar-row-height");
    rotationsplan.timeline.update("scroll-top");
  }, [rotationen]);

  return (
    <div
      className="cct-row"
      data-employee={employee.id}
      title={employee.name}
      style={{
        height: `${height * 30 + 5}px`
      }}
    >

      <GetColumns rotationsplan={rotationsplan} />

      {rotationen}

    </div>
  );
}

export default RowEmployee;
