import React, { useState, useEffect, useCallback, useRef } from 'react';

import HeaderRoot from './header-root/header-root';
import BodyRoot from './body-root/body-root';
import Sidebar from './sidebar/sidebar';

function CalendarTimeline({ rotationsplan, setShowRotationForm }) {
  let pull = false;
  let push = false;

  if (rotationsplan) {
    pull = rotationsplan.timeline.pull;
    push = rotationsplan.timeline.push;
  }

  // https://dmitripavlutin.com/react-throttle-debounce/
  // const debounceWheelHandler = useCallback((event) => throttle(scrollSection, 100),[])

  if (!rotationsplan) {
    return null;
  }

  const showForm = (event) => {
    const className = event.target.classList;
    if (className.contains('cct-column')) {
      if (rotationsplan.timeline.view === 'contingent') {
        const kontingent_id = event.target.offsetParent.dataset.contingent;
        const rotation = {
          show: true,
          id: 0,
          kontingent_id,
          date: event.target.dataset.columnkey
        };
        setShowRotationForm(() => rotation);
      } else {
        const rotation = {
          show: true,
          id: 0,
          employee_id: event.target.offsetParent.dataset.employee,
          date: event.target.dataset.columnkey
        };
        setShowRotationForm(() => rotation);
      }
    }
    if (className.contains('cct-rotation')) {
      const curEl =
        event.target.tagName === 'SPAN'
          ? event.target.parentNode
          : event.target;
      if (rotationsplan.timeline.view === 'contingent') {
        const rotation_data = curEl.dataset.rotation.split('-');
        const rotation_id = rotation_data[0];
        const kontingent_id = rotation_data[1];

        const rotation = {
          show: true,
          id: rotation_id,
          kontingent_id,
          date: ''
        };
        setShowRotationForm(() => rotation);
      } else {
        const rotation_data = curEl.dataset.rotation.split('-');
        const rotation_id = rotation_data[0];
        const kontingent_id = rotation_data[1];
        const employee_id = rotation_data[2];

        const rotation = {
          show: true,
          id: rotation_id,
          kontingent_id,
          employee_id
        };
        setShowRotationForm(() => rotation);
      }
    }
  };

  return (
    <div className="calendar-timeline">
      <Sidebar rotationsplan={rotationsplan} />
      <div className="cct-scroll">
        <HeaderRoot rotationsplan={rotationsplan} />
        <BodyRoot onDoubleClick={showForm} rotationsplan={rotationsplan} />
      </div>
    </div>
  );
}

export default CalendarTimeline;
