import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Basic from '../basic';
import { showConsole } from '../../tools/flags';
import { isObject, isFunction } from '../../tools/types';
import { downloadCSV } from '../../util_func/util';

class GenericTable extends Basic {
  constructor(
    appModel,
    data,
    { columns, exports, pages, order, filter, append_child }
  ) {
    super(appModel);
    this.loading = false;
    this.columns = columns;
    this.sizes = pages?.sizes || [10, 25, 50, 0];
    this.curSize = pages?.cur_size ?? 10;
    this.order = order || { key: 'id', sort: 'asc', type: 'numeric' };
    this.curPage = (pages?.visible && 1) || 1;
    this.visiblePages = pages?.visible || [1, 2, 3, 4, 5];
    this.initialPages = pages?.visible || [1, 2, 3, 4, 5];
    this.filters = filter || [];
    this.append_child = append_child || {};
    this.exports = exports || [];
    this.data = this.convertData(data);
    this.initialData = this.data;
    this.antraege = this.initialAntraege();
    this.antraegeView = this.setInitailAntraegeView();
    this.filterStartDate = '';
    this.filterEndDate = '';
    this.firstInitial = true;
  }

  set order({ key, sort, type }) {
    if (!key || !sort || !type) {
      console.log(
        'Property order has only following properties: {key:string, sort:string, type:string(numeric, date, string)}'
      );
    } else if (sort !== 'asc' && sort !== 'desc') {
      console.log('Property sort has only: asc or desc');
    } else if (type !== 'numeric' && type !== 'date' && type !== 'string') {
      console.log('Property type has only: numeric, date or string');
    } else {
      this._order = { key, sort, type };
    }
  }

  get order() {
    return this._order;
  }

  set loading(val) {
    this._loading = val;
    this.update('loader');
  }

  get loading() {
    return this._loading;
  }

  convertData(data) {
    let dataObj = {};

    if(!isObject(data) && this?._user?.isAdmin){
      console.error("Object expected, but got: ", data, this, "Array will be transformed to Object with id or index as keys");
    } else {
      dataObj = data;
    }
    if(Array.isArray(data)) {
      dataObj = data.reduce((acc, a, i) => {
        const id = a?.id;
        acc[id === undefined ? i : id] = a;
        return acc;
      }, {});
    } 
    return dataObj;
  }

