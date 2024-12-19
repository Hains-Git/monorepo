import { development } from '../../tools/flags';
import Channel from '../helper/channel';

class AbwesentheitenChannel extends Channel {
  constructor(parent = false, appModel = false) {
    super('abwesentheiten', parent, appModel, false);
    this.urlaubsliste = parent;
    if (development) this._whoAmI();
  }

  /**
   * Empfängt die Daten und führt entsprechende Operationen aus
   * @param {Object} data
   */
  receive(data = false) {
    if (development) console.log(data);
    if (data?.aw) {
      this.urlaubsliste.updateAbwesentheiten(data.aw);
    }
    if (data?.einteilungen_aw) {
      this.urlaubsliste.updateEinteilungenByChannel(data.einteilungen_aw, data?.mitarbeiter_ids, data?.von, data?.bis);
    }
  }
}
export default AbwesentheitenChannel;
