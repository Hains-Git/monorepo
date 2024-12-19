import Schicht from "../apimodels/schicht";

class FreiSchicht extends Schicht {
  constructor({
    anfang,
    ende,
    arbeitszeit = 0,
    dienstId = 0,
    ausgleich = false,
    id = -1,
    schicht_nummer = 1
  }, appModel = false) {
    super({
      id,
      schicht_nummer,
      anfang,
      ende,
      arbeitszeit,
      ausgleich
    }, appModel, false);
    this._setInteger("be_po_dienst_id", dienstId);
    this._preventExtension();
  }

  /**
   * Liefert ein Objekt mit der dienstId
   */
  get bedarfsEintrag() {
    return {
      po_dienst_id: this.be_po_dienst_id
    };
  }

  /**
   * Liefert false
   */
  get arbeitszeittyp() {
    return false;
  }

  /**
   * True
   */
  get isFrei() {
    return true;
  }

  /**
   * False
   */
  get isArbeit() {
    return false;
  }

  /**
   * False
   */
  get isRufdienst() {
    return false;
  }

  /**
   * False
   */
  get isBereitschaftsdienst() {
    return false;
  }

  /**
   * Liefert den namen des Arbeitszeittyps
   */
  get typ() {
    return "Frei";
  }
}

export default FreiSchicht;
