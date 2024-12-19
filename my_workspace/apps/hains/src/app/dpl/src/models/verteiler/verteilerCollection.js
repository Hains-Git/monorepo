import Basic from "../basic";
import VerteilerBereichTagesverteiler from "./VerteilerBereichTagesverteiler";

/**
 * Klasse für die Headlines im Tagesverteiler.
 * @class VerteilerTVCollection
 */
class VerteilerTVCollection extends Basic {
  constructor(obj, collections, appModel = false) {
    super(appModel);
    this._setObject("collections", collections);
    this._setInteger("id", obj?.id);
    this._set("color", obj?.color || "");
    this._set("name", obj.name || "");
    this._set("planname", obj.planname || "");
    this._setArray("bereich_tagesverteilers", obj?.bereich_tagesverteilers?.map?.(
      (_obj) => new VerteilerBereichTagesverteiler(_obj, this, this._appModel)
    ));
  }

  /**
   * True, wenn ein Element aus bereich_tagesverteiler in der Vorlage auftaucht.
   */
  get isInVorlage() {
    return !!this.bereich_tagesverteilers?.find?.((item) => !!item?.isInVorlage);
  }

  /**
   * Iteriert über alle Daten und ruft die Funktion func auf
   * für collections, die zur im Verteiler gewählten Vorlage passen.
   * @param {Function} func 
   */
  eachBereichTVByVorlage(func) {
    const result = [];
    if (!this?._vorlage) return result;
    let i = 0;
    this.bereich_tagesverteilers?.forEach?.((item) => {
      if (!item?.isInVorlage) return;
      result.push(this._isFunction(func) ? func(item, i) : item);
      i++;
    });
    return result;
  }

  /**
   * Mapped die Collections anhand der Funktion callback zu einem Array
   * @param {Function} callback 
   * @returns Array
   */
  eachBereichTV(callback) {
    const result = [];
    let i = 0;
    this.bereich_tagesverteilers?.forEach?.((item) => {
      result.push(this._isFunction(callback) ? callback(item, i) : item);
      i++;
    });
    return result;
  }
};

export default VerteilerTVCollection;