import { formatDate, startOfMonth, today } from "../../tools/dates";
import { showConsole } from "../../tools/flags";
import PlanerDate from "../apimodels/planerdate";
import ByDienst from "./helper/bydienst";
import ByMitarbeiter from "./helper/bymitarbeiter";
import ByMitarbeiterDienst from "./helper/bymitarbeiterdienst";

/**
 * Klasse um ein PlanerDate-Object zu erstellen
 * @class
 */
class DienstplanerDataPlanerDate extends PlanerDate {
  constructor(obj, appModel = false) {
    super(obj, appModel, false);
    this.reset();
    this._preventExtension();
  }

  /**
   * Gibt die Reihenfolge des Monats zurück
   */
  get _order() {
    let result = 1;
    if (this._zahl < this._anfang.zahl) {
      result = 0;
    } else if (this._zahl > this._ende.zahl) {
      result = 2;
    }

    return result;
  }

  /**
   *  Testet, ob das Feld in dem Hauptdatum liegt
   */
  get isInMainZeitraum() {
    return this._order === 1;
  }

  /**
   * Testet, ob das Datum mindestens dem aktuelle Hauptmonat entspricht
   */
  get isPlanDatum() {
    const anfang = this._anfang;
    const result = this._zahl >= anfang.zahl;

    return result;
  }

  /**
   * Liefert true, wenn das Datum in der Tabelle angezeigt wird
   */
  get showInTable() {
    const onlyPlanungszeitraum = this?._user?.dienstplanTableSettings?.only_planungszeitraum;
    return onlyPlanungszeitraum ? this.isInMainZeitraum : true;
  }

  /**
   * Liefert ein Array mit dem label und dem feiertagnamen
   */
  get contentArray() {
    const feiertagName = this.feiertagName.trim();
    const result = [this.label];
    if (feiertagName) {
      return result.concat(feiertagName.split(" "));
    }
    return result;
  }

  /**
   * Testen, ob das Datum größer gleich dem aktuellen Tag ist
   */
  get isCurrentMonthPlus() {
    return this._zahl >= this._dateZahl(formatDate(startOfMonth(today())));
  }

  /**
   * Nur Datum die größer gleich dem aktuellen Tag
   * und mindestens im Hauptmonat liegen dürfen bearbeitet werden
   */
  get writable() {
    return this.isPlanDatum && this.isCurrentMonthPlus;
  }

  /**
   * Liefert Informationen zum Datum
   */
  get mainInfos() {
    return {
      ...super.mainInfos,
      writable: { value: this.writable ? "Ja" : "Nein", label: "Einteilungen Bearbeitbar" }
    };
  }

  /**
   * Liefert weitere Informationen zur Datum
   */
  get popupInfos() {
    return {
      ...super.popupInfos
    };
  }

  /**
   * Liefert ein Info-Objekt
   */
  get _info() {
    return {
      mainInfos: this.mainInfos,
      popupInfos: this.popupInfos
    };
  }

  /**
   * Zurücksetzen des Datums
   */
  reset() {
    this._setObject("bedarfsFelder", {});
  }

  /**
   * Gibt das entsprechende Element aus by_dienst zurück
   * @param {Number} dienstId
   * @returns object
   */
  getDienstEl(dienstId) {
    if (!(this.by_dienst[dienstId] instanceof ByDienst)) {
      this.by_dienst[dienstId] = new ByDienst(this?.by_dienst?.[dienstId]
        || {}, this._appModel, this);
    }

    return this.by_dienst[dienstId];
  }

  /**
   * Liefert die Bereiche aus dem entsprechenden by_dienst-Element
   * @param {Number} dienstId
   * @returns object
   */
  getBereiche(dienstId) {
    return this.getDienstEl(dienstId)?.bereiche_ids;
  }

  /**
   * Gibt einen bestimmten Bereich zurück und erstellt diesen ggf.
   * falls bereiche existieren, aber nicht diese bereichId
   * @param {Number} dienstId
   * @param {Number} bereichId
   * @returns object
   */
  getBereich(dienstId = 0, bereichId = 0) {
    const el = this.getDienstEl(dienstId);
    return el?.getBereich?.(bereichId);
  }

  getFirstBereich(dienstId = 0) {
    const el = this.getDienstEl(dienstId);
    return el?.getFirstBereich();
  }

