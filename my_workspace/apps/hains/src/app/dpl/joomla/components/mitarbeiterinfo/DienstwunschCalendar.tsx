import React, { useContext } from 'react';

import FullCalendar from '@fullcalendar/react';
import deLocale from '@fullcalendar/core/locales/de';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import { ApiContext } from '../../context/mitarbeiterinfo/ApiProvider';
import { DienstwunschPopupContext } from '../../context/mitarbeiterinfo/DienstwunschPopupProvider';

import styles from '../../mitarbeiterinfo/app.module.css';

import { getTagKey, getStartAndEnd } from '../../helper/util';
import { convertDateToEnFormat } from '../../helper/dates';

type TProps = {
  index: number;
};

function inMonths(initialDate: string, i: number) {
  const date = initialDate ? new Date(initialDate) : new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  return new Date(year, month + i, 1);
}

export default function DienstwunschCalendar({ index }: TProps) {
  const {
    einteilungenPerMonth,
    einteilungenEvents,
    getNewEinteilungen,
    mitarbeiter_id,
    urlaubeSumEvents,
    fakeDotEvents,
    wunschEvents,
    initialDate
  } = useContext(ApiContext);

  const { receiveEventData, findEventByDate } = useContext(
    DienstwunschPopupContext
  );

  const eventsTrigger = (info: any, success: any) => {
    let start = '';
    let end = '';

    const nextDate = new Date(info.start);
    nextDate.setDate(1);
    while (nextDate < info.end) {
      const nextDateKey = getTagKey(convertDateToEnFormat(nextDate));
      if (!einteilungenPerMonth[nextDateKey]) {
        const obj = getStartAndEnd(nextDate);
        if (!start) start = obj.start;
        end = obj.end;
      }
      nextDate.setMonth(nextDate.getMonth() + 1);
    }

    if (start && end) {
      const params = {
        start,
        end,
        id: mitarbeiter_id
      };
      getNewEinteilungen(params);
    }

    success([
      ...einteilungenEvents,
      ...urlaubeSumEvents,
      ...wunschEvents,
      ...fakeDotEvents
    ]);
  };

  const handleEventClick = (info: any) => {
    const eventDef = info?.event?._def;
    const { clientX, clientY } = info.jsEvent;
    const eventType = eventDef?.extendedProps?.type;
    if (eventType !== 'wunsch' || info.el.classList.contains('wunsch_dot'))
      return;
    const event = { ...eventDef, start: info.dateStr };
    receiveEventData(event, { clientY, clientX });
  };

  const handleDateClick = (info: any) => {
    const { clientX, clientY } = info.jsEvent;
    const tag = info.dateStr;
    findEventByDate(tag, { clientY, clientX });
  };

  const handleEventOnMount = (info: any) => {
    // if (!info.el.classList.contains('wunsch_dot')) return;
    const label = info.event._def.extendedProps.label || '';
    if (label) {
      info.el.title = label;
    }
  };

  return (
    <div className={styles.calendar}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        initialDate={inMonths(initialDate, index)}
        headerToolbar={{
          right: 'prev,next'
        }}
        forceEventDuration
        selectable
        selectMirror
        height="auto"
        locale={deLocale}
        firstDay={1}
        timeZone="local"
        weekNumbers
        editable
        dayMaxEvents
        events={eventsTrigger}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
        eventDidMount={handleEventOnMount}
      />
    </div>
  );
}
