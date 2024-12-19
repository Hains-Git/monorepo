import React, { useEffect, useState } from 'react';

import { UseRegisterKey } from '../../../../hooks/use-register';
import { UseTooltip } from '../../../../hooks/use-tooltip';

function RowContingentName({ contingent, rotationsplan }) {
  const [height, setHeight] = useState(1);
  const [title, setTitle] = useState(contingent.vkTitle);
  const rowHeight = UseRegisterKey(
    'sidebar-row-height',
    contingent.push,
    contingent.pull
  );
  const vkUpdate = UseRegisterKey(
    'vk-update',
    rotationsplan.push,
    rotationsplan.pull
  );
  const [onOver, onOut] = UseTooltip(title);

  useEffect(() => {
    setTitle(() => contingent.vkTitle);
  }, [vkUpdate, contingent]);

  useEffect(() => {
    setHeight(() => contingent.getHeight() || 1);
  }, [rowHeight]);

  return (
    <div
      className="cct-row"
      data-contingent={contingent.id}
      style={{
        height: `${height * 30 + 5}px`
      }}
    >
      <p onMouseOver={onOver} onMouseOut={onOut}>
        {contingent.name}
      </p>
    </div>
  );
}

// export default React.memo(RowContingentName);
export default RowContingentName;
