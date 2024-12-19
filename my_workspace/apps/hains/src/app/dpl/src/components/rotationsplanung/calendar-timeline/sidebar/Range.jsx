import React, { useEffect, useState } from 'react';
import { today } from '../../../../tools/dates';
import { throttle } from '../../../../tools/debounce';

function Range({ rotationsplan }) {
  const [dateStartString, setDateStartString] = useState('');

  useEffect(() => {
    const todayDate = today();
    const todayYear = String(todayDate.getFullYear());
    const todayMonth = String(todayDate.getMonth() + 1).padStart(2, 0);
    const todayDay = String(todayDate.getDate());

    const todayString = `${todayYear}-${todayMonth}-${todayDay}`;
    setDateStartString(() => todayString);
  }, []);

  useEffect(() => {
    if (dateStartString) {
      const dateStart = new Date(dateStartString);
      rotationsplan.timeline.setNewRangeDateToTimeline(dateStart);
    }
  }, [dateStartString]);

  const onChangePeriod = (evt) => {
    setDateStartString(() => evt.target.value.trim());
  };

  const throttledOnChangePeriod = throttle(onChangePeriod, 370);

  return (
    <div className="fieldset column inline">
      <label>Startdatum:</label>
      <input
        type="date"
        value={dateStartString}
        name="date-from"
        onChange={throttledOnChangePeriod}
      />
    </div>
  );
}

export default Range;
