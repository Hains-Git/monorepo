import {
  shortwait, throttle
} from "../../../../tools/debounce";
import Shared from "./shared";
import Body from "./body";
import Column from "./columns";

class Table extends Shared {
  constructor(obj = {}, appModel = false, preventExtension = true) {
    super(appModel);
    this.init(this._isObject(obj) ? obj : {});
    this._setObject("lastCells", {
      head: false,
      body: false,
      foot: false
    });
    if (preventExtension) this._preventExtension();
  }

  get isATable() {
    return true;
  }

  /**
   * Endzeile
   * @param {Number} end
   */
  setRowEnd(end = 0) {
    this._set("rowEnd", end);
  }

  /**
   * Endspalte
   * @param {Number} end
   */
  setCellEnd(end = 0) {
    this._set("cellEnd", end);
  }

  /**
   * Erstellt einen neuen Body
   * @param {Object} obj
   * @returns Body
   */
  createBody(obj = {}, type = "body") {
    return new Body(this._isObject(obj) ? obj : {}, type, this, this._appModel);
  }

  /**
   * Setzt den Tabellen-Kopf
   * @param {Object} head
   */
  setHead(head = {}) {
    this._set("head", this.createBody(head, "head"));
  }

  /**
   * Setzt den Tabellen-Körper
   * @param {Object} head
   */
  setBody(body = {}) {
    this._set("body", this.createBody(body, "body"));
  }

  /**
   * Setzt den Tabellen-Fuß
   * @param {Object} foot
   */
  setFoot(foot = {}) {
    this._set("foot", this.createBody(foot, "foot"));
  }

  /**
   * Erstellt Spalten für die Tabelle
   * @param {Object} columns
   */
  setColumns(columns = {}) {
    this._setObject("columns", {});
    if (this._isObject(columns)) {
      for (const key in columns) {
        this.addColumn(columns[key], key);
      }
    }
  }

  /**
   * Iteriert über alle Columns der Tabelle
   * @param {Function} callback
   */
  eachColumn(callback = false) {
    if (!this._isFunction(callback)) return false;
    for (const key in this.columns) {
      callback(this.columns[key], key);
    }
  }

  /**
   * Fügt den Columns eine neue Column hinzu
   * @param {Object} obj
   * @param {String} id
   */
  addColumn(obj = {}, id = "0") {
    this.columns[id] = new Column(this._isObject(obj) ? obj : {}, id, this._appModel);
  }

  /**
   * Liefert die entsprechende Column
   * @param {String} id
   * @returns Column
   */
  getColumn(id = "0") {
    return this.columns?.[id] || false;
  }

  /**
   * Verändert die Fontsize
   * @param {Number} add
   * @param {Boolean} reset
   * @returns Boolean
   */
  setFontSize(add = 0, reset = false) {
    if (this?._user?.setFontSize) {
      const newFontSize = this._user.setFontSize(add, reset);
      const newStyle = this.style ? { ...this.style } : {};
      newStyle.fontSize = `${newFontSize}em`;
      this._set("style", newStyle);
      this._update();
      return true;
    }
    return false
  }

  /**
   * Initialisiert die Properties
   * @param {Object} param0
   */
  init({
    id = "",
    className = "",
    style = null,
    visible = true,
    fontSizeFaktor = 0,
    rowEnd = -1,
    cellEnd = -1,
    columns = {},
    head = {},
    body = {},
    foot = {},
    ref = false
  }) {
    this.setClassName(className);
    this.setVisible(visible);
    this.setStyle(style);
    this.setColumns(columns);
    this.setHead(head);
    this.setBody(body);
    this.setFoot(foot);
    this.setRef(ref);
    this.setId(id);
    this.setRowEnd(rowEnd);
    this.setCellEnd(cellEnd);
    if (fontSizeFaktor >= 0) this.setFontSize(fontSizeFaktor);
  }

  /**
   * Update aller Bodys
   */
  updateBodys = throttle(() => {
    this?.head?._update?.();
    this?.body?._update?.();
    this?.foot?._update?.();
  }, shortwait);

  /**
   * Führt ein Update der letzen Zelle der Tabellen-Körper aus
   */
  updateLastCells = throttle(() => {
    this?.head?.lastCell?._update?.();
    this?.body?.lastCell?._update?.();
    this?.foot?.lastCell?._update?.();
  }, shortwait);

  /**
   * Führt ein Update des Popups aus
   */
  updatePopup = throttle(() => {
    this._setState({}, "popup");
  }, shortwait);


  /**
   * Updaten der Tabelle und der Bodys
   */
  update = () => { 
    this._update();
    this.updatePopup();
    this.updateBodys();
  };
}

export default Table;