  getGermanDateTime(str) {
    const date = new Date(str);
    return date.toLocaleDateString('de-De', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  createDataForPDFExport() {
    const rows = [];
    const keys = [
      'id',
      'antragstyp',
      'mitarbeiter',
      'created_at',
      'updated_at',
      'start',
      'ende',
      'antragsstatus'
    ];

    this.antraege.forEach(antrag => {
      const columns = new Array(keys.length);
      Object.keys(antrag).forEach(key => {
        const obj = {};
        if (keys.includes(key)) {
          if (key === 'mitarbeiter') {
            obj.content = antrag.mitarbeiter.planname;
          } else if (key === 'antragstyp') {
            obj.content = antrag.antragstyp.name;
          } else if (key === 'antragsstatus') {
            obj.content = antrag.antragsstatus.name;
            obj.styles = {};
            switch (antrag.antragsstatus.id) {
              case 1:
                obj.styles = { fillColor: '#ffff00' };
                break;
              case 2:
                obj.styles = { fillColor: '#90ee90' };
                break;
              case 3:
                obj.styles = { fillColor: '#ff0000', textColor: '#ffffff' };
                break;
              case 4:
                obj.styles = { fillColor: '#ffa500', textColor: '#ffffff' };
                break;
              case 5:
                obj.styles = { fillColor: '#800080', textColor: '#ffffff' };
                break;
            }
          } else if (key === 'created_at' || key === 'updated_at') {
            obj.content = this.getGermanDateTime(antrag[key]);
          } else {
            obj.content = antrag[key];
          }
          const ix = keys.indexOf(key);
          if (ix >= 0) {
            columns[ix] = obj;
          }
        }
      });
      rows.push(columns);
    });
    return rows;
  }

  createCsvData(separator = ';') {
    const csv = [];
    const keys = [
      'id',
      'antragstyp',
      'mitarbeiter',
      'created_at',
      'updated_at',
      'start',
      'ende',
      'antragsstatus'
    ];

    const headers = [
      '"ID"',
      '"Art"',
      '"Planname"',
      '"Eingereicht"',
      '"Bearbeitet"',
      '"Beginn"',
      '"Ende"',
      '"Status"'
    ];
    csv.push(headers.join(separator));

    this.antraege.forEach((antrag, ix) => {
      const cols = new Array(keys.length);

      Object.keys(antrag).forEach(key => {
        if (!keys.includes(key)) {
          return;
        }
        let data = null;
        if (key === 'mitarbeiter') {
          data = antrag.mitarbeiter.planname;
        } else if (key === 'antragstyp') {
          data = antrag.antragstyp.name;
        } else if (key === 'antragsstatus') {
          data = antrag.antragsstatus.name;
        } else if (key === 'created_at' || key === 'updated_at') {
          data = this.getGermanDateTime(antrag[key]);
        } else {
          data = antrag[key];
        }
        const ix = keys.indexOf(key);
        if (ix >= 0) {
          cols[ix] = `"${data}"`;
        }
      });
      csv.push(cols.join(separator));
    });

    return csv;
  }

  createCSV() {
    // https://stackoverflow.com/questions/15547198/export-html-table-to-csv-using-vanilla-javascript
    /* this.download_table_as_csv(tableID) */
    // Excel interpretiert es mit ; und SEP=;
    const csvData = this.createCsvData(';');
    const csv_string = csvData.join('\n');
    if (showConsole) console.log(csv_string);
    const filename = `urlaubsantraege_${new Date().toLocaleDateString()}.csv`;
    downloadCSV(csv_string, filename);
  }

  createPDF() {
    const body = this.createDataForPDFExport();
    const head = [
      'ID',
      'Art',
      'Planname',
      'Eingereicht',
      'Bearbeitet',
      'Beginn',
      'Ende',
      'Status'
    ];
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: 'letter',
      compress: true
    });

    doc.setFont('times', 'normal', 400);

    autoTable(doc, {
      headStyles: { fillColor: '#00427A' },
      bodyStyles: { fontSize: 9 },
      margin: 10,
      head: [head],
      body
    });

    const filename = `urlaubsantraege_${new Date().toLocaleDateString()}.pdf`;
    doc.save(filename);
  }

  /* set curSize(newSize){ */
  /*   if(!this.containsNumbers(newSize)){ */
  /*     console.log("Allowed only numbers"); */
  /*     return null; */
  /*   } */
  /*   this._curSize = parseInt(newSize); */
  /* } */
  /* get curSize(){ */
  /*   return this._curSize; */
  /* } */

  updateData() {
    this.antraege = this.initialAntraege();
    this.antraegeView = this.setInitailAntraegeView();
    this.visiblePages = this.getVisiblePages();
  }

  setNewData(data) {
    this.data = this.convertData(data);
    const antraege = this.getFilteredAntraege();
    this.antraege = antraege;
    this.antraegeView = this.getSlicedAntraege(antraege);
    this.visiblePages = this.getVisiblePages();
  }

  restoreInitailData() {
    const antraege = this.getFilteredAntraege(Object.values(this.initialData));
    this.data = this.initialData;
    this.antraege = antraege;
    this.antraegeView = this.getSlicedAntraege(antraege);
    this.visiblePages = this.getVisiblePages();
  }

  setNewFilterVal(filters) {
    filters.forEach(filter => {
      const tmpF = this.filters.find(f => f.key === filter.key);
      if (!tmpF) return null;
      tmpF.initial_val = filter.val;
    });
  }

