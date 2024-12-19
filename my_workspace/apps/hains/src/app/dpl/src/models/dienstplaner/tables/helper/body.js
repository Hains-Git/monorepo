import Shared from "./shared";
import Row from "./row";

const TYPES = [
  "body",
  "head",
  "foot"
];

class Body extends Shared {
  constructor(obj = {}, type = "body", table = false, appModel = false) {
    super(appModel);
    this._set("type", TYPES.includes(type) ? type : "body");
    this._set("table", table);
    this.setRowsCount(0);
    this.setCellsCount(0);
    this.init(this._isObject(obj) ? obj : {});
    this._preventExtension();
  }

  get isABody() {
    return true;
  }

  /**
   * True, wenn type = "head"
   */
  get isHead() {
    return this.type === "head";
  }

  /**
   * True, wenn type = "body"
   */
  get isBody() {
    return this.type === "body";
  }

  /**
   * True, wenn type = "foot"
   */
  get isFoot() {
    return this.type === "foot";
  }

  /**
   * Liefert die Anzahl der Zeilen
   */
  get length() {
    return this?.rows?.length || 0;
  }

  /**
   * Liefert die letzte Tabellen-Zeile
   */
  get end() {
    if (this.isBody) return this?.table?.rowEnd || -1;
    return -1;
  }

  setCellsCount(count = 0) {
    this._setInteger('cellsCount', count);
  }

  setRowsCount(count = 0) {
    this._setInteger('rowsCount', count);
  }

  /**
   * Setzt die letze Zeile des Tabellen-Körpers
   * @param {Object} cell
   */
  setLastCell(cell = false) {
    this._set("lastCell", cell);
  }

  /**
   * Iteriert über alle Zeilen
   * @param {Function} callback
   * @param {Boolean} onlyvisible
   * @returns Array
   */
  eachRow(callback = false, onlyvisible = true) {
    const rows = [];
    if (this._isFunction(callback)) {
      this?.rows?.forEach?.((row, i) => {
        if (onlyvisible && !row?.isVisible) return false;
        rows.push(callback(row, i));
      });
    }
    return rows;
  }

  /**
   * Iteriert über alle Zeilen bis rowEnd der Tabelle
   * @param {Function} callback
   * @returns Array
   */
  eachRowFromIntervall(callback = false) {
    const rows = [];
    if (this._isFunction(callback)) {
      const l = this.length;
      let end = this.end;
      if (end < 0) end = l;
      let j = 0;
      let lastRow = false;
      for (let i = 0; i < l; i++) {
        const row = this.rows[i];
        if (!row?.isVisible) continue;
        if (j < end) {
          row.setIsLast(false);
          rows.push(callback(row, i, j));
          lastRow = row;
        }
        j++;
      }
      this.setRowsCount(j);
      lastRow?.setIsLast?.(true);
    }
    return rows;
  }

  /**
   * Fügt eine neue Row hinzu
   * @param {Object} row
   * @param {Number} pos
   */
  addRow(row = {}, pos = -1) {
    const r = new Row(this._isObject(row) ? row : {}, this, this._appModel);
    if (pos < 0) {
      this.rows.push(r);
    } else {
      this.rows.splice(pos, 0, r);
    }
    return r;
  }

  /**
   * Initialisiert die Komponente
   * @param {Object} param0
   */
  init({
    id = "",
    rows = [],
    className = "",
    style = null,
    visible = true,
    ref = false
  }) {
    this.setId(id);
    this._setArray("rows", []);
    this.setClassName(className);
    this.setStyle(style);
    this.setVisible(visible);
    this.setRef(ref);
    this.setLastCell(false);
    rows?.forEach?.((row) => {
      this.addRow(row, -1);
    });
  }
}

export default Body;
