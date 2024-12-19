import Basic from "../basic";
import VerteilerTVCollection from "./verteilerCollection";

/**
 * Klasse mit der die Verteiler-Collections verwaltet werden
 * @class VerteilerCollections
 */
class VerteilerCollections extends Basic{
  constructor(arr, parent, appModel = false) {
    super(appModel);
    this._setObject("parent", parent);
    this.init(arr);
  }

  /**
   * Iteriert über alle Daten und ruft die Funktion func auf
   * für collections, die zur im Verteiler gewählten Vorlage passen.
   * @param {Function} func 
   */
  eachByVorlage(func) {
    const result = [];
    if (!this?._vorlage) return result;
    let i = 0;
    this._each((item) => {
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
  each(callback) {
    const result = [];
    let i = 0;
    this._each((item) => {
      result.push(this._isFunction(callback) ? callback(item, i) : item);
      i++;
    });
    return result;
  }

  /**
   * Liefert die Optionen zum Einstellen des TV-Grids
   * @returns Array
   */
  createOptionVals() {
    return this.eachByVorlage((_headline) => {
      const group = {
        options: [],
        label: _headline.name,
        colors: {}
      };
      let optionPlanname = `hl-${_headline.planname}`;
      group.options.push({
        planname: optionPlanname,
        color: _headline.color,
        label: _headline.name
      });
      group.colors[optionPlanname] = _headline.color;
      _headline?.eachBereichTVByVorlage?.((item) => {
        const name = item.bereich
          ? item.bereich.converted_planname
          : item.po_dienst.converted_planname;
        const label = item.bereich ? item.bereich.name : item.po_dienst.name;

        optionPlanname = `ct-${name}`;
        group.options.push({
          planname: optionPlanname,
          color: item.color,
          label
        });
        group.colors[optionPlanname] = item.color;
      });
      return group;
    });
  }

  /**
   * Initialisiert die Collections
   * @param {Array} arr 
   */
  init(arr) {
    arr?.forEach?.((item) => {
      this._setObject(item.id, new VerteilerTVCollection(item, this, this._appModel));
    });
  }
};

export default VerteilerCollections;