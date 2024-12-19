import { development } from '../../tools/flags';
import Channel from '../helper/channel';

class VerteilerChannel extends Channel {
  constructor(parent = false, appModel = false) {
    super('verteiler', parent, appModel, false);
    if (development) this._whoAmI();
  }

  /**
   * Empfängt die Daten und führt entsprechende Operationen aus
   * @param {Object} data
   */
  receive(data = false) {
    // if (development) console.log(data);
    this.einteilen(data?.einteilungen);
    this.freigabeUpdate(data?.freigabe, data?.freigabetypen_dienste_ids);
    this.rotationUpdate(data?.rotation, data?.addRotation);
    this.wunschUpdate(data?.wunsch);
    this?.parent?.uiUpdate?.(true);
  }

  /**
   * Führt ein Update der Einteilung aus
   * @param {Object} einteilungen
   */
  einteilen(einteilungen) {
    const verteilerData = this?._pageData;
    if (
      !(
        this._isObject(einteilungen) &&
        verteilerData?.resetEinteilung &&
        verteilerData?.tagIsInDienstplaeneFrames
      )
    )
      return;
    const removed = {};
    for (const key in einteilungen) {
      const [bereich_id, tag, po_dienst_id] = key.split('_');
      if (!verteilerData.tagIsInDienstplaeneFrames(tag)) continue;
      if (!removed[key]) {
        removed[key] = true;
        verteilerData.removeEinteilungenForBereich(
          tag,
          po_dienst_id,
          bereich_id
        );
      }
      einteilungen[key]?.forEach?.((e) => {
        verteilerData.resetEinteilung(e);
      });
    }
  }

  /**
   * Führt ein Update der Rotation durch
   * @param {Object} rotation
   * @param {Boolean} add
   */
  rotationUpdate(rotation, add = false) {
    super.rotationUpdate(rotation, add, (r, oldR) => {
      this?._dates?._each?.((date) => {
        if (date.updateRotation) {
          date.updateRotation(oldR, false);
          date.updateRotation(r, add);
        }
      });
    });
  }
}

export default VerteilerChannel;
