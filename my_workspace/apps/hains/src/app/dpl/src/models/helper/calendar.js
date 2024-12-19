import Basic from '../basic';
import {
  addDays,
  daysInMonth,
  getWeek,
  startDayOfWeek,
  lastDayOfWeek,
  addDateByType,
  getMonth,
  getMonthShort,
  getGermanDate,
  getKWLabel,
  today,
  getYear,
  formatDate,
  startOfMonth,
  dateRegEx
} from '../../tools/dates';

class Calendar extends Basic {
  constructor(appModel = false, view = 'day') {
    super(appModel);
    this.day = today();
    this.rangeDay = [];
    this.cancledDay = this.day;
    this.cancelRange = this.rangeDay;
    this.today = today();
    this.yearDates = this.init();
    this.view = view;
    this.views = { month: 'Monat', week: 'Woche', day: 'Tag' };
    this.cbObj = {};
    this.showViews = true;
    this.loader = false;
    this.changeSelectedDay(this.day, false);
    this.confirm();
  }

  get dayString() {
    return formatDate(this.day);
  }

  init() {
    const date = this.day;
    const year = date.getFullYear();
    return this.generateYearCal(year);
  }

  /**
   * @param {string} year
   * @returns {Object} Liefert ein zusammengestelltes Jahres Objekt mit Monaten, Wochen und Tagen
   */
  generateYearCal(year) {
    const cd = {};
    const monthsNum = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

    if (!cd[year]) cd[year] = {};

    monthsNum.forEach((monthNum) => {
      if (!cd[year][monthNum]) cd[year][monthNum] = {};
      const _daysInMonth = daysInMonth(monthNum, year);
      for (let i = 1; i <= _daysInMonth; i++) {
        const currentDate = new Date(year, monthNum, i);
        const wk = getWeek(currentDate);
        if (!cd[year][monthNum][wk]) {
          cd[year][monthNum][`${year}-${wk}`] =
            this.fillUpWeekDays(currentDate);
        }
      }
    });
    return cd;
  }

  updateCalendar() {
    this.update('updateCalendar');
  }

