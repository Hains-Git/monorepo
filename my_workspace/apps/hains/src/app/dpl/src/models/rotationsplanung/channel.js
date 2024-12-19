import { development } from '../../tools/flags';
import Channel from '../helper/channel';

class RotationsplanChannel extends Channel {
  constructor(parent = false, appModel = false) {
    super('rotationsplan', parent, appModel, false);
    if (development) this._whoAmI();
  }

  /**
   * Empfängt die Daten und führt entsprechende Operationen aus
   * @param {Object} data
   */
  receive(data = false) {
    if (development) console.log(data);
    this.parent?.updateVkTeamOverview?.(data?.vk_team_overview);
  }
}

export default RotationsplanChannel;
