import Shared from "./shared";

class Cell extends Shared {
  constructor(obj = {}, row = false, appModel = false) {
    super(appModel);
    this._set("row", row);
    this.init(this._isObject(obj) ? obj : {});
    this._preventExtension();
  }

  get isACell() {
    return true;
  }

  /**
   * True, wenn es der letzten gerenderten Zelle der letzten Zeile des Body entspricht
   */
  get lastInBody() {
    return this?.isLast && this?.row?.isLast;
  }

  /**
   * Liefert den Körper aus der Zeile
   */
  get body() {
    return this?.row?.body;
  }

  /**
   * Liefert die Anzahl der Zeilen
   */
  get cellsLength() {
    return this?.row?.length || 0;
  }

  /**
   * Liefert die Anzahl der Spalten
   */
  get rowsLength() {
    return this?.body?.length || 0;
  }

  /**
   * Liefert das Ende der Zeilen
   */
  get rowEnd() {
    return this?.body?.end || -1;
  }

  /**
   * Liefert das Ende der Spalten
   */
  get cellEnd() {
    return this?.row?.end || -1;
  }

  /**
   * Liefert die Tabelle aus dem Body
   */
  get table() {
    return this?.body?.table;
  }

  /**
   * True, wenn Zeile vom Typ Head ist
   */
  get isHead() {
    return this?.row?.isHead;
  }

  /**
   * True, wenn Zeile vom Typ Body ist
   */
  get isBody() {
    return this?.row?.isBody;
  }

  /**
   * True, wenn Zeile vom Typ Foot ist
   */
  get isFoot() {
    return this?.row?.isFoot;
  }

  /**
   * Liefert die position der Zelle
   */
  get position() {
    return this?.row?.cells?.indexOf
      ? this.row.cells.indexOf(this)
      : -1;
  }

  /**
   * Liefert den Style der Zelle verbunden mit dem Style der Column
   */
  get cellStyle() {
    const column = this.getColumn();
    if (this._isObject(column?.style)) {
      return {
        ...this.style,
        ...column.style
      };
    }
    return this.style;
  }

  /**
   * Liefert den Classname der Zelle verbunden mit dem Classname der Column
   */
  get cellClassName() {
    const column = this.getColumn();
    return `${this.className} ${column?.className || ""}`.trim();
  }

  /**
   * Initialisiert die Attribute der Zelle
   * @param {Object} param0
   */
  init({
    id = "",
    visible = true,
    className = "",
    style = null,
    clickHandler = false,
    dateId = "",
    mitarbeiterId = 0,
    dienstId = 0,
    ref = false,
    getColumn = false,
    getContent = false,
    header = false,
    colspan = 1,
    rowspan = 1,
    el = false
  }) {
    this.setIsLast(false);
    this.setId(id);
    this.setClassName(className);
    this.setDefaultClassName(className);
    this.setStyle(style);
    this.setVisible(visible);
    this.setClickHandler(clickHandler);
    this.setMitarbeiterId(mitarbeiterId);
    this.setDienstId(dienstId);
    this.setDateId(dateId);
    this.setRef(ref);
    this._set("getContent", this._isFunction(getContent) ? getContent : () => "");
    this._set("getColumn", this._isFunction(getColumn) ? getColumn : () => false);
    this._set("colspan", colspan);
    this._set("rowspan", rowspan);
    this._set("header", header);
    this._set("el", el);
  }

  /**
   * Testet, ob die letze Zelle innerhalb der Tabelle liegt,
   * wenn ja, wird das cellEnd bzw. rowEnd angepasst.
   * @param {Object} el
   */
  checkRef = (el) => {
    const tableEl = el?.parentElement?.parentElement?.parentElement;
    const {
      lastInBody,
      rowEnd,
      cellEnd,
      table,
      cellsLength,
      rowsLength
    } = this;
    const cellEndLower = cellEnd >= 0;
    const rowEndLower = rowEnd >= 0;
    const rowsCount = table?.body?.rowsCount || rowsLength || 1;
    const cellsCount = table?.body?.cellsCount || cellsLength || 1;
    // Zellen/Zeilen löschen und nachladen
    if (lastInBody && el && tableEl
      && table?.setCellEnd && table?.setRowEnd
      && table?.updateBodys) {
      const cellPos = el.getBoundingClientRect();
      const tablePos = tableEl.getBoundingClientRect();
      const diff = 100;
      const add = 3;
      const updateCellEnd = cellPos.right < tablePos.right + diff && cellEndLower;
      const updateRowEnd = cellPos.bottom < tablePos.bottom + diff && rowEndLower;
      if (!updateCellEnd && !updateRowEnd) {
        return false;
      }
      const nextCell = cellEnd + add;
      updateCellEnd && table.setCellEnd(nextCell > cellsCount ? -1 : nextCell);
      if (this.isBody) {
        const nexRow = rowEnd + add;
        updateRowEnd && table.setRowEnd(nexRow > rowsCount ? -1 : nexRow);
      }
      table.updateBodys();
    }
  };

  /**
   * Liefert die Einteilungen-Ids der Elemente
   * @returns Array
   */
  getEinteilungenIds() {
    const einteilungenIds = [];
    // getFelder(true), damit die ensprechenden Filter eingesetzt werden
    const felder = this?.el?.getFelder?.(true);
    felder?.forEach?.((feld) => {
      const einteilungId = feld?.einteilungId;
      if (feld?.einteilung?.show && !einteilungenIds.includes(einteilungId)) {
        einteilungenIds.push(einteilungId);
      }
    });
    return einteilungenIds;
  }

  /**
   * Zelle soll sich auch bei Column anmelden
   * @param {Function} setUpdate
   */
  _push = (setUpdate) => {
    if (setUpdate) this._pushToRegister(setUpdate, "update");
    const column = this.getColumn();
    column?._push && column?._push(setUpdate);
  };

  /**
   * Zelle soll sich auch bei Column abmelden
   * @param {Function} setUpdate
   */
  _pull = (setUpdate) => {
    if (setUpdate) this._pullFromRegister(setUpdate, "update");
    const column = this.getColumn();
    column?._pull && column?._pull(setUpdate);
  };

  /**
   * Ermittelt die Position des Elements anhand
   * @param {Object} el
   */
  getPosition(el) {
    const column = this.getColumn();
    column?.getStickyPosition?.(el);
  }
}

export default Cell;
