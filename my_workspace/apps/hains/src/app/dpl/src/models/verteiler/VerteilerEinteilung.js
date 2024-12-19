import Einteilung from '../apimodels/einteilung';
import FeldV from './FeldV';

class VerteilerEinteilung extends Einteilung {
  constructor(obj, appModel = false) {
    super(obj, appModel, false);
    this._setArray('dienstfreiKeys', []);
  }

  get bedarf() {
    return this?.feld?.bedarf;
  }

  /**
   * Vorschläge und Counts-Einteilungen sollen angezeigt werden
   */
  get show() {
    const show = this.counts || (
      this.vorschlag 
      && this?._page?.hasDienstplanID?.(this.dienstplan_id)
    );
    return !!show;
  }

  addFeld(be_id) {
    const felder = this?._pageData?.felder;
    let tmpfeld =
      felder?.[this.tag]?.[this.po_dienst_id]?.find &&
      felder[this.tag][this.po_dienst_id].find(
        feld =>
          feld.empty &&
          (this.bereich_id ? feld.bereichId === this.bereich_id : true)
      );
    if (tmpfeld?.einteilen) {
      tmpfeld.einteilen({
        value: this.mitarbeiter_id,
        einteilungId: this.id,
        arbeitsplatzId: this.arbeitsplatz_id,
        post: false
      });
    } else {
      tmpfeld = new FeldV(
        {
          tag: this.tag,
          bereichId: this.bereich_id,
          dienstId: this.po_dienst_id,
          value: this.mitarbeiter_id,
          arbeitsplatzId: this.arbeitsplatz_id,
          einteilungId: this.id,
          schichtnr: this.schichten,
          bedarfeintragId: be_id
        },
        this._appModel
      );
      if (!felder[tmpfeld.tag]) felder[tmpfeld.tag] = {};
      if (!felder[tmpfeld.tag][tmpfeld.dienstId])
        felder[tmpfeld.tag][tmpfeld.dienstId] = [];
      felder[tmpfeld.tag][tmpfeld.dienstId].push(tmpfeld);
    }
    this.setFeld(tmpfeld);
    this.add(tmpfeld);
    this.feld?.bedarf?.addFeld?.(tmpfeld);
    this.checkDienstfrei();
  }

  checkDienstfrei() {
    this.feld?.onDienstfrei?.(this.tag, tag => {
      this._pageData.addEinteilungToDienstfrei(this, tag);
      if (!this.dienstfreiKeys.includes(tag)) {
        this.dienstfreiKeys.push(tag);
      }
    });
  }

  poDienstName(po_dienste) {
    return po_dienste[this.po_dienst_id].name;
  }

  /**
   * Entfernt die Einteilung
   */
  completeRemove() {
    this._pageData?.einteilungAufhebenRemove?.(this.id);
    this.updateCachedDienstplan();
  }
}
export default VerteilerEinteilung;