  hideLoader() {
    this.loading = false;
  }

  initialAntraege() {
    const filtered = this.getFilteredAntraege();
    const sorted = this.getSortedAntraege(filtered);
    return sorted;
  }

  setInitailAntraegeView() {
    const antraege = this.antraege;
    const sliced = this.getSlicedAntraege(antraege);
    return sliced;
  }

  setFilteredAntraege(antraege) {
    this.curPage = 1;
    this.getSlicedAntraege(antraege);
    this.antraege = antraege;
    this.getVisiblePages();
  }

  isDateInvalid(filter, val) {
    if (!filter.hasOwnProperty('date_is')) {
      return false;
    }
    if (!this.isDate(val)) {
      alert('Invalid DateFormat');
      return true;
    }
    if (filter.date_is === 'start' && this.filterEndDate === '') {
      this.filterStartDate = val;
      return false;
    }
    if (filter.date_is === 'end' && this.filterStartDate === '') {
      this.filterEndDate = val;
      return false;
    }

    const valDateTime = new Date(val).getTime();
    const start = new Date(this.filterStartDate).getTime();
    const end = new Date(this.filterEndDate).getTime();

    if (filter.date_is === 'start' && valDateTime <= end) {
      this.filterStartDate = val;
      return false;
    }
    if (filter.date_is === 'end' && valDateTime >= start) {
      this.filterEndDate = val;
      return false;
    }

    return true;
  }

  evChangeOrder(obj) {
    this.order = obj;
    const antraege = this.getSortedAntraege(this.antraege);
    const sliced = this.getSlicedAntraege(antraege);
    this.antraege = antraege;
    this.changedOrder(obj, sliced);
  }

  evSizeChanged(size) {
    this.curSize = size;
    this.getVisiblePages();
    const antraege = this.getSlicedAntraege();
    this.sizeChanged(this.curSize, antraege);
    return antraege;
  }

  evPageChanged(page) {
    this.curPage = page;
    this.getVisiblePages();
    const antraege = this.getSlicedAntraege();
    this.pageChanged(this.curPage, antraege);
    return antraege;
  }

  evChangeFilterVal(filter, val) {
    this.loading = true;
    if (filter.type === 'date') {
      if (this.isDateInvalid(filter, val)) {
        alert('Invalid date selection');
        this.filterChanged(val, []);
        return null;
      }
    }
    const filterCur = this.filters.find(item => item.key === filter.key);
    const selectedVal = this.containsNumbers(val)
      ? parseInt(val, 10)
      : val.trim();

    filterCur.initial_val = selectedVal;

    const filters = this.filters.map(filter => ({
      key: filter.key,
      initial_val: filter.initial_val,
      type: filter.type
    }));

    const curFilter = {
      key: filter.key,
      initial_val: filter.initial_val,
      type: filter.type
    };

    const antraege = this.getFilteredAntraege();

    this.setFilteredAntraege(antraege);

    if (filter?.filterCallback) {
      this.filterCallback(antraege, curFilter, filters);
    } else {
      this.filterChanged(antraege, curFilter, filters);
    }
    return antraege;
  }

  evCheckbox(dataRow) {
    this.checkboxChecked(dataRow);
  }

  evBtn(dataRow) {
    this.btnClicked(dataRow);
  }

  evEditRow(dataRow, history) {
    this.editRow(dataRow, history);
  }

  checkboxChecked(dataRow) {
    console.log('method to override, when checkbox is clicked');
  }

  btnClicked(dataRow) {
    console.log('method to override, when btn is clicked');
  }

  editRow(dataRow, history) {
    console.log('method to override, when row is clicked');
  }

  sizeChanged(size, antraege) {
    console.log({
      info: 'should be overriden to see the new results. And call this.update()',
      methodName: 'sizeChanged',
      params: ['newSize', 'newData']
    });
  }

