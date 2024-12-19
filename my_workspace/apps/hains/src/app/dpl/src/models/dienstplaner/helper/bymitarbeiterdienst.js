import { getRGB } from "../../../tools/helper";
import Basic from "../../basic";
import DienstplanerAddFeld from "./addfeld";
import DienstplanerDefaultFeld from "./defaultfeld";

class ByMitarbeiterDienst extends Basic {
  constructor({
    mitarbeiterId = 0,
    dienstId = 0
  }, appModel = false, date = false) {
    super(appModel);
    this._setInteger("mitarbeiterId", mitarbeiterId);
    this._setInteger("dienstId", dienstId);
    this._set("date", date);
    this.setRenderedContent();
    this._preventExtension();
  }

  /**
   * Liefert ein Label
   */
  get label() {
    return `${this.mitarbeiter?.planname || this.mitarbeiterId}, ${this.dienst?.planname || this.dienstId}`;
  }

  /**
   * Liefert ein Key
   */
  get key() {
    return `${this.mitarbeiterId}_${this.dienstId}`;
  }

  /**
   * Liefert den zugehörigen Dienst
   */
  get dienst() {
    return this._getIdsObject("_dienste", "dienstId", false);
  }

  /**
   * Liefert den zugehörigen Mitarbeiter
   */
  get mitarbeiter() {
    return this._getIdsObject("_mitarbeiter", "mitarbeiterId", false);
  }

  /**
   * Liefert die ID des tags
   */
  get tag() {
    return this?.date?.id || "";
  }

  /**
   * Liefert ein Add-Feld
   */
  get addFeldObj() {
    return new DienstplanerAddFeld({
      add: false,
      shouldSetFocus: true,
      byDienstBereich: this,
      value: "+",
      tag: this?.date?.id,
      dienstId: this.dienstId,
      mitarbeiterId: this.mitarbeiterId
    }, this._appModel);
  }

  /**
   * True, wenn date und mitarbeiter writable ist
   */
  get writable() {
    return this?.dienst?.writable && this?.mitarbeiter?.writable?.(0, this.dienstId);
  }

  get allEinteilungenPublic() {
    let res = true;
    const felder = this.getFelder();
    if(!this._isArray(felder)) return res;
    const l = felder.length;
    for (let i = 0; i < l; i++) {
      const feld = felder[i];
      if (feld?.dienstId === this.dienstId && feld?.date?.showInTable) {
        const einteilung = feld?.date?.isInMainZeitraum && feld?.visible && feld?.einteilung;
        if(!einteilung) continue;
        if(!einteilung?.public) {
          res = false;
          break;
        }
      }
    }
    return res;
  }

  /**
   * Erstellt ein default-Feld
   */
  getDefaultFeldObj(value = "-") {
    return new DienstplanerDefaultFeld({
      byDienstBereich: this,
      value,
      tag: this?.date?.id,
      dienstId: this.dienstId,
      mitarbeiterId: this.mitarbeiterId
    }, this._appModel);
  }

  /**
   * Setzt das Attribut renderedContent
   */
  setRenderedContent(content = false) {
    this._set("renderedContent", content);
  }

  /**
   * @returns True, wenn ein neues Feld angehängt werden kann oder ein Feld leer ist
   */
  showAddFeldAlleTage() {
    let show = false;
    if (this.writable) {
      this?._dates?._each?.((date) => {
        const dienstEl = date.getDienstEl(this.dienstId);
        if (dienstEl?.showAddFeld && date?.writable) {
          show = dienstEl.showAddFeld();
        }
        return show;
      });
    }
    return show;
  }

  /**
   * Liefert ein By-Dienst-Element des Datums
   * @param {Object} date
   * @returns object
   */
  getDienstEl(date = false) {
    return date?.getDienstEl?.(this.dienstId);
  }

  /**
   * Liefert alle Felder
   * @param {Boolean} filterByDienst
   * @returns array
   */
  getFelder(filterByDienst = "") {
    const result = (this?.mitarbeiter?.getAllEinteilungen
      && this.mitarbeiter.getAllEinteilungen()) || [];
    return filterByDienst
      ? result.filter((feld) => feld?.dienstId === this.dienstId)
      : result;
  }

  /**
   * Liefert die eingeteilten Dates
   * @returns Array
   */
  getDates() {
    const result = [];
    this.getFelder(false).forEach((feld) => {
      if (feld?.dienstId === this.dienstId && feld?.date) {
        result.push(feld.date);
      }
    });
    return result;
  }

  /**
   * Liefert die Namen der Tage
   * @param {Boolean} withColor
   * @param {Boolean} publish
   * @returns Array
   */
  getTage = (withColor = false, publish = false) => {
    const result = [];
    this.getFelder(false).forEach((feld) => {
      if (feld?.dienstId === this.dienstId) {
        const einteilung = feld?.einteilung;
        if (
          (publish && !(einteilung?.writable || einteilung?.public)) 
          || !feld?.date?.showInTable
        ) return;
        result.push(withColor && feld?.date?.getColor
          ? [feld.getValue("tag"), getRGB(feld.date.getColor())]
          : feld.getValue("tag"));
      }
    });
    if (!result.length) result.push("-");
    return result;
  };

  /**
   * Liefert die Componeneten des By-Mitarbeiter-Dienst-Elements
   * @param {Function} callback
   * @returns array
   */
  getContent(callback = false) {
    const content = [];
    const type = "tag";
    const getFromCallback = this._isFunction(callback) 
      ? (feld) => callback(feld, type) 
      : (feld) => feld;
    this.getFelder(false).forEach((feld) => {
      if (feld?.dienstId === this.dienstId && feld?.date?.showInTable && feld?.visible) {
        content.push(getFromCallback(feld));
      }
    });
    const showAddFeld = this.showAddFeldAlleTage();
    if (!(content.length || showAddFeld)) {
      content.push(getFromCallback(this.getDefaultFeldObj("-")));
    }  
    // !content.length &&
    if(showAddFeld) {
      content.push(getFromCallback(this.addFeldObj));
    }
    return content;
  }

  _push = (setUpdate) => {
    if (setUpdate) {
      this._pushToRegister(setUpdate, "update");
      this?.mitarbeiter?._push?.(setUpdate);
      this?._user?._push?.(setUpdate);
    }
  };

  _pull = (setUpdate) => {
    if (setUpdate) {
      this._pullFromRegister(setUpdate, "update");
      this?.mitarbeiter?._pull?.(setUpdate);
      this?._user?._pull?.(setUpdate);
    }
  };
}

export default ByMitarbeiterDienst;
