import Feld from '../helper/feld';

class FeldV extends Feld {
  constructor(obj, appModel = false) {
    super(obj, appModel, false);
  }

  /**
   * Teilt das Feld ein
   * @param {Object} param0
   */
  einteilen(param0) {
    return super.einteilen({
      ...param0,
      responseCallback: () => {}
    });
  }

  removeFromBedarf() {
    if (this.bedarf) {
      this.bedarf.removeFeld(this);
    }
  }

  onDienstfrei(curTag, callback) {
    this.schichten?.forEach?.(s => {
      if(!s.isFrei) return;
      const tage = s.getTage();
      tage?.forEach?.(tag => {
        if(tag === curTag) return;
        if(!s.hasDayFrei(tag)) return;
        callback(tag);
      });
    });
  }
}

export default FeldV;
