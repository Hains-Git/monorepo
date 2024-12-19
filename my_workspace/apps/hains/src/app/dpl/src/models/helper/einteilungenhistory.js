import { returnError } from "../../tools/hains";
import Basic from "../basic";

class EinteilungenHistory extends Basic {
  constructor(appModel = false, preventExtension = true) {
    super(appModel);
    this.setData();
    if (preventExtension) this._preventExtension();
  }

  /**
   * Iteriert über alle Versionen und führt einen Callback aus.
   * @param {Function} callback
   * @returns Array
   */
  eachVersion(callback = false) {
    const result = [];
    this.data.forEach((item, i) => {
      result.push(this._isFunction(callback) ? callback(item, i) : item);
    });
    return result;
  }

  /**
   * setzt das data Attribut
   * @param {Array} data
   */
  setData(data = []) {
    this._setArray("data", data);
    this._update();
  }

  /**
   * Erstellt eine EinteilungVersion, wenn diese Funktion überschrieben wird.
   * Wird Seitenspezifisch überschrieben, z.B. im Dienstplaner.
   * @param {Object} version
   * @param {Number} item_id
   * @returns Object
   */
  createEinteilungVersion(version, item_id) {
    return {...version, item_id};
  }

  /**
   * Bereitet die Daten für die Anzeige auf.
   * @param {Array} data
   * @returns Array
   */
  creaeteEinteilungenVersions(data) {
    const result = [];
    data?.forEach?.((item) => {
      item?.versions?.forEach?.((version) => {
        if (version?.object) {
          result.push(this.createEinteilungVersion(JSON.parse(version.object), version.item_id));
        }
      });
    });
    return result;
  }

  /**
   * Lädt die History der Einteilungen aus der API und führt einen Callback aus.
   * @param {Object} feld
   * @param {Function} callback
   */
  loadHistory(feld, callback = false) {
    const call = () => this._isFunction(callback) && callback();
    if (this?._hains?.api) {
      const data = {};
      if (typeof feld?.tag === "string") data.tag = feld.tag;
      if (typeof feld?.dienstId === "number") data.dienst_id = feld.dienstId;
      if (typeof feld?.bereichId === "number") data.bereich_id = feld.bereichId;
      this._hains.api("einteilungshistory", "GET", data).then((response) => {
        if (!this?._mounted) return;
        this.setData(this.creaeteEinteilungenVersions(response));
        call();
      }, (resp) => {
        returnError(resp);
        call();
      });
    }
  }
}

export default EinteilungenHistory;
