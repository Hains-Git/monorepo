import Basic from '../basic';
import { formatDate, today, addDays, getYear } from '../../tools/dates';
import { createSearchGroup } from '../../tools/helper';

class Mtable extends Basic {
  constructor(appModel, urlaubsliste) {
    super(appModel);
    this._set('urlaubsliste', urlaubsliste);
    this.today = this.getInitialDate();
    this.visibleCounters = urlaubsliste?.counters;
    this.awCounterPoDienst = urlaubsliste?.aw_counter_po_dienst;
    this.visibleColumns = urlaubsliste?.settings?.visible_columns || [];
    this.prevVisibleColumnsLength = urlaubsliste?.settings?.visible_columns?.length;
    this.visibleTeamIds = urlaubsliste?.settings?.visible_team_ids || [];
    this.prevDate = this.today;
    this.yearAw = String(getYear(this.today));
    this.scrollLeftAmount = 0;
    this.lastScrollLeftMax = 0;
    this.waitForLoading = false;
    this.isScrolledLeft = false;
    this.leftBlockWidth = 0;
    this._set('tableHtml', null);
    this._set('cellPositions', {});
    this._set('searchVal', '');
    this._setObject('searchGroups', {
      mitarbeiter: createSearchGroup(this, 'mitarbeiter', true),
      funktionen: createSearchGroup(this, 'funktionen'),
      mitarbeiterTeam: createSearchGroup(this, 'mitarbeiterTeam')
    });
    this.posLeftScroll = 0;
    // console.log('Create Mtable', this);
    this.isSettingsOverlayOpen = this.visibleColumns.length === 0 && this.visibleTeamIds.length === 0;
  }

  getFixColumnsSize(prev = false) {
    const size = prev ? this.prevVisibleColumnsLength : this.visibleColumns.length;
    return size + 1 + Object.keys(this.visibleCounters).length;
  }

  toggleSettings() {
    this.isSettingsOverlayOpen = !this.isSettingsOverlayOpen;
    this.update('toggleSettingsOverlay');
  }

  getInitialDate() {
    const locationDate = new URLSearchParams(window.location.search).get('date');
    const dateView = locationDate || formatDate(today());
    return dateView;
  }

  search = (searchVal, groups) => {
    this._set('searchVal', searchVal);
    this.update('renderBody');
  };

  initHtml(tableHtml) {
    this._set('tableHtml', tableHtml);
  }

  addCellPositions({ left, dateId }) {
    this.cellPositions[dateId] = left;
  }

  createCellPositions() {
    const leftBlockWidth = Math.round(this.getLeftBlockWidth());
    const thCells = this.tableHtml.childNodes[0].childNodes[0].childNodes;

    thCells.forEach((th) => {
      const left = th.offsetLeft - leftBlockWidth;
      const dateId = th?.dataset?.date;
      if (dateId) {
        this.addCellPositions({ left, dateId });
      }
    });
    this.scrollToLastPos();
    this.waitForLoading = false;
    return this.cellPositions;
  }

  scrollToLastPos() {
    if (!this.isScrolledLeft) return;
    const scrollLeft = this.tableHtml.scrollLeftMax - this.lastScrollLeftMax + this.scrollLeftAmount;

    this.tableHtml.scrollLeft = scrollLeft;
  }

  getAllTableRows() {
    const tableBodys = this.tableHtml?.childNodes || [];
    const tableHeadRows = tableBodys?.[0]?.childNodes || [];
    const tableBodyRows = tableBodys?.[1]?.childNodes || [];
    const tableRows = [...tableHeadRows, ...tableBodyRows];
    return tableRows;
  }

  eachFixColumnCell(callback, size = 0) {
    const tableRows = this.getAllTableRows();
    if (size === 0) size = this.getFixColumnsSize(false);
    tableRows.forEach((row, rowIx) => {
      const children = Array.from(row.childNodes).slice(0, size);
      children.forEach((child, colIx) => {
        if (colIx > 0 && !child.id.includes('visible-column')) return;
        callback(child, colIx, row, rowIx);
      });
    });
  }

  resetFixCellStyle(htmlCell) {
    const date = htmlCell.dataset?.date;
    if (date) return;
    htmlCell.style.position = 'inherit';
    htmlCell.style.backgroundColor = 'red';
    htmlCell.style.left = 1;
  }

  resetFixColumns() {
    this.eachFixColumnCell((child) => {
      this.resetFixCellStyle(child);
    }, this.getFixColumnsSize(true));
  }

  setFixColumns() {
    if (!this.tableHtml) return null;
    this.resetFixColumns();
    const leftPos = {};
    let left = 0;
    const size = this.getFixColumnsSize(false);
    this.eachFixColumnCell((child, colIx, row, rowIx) => {
      if (rowIx === 0) {
        leftPos[colIx] = parseInt(left, 10);
        left += child.getBoundingClientRect().width;
      }
      const date = child.dataset?.date;
      if (date) return;
      child.style.position = 'sticky';
      if (child?.className?.split?.(' ')?.includes?.('inaktiv')) {
        child.style.backgroundColor = 'var(--abwesend)';
      } else {
        child.style.backgroundColor = 'var(--white-hover)';
      }
      child.style.left = `${leftPos[colIx]}px`;
    }, size);
    this.prevVisibleColumnsLength = this.visibleColumns.length;
  }