  /**
   * Iteriert durch die Dienste
   * @param {Function} callback
   * @param {Boolean} sort
   * @returns Array
   */
  eachDienst(callback = false, sort = false) {
    const arr = [];
    if (!this._isFunction(callback)) {
      console.log("Es wird ein callback erwartet", callback);
      return arr;
    }

    this.eachByDienst((oldEl, dienstId) => {
      const dienst = this._dienste[dienstId];
      const el = this.getDienstEl(dienstId);
      if (!el || !dienst) {
        if (!dienst && showConsole) {
          console.log(this.by_dienst, dienstId, dienst, "Dienst existiert nicht!");
        }
        return;
      }
      if (sort) arr.push({ dienst, el });
      else callback(dienst, el);
    });

    if (sort) {
      arr.sort((a, b) => a.dienst.order - b.dienst.order);
      arr.forEach((obj) => callback(obj.dienst, obj.el));
    }
    return arr;
  }

  /**
   * Liefert das entsprechende by_mitarbeiter-Element
   * @param {Number} mitarbeiterId
   * @returns object
   */
  getMitarbeiterEl(mitarbeiterId = 0) {
    if (!(this.by_mitarbeiter[mitarbeiterId] instanceof ByMitarbeiter)) {
      this.by_mitarbeiter[mitarbeiterId] = new ByMitarbeiter(this?.by_mitarbeiter?.[mitarbeiterId]
        || {}, this._appModel, this);
    }

    return this.by_mitarbeiter[mitarbeiterId];
  }

  /**
   * Gibt die Wunsch-Id des Mitarbeiters für einen bestimmten Tag aus
   * @param {Number} mitarbeiterId
   * @returns wunsch-Id
   */
  getMitarbeiterWunsch(mitarbeiterId) {
    const result = this.getMitarbeiterEl(mitarbeiterId);
    return result?.wunsch_id || 0;
  }

  /**
   * Initialisiert alle By-Dienst und alle Einteilungen
   * @param {Function} callback
   */
  initDienste(callback = false) {
    this.eachByDienst((oldEl, dienstId) => {
      const el = this.getDienstEl(dienstId);
      if (this._isFunction(callback)) {
        callback(el);
      }
    });
  }

  /**
   * Initialisiert das By-Mitarbeiter-Element
   * @param {Function} callback
   */
  initMitarbeiter(callback = false) {
    const callbackFn = this._isFunction(callback) ? callback : () => {};
    this.eachByMitarbeiter((oldEl, mitarbeiterId) => {
      const el = this.getMitarbeiterEl(mitarbeiterId);
      callbackFn(el);
    });
  }

  /**
   * Liefert ein Objekt, in dem sich alle Felder eines Mitarbeiters zu einem Dienst finden lassen
   * @param {Number} mitarbeiterId
   * @param {Number} dienstId
   * @returns object
   */
  getTableDienstHeadEl(mitarbeiterId = 0, dienstId = 0) {
    return new ByMitarbeiterDienst({
      mitarbeiterId,
      dienstId
    }, this._appModel, this);
  }

  /**
   * Zählt die besetzten Felder
   * @param {Number} dienstId
   * @returns number
   */
  countBesetzt(dienstId = 0) {
    const el = this.getDienstEl(dienstId);
    return (el?.besetzt?.()?.length) || 0;
  }

  /**
   * Zählt die unbesetzten Felder
   * @param {Number} dienstId
   * @returns number
   */
  countUnbesetzt(dienstId = 0) {
    const el = this.getDienstEl(dienstId);
    return el?.unbesetzt?.()?.length || 0;
  }

  /**
   * Zählt den Bedarf der Vorlage-Dienste
   * @returns number
   */
  getCurrentBedarf() {
    const vorlage = this._vorlageDiensteIds;
    let sum = 0;
    if (vorlage) {
      vorlage.forEach((dId) => {
        sum += this.countUnbesetzt(dId);
      });
    }
    return sum;
  }

  /**
   * Erstellt die Informationen zu dem Datum
   */
  setInfo() {
    this._setPageInfoPopup(this.contentArray.join(", "), this);
  }

  /**
   * Liefert die Farbe für die PDF
   * @returns {string} Benutzerdefinierte Farbe
   */
  getColor() {
    let color = "";
    if (this.isFeiertag) {
      color = "#ffc8c8";
    } else if (this.is_weekend) {
      color = "#d7d7d7";
    }
    return color;
  }
}

export default DienstplanerDataPlanerDate;
