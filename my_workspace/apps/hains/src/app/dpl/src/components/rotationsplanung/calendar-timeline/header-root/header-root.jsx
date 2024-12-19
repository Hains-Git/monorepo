import React from 'react';

import Header from './header/header';

import { UseRegisterKey } from '../../../../hooks/use-register';

function HeaderRoot({ rotationsplan }) {
  const update = UseRegisterKey("column-width", rotationsplan.timeline.push, rotationsplan.timeline.pull);
  const scrollUpdate = UseRegisterKey("scroll-update", rotationsplan.timeline.push, rotationsplan.timeline.pull);

  const todayYear = rotationsplan.timeline.todayYear;
  const columnWidth = rotationsplan.timeline.years[todayYear].columnWidth;
  const maxColumnWidth = rotationsplan.timeline.rangeWidth[1];
  const headerRootHeight = columnWidth === maxColumnWidth ? '92' : '66';

  return (
    <div
      className="cct-header-root"
      style={{
        width: `${rotationsplan.timeline.cctScroll.clientWidth}px`,
        height: `${headerRootHeight}px`
      }}
    >
      <Header rotationsplan={rotationsplan} />
    </div>
  );
}

export default HeaderRoot;
