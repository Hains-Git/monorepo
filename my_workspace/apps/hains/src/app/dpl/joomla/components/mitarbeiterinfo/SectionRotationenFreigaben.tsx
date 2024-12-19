import React, { useContext, useEffect, useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import deLocale from '@fullcalendar/core/locales/de';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { FaSync, FaHistory, FaUserShield, FaBook } from 'react-icons/fa';
import { ApiContext } from '../../context/mitarbeiterinfo/ApiProvider';

import CardWrapper from './CardWrapper';
import TabBar from '../utils/tab-bar/TabBar';
import OverviewTable from './tables/OverviewTable';
import FreigabenTable from './tables/FreigabenTable';

import { TRotation, TKontingent } from '../../helper/api_data_types';

import styles from '../../mitarbeiterinfo/app.module.css';
import { getTagKey, getStartAndEnd, getFontColorByWhite } from '../../helper/util';
import { addDays, formatDate } from '../../../src/tools/dates';
import { convertDateToEnFormat } from '../../helper/dates';
import GeraetepaesseTable from './tables/GeraetepaesseTable';

type TProps = {
  setRotationData: React.SetStateAction<any>;
  mitarbeiterData: React.SetStateAction<any>;
  rotationen: TRotation[];
  freigabenRotationen: object;
  kontingente: TKontingent[] | undefined;
};

type TEventRotation = {
  start: string;
  end: string | Date;
  title: string;
  backgroundColor: string;
  allDay: boolean;
  id: number;
  textColor: string;
  borderColor: string;
  color: string;
  extendedProps?: {
    id: number;
    type: string;
    von: string;
    bis: string;
    position: number;
    prioritaet: number;
    kommentar?: string;
    published: boolean;
    cat?: string;
    kontingent_id: number;
  };
};

export default function SectionRotationenFreigaben({
  setRotationData,
  mitarbeiterData,
  rotationen,
  freigabenRotationen,
  kontingente
}: TProps) {
  const {
    einteilungenPerMonth,
    einteilungenEvents,
    getNewEinteilungen,
    mitarbeiter_id,
    initialDate,
    dienstfreiEvents
  } = useContext(ApiContext);

  const [rotationenEvents, setRotationenEvent] = useState<TEventRotation[]>([]);

  const [rightSecIx, setRightSecIx] = useState(0);

  const calendarRef = useRef<FullCalendar | null>(null);

  const getRotationEvent = (item: TRotation, kontingent: any) => {
    const bgColor = item.published ? '#add8e6' : '#d3d3d3';
    const { color } = getFontColorByWhite(bgColor);
    const bisDate = new Date(item.bis);
    // Becaus fullcalendar uses the end date as an axclusive date not inclusive
    bisDate.setDate(bisDate.getDate() + 1);

    const event: TEventRotation = {
      id: item.id,
      title: kontingent.name,
      start: item.von,
      end: bisDate,
      allDay: true,
      backgroundColor: bgColor,
      borderColor: 'transparent',
      textColor: color,
      color,
      extendedProps: {
        id: item.id,
        position: item.position,
        prioritaet: item.prioritaet,
        kommentar: item.kommentar,
        published: item.published,
        cat: 'rotation',
        kontingent_id: item.kontingent_id,
        bis: item.bis,
        von: item.von,
        type: 'rotation'
      }
    };
    return event;
  };

  const createRotationenEvents = () => {
    const events: TEventRotation[] = [];
    rotationen.forEach((item: TRotation) => {
      const kontingent = kontingente?.find((kontingent) => kontingent.id === item.kontingent_id);
      const event = getRotationEvent(item, kontingent);
      events.push(event);
    }, []);
    setRotationenEvent(events);
  };

  useEffect(() => {
    createRotationenEvents();
  }, [rotationen]);

  useEffect(() => {
    if (mitarbeiterData) {
      createRotationenEvents();
    }
  }, [mitarbeiterData]);

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

    success([...rotationenEvents, ...einteilungenEvents, ...dienstfreiEvents]);
  };

  const handleDateClick = (info: any) => {
    const von = info.dateStr;
    const nextDate = addDays(von, 1);
    const bis = formatDate(nextDate);
    const mitarbeiter_planname = mitarbeiterData.mitarbeiter.planname;
    const kontingent_id = kontingente?.[0].id || 0;
    const rotation_id = '';
    const rot = {
      kontingent_id,
      rotation_id,
      von,
      bis,
      prioritaet: 1,
      position: 0,
      kommentar: '',
      published: true,
      mitarbeiter_id,
      mitarbeiter_planname
    };
    setRotationData(rot);
  };

  const handleEventClick = (info: any) => {
    const extendedProps = info.event._def.extendedProps;
    if (extendedProps.type !== 'rotation') return;
    const mitarbeiter_planname = mitarbeiterData.mitarbeiter.planname;
    const rotation_id = extendedProps.id;
    setRotationData({
      ...extendedProps,
      rotation_id,
      mitarbeiter_id,
      mitarbeiter_planname
    });
  };

  const handleRightSecTabBar = ({ name, index }: { name: string; index: number }) => {
    setRightSecIx(index);
  };

  return (
    <div className={styles.section_grid}>
      <CardWrapper>
        <TabBar tabs={[{ name: 'Alle Rotationen', icon: <FaSync /> }]} />
        <div className={styles.calendar}>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek'
            }}
            initialDate={initialDate}
            forceEventDuration
            selectable
            selectMirror
            height="auto"
            locale={deLocale}
            firstDay={1}
            timeZone="local"
            weekNumbers
            navLinks
            editable
            dayMaxEvents
            events={eventsTrigger}
            eventDidMount={(info) => {
              const desc = info?.event._def?.extendedProps?.label || '';
              info.el.title = desc;
            }}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
          />
        </div>
      </CardWrapper>
      <CardWrapper>
        <TabBar
          tabs={[
            { name: 'Überblick', icon: <FaHistory /> },
            { name: 'Freigaben', icon: <FaUserShield /> },
            { name: 'Gerätepässe', icon: <FaBook /> }
          ]}
          onSelected={handleRightSecTabBar}
        />
        {rightSecIx === 0 && <OverviewTable kontingente={kontingente} freigabenRotationen={freigabenRotationen} />}
        {rightSecIx === 1 && <FreigabenTable />}
        {rightSecIx === 2 && <GeraetepaesseTable />}
      </CardWrapper>
    </div>
  );
}