  pageChanged(pageNum, antraege) {
    console.log({
      info: 'should be overriden to see the new results. And call this.update()',
      methodName: 'pageChanged',
      params: ['pageNum', 'newData']
    });
  }

  filterChanged(antraege, curFilter, filters) {
    console.log({
      info: 'should be overriden to see the new results. And call this.update()',
      methodName: 'filterChanged',
      params: ['newData', 'curFilter', 'filters']
    });
  }

  changedOrder(obj, antraege) {
    console.log({
      info: 'should be overriden to see the new results. And call this.update()',
      methodName: 'changedOrder',
      params: ['newOrder', 'newData']
    });
  }

  filterCallback(filters) {
    console.log({
      info: 'should be overriden to see the new results. And call this.update()',
      methodName: 'filterCallback',
      params: ['filers']
    });
  }

  containsNumbers(str) {
    if (str === '') return false;
    return /^(\d+)$/.test(str);
  }

  getPagesTotal(antraege = this.antraege, curSize = this.curSize) {
    const total = Math.ceil(
      antraege.length / (curSize === 0 ? antraege.length : curSize)
    );
    return total;
  }

  getLastPages(
    antraege = this.antraege,
    curSize = this.curSize,
    initialPages = this.initialPages
  ) {
    const totalPages = this.getPagesTotal(antraege, curSize);
    const lastPages = initialPages
      .map((e, ix) => totalPages - ix)
      .sort((a, b) => a - b);
    return lastPages;
  }

  shouldDisplayLastPage(
    antraege = this.antraege,
    curPage = this.curPage,
    curSize = this.curSize,
    initialPages = this.initialPages
  ) {
    if (curSize === 0) return false;
    return (
      curPage <= this.getPagesTotal(antraege, curSize) - initialPages.length + 1
    );
  }

  shouldDisplayFirstPage(
    antraege = this.antraege,
    curPage = this.curPage,
    curSize = this.curSize,
    initialPages = this.initialPages
  ) {
    if (curSize === 0) return false;
    return curPage >= initialPages.length;
  }

  convertStringToAccessor(dataRow, column, key = 'key') {
    if (!column?.[key]) {
      return null;
    }
    let str = column[key]
      .split('.')
      .reduce((p, c) => (p && p[c]) || null, dataRow);
    if (column.hasOwnProperty('formatDate')) {
      const date = new Date(str);
      str = date.toLocaleDateString(
        column.formatDate.lang,
        column.formatDate.props
      );
    }
    return str;
  }

  sortAntraege(a, b) {
    let first = this.convertStringToAccessor(a, this.order);
    let sec = this.convertStringToAccessor(b, this.order);

    if (
      this.order.type !== 'date' &&
      this.order.type !== 'numeric' &&
      this.order.type !== 'string'
    ) {
      console.log(
        'opts:order:type:: allowed only with date, numeric or string'
      );
      return;
    }
    if (this.order?.sort !== 'asc' && this.order?.sort !== 'desc') {
      console.log('opts:order:sort:: allowed only asc or desc');
      return;
    }

    if (this.order.type !== 'string') {
      if (this.order.type === 'date') {
        first = new Date(first).getTime();
        sec = new Date(sec).getTime();
      }

      if (this.order.sort === 'asc') {
        return first - sec;
      }
      if (this.order.sort === 'desc') {
        return sec - first;
      }
    }

    const order = first === sec ? 0 : 1;
    if (this.order.sort === 'asc') {
      return first.toLowerCase() < sec.toLowerCase() ? -1 : order;
    }
    if (this.order.sort === 'desc') {
      return sec.toLowerCase() < first.toLowerCase() ? -1 : order;
    }

    return 0;
  }

  getSortedAntraege(antraege = Object.values(this.data)) {
    return antraege.sort((a, b) => this.sortAntraege(a, b));
  }

