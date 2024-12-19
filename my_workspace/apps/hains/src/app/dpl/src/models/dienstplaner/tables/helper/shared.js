import InfoTab from "../../../helper/info-tab";

class Shared extends InfoTab {
  constructor(appModel = false) {
    super(appModel);
  }

  /**
   * Liefert das Date-Objekt
   */
  get date() {
    return this._getIdsObject("_dates", "dateId", false);
  }

  /**
   * Liefert das Dienst-Objekt
   */
  get dienst() {
    return this._getIdsObject("_dienste", "dienstId", false);
  }

  /**
   * Liefert das Mitarbeiter-Objekt
   */
  get mitarbeiter() {
    return this._getIdsObject("_mitarbeiter", "mitarbeiterId", false);
  }

  /**
   * Testet, ob der Dienst in der Vorlage vorhanden ist
   */
  get dienstIsInVorlage() {
    const diensteIds = this._vorlageDiensteIds;
    return !diensteIds.length || !this.dienstId || diensteIds.includes(this.dienstId);
  }

  /**
   * Liefert das visible Atrribut und checked ggf. Filter der Tabelle
   */
  get isVisible() {
    if (this.visible && this?.table?.isInFilter) {
      return this.table.isInFilter(this);
    }

    return this.visible;
  }

  /**
   * Setzt die Id der Komponente
   * @param {String} id
   */
  setId(id = "") {
    this._set("id", id);
  }

  /**
   * Setzt die Referenz auf ein Dom-Element
   * @param {Object} ref
   */
  setRef(ref = false) {
    this._set("ref", ref, false);
  }

  /**
   * Klassenname für die Komponente
   * @param {String} className
   */
  setClassName(className = "") {
    this._set("className", (className?.toString?.() || "").trim());
  }

  /**
   * Klassenname für die Komponente
   * @param {String} className
   */
  setDefaultClassName(defaultClassName = "") {
    this._set("defaultClassName", (defaultClassName?.toString?.() || "").trim());
  }

  /**
   * Style der Tabelle
   * @param {Object} style
   */
  setStyle(style = null) {
    this._setObject("style", style);
  }

  /**
   * Setzt das Attribut isLast
   * @param {Boolean} bool
   */
  setIsLast(bool = false, add = false) {
    this._set("isLast", bool);
    if (add && this?.body?.setLastCell) {
      this.body.setLastCell(this);
    }
  }

  /**
   * Setzt das visible Attribut
   * @param {Boolean} bool
   */
  setVisible(bool = false, update = false) {
    this._set("visible", bool);
    update && this._update();
  }

  /**
   * Setzt den clickHandler
   * @param {Function} fkt
   */
  setClickHandler(fkt = false) {
    this._set("clickHandler", this._isFunction(fkt) ? fkt : null);
  }

  /**
   * Setzt die Date-Id
   * @param {String} dateId
   */
  setDateId(dateId = "") {
    this._set("dateId", dateId);
  }

  /**
   * Setzt die Dienst-Id
   * @param {Number} dienstId
   */
  setDienstId(dienstId = 0) {
    this._set("dienstId", dienstId);
  }

  /**
   * Setzt die Mitarbeiter-Id
   * @param {Number} mitarbeiterId
   */
  setMitarbeiterId(mitarbeiterId = 0) {
    this._set("mitarbeiterId", mitarbeiterId);
  }
}

export default Shared;
