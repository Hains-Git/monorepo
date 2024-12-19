import Basic from "../basic";

/**
 * Klasse um ein Freigabe-Objekt zu erstellen.
 * Entspricht Dienstfreigabe aus der API.
 * @class
 */
class Freigabe extends Basic {
  constructor(obj, appModel = false, preventExtension = true) {
    super(appModel);
    this._setInteger("freigabestatus_id", obj.freigabestatus_id);
    this._setInteger("freigabetyp_id", obj.freigabetyp_id);
    this._setInteger("mitarbeiter_id", obj.mitarbeiter_id);
    this._setInteger("standort_id", obj.standort_id);
    this._setInteger("id", obj.id);
    this._setInteger("user_id", obj.user_id);
    if (preventExtension) this._preventExtension();
  }

  /**
   * Liefert den eingeteilten Mitarbeiter
   */
  get mitarbeiter() {
    return this._getIdsObject(["_mitarbeiter", "_mitarbeiters"], "mitarbeiter_id", true);
  }

  /**
   * Liefert den entsprechenden Freigabetypen
   */
  get freigabetyp() {
    return this._getIdsObject("_freigabetypen", "freigabetyp_id", true);
  }

  /**
   * Liefert den enstrpechenden Freigabestatus
   */
  get freigabestatus() {
    return this._getIdsObject("_freigabestatuse", "freigabestatus_id", true);
  }

  /**
   * Liefert das qualifziert Attribut aus freigabetyp
   */
  get qualifiziert() {
    return this?.freigabestatus?.qualifiziert || false;
  }

  /**
   * Liefert das qualifziert Attribut aus freigabetyp
   */
  get erteilt() {
    return this?.freigabestatus?.erteilt || false;
  }

  /**
   * Liefert Informationen zu der Freigabe
   */
  get _info() {
    const label = this?.freigabetyp?.name || this.freigabetyp_id.toString();
    return {
      value: {
        mitarbeiter: { value: this?.mitarbeiter.planname || this.mitarbeiter_id.toString(), label: "Mitarbeiter" },
        status: { value: this?.freigabestatus?._info?.value || this.freigabestatus_id.toString(), label: "Status" },
        freigabetyp: { value: this?.freigabetyp?._info?.value || this.freigabetyp_id.toString(), label: "Typ" }
      },
      label,
      sort: label
    };
  }
}

export default Freigabe;