  getFilteredAntraege(antraege = Object.values(this.data)) {
    const antraegeReduced = this.filters.reduce((acc, filter) => {
      if (!filter.initial_val || filter?.skip) {
        return acc;
      }
      return this.searchInObj(
        acc,
        filter?.initial_val,
        filter?.search_in,
        filter
      );
    }, antraege);

    return this.getSortedAntraege(antraegeReduced);
  }

  getAntraegeByFilterText(
    antraege = Object.values(this.data),
    searchText = '',
    searchObj = {},
    filter = null
  ) {
    const filteredAntraege = antraege.filter(antrag => {
      const found = this.convertStringToAccessor(antrag, searchObj);
      if (typeof searchText === 'string' && searchText.includes('|')) {
        const searchVals = searchText.split('|');
        const founds = searchVals.findIndex(searchVal => {
          if (this.isSearchTextFound([], antrag, found, searchVal, filter)) {
            return true;
          }
          return false;
        });
        if (founds >= 0) return true;
      } else if (
        this.isSearchTextFound([], antrag, found, searchText, filter)
      ) {
        return true;
      }

      return false;
    });
    return filteredAntraege;
  }

  isDate(str) {
    const isoRegex =
      /^(?:\d{4})-(?:\d{2})-(?:\d{2})T(?:\d{2}):(?:\d{2}):(?:\d{2}(?:\.\d*)?)(?:(?:-(?:\d{2}):(?:\d{2})|Z)?)$/;
    const enDateRegex = /^[\d]{4}-[\d]{2}-[\d]{2}$/;
    const deDateRegex = /^[\d]{2}\.[\d]{2}\.[\d]{4}$/;

    if (deDateRegex.test(str) || enDateRegex.test(str) || isoRegex.test(str)) {
      let dateStr = str;
      if (deDateRegex.test(str)) {
        dateStr = this.getFormatDateStr(str);
      }
      return (
        new Date(dateStr) !== 'Invalid Date' && !Number.isNaN(new Date(dateStr))
      );
    }
    return false;
  }

  getFormatDateStr(str) {
    let dateStr = str;
    if (str.includes('.')) {
      const dateArr = str.split('.');
      dateStr = `${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`;
    }
    return dateStr;
  }

  isAntragInArray(founds, antragId) {
    return founds.find(antrag => antrag.id === antragId);
  }

  isSearchTextFound(
    founds = [],
    antrag = {},
    objVal = '',
    searchText = '',
    filter = {}
  ) {
    const whichType = typeof objVal;

    if (whichType === "boolean") {
      if (objVal === searchText) {
        if (!this.isAntragInArray(founds, antrag.id)) {
          return true;
        }
      }
      return null;
    }

    if (whichType === "number") {
      if (this.containsNumbers(objVal) && this.containsNumbers(searchText)) {
        if (parseInt(objVal, 10) === parseInt(searchText, 10)) {
          if (!this.isAntragInArray(founds, antrag.id)) {
            return true;
          }
        }
      }
      return null;
    }

    if (whichType === "string") {
      if (this.isDate(objVal)) {
        if (this.isDate(searchText)) {
          const recordDate = new Date(this.getFormatDateStr(objVal)).getTime();
          const searchDate = new Date(
            this.getFormatDateStr(searchText)
          ).getTime();

          if (filter.hasOwnProperty('date_is')) {
            if (filter.date_is === 'start') {
              if (recordDate >= searchDate) {
                if (!this.isAntragInArray(founds, antrag.id)) {
                  return true;
                }
              }
            }
            if (filter.date_is === 'end') {
              if (recordDate <= searchDate) {
                if (!this.isAntragInArray(founds, antrag.id)) {
                  return true;
                }
              }
            }
          } else if (recordDate === searchDate) {
            if (!this.isAntragInArray(founds, antrag.id)) {
              return true;
            }
          }
          return null;
        }
        return null;
      }

      if (this.containsNumbers(objVal)) {
        if (this.containsNumbers(searchText)) {
          if (parseInt(objVal, 10) === parseInt(searchText, 10)) {
            if (!this.isAntragInArray(founds, antrag.id)) {
              return true;
            }
          }
        }
        return null;
      }

      if (!this.containsNumbers(objVal)) {
        if (!this.containsNumbers(searchText)) {
          if (objVal.toLowerCase().includes(searchText.toLowerCase())) {
            if (!this.isAntragInArray(founds, antrag.id)) {
              return true;
            }
          }
        }
      }

      return null;
    }

    return null;
  }

