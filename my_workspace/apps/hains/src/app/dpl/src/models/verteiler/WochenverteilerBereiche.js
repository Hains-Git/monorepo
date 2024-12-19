import Basic from "../basic";
import VerteilerBereichWochenverteiler from "./VerteilerBereichWochenverteiler";

class WochenverteilerBereiche extends Basic{
  constructor(arr, parent, appModel = false) {
    super(appModel);
    this._setObject("parent", parent);
    this.init(arr);
  }

  /**
   * Iteriert über alle Daten und ruft die Funktion func auf
   * für Bereiche, die zur im Verteiler gewählten Vorlage passen.
   * @param {Function} func 
   */
  eachByVorlage(func) {
    const result = [];
    let i = 0;
    if (!this?._vorlage) return result;
    this._each((item) => {
      if (!item?.isInVorlage) return;
      result.push(this._isFunction(func) ? func(item, i) : item);
      i++;
    });
    return result;
  }

  /**
   * Mapped die Bereiche anhand der Funktion callback zu einem Array
   * @param {Function} callback 
   * @returns Array
   */
  each(callback = false) {
    const result = [];
    let i = 0;
    this._each((item) => {
      result.push(this._isFunction(callback) ? callback(item, i) : item);
      i++;
    });
    return result;
  }

  /**
   * Initialisiert die Bereiche des Wochenverteilers
   * @param {Array} arr 
   */
  init(arr) {
    arr?.forEach?.((item) => {
      this._setObject(item.id, new VerteilerBereichWochenverteiler(item, this, this._appModel));
    });
  }
};

export default WochenverteilerBereiche;