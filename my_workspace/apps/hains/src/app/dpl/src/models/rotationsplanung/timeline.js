import ColumnYear from './columnYear';
import Basic from '../basic';
import { returnError } from "../../tools/hains";
import { hainsOAuth } from "../../tools/helper";
import { today } from '../../tools/dates';

class Timeline extends Basic {
  constructor({ years, zoomVal, rangeWidth, initialColumnWidth, curYear, curMonth }, appModel) {
    super(appModel);
    this.zoomVal = zoomVal;
    this.rangeWidth = rangeWidth;
    this.initialColumnWidth = initialColumnWidth;
    this.view = "contingent";
    // this.view = "mitarbeiter";
    this.onlyActiveEmployees = true;
    this.contingentIds = [];
    this.employeeIds = [];
    this.years = this.createColumnYears(years, initialColumnWidth);
    this.cctScroll = false;
    this.fullWidth = this.calculateNewFullWidth();
    this.monthsPositions = this.calculateMonthsPositions();
    this.scrollPos = 0;
    this.scrollTopPos = 0;
    this.shoudScroll = false;
    this.countMonth = 3;
    this.todayMonth = curMonth;
    this.todayYear = curYear;
    this.renderYears = years;
    this.count = 0;
    this.hainsApi = hainsOAuth;
  }

  createColumnYears(years, initialColumnWidth) {
    // console.time("createColumnYears")
    const columnYears = {};
    const yearObj = {};
    let previosYearMonths = 0;

    Object.keys(years).forEach((year, index) => {
      if (index === 0) {
        const columnYear = new ColumnYear(
          year,
          initialColumnWidth,
          index,
          this.zoomVal,
          years[year].months,
          previosYearMonths,
          this.rangeWidth,
          this._appModel
        );
        previosYearMonths += Object.keys(columnYear.months).length;
        yearObj[year] = columnYear
      }
      else {
        const columnYear = new ColumnYear(
          year,
          initialColumnWidth,
          index,
          this.zoomVal,
          years[year].months,
          previosYearMonths,
          this.rangeWidth,
          this._appModel
        );
        previosYearMonths += Object.keys(columnYear.months).length;
        yearObj[year] = columnYear
      }
      columnYears[year] = yearObj[year];
    });

    // console.timeEnd("createColumnYears")
    return columnYears;
  }

  setFullWidth(width) {
    this.fullWidth = width;
  }

  setScrollPos(pos) {
    this.scrollPos = pos;
  }

  fillContingentIds() {
    for (const id in this._pageData.kontingente) {
      if (!this.contingentIds.includes((id))) {
        this.contingentIds.push(parseInt(id, 10));
      }
    }
  }

  fillEmployeeIds() {
    for (const id in this._pageData.mitarbeiter) {
      if (!this.employeeIds.includes((id))) {
        this.employeeIds.push(parseInt(id, 10));
      }
    }
  }

  filterEmployee(employeeIds) {
    this.employeeIds = employeeIds;
    this.update("filter-update");
  }

  filterContingent(contingentIds) {
    this.contingentIds = contingentIds;
    this.update("filter-update");
  }

  getEmployeeIDsOFNoRotation(rotationen, employees) {
    const now = today();
    const year = now.getFullYear();
    const monthNum = (now.getMonth() + 1);
    const startDateZahl = Number(`${year}${(monthNum + 2).toString().padStart(2, 0)}16`);

    const employeeIds = [];
    const foundRot = Object.values(rotationen).filter(rot => rot.vonZahl <= startDateZahl && rot.bisZahl >= startDateZahl);

    Object.values(employees).forEach(employee => {
      if(!employee.aktiv) return;
      const found = foundRot.find(el => el.mitarbeiter_id === employee.id);
      if (!found) {
        employeeIds.push(employee.id);
      }
    });

    return employeeIds;
  }

  getEmployeeIdsWithNoRot(employees, apiEmployeeIds) {
    const employeeIds = [];
    Object.values(employees).forEach(employee => {
      if(!employee.aktiv) return;
      if (!apiEmployeeIds.includes(employee.id)) {
        employeeIds.push(employee.id)
      }
    })
    return employeeIds;
  }

  calculateNewFullWidth() {
    const years = Object.values(this.years);
    return years.reduce((acc, year, index) => {
      // year.left = acc; 
      const firstmonth = year.months[Object.keys(year.months)[0]];
      year.left = firstmonth.left;
      let yearWidth = 0;
      if (index === 0) {
        // yearWidth = year.yearWidth - firstmonth.left * - 1;
        yearWidth = year.yearWidth;
      }
      else {
        yearWidth = year.yearWidth;
      }

      return acc + yearWidth
    }, 0);
  }

  changeView(value) {
    this.view = value;
    if (this.view === "contingent") {
      this._page.disconnectRotationenFromEmployee();
      this._page.connectRotationenToContingent();
    }
    else {
      this._page.disconnectRotationenFromContingent();
      this._page.connectRotationenToEmployee();
    }
    this.update("view-update");
  }

  changeActiveEmployee(val) {
    this.onlyActiveEmployees = val;
    this.update("employee-update");
  }

  zoom(columnIndex, zoomInOrOut) {
    Object.values(this.years).forEach(year => {
      year.calculateMonthProps(columnIndex, zoomInOrOut, this.cctScroll);
    });
  }

  calculateNewProps(event) {
    const isColumn = event.target.classList.contains("cct-column");
    if (!isColumn) return;

    const zoomInOrOut = event.deltaY;
    const columnIndex = parseInt(event.target.dataset.columnindex, 10);
    this.zoom(columnIndex, zoomInOrOut > 0 ? "zoom-in" : "zoom-out");
    const newFullWidth = this.calculateNewFullWidth();
    this.setFullWidth(newFullWidth);

    this.update("column-width");
  }

  calculateMonthsPositions() {
    const positions = [];
    Object.values(this.years).forEach((year) => {
      Object.values(year.months).forEach((month) => {
        const position = {
          year: year.year,
          month
        }
        positions.push(position);
      });
    });
    return positions;
  }

  getScrollAmount() {

    const date = new Date(this.todayYear, this.todayMonth, 1);
    const monthName = date.toLocaleString('en-us', { month: 'long' }).toLowerCase();
    const targetMonth = this.years[this.todayYear].months[monthName];

    const cctScrollWidth = this.cctScroll.offsetWidth;

    const targetMonthWidth = targetMonth.columnWidth;
    const diffWidth = (cctScrollWidth - targetMonthWidth) / 2;
    const targetMonthOffsetLeft = targetMonth.left;

    const scrollAmount = targetMonthOffsetLeft - diffWidth;

    return scrollAmount;
  }

  shouldRenderNextMonthOnScrollLeft(scrollAmount) {
    return scrollAmount > this.cctScroll.scrollLeftMax;
  }

  getLastMonthInView() {
    const cctScrollWidth = this.cctScroll.offsetWidth;
    let lastMonthInViewIndex = null;
    this.monthsPositions.forEach((position, index) => {
      if ((position.month.left + position.month.columnWidth) >= cctScrollWidth && position.month.left < cctScrollWidth) {
        lastMonthInViewIndex = index;
        
      }
    });
    return this.monthsPositions[lastMonthInViewIndex - 1];
  }

  renderMonthsOnDisplayWidth() {

    let shoulCallItself = false;
    const scrollAmount = this.getScrollAmount();

    const firstMonth = this.monthsPositions[1];
    if (scrollAmount < firstMonth.month.left) {
      this.renderPreviosMonths(firstMonth, false);
      shoulCallItself = true;
    }

    const shouldRenderNextMonth = this.isCurTimelineWSmallerThanDisplay();
    if (shouldRenderNextMonth) {
      const rightPosition = this.monthsPositions[this.monthsPositions.length - 2];
      this.renderNextMonths(rightPosition, false);
      shoulCallItself = true;
    }

    if (shoulCallItself) {
      return this.renderMonthsOnDisplayWidth();
    }

    const lastMonth = this.monthsPositions[this.monthsPositions.length - 1];
    const lastMonthLeft = lastMonth.month.left - scrollAmount;
    if (lastMonthLeft < this.cctScroll.offsetWidth) {
      const secondLastMonth = this.monthsPositions[this.monthsPositions.length - 2];
      this.renderNextMonths(secondLastMonth, false);
    }

    if (this.shouldRenderNextMonthOnScrollLeft(scrollAmount)) {
      const lastMonthInView = this.getLastMonthInView();
      if (lastMonthInView) {
        this.renderNextMonths(lastMonthInView, false);
      }
    }

    return scrollAmount;
  }

  isCurTimelineWSmallerThanDisplay() {
    const cctScrollWidth = this.cctScroll.offsetWidth;
    const curFullWidth = this.fullWidth;
    return curFullWidth < cctScrollWidth;
  }


  getAltMonths(year) {
    return Object.keys(this.years[year].months).map(month => new Date(`${month} 1, ${year}`).getMonth());
  }

  addToRenderYears(year, prevM, month, addedMonths = 0) {
    const result = {
      update: false,
      addedMonths
    };
    if (!this.renderYears[year]) {
      this.renderYears[year] = { months: [] };
    };
    if (this.renderYears[year].months.includes(month)) {
      return result;
    }
    if (prevM) {
      this.renderYears[year].months.unshift(month);
      result.addedMonths++;
    } else {
      this.renderYears[year].months.push(month);
    }
    result.update = true;
    return result
  }

  renderMonths(position, side, scrollUpdate = true) {
    const prevM = side === "prev";

    const monthInView = parseInt(position.month.columnKey.split("-")[1], 10);

    const checkMonth = prevM ? monthInView - (this.countMonth - 1) : monthInView + (this.countMonth - 1);
    const year = parseInt(position.month.columnKey.split("-")[0], 10);

    let add = 0;
    if (prevM && checkMonth < 0 && (this.renderYears[year - 1] || !this.renderYears[year - 1])) {
      add = -1;
    } else if(checkMonth > 11 && (this.renderYears[year + 1] || !this.renderYears[year + 1])) {
      add = 1;
    }

    const yearCheck = year + add;
    const date = new Date(yearCheck, checkMonth, 1);
    const monthName = date.toLocaleString('en-us', { month: 'long' }).toLowerCase();

    let addedMonths = 0;
    let update = false;
    const notExists = !this.years[yearCheck] || !(monthName in this.years[yearCheck].months);
    const monthCheck = checkMonth < 0 || checkMonth > 11;
    if(notExists || monthCheck) {
      for (let i = 1; i <= this.countMonth; i++) {
        let newMonth = prevM ? (checkMonth - i) + 12 : (checkMonth - 1) + i - 12;
        let newYear = prevM ? year - 1 : year + 1;
        if(notExists) {
          newMonth = prevM ? (checkMonth + 1) - i : (checkMonth - 1) + i;
          newYear = year;
          if (((checkMonth + 1) - i) < 0 || ((checkMonth - 1) + i) > 11) {
            newMonth = prevM ? (checkMonth + 1) - i + 12 : (checkMonth - 1) + i - 12;
            newYear = prevM ? year - 1 : year + 1;
          }
        }
        
        const result = this.addToRenderYears(newYear, prevM, newMonth, addedMonths);
          addedMonths = result.addedMonths;
          if (result.update) {
            update = true;
          } else {
            return;
          }
      }
    }

    if (!update) {
      return;
    }

    const apiYears = { ...this.renderYears }

    const customProps = {
      years: {
        ...this.renderYears
      },
      initialColumnWidth: position.month.columnWidth
    }
    this.years = this.createColumnYears(customProps.years, customProps.initialColumnWidth);
    this.monthsPositions = this.calculateMonthsPositions();

    const newFullWidth = this.calculateNewFullWidth();
    this.setFullWidth(newFullWidth);

    if (prevM && scrollUpdate) {
      this.cctScroll.scrollLeft += addedMonths * position.month.columnWidth;
      this.scrollPos += addedMonths * position.month.columnWidth;
    }
    this.shoudScroll = true;
    const params = this.prepareParams(apiYears);
    this.hainsApi.api("rotationen", "post", params).then((response) => {
      if (!this?._mounted) return;
      if (this.view === "contingent") {
        this._page.data.addNewRotationenToContingent(response.rotationen)
      }
      else {
        this._page.data.addNewRotationenToEmployee(response.rotationen)
      }

      this.update("column-width");
    }, returnError);

    return update;

  }

  addRotationToTimeline(rotation) {
    const rotationen = {}
    rotationen[rotation.id] = rotation;
    if (this.view === "contingent") {
      this._page.data.addNewRotationenToContingent(rotationen);
    }
    else {
      this._page.data.addNewRotationenToEmployee(rotationen);
    }
    this.update("column-width");
  }

  removeRotationFromTimeline(rotation) {
    if (this.view === "contingent") {
      this._page.data.removeRotationFromContingent(rotation);
    }
    else {
      this._page.data.removeRotationFromEmployee(rotation);
    }
    this.update("column-width");
  }

  prepareParams(apiYears) {
    let startYear = 0;
    let endYear = 0;
    Object.keys(apiYears).forEach(year => {
      if (!apiYears[year].months.length) return;
      if (!startYear) startYear = year;
      endYear = year;
    });
    const startMonth = apiYears[startYear].months[0] + 1;
    const endMonth = apiYears[endYear].months[apiYears[endYear].months.length - 1] + 1;
    const endDayNum = new Date(endYear, endMonth, 0).getDate();
    const startDate = `${startYear}-${startMonth}-01`;
    const endDate = `${endYear}-${endMonth}-${endDayNum}`;

    return {
      anfang: startDate,
      ende: endDate
    }
  }

  getMonthDifference(startDate, endDate) {
    const monthDiffs = endDate.getMonth() - startDate.getMonth() + 12 * (endDate.getFullYear() - startDate.getFullYear())
    return monthDiffs;
  }

  getMidPointOfTwoDates(dateFrom, dateTo) {
    const midpoint = new Date((dateFrom.getTime() + dateTo.getTime()) / 2);
    return midpoint;
  }

  createApiYears(rangeMonths, curYear, curMonth) {

    let prevMonth; let nextMonth;

    const initialsYears = {
      [curYear]: { months: [] },
      [curYear - 1]: { months: [] },
      [curYear + 1]: { months: [] }
    }

    for (let i = 1; i <= rangeMonths; i++) {
      if (curMonth - i < 0) {
        prevMonth = (curMonth - i) + 12;
        initialsYears[curYear - 1].months = [prevMonth, ...initialsYears[curYear - 1].months];
      }
      else {
        prevMonth = curMonth - i;
        initialsYears[curYear].months = [prevMonth, ...initialsYears[curYear].months];
      }
    }

    initialsYears[curYear].months = [...initialsYears[curYear].months, curMonth];

    for (let i = 1; i <= rangeMonths; i++) {
      if (curMonth + i > 11) {
        nextMonth = (curMonth + i) - 12;
        initialsYears[curYear + 1].months = [...initialsYears[curYear + 1].months, nextMonth];
      }
      else {
        nextMonth = curMonth + i;
        initialsYears[curYear].months = [...initialsYears[curYear].months, nextMonth];
      }
    }

    //
    if (!initialsYears[curYear - 1].months.length) delete initialsYears[curYear - 1]
    if (!initialsYears[curYear + 1].months.length) delete initialsYears[curYear + 1]

    return initialsYears;
  }

  setNewRangeDateToTimeline(dateStart) {

    const curYear = dateStart.getFullYear();
    const curMonth = dateStart.getMonth();
    if (curYear === this.todayYear && curMonth === this.todayMonth) {
      return;
    }
    this.todayYear = curYear;
    this.todayMonth = curMonth;

    const apiYears = this.createApiYears(3, curYear, curMonth);
    const params = this.prepareParams(apiYears)
    this.renderYears = apiYears;

    this.loadAndCreateMonthsDataByDateInput(apiYears, params);
  }


  loadAndCreateMonthsDataByDateInput(apiYears, params) {
    this.years = this.createColumnYears(apiYears, this.initialColumnWidth);
    this.monthsPositions = this.calculateMonthsPositions();
    this.checkForDisplayWidth();
    const newFullWidth = this.calculateNewFullWidth();
    this.setFullWidth(newFullWidth);
    this.hainsApi.api("rotationen", "post", params).then((response) => {
      if (!this?._mounted) return;
      if (this.view === "contingent") {
        this._page.disconnectRotationenFromContingent();
        this._page.data.addNewRotationenToContingent(response.rotationen, "new")
      }
      else {
        this._page.disconnectRotationenFromEmployee();
        this._page.data.addNewRotationenToEmployee(response.rotationen, "new")
      }

      this.update("column-width");

    }, returnError);
  }

  renderPreviosMonths(position, scrollUpdate = true) {
    this.renderMonths(position, "prev", scrollUpdate);
  }

  renderNextMonths(position) {
    this.renderMonths(position, "next");
  }

  checkForDisplayWidth() {
    this.renderMonthsOnDisplayWidth();
    this.update("scroll-to");
  }

  scrollToCurMonth() {
    const scrollAmount = this.getScrollAmount();
    this.scrollPos = scrollAmount;
    this.cctScroll.scrollLeft = scrollAmount;
  }

  infiniteScroll(event) {
    const target = event.target;
    const scrollWidth = target.offsetWidth;

    if (this.shoudScroll) {
      // console.log("infiniteScroll shoulScroll scrollPos", this.scrollPos)
      target.scrollLeft = this.scrollPos;
    }
    const curScrollPos = target.scrollLeft;

    // console.log("A::", this.scrollPos, curScrollPos, this.shoudScroll);

    this.monthsPositions.forEach((position, index) => {
      if (curScrollPos < this.scrollPos) {
        if (curScrollPos >= position.month.left && curScrollPos <= position.month.left + position.month.columnWidth) {
          this.renderPreviosMonths(position);
        }
      }
      else if (curScrollPos + scrollWidth >= position.month.left && curScrollPos + scrollWidth <= position.month.left + position.month.columnWidth) {
          this.renderNextMonths(position);
        }
    });
    this.scrollPos = curScrollPos;
    this.shoudScroll = false;
    this.update("scroll-update");

    // console.log("infi", this.scrollPos)
  }

  setScrollTopPos(scrollTop) {
    this.scrollTopPos = scrollTop;
    this.update("scroll-top");
  }

}

export default Timeline;