  searchInObj(
    antraege = this.initialAntraege(),
    searchText = '',
    searchObj = {},
    filter = {}
  ) {
    if (searchObj.key.toLowerCase() !== 'all') {
      return this.getAntraegeByFilterText(
        antraege,
        searchText,
        searchObj,
        filter
      );
    }

    if (!this.containsNumbers(searchText) && searchText.trim() === '') {
      const tmp = this.getFilteredAntraege();
      return tmp;
    }

    const founds = [];
    antraege.forEach(antrag => {
      this.getKeyFromObject('', antrag, val => {
        const objVal = this.convertStringToAccessor(antrag, { key: val });
        if (!objVal) return null;

        if (
          this.isSearchTextFound(founds, antrag, objVal, searchText, filter)
        ) {
          founds.push(antrag);
        }
        return null;
      });
    });
    return founds;
  }

  isKeyAvaibleInColumns(key) {
    return this.columns.find(column => column.key === key);
  }

  getKeyFromObject(str, obj, cb) {
    let str2 = null;
    for(const key of Object.getOwnPropertyNames(obj)){
      if(isFunction(obj[key]) || key.startsWith("_")) {
        continue;
      } 
      str2 = str.length > 0 ? `${str}.${key}` : key;
      if(isObject(obj[key])) {
        str2 = this.getKeyFromObject(str2, obj[key], cb);
        continue;
      }
      if (!this.isKeyAvaibleInColumns(str2)) {
        continue;
      }
      cb(str2);
    }
    return str2;
  }

  getSlicedAntraege(
    antraege = this.antraege,
    curPage = this.curPage,
    curSize = this.curSize
  ) {
    const start = curSize * curPage - curSize;
    const end = start + curSize;
    const sliced =
      start === 0 && end === 0 ? antraege : antraege.slice(start, end);
    this.antraegeView = sliced;
    return sliced;
  }

  isAntraegeMoreThanInitialPages(antraege, initialPages) {
    const num = initialPages[initialPages.length - 1];
    return (
      antraege.length >
      num * (this.curSize === 0 ? antraege.length : this.curSize)
    );
  }

  calculatePagesCount(pageSize, totalCount) {
    if (pageSize === 0) return 1;
    return totalCount <= pageSize ? 1 : Math.ceil(totalCount / pageSize);
  }

  getVisiblePages(
    antraege = this.antraege,
    curPage = this.curPage,
    curSize = this.curSize,
    initialPages = this.initialPages
  ) {
    let visiblePages = null;

    if (curPage >= this.initialPages.length) {
      if (
        this.shouldDisplayLastPage(antraege, curPage, curSize, initialPages)
      ) {
        this.visiblePages = [curPage - 1, curPage, curPage + 1];
        visiblePages = [curPage - 1, curPage, curPage + 1];
      } else {
        const lastPages = this.getLastPages(antraege, curSize, initialPages);
        this.visiblePages = lastPages;
        visiblePages = lastPages;
      }
    } else if (this.isAntraegeMoreThanInitialPages(antraege, initialPages)) {
      this.visiblePages = this.initialPages;
      visiblePages = this.initialPages;
    } else {
      const pagesCount = this.calculatePagesCount(curSize, antraege.length);
      const pages = Array.from({ length: pagesCount }, (_, i) => i + 1);
      visiblePages = pages;
      this.visiblePages = pages;
    }
    return visiblePages;
  }
}

export default GenericTable;
