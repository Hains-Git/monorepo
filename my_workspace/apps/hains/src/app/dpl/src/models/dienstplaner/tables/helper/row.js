import Cell from "./cell";
import Shared from "./shared";

class Row extends Shared {
  constructor(obj = {}, body = false, appModel = false) {
    super(appModel);
    this._set("body", body);
    this.init(this._isObject(obj) ? obj : {});
    this._preventExtension();
  }

  get cellLabel() {
    const sort = this.table?.sortStart || 0;
    const arr = [];
    const tag = this?._anfang?.str || "";
    switch (sort) {
      case 1:{
        const funktion = this?.mitarbeiter?.funktion?.planname || "";
        funktion && arr.push(funktion);
        break;
      } case 2:{
        const rotation = this?.mitarbeiter?.getPrioRotationAm?.(tag)?.name || "";
        rotation && arr.push(rotation);
        break;
      } case 3:{
        const funktion = this?.mitarbeiter?.funktion?.planname || "";
        funktion && arr.push(funktion);
        const rotation = this?.mitarbeiter?.getPrioRotationAm?.(tag)?.name || "";
        rotation && arr.push(rotation);
        break;
      } case 4:{
        const rotation = this?.mitarbeiter?.getPrioRotationAm?.(tag)?.name || "";
        rotation && arr.push(rotation);
        const funktion = this?.mitarbeiter?.funktion?.planname || "";
        funktion && arr.push(funktion);
        break;
      }
    }
    return arr.join(", ");
  }

  get isARow() {
    return true;
  }

  /**
   * Liefert die Anzahl der Zellen
   */
  get length() {
    return this?.cells?.length || 0;
  }

  /**
   * Liefert die letzte Tabellen-Spalte
   */
  get end() {
    return this?.table?.cellEnd || -1;
  }

  /**
   * Liefert die Tabelle aus dem Body
   */
  get table() {
    return this?.body?.table;
  }

  /**
   * Liefert die position der Zeile
   */
  get position() {
    return this?.body?.rows?.indexOf
      ? this.body.rows.indexOf(this)
      : -1;
  }

  /**
   * True, wenn Body vom Typ Head ist
   */
  get isHead() {
    return this?.body?.isHead;
  }

  /**
   * True, wenn Body vom Typ Body ist
   */
  get isBody() {
    return this?.body?.isBody;
  }

  /**
   * True, wenn Body vom Typ Foot ist
   */
  get isFoot() {
    return this?.body?.isFoot;
  }

  setCellsCount(count = 0) {
    this.body?.setCellsCount?.(count);
  }

  /**
   * Iteriert über alle Zellen
   * @param {Function} callback
   * @param {Boolean} onlyvisible
   * @returns Array
   */
  eachCell(callback = false, onlyvisible = true) {
    const cells = [];
    if (this._isFunction(callback)) {
      this?.cells?.forEach?.((cell, i) => {
        if (onlyvisible && !cell?.isVisible) return false;
        cells.push(callback(cell, i));
      });
    }
    return cells;
  }

  /**
   * Iteriert über alle Zellen bis cellEnd der Tabelle
   * @param {Function} callback
   * @returns Array
   */
  eachCellFromIntervall(callback = false) {
    const cells = [];
    if (this._isFunction(callback)) {
      const l = this.length;
      let end = this.end;
      let lastCell = false;
      if (end < 0) end = l;
      let j = 0;
      for (let i = 0; i < l; i++) {
        const cell = this.cells[i];
        if (!cell?.isVisible) continue;
        if(j < end) {
          cell.setIsLast(false, false);
          cells.push(callback(cell, i, j));
          lastCell = cell;
        }
        j++;
      }
      this.setCellsCount(j);
      lastCell?.setIsLast?.(true, true);
    }
    return cells;
  }

  /**
   * Fügt eine neue Zelle hinzu
   * @param {Object} row
   * @param {Number} pos
   */
  addCell(cell = {}, pos = -1) {
    const c = new Cell(this._isObject(cell) ? cell : {}, this, this._appModel);
    if (pos < 0) {
      this.cells.push(c);
    } else {
      this.cells.splice(pos, 0, c);
    }
    return c;
  }

  /**
   * Initialisiert die Zeile
   * @param {Object} param0
   */
  init({
    id = "",
    cells = [],
    dateId = "",
    mitarbeiterId = 0,
    dienstId = 0,
    visible = true,
    className = "",
    style = null,
    clickHandler = false,
    ref = false
  }) {
    this.setIsLast(false);
    this.setId(id);
    this._setArray("cells", []);
    this.setClassName(className);
    this.setStyle(style);
    this.setVisible(visible);
    this.setClickHandler(clickHandler);
    this.setMitarbeiterId(mitarbeiterId);
    this.setDienstId(dienstId);
    this.setDateId(dateId);
    this.setRef(ref);
    cells?.forEach?.((cell) => {
      this.addCell(cell, -1);
    });
  }
}

export default Row;
