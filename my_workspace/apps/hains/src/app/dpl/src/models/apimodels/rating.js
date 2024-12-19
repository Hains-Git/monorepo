import Basic from "../basic";

/**
 * Klasse um ein Rating-Objekt zu erstellen.
 * Entspricht DienstRating aus der API
 * @class
 */
class Rating extends Basic {
  constructor(obj, appModel = false, preventExtension = true) {
    super(appModel);
    this._setInteger("mitarbeiter_id", obj.mitarbeiter_id);
    this._setInteger("po_dienst_id", obj.po_dienst_id);
    this._setInteger("rating", obj.rating);
    this._setInteger("id", obj.id);
    if (preventExtension) this._preventExtension();
  }

  /**
   * Liefert den Dienst, welcher bewertet wurde
   */
  get dienst() {
    return this._getIdsObject(["_dienste", "_po_dienste"], "po_dienst_id", true);
  }

  /**
   * Liefert den eingeteilten Mitarbeiter
   */
  get mitarbeiter() {
    return this._getIdsObject(["_mitarbeiter", "_mitarbeiters"], "mitarbeiter_id", true);
  }

  /**
   * Liefert Informationen zu der Bewertung
   */
  get _infoDienst() {
    return {
      value: {
        id: { value: this.id.toString(), label: "ID" },
        wert: { value: this.rating.toString(), label: "Bewertung" }
      },
      label: this?.mitarbeiter?.planname || this.mitarbeiter_id.toString(),
      sort: this.rating
    };
  }

  /**
   * Liefert Informationen zu der Bewertung
   */
  get _infoMitarbeiter() {
    return {
      value: {
        id: { value: this.id.toString(), label: "ID" },
        wert: { value: this.rating.toString(), label: "Bewertung" }
      },
      label: this?.dienst?.planname || this.po_dienst_id.toString(),
      sort: this.rating
    };
  }
}

export default Rating;