  renderTableHead() {
    const thead =
      this.view === 'month'
        ? []
        : ['KW', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
    return thead;
  }

  renderTableBodyRows() {
    if (this.view === 'month') {
      const monthsObj = this.yearDates[this.year];
      const months = Object.keys(monthsObj);
      return months.filter((m) => parseInt(m, 10) % 3 === 0);
    }
    const kws = this.yearDates[this.year][this.month];
    return Object.keys(kws);
  }

  renderTableBodyColumns(kw) {
    if (this.view === 'month') {
      const monthsObj = this.yearDates[this.year];
      const startMonth = parseInt(kw, 10);
      const endMonth = startMonth + 2;
      const dateNum = this.day.getDate();
      const dates = Object.keys(monthsObj).reduce((acc, m) => {
        const nr = parseInt(m, 10);
        if(nr >= startMonth && nr <= endMonth) {
          acc.push(new Date(this.year, nr, dateNum));
        }
        return acc;
      }, []);
      return dates;
    }
    const kws = this.yearDates[this.year][this.month];
    return kws[kw];
  }

  renderViewText() {
    return this.showViews ? Object.keys(this.views) : [];
  }

  renderPreview() {
    let text = null;
    const day = this.selectedDay || this.day;
    const firstDay = this.rangeDay[0];
    const lastDay = this.rangeDay[1];

    if (this.view === 'day') {
      if (this.rangeDay.length === 2) {
        const date1 = getGermanDate(firstDay);
        const date2 = getGermanDate(lastDay);
        text = `${date1.name.slice(0, 2)}, ${date1.dateDe} - ${date2.name.slice(
          0,
          2
        )}, ${date2.dateDe}`;
      } else {
        const { name, dateDe } = getGermanDate(day);
        text = `${name}, ${dateDe}`;
      }
    } else if (this.view === 'week') {
      text = `KW${getWeek(day)} ${getMonthShort(day)} ${this.selectedYear}`;
      if (this.rangeDay.length === 2) {
        const leftSide = `KW${getWeek(firstDay)} ${getMonthShort(
          firstDay
        )} ${getYear(firstDay)}`;
        const rightSide = `KW${getWeek(lastDay)} ${getMonthShort(
          lastDay
        )} ${getYear(lastDay)}`;
        text = `${leftSide} - ${rightSide}`;
      }
    } else {
      text = `${getMonth(day)} ${this.selectedYear}`;
      if (this.rangeDay.length === 2) {
        const leftSide = `${getMonthShort(firstDay)} ${getYear(firstDay)}`;
        const rightSide = `${getMonthShort(lastDay)} ${getYear(lastDay)}`;
        text = `${leftSide} - ${rightSide}`;
      }
    }
    return text;
  }

  renderPreviewFooter() {
    let text = null;
    const now = this.today;
    if (this.view === 'day') {
      const { name, dateDe } = getGermanDate(now);
      text = `${name}, ${dateDe}`;
    } else if (this.view === 'week') {
      text = getKWLabel(now);
    } else {
      text = `${getMonth(now)} ${now.getFullYear()}`;
    }
    return text;
  }

  setDateOnToday() {
    this.changeSelectedDay(this.today);
  }

  changeView(view) {
    this.view = view;
    this.updateCalendar();
  }

  viewDependentNext(view = 'day', amount = 1) {
    const day = addDateByType(this.selectedDay, amount, view);
    this.changeSelectedDay(day);
  }

  prev() {
    this.viewDependentNext(this.view, -1);
  }

  next() {
    this.viewDependentNext(this.view, 1);
  }

  prevMonth() {
    this.viewDependentNext('month', -1);
  }

  nextMonth() {
    this.viewDependentNext('month', 1);
  }

  prevYear() {
    this.viewDependentNext('year', -1);
  }

  nextYear() {
    this.viewDependentNext('year', 1);
  }

  cancel() {
    this.changeSelectedDay(this.cancledDay, true);
    this.rangeDay = [...this.cancelRange];
    this.loader = false;
  }

  loading() {
    this.loader = true;
    this.updateCalendar();
  }

  removeLoader() {
    this.loader = false;
    this.updateCalendar();
  }

  confirm() {
    this.cancledDay = this.selectedDay || this.day;
    this.cancelRange = this.rangeDay;
    this.confirmed = {
      day: this.selectedDay,
      wk: this.selectedWeek,
      month: this.selectedMonth,
      range: this.rangeDay
    };
  }

  shouldUpdateData(day) {
    let update = false;
    const firstDay =
      this.view === 'day'
        ? this.selectedDay || this.day
        : startDayOfWeek(day, 1);
    const secondDay = this.view === 'day' ? day : lastDayOfWeek(day, 1);
    if (firstDay.getMonth() !== secondDay.getMonth()) {
      update = true;
    }
    this.cbObj = {
      ...this.cbObj,
      dayTo: secondDay
    };
    return update;
  }

  changeSelectedDay(day, cancel = false) {
    const updateData = this.shouldUpdateData(day);
    this.day = day;
    this.selectedDay = (cancel && this.confirmed?.day) || day;
    this.kw = getWeek(day);
    this.selectedWeek = (cancel && this.confirmed.wk) || getWeek(day);
    this.month = day.getMonth();
    this.selectedMonth = (cancel && this.confirmed?.month) || day.getMonth();
    const year = day.getFullYear();
    if (year !== this.year) {
      this.year = day.getFullYear();
      this.selectedYear = day.getFullYear();
      this.yearDates = this.generateYearCal(this.year);
    }
    this.cbObj = {
      day: this.selectedDay,
      wk: this.selectedWeek,
      year: this.selectedYear,
      month: this.selectedMonth,
      range: this.rangeDay,
      shouldUpdate: updateData
    };
    this.updateCalendar();
  }

  /**
   * @param {string} key - 2023-31
   * @returns {string} Gibt vom String die Kalenderwoche (31) zurueck.
   */
  getKwFromKey(key) {
    return parseInt(key.split('-')[1], 10);
  }

  /**
   * @param {string} key - 2023-31
   * @returns {string} Gibt vom String das Jahr (2023) zurueck.
   */
  getYearFromKey(key) {
    return parseInt(key.split('-')[0], 10);
  }

  /**
   * @param {Date} date
   * @returns {Number} Gibt den Tag als Zahl zurueck.
   */
  getDayNumberFromDate(date) {
    return date.getDate();
  }

  /**
   * @param {Date} day
   * @returns {Boolean} Gibt true wenn der Tag zu dem Monat gehoert.
   */
  isDayInMonth(day) {
    return day.getMonth() === this.month;
  }

  isDayToDay(day) {
    return day.toDateString() === this.today.toDateString?.();
  }

  isDayInCurrentWeek(row) {
    return !!(
      this.getKwFromKey(row) === getWeek(this.today) &&
      this.today?.getFullYear?.() === this.getYearFromKey(row)
    );
  }

  /**
   * @param {Date} day
   * @returns {Boolean} Gibt true wenn day gleich dem ausgewaehlten Tag ist.
   */
  isDayCurrent(day) {
    return day.toDateString() === this.selectedDay.toDateString?.();
  }

  isWeekCurrent(row) {
    return this.view === 'week'
      ? !!(
          this.getKwFromKey(row) === this.selectedWeek &&
          this.selectedYear === this.getYearFromKey(row)
        )
      : false;
  }

  isMonthCurrent(day) {
    const year = day.getFullYear();
    const month = day.getMonth();
    return !!(this.selectedYear === year && this.selectedMonth === month);
  }

  getMonthName(date = null) {
    const _date = date || this.day;
    return getMonth(_date);
  }

  /**
   * @param {Date|String} currentDate
   * @returns {Date[]} Liefert die Tage der Woche
   */
  fillUpWeekDays(currentDate) {
    const _startDayOfWeek = startDayOfWeek(currentDate, 1);
    const endDayOfWeek = lastDayOfWeek(currentDate, 1);
    let day = _startDayOfWeek;
    const days = [];

    while (day <= endDayOfWeek) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }

  setActiveCss(day) {
    const isMonthView = this.view === 'month';
    let isActiveCss = '';
    isActiveCss = (isMonthView && this.isMonthCurrent(day) && 'active') || '';
    if (this.rangeDay.length === 2) {
      isActiveCss = (this.isDayInRange(day) && 'active') || '';
    } else {
      isActiveCss = (this.isDayCurrent(day) && 'active') || '';
    }
    return isActiveCss;
  }

  isRangeDayInWeek(row) {
    let rangDay1 = this.rangeDay[0];
    const rangDay2 = this.rangeDay[1];
    const curWeek = parseInt(row.split('-')[1], 10);
    if (rangDay1 && rangDay2) {
      rangDay1 = startDayOfWeek(rangDay1, 1);
      const firstWeek = getWeek(rangDay1);
      const lastWeek = getWeek(rangDay2);
      if (curWeek >= firstWeek && curWeek <= lastWeek) {
        return true;
      }
    }
    return false;
  }

  setRangeDay(day) {
    if (!this.rangeDay.includes(day) && this.rangeDay.length < 2) {
      this.rangeDay.push(day);
    } else {
      this.rangeDay = [];
      this.rangeDay.push(day);
    }
    this.rangeDay.sort((a, b) => a - b);
    if (this.view === 'week') {
      this.rangeDay[0] = startDayOfWeek(this.rangeDay[0], 1);
    }
    console.log(this.rangeDay);
  }

  isDayInRange(day) {
    if (this.rangeDay.length < 2) return false;
    let isInRange = false;
    const start = this.rangeDay[0];
    const end = this.rangeDay[1];
    if (day >= start && day <= end) {
      isInRange = true;
    }
    return isInRange;
  }

  resetRange() {
    this.rangeDay = [];
  }

  /**
   * Liefert je nach View, den Anfang der Auswahl
   * @returns 
   */
  getViewSelectedDayStartString() {
    let day = this.selectedDay;
    if (this.view === 'week') {
      day = startDayOfWeek(day, 1);
    } else if (this.view === 'month') {
      day = startOfMonth(day);
    }
    return formatDate(day);
  }

  /**
   * @param {String} date 
   * @returns True, wenn date ein String der Form YYYY-MM-DD ist
   */
  checkIsDateString(date) {
    return typeof date === 'string' && dateRegEx.test(date);
  }

  /**
   * Location updaten, wenn sich Tag, Woche oder Monat geändert hat
   * @param {String} date 
   * @returns True, wenn sich der Tag, die Woche oder der Monat geändert hat
   */
  dateLocationChanged(date) {
    if (!this.checkIsDateString(date)) return false;
    const day = new Date(date);
    const oldDay = this.getViewSelectedDayStartString();
    this.changeSelectedDay(day, false);
    this.confirm();
    return oldDay !== this.getViewSelectedDayStartString();
  }
}

export default Calendar;
