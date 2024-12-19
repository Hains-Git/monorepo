import React, { useRef, useEffect } from 'react';

import Body from './body';

import { UseRegisterKey } from '../../../../hooks/use-register';
import { shortwait, throttle } from '../../../../tools/debounce';

function BodyRoot({ rotationsplan, onDoubleClick }) {
  const cctScroll = useRef(null);

  const todayYear = rotationsplan.timeline.todayYear;
  const columnWidth = rotationsplan.timeline.years[todayYear].columnWidth;
  const maxColumnWidth = rotationsplan.timeline.rangeWidth[1];
  const bodyRootTop = columnWidth === maxColumnWidth ? '94' : '64';

  UseRegisterKey(
    'column-width',
    rotationsplan.timeline.push,
    rotationsplan.timeline.pull
  );
  const scrollToMonthOnce = UseRegisterKey(
    'scroll-to',
    rotationsplan.timeline.push,
    rotationsplan.timeline.pull
  );

  useEffect(() => {
    if (cctScroll.current && rotationsplan) {
      rotationsplan.timeline.cctScroll = cctScroll.current;
      rotationsplan.timeline.checkForDisplayWidth();
    }
    if (rotationsplan) {
      return () => {
        rotationsplan.timeline.cctScroll = false;
      };
    }
  }, [cctScroll, rotationsplan]);

  useEffect(() => {
    if (rotationsplan) {
      rotationsplan.timeline.scrollToCurMonth();
    }
  }, [scrollToMonthOnce]);

  const zoomSection = (event) => {
    // for maybe bug on chrome: https://stackoverflow.com/questions/14926366/mousewheel-event-in-modern-browsers
    if (!event.shiftKey) {
      return;
    }
    rotationsplan.timeline.calculateNewProps(event);
  };

  const scrollSection = (event) => {
    if (event.target.scrollLeft !== rotationsplan.timeline.scrollPos) {
      rotationsplan.timeline.infiniteScroll(event);
    }
    if (event.target.scrollTop !== rotationsplan.timeline.scrollTopPos) {
      rotationsplan.timeline.setScrollTopPos(event.target.scrollTop);
    }
  };

  const throttledZoom = throttle(zoomSection, shortwait);

  return (
    <div
      className="cct-body-root"
      style={{ paddingTop: `${bodyRootTop}px` }}
      // onScroll={throttle(scrollSection, 50)}
      onScroll={scrollSection}
      ref={cctScroll}
      onWheel={throttledZoom}
      onDoubleClick={onDoubleClick}
    >
      <Body rotationsplan={rotationsplan} />
    </div>
  );
}

export default BodyRoot;
