import React from "react";
import DienstplanerFeld from "./feld";
import { debounce, wait } from "../../../tools/debounce";

class DienstplanerAddFeld extends DienstplanerFeld {
  constructor(obj, appModel = false) {
    super(obj, appModel, false);
    this._set("add", obj?.add || false, false);
    this._set("shouldSetFocus", obj.shouldSetFocus);
    this._set("mitarbeiterId", obj.mitarbeiterId || 0);
    this._preventExtension();
  }

  /**
   * Liefert true
   */
  get default() {
    return true;
  }

  /**
   * Liefert true
   */
  get isAddFeld() {
    return true;
  }

  /**
   * Liefert true
   */
  get vorschlaege() {
    return true;
  }

  /**
   * Liefert -1
   */
  get index() {
    return -1;
  }

  /**
   * Default-Felder sind immer visible
   */
  get visible() {
    return true;
  }

  /**
   * Nur bestimmte Felder sollen überschrieben werden
   */
  get writable() {
    return false;
  }

  /**
   * Liefert false
   */
  get exceedsBedarf() {
    return false;
  }

  /**
   * Leifert false
   */
  get isOptional() {
    return false;
  }

  /**
   * Gibt den eingeteilten Mitarbeiter zurück
   */
  get mitarbeiter() {
    return this._getIdsObject("_mitarbeiter", "mitarbeiterId", false);
  }

  /**
   * Label für das Auswahl-Tab
   */
  get label() {
    const {
      dienst,
      mitarbeiter,
      date
    } = this;
    let label = `${date?.label || this.tag}, ${dienst?.planname || this.dienstId}`;
    if (mitarbeiter) {
      label = dienst && mitarbeiter
        ? `${mitarbeiter?.planname || this.mitarbeiterId}, ${dienst?.planname || this.dienstId}`
        : `${mitarbeiter?.planname || this.mitarbeiterId}, ${date?.label || this.tag}`;
    }
    return label;
  }

  get hasAddFkt() {
    return this._isFunction(this?.add);
  }

  /**
   * show inaktivieren
   */
  show() {}

  /**
   * hide inaktivieren
   */
  hide() {}

  /**
   * remove inaktivieren
   */
  remove() {}

  /**
   * einteilen inaktivieren
   */
  einteilen() {}

  /**
   * Liefert das value-Attribut
   */
  getValue() {
    return this.value;
  }

  /**
   * Liefert die Default-Werte
   * @returns object
   */
  getStyle() {
    return {
      className: "default-einteilung",
      title: [],
      style: null
    };
  }

  /**
   * Aktualisiert die Vorschläge für die Tabelle
   * @param {Boolean} execute
   */
  setFocus(execute = false) {
    const auswahl = this.shouldSetFocus && this?._dienstplanTable?.auswahl;
    if (auswahl?.setFeld) {
      auswahl.setFeld(this, execute);
    }
  }

  /**
   * Liefert das erste passende leere Feld zu einem bestimmten Dienst
   * @param {Object} date
   * @returns feld
   */
  getEmptyDienstFeld(dienst = false) {
    return super.getEmptyDienstFeld(dienst, this?.mitarbeiter);
  }

  /**
   * Liefert das erste passende leere Feld zu einem bestimmten Tag und Mitarbeiter
   * @param {Object} date
   * @returns feld
   */
  getEmptyDateFeld(date = false) {
    return super.getEmptyDateFeld(date, this?.mitarbeiter);
  }

  /**
   * Führt die add-Funktion gedebounced aus
   */
  debouncedAdd = debounce((evt) => {
    if(this.hasAddFkt) {
      this.add(evt);
    }
  }, wait);
}

export default DienstplanerAddFeld;
