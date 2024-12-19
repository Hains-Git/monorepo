function Table({ calendar, range, dateUpdated, confirm }) {
  const isMonthView = calendar.view === 'month';
  const selectDay = (day, shiftKey, shouldConfirm = false) => {
    if (shiftKey && range) {
      calendar.setRangeDay(day);
    } else {
      calendar.resetRange();
    }
    calendar.changeSelectedDay(day);
    dateUpdated(day, calendar.view);
    if (shouldConfirm) confirm();
  };
  const clickOnDay = (day, e, shouldConfirm = false) => {
    selectDay(day, e.shiftKey, shouldConfirm);
  };
  const clickOnWeek = (e, shouldConfirm = false) => {
    if (calendar.view !== 'week') return;
    const tr = e.target.closest('tr');
    const lastTd = tr.childNodes[tr.childNodes.length - 1];
    const dayStr = lastTd.dataset?.day;
    const day = new Date(dayStr);
    selectDay(day, e.shiftKey, shouldConfirm);
  };

  return (
    <table className={calendar.view}>
      <thead>
        <tr>
          {calendar.renderTableHead().map((item) => {
            return (
              <th key={item}>
                <span>{item}</span>
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {calendar.renderTableBodyRows().map((row) => {
          const currentWeekCss = calendar.isWeekCurrent(row) ? 'active' : '';
          const thisWeekCss = calendar.isDayInCurrentWeek(row) ? 'active' : '';
          const isRangeDayInWeek = calendar.isRangeDayInWeek(row)
            ? 'active'
            : '';
          return (
            <tr
              key={row}
              className={`${currentWeekCss} ${isRangeDayInWeek}`.trim()}
            >
              {!isMonthView && (
                <th
                  onClick={(e) => {
                    clickOnWeek(e, false);
                  }}
                  onDoubleClick={(e) => {
                    clickOnWeek(e, true);
                  }}
                >
                  <span className={thisWeekCss}>
                    {calendar.getKwFromKey(row)}
                  </span>
                </th>
              )}
              {calendar.renderTableBodyColumns(row).map((day) => {
                const isDayInMonthCss =
                  isMonthView || calendar.isDayInMonth(day)
                    ? 'in-month'
                    : 'not-in-month';
                const isTodayCss = calendar.isDayToDay(day) ? 'today' : '';
                const isActiveCss = calendar.setActiveCss(day);
                return (
                  <td
                    data-day={day}
                    key={`${row}-${day}`}
                    className={isActiveCss}
                    onClick={(e) => {
                      clickOnDay(day, e, false);
                    }}
                    onDoubleClick={(e) => {
                      clickOnDay(day, e, true);
                    }}
                  >
                    <span className={`${isDayInMonthCss} ${isTodayCss}`}>
                      {isMonthView
                        ? calendar.getMonthName(day)
                        : calendar.getDayNumberFromDate(day)}
                    </span>
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default Table;
