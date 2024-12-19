import React, {
  useState,
  useEffect
} from 'react';

import GetColumns from '../get-columns';
import Rotation from '../rotation';

import { UseRegisterKey } from '../../../../hooks/use-register';

function RowContingent({ contingent, rotationsplan }) {
  const [height, setHeight] = useState(1);
  const [rotationen, setRotationen] = useState([]);

  const columnWidth = UseRegisterKey("column-width", rotationsplan.timeline.push, rotationsplan.timeline.pull);
  const employeeUpdate = UseRegisterKey("employee-update", rotationsplan.timeline.push, rotationsplan.timeline.pull);

  useEffect(() => {
    setRotationen(() => {
      const arr = contingent.eachRotation((rotation) => (
        <Rotation
          key={rotation.id}
          rotation={rotation}
          contingent={contingent}
          rotationsplan={rotationsplan}
        />
      ));
      return arr;
    });
    setHeight((curHeight) => {
      const newHeight = contingent.getHeight() || 1;
      if (curHeight !== newHeight) {
        // contingent.update("sidebar-row-height");
      }
      return newHeight;
    });
  }, [columnWidth, employeeUpdate]);

  useEffect(() => {
    contingent.update("sidebar-row-height");
    rotationsplan.timeline.update("scroll-top");
  }, [rotationen]);

  return (
    <div
      className="cct-row"
      data-contingent={contingent.id}
      title={contingent.name}
      style={{
        height: `${height * 30 + 5}px`
      }}
    >

      <GetColumns rotationsplan={rotationsplan} />

      {rotationen}
    </div>
  );
}

export default RowContingent;
