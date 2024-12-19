import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './calendar.css';
import { MdArrowBackIosNew, MdArrowForwardIos } from 'react-icons/md';
import { useHistory, useLocation } from 'react-router-dom';
import SpinnerIcon from '../spinner-icon/SpinnerIcon';
import { UseRegisterKey } from '../../../hooks/use-register';
import Table from './Table';
import { UseMounted } from '../../../hooks/use-mounted';

import CalenderModel from '../../../models/helper/calendar';
import DienstplanCalendar from '../../../models/helper/dienstplancalendar';
import { debounce, wait } from '../../../tools/debounce';
/**
 * Dieser Kalender hat drei Ansichten. Eine Tages, Wochen und - Monatsansicht.
 * Zuästslich kann über den parameter range bestimmt werden ob man eine Von - Bis Auswahl treffen möchte.
 * Zur Zeit funktioniert diese Option nur für die Tages Ansicht. */
function Calendar({
  children,
  calendar,
  arrows = false,
  range = false,
  showView = false,
  showCalender = false,
  setShowCalender,
  dateUpdated,
  dateConfirmed,
  updateLocation = false
}) {
  UseRegisterKey('updateCalendar', calendar.push, calendar.pull, calendar);
  const [widthExtended, setWidthExtended] = useState({});
  const mounted = UseMounted();
  const year = calendar.day.getFullYear();
  const history = useHistory();
  // Update on change of the location, if update is necessary.
  // Wenn keine Query übergeben wurde, kein Update durchführen!
  const location = useLocation();

  const changeView = (_view) => {
    calendar.changeView(_view);
  };

  const prevMonth = () => {
    calendar.prevMonth();
    dateUpdated(calendar.selectedDay, calendar.view);
  };

  const nextMonth = () => {
    calendar.nextMonth();
    dateUpdated(calendar.selectedDay, calendar.view);
  };

  const prevYear = () => {
    calendar.prevYear();
    dateUpdated(calendar.selectedDay, calendar.view);
  };

  const nextYear = () => {
    calendar.nextYear();
    dateUpdated(calendar.selectedDay, calendar.view);
  };

  const chooseYear = (e) => {
    const _year = parseInt(e.target.value, 10);
    if (_year < year) {
      calendar.prevYear();
    } else {
      calendar.nextYear();
    }
    dateUpdated(calendar.selectedDay, calendar.view);
  };

  const dateConfirmAndShowLoader = () => {
    calendar.loading();
    setShowCalender(() => false);
    setTimeout(() => {
      if (mounted) {
        dateConfirmed(calendar.cbObj);
        const calendarDay = calendar?.dayString;
        if (calendarDay) {
          history.push(`${history.location.pathname}?date=${calendarDay}`);
        }
      }
    }, 100);
  };

  const debounceUpdate = useCallback(
    debounce(() => {
      dateUpdated(calendar.selectedDay, calendar.view, () => {
        dateConfirmAndShowLoader();
      });
    }, wait),
    [calendar]
  );

  const prev = () => {
    calendar.prev();
    debounceUpdate();
  };

  const next = () => {
    calendar.next();
    debounceUpdate();
  };

  const setToday = () => {
    calendar.setDateOnToday();
  };

  const cancel = () => {
    calendar.cancel();
    setShowCalender((val) => !val);
  };

  const confirm = () => {
    calendar.confirm();
    dateConfirmAndShowLoader();
  };

  const confirmOnEnter = (evt) => {
    if (evt.key === 'Enter') {
      evt.preventDefault();
      evt.stopPropagation();
      confirm();
    }
  };

  const renderSelectYears = () => {
    return (
      <select aria-label="years" onChange={chooseYear} value={year}>
        <option value={year - 1}>{year - 1}</option>
        <option value={year}>{year}</option>
        <option value={year + 1}>{year + 1}</option>
      </select>
    );
  };

  useEffect(() => {
    showCalender && document.addEventListener('keyup', confirmOnEnter);
    return () => {
      document.removeEventListener('keyup', confirmOnEnter);
    };
  }, [calendar, showCalender]);

  useEffect(() => {
    const locationDate = new URLSearchParams(location.search).get('date');
    const shouldUpdate =
      updateLocation && calendar?.dateLocationChanged?.(locationDate);
    if (shouldUpdate) {
      debounceUpdate();
    }
  }, [calendar, location]);

  return (
    <div className={`calendar ${calendar.view}`}>
      <div className="preview-wrapper">
        <div className="preview">
          {arrows && (
            <p onClick={prev}>
              <MdArrowBackIosNew />
            </p>
          )}
          <p onClick={cancel}>{calendar.renderPreview()}</p>
          {arrows && (
            <p onClick={next}>
              <MdArrowForwardIos />
            </p>
          )}
        </div>
        <div className="loader">
          {calendar.loader && (
            <SpinnerIcon
              width={20}
              height={20}
              borderWidth="0.15rem"
              color="#00427a"
            />
          )}
        </div>
      </div>
      {showCalender && (
        <div className="calendar-popup">
          <div className="header">
            {showView && (
              <div className="view">
                {calendar.renderViewText().map((view) => (
                  <p
                    className={view === calendar.view ? 'active' : ''}
                    key={view}
                    onClick={() => changeView(view)}
                  >
                    {calendar.views[view]}
                  </p>
                ))}
              </div>
            )}
            <div className="month-name">
              {calendar.view !== 'month' ? (
                <div className="current-date">
                  <p onClick={prevMonth}>
                    <MdArrowBackIosNew />
                  </p>
                  <p>
                    <span>{calendar.getMonthName()}</span>
                    {renderSelectYears()}
                  </p>
                  <p onClick={nextMonth}>
                    <MdArrowForwardIos />
                  </p>
                </div>
              ) : (
                <div className="current-date">
                  <p onClick={prevYear}>
                    <MdArrowBackIosNew />
                  </p>
                  {renderSelectYears()}
                  <p onClick={nextYear}>
                    <MdArrowForwardIos />
                  </p>
                </div>
              )}
            </div>
          </div>
          <div
            className="body"
            ref={(body) => {
              if (!body) return;
              const { width } = body.getBoundingClientRect();
              setWidthExtended((current) => {
                const newWidth = `${width}px`;
                if (current?.width === newWidth) return current;
                return { width: newWidth };
              });
            }}
          >
            <Table
              range={range}
              dateUpdated={dateUpdated}
              calendar={calendar}
              confirm={confirm}
            />
            <div className="footer">
              <p onClick={setToday}>{calendar.renderPreviewFooter()}</p>
              <div className="buttons">
                <p onClick={cancel}>Cancel</p>
                <p onClick={confirm}>OK</p>
              </div>
            </div>
          </div>
          <div className="extend-component" style={widthExtended}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;

Calendar.propTypes = {
  /** Ob eine von - bis Auswahl aktiviert werden soll. */
  range: PropTypes.bool,
  /** Das Kalender Model */
  calendar: PropTypes.oneOfType([
    PropTypes.instanceOf(CalenderModel),
    PropTypes.instanceOf(DienstplanCalendar)
  ]).isRequired,
  /** Ob Pfeile angezeigt werden sollen, neben dem Datum. */
  arrows: PropTypes.bool,
  /** Ob im Calender der wechsel der Ansicht sichtbar sein soll. */
  showView: PropTypes.bool,
  /** Ob der Kalender sichtbar ist. */
  showCalender: PropTypes.bool.isRequired,
  /** Die Funktion von useState */
  setShowCalender: PropTypes.func.isRequired,
  /** Wird aufgerufen bei jedem wechsel des Tages. */
  dateUpdated: PropTypes.func.isRequired,
  /** Wird aufgerufen wenn der OK - Button geklickt wurde */
  dateConfirmed: PropTypes.func.isRequired,
  /** Ob die Location der Route geupdatet werden soll. */
  updateLocation: PropTypes.bool
};
