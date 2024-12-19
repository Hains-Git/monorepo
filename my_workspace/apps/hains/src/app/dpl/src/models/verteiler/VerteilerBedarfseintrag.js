import Bedarfeintrag from '../apimodels/bedarfeintrag';

class VerteilerBedarfseintrag extends Bedarfeintrag {
  constructor(obj, appModel = false) {
    super(obj, appModel, false);
  }

  mapFirstEntry(){
    const startBedarf = this.startBedarfsEintrag;
    if(startBedarf || !this.is_block) return;
    const key = `${this.tag}_${this.po_dienst_id}_${this.bereich_id}_${this.dienstbedarf_id}`;
    const alternative = this?._bedarfseintraege?.[this?._pageData?.bedarfeMap?.[key]?.first_entry];
    if(!alternative?.is_block) return;
    this._set("first_entry", alternative.id);
  }

  poDienstName(po_dienste) {
    return po_dienste[this.po_dienst_id].name;
  }
}
export default VerteilerBedarfseintrag;
