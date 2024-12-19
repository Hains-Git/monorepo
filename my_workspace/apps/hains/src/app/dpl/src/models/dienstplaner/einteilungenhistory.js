import { showConsole } from "../../tools/flags";
import EinteilungenHistory from "../helper/einteilungenhistory";
import DienstplanEinteilungVersion from "./einteilungversion";

class DienstplanEinteilungenHistory extends EinteilungenHistory {
  constructor(appModel = false) {
    super(appModel, true);
    if (showConsole) this._whoAmI();
    this._preventExtension();
  }

  /**
   * setzt das data Attribut
   * @param {Array} data
   */
  setData(data = []) {
    this._setArray("data", data);
    this.data.sort((a, b) => b.updatedAtZahl - a.updatedAtZahl);
    this._update();
  }

  /**
   * Erstellt eine EinteilungVersion
   * @param {Object} version
   * @param {Number} item_id
   * @returns Object
   */
  createEinteilungVersion(version, item_id) {
    return new DienstplanEinteilungVersion(version, item_id, this._appModel);
  }
}

export default DienstplanEinteilungenHistory;
