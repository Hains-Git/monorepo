import React, { useEffect, useState } from 'react';

import { UseRegisterKey } from '../../../../hooks/use-register';
import { UseTooltip } from '../../../../hooks/use-tooltip';
import { UseMounted } from '../../../../hooks/use-mounted';

function RowEmployeeName({ employee, rotationsplan }) {
  const [height, setHeight] = useState(1);
  const rowHeight = UseRegisterKey(
    'sidebar-row-height',
    employee.push,
    employee.pull
  );
  const mounted = UseMounted();
  const [onOver, onOut] = UseTooltip(() =>
    mounted ? rotationsplan?.kontingenteEingeteilt(employee?.id) : ''
  );

  useEffect(() => {
    setHeight(() => employee.getHeight() || 1);
  }, [rowHeight]);

  return (
    <div
      className={`cct-row ${employee?.aktiv ? 'aktiv' : 'inaktiv'}`}
      data-employee={employee.id}
      style={{
        height: `${height * 30 + 5}px`
      }}
    >
      <p onMouseOver={onOver} onMouseOut={onOut}>
        {employee.planname}
      </p>
    </div>
  );
}

export default RowEmployeeName;
