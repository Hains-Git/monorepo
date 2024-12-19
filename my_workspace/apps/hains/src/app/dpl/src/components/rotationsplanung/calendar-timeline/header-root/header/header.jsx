import React from 'react';

import Column from '../../column/column';
import GetColumns from '../../get-columns';

import { UseRegisterKey } from '../../../../../hooks/use-register';

function Header({ rotationsplan }) {
  UseRegisterKey(
    'scroll-to',
    rotationsplan.timeline.push,
    rotationsplan.timeline.pull
  );

  return (
    <div
      className="cct-header"
      style={{
        width: `${rotationsplan.timeline.fullWidth}px`,
        left: `-${rotationsplan.timeline.scrollPos}px`
      }}
    >
      <div className="cct-header-top">
        {Object.values(rotationsplan.timeline.years).map((yearObj) => (
          <Column
            rotationsplan={rotationsplan}
            columnWidth={yearObj.yearWidth}
            key={yearObj.key}
            text={yearObj.year}
          />
        ))}
      </div>
      <div className="cct-header-bottom">
        <GetColumns text year rotationsplan={rotationsplan} />
      </div>
    </div>
  );
}

export default Header;