  getLeftBlockWidth() {
    const countersLength = Object.values(this.visibleCounters).length;
    const columnsLength = this.visibleColumns.length + 1 + countersLength;
    // const thCells = this.tableHtml?.querySelectorAll(
    //   `thead tr:first-child th:nth-child(-n+${columnsLength})`
    // );
    const thCells = Array.from(this.tableHtml?.childNodes[0]?.childNodes[0].childNodes).slice(0, columnsLength);

    let left = 0;
    thCells?.forEach?.((th) => {
      const thRect = th?.getBoundingClientRect?.();
      left += Math.round(thRect.width);
    });
    this.leftBlockWidth = left;
    return left;
  }

  scrollToInitialDate() {
    const left = this.getLeftBlockWidth();
    this.leftBlockWidth = left;
    const scrollToDate = this.cellPositions[this.prevDate];
    this.tableHtml.scrollLeft = scrollToDate;
    return scrollToDate;
  }

  loadDataForBiggerScreen() {
    if (this.tableHtml?.scrollLeftMax === 0) {
      console.log('LOAD');
      this.urlaubsliste.loadNewDataForBiggerScreens(false, this.lastDay);
    }
  }

  loadNewAbwesentheitenInUrlaubsliste(year) {
    this.urlaubsliste.loadNewAbwesentheiten(year);
  }

  loadNewAbwesentheiten(scrolLeft, tableWidth) {
    const leftBlockWidth = this.leftBlockWidth || 509;
    const viewWidth = tableWidth - leftBlockWidth + scrolLeft;

    const years = Object.entries(this.cellPositions)
      .reduce((res, acc) => {
        const [date, pos] = acc;
        const year = getYear(date);
        if (scrolLeft < pos + 30 && pos + 30 <= viewWidth) {
          if (!res.includes(year)) res.push(year);
        }
        return res;
      }, [])
      .sort((a, b) => a - b);

    const viewYear = years.join('-');
    const year = String(years[0]);

    if (years.length === 1) {
      if (year !== this.yearAw) {
        this.loadNewAbwesentheitenInUrlaubsliste(years[0]);
        this.yearAw = year;
      }
    }

    if (viewYear !== this.yearAw) {
      this.yearAw = viewYear;
      this.updateViewYear();
    }
  }

  updateViewYear() {
    this.update('viewYear');
  }

  checkForNewDates(e) {
    if (e.target.scrollLeft === this.scrollLeftAmount) {
      return;
    }

    const scrollPast = e.target.scrollLeft < this.scrollLeftAmount;
    this.isScrolledLeft = scrollPast;

    this.scrollLeftAmount = parseInt(e.target.scrollLeft, 10);
    const tableWidth = e.target.clientWidth;
    const scrollLeftMax = e.target.scrollLeftMax;

    const edgeDate = scrollPast ? this?.getEdgeDayLeft() : this?.getEdgeDay();
    const edgePos = this.cellPositions[edgeDate];
    const dateView = scrollPast ? this.firstDay : this.lastDay;

    this.loadNewAbwesentheiten(this.scrollLeftAmount, tableWidth);

    // console.log({
    //   scrollPast,
    //   tableWidth,
    //   scrollLeft: this.scrollLeftAmount,
    //   scrollLeftMax,
    //   edgeDate,
    //   edgePos,
    //   load: scrollPast ? edgePos : edgePos - tableWidth + this.leftBlockWidth,
    //   dateView
    // });

    if (scrollPast) {
      if (this.scrollLeftAmount <= edgePos) {
        if (this.urlaubsliste.isLoading && this.waitForLoading) return;
        this.lastScrollLeftMax = scrollLeftMax;
        this.prevDate = edgeDate;
        this.urlaubsliste.loadNewData(scrollPast, dateView);
        this.waitForLoading = true;
      }
    } else if (this.scrollLeftAmount >= edgePos - tableWidth + this.leftBlockWidth) {
      if (this.urlaubsliste.isLoading && this.waitForLoading) return;
      this.urlaubsliste.loadNewData(scrollPast, dateView);
      this.lastScrollLeftMax = scrollLeftMax;
      this.prevDate = edgeDate;
      this.waitForLoading = true;
    }
  }

  setEdgeDaysFromDates() {
    const dates = Object.values(this?.urlaubsliste?.dates).sort((a, b) => {
      return a.date_nr - b.date_nr;
    });
    const lastDay = dates[dates.length - 1]?.full_date;
    const firstDay = dates[0]?.full_date;
    this._set('lastDay', lastDay);
    this._set('firstDay', firstDay);
  }

  getEdgeDayLeft() {
    // return formatDate(addDays(this.firstDay, 2));
    return formatDate(addDays(this.firstDay, 0));
  }

  getEdgeDay() {
    // return formatDate(addDays(this.lastDay, -14));
    return formatDate(addDays(this.lastDay, 0));
  }

  specialDay(day) {
    let cssClassName = '';
    if (day?.is_weekend) cssClassName = 'weekend';
    if (day?.feiertag) cssClassName = 'feiertag';
    return cssClassName;
  }

  setFilterIds(id, name) {
    let ids = this[name] !== undefined ? [...this[name]] : [];
    if (this[name].includes(id)) {
      ids = this[name].filter((_id) => id !== _id);
    } else {
      ids = [...this[name], id];
    }
    this._set(name, ids);
    return ids;
  }

  saveSettings(setLoading) {
    this.urlaubsliste.saveSettings(this.visibleColumns, this.visibleTeamIds, () => {
      setLoading?.(() => false);
    });
  }
}

export default Mtable;
