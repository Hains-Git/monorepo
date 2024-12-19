import Basic from "../basic";

/**
 * Klasse um ein Bereich-Objekt zu erstellen.
 * @class
 */
class Arbeitsplatz extends Basic {
  constructor(obj, appModel = false, preventExtension = true) {
    super(appModel);
    this._set("name", obj.name);
    this._setInteger("id", obj.id);
    this._setInteger("bereich_id", obj.bereich_id);
    if (preventExtension) this._preventExtension();
  }

  /**
   * Liefert den zugehörigen Bereich
   */
  get bereich() {
    return this._getIdsObject("_bereiche", "bereich_id", true);
  }

  /**
   * Liefert ein Info-Objekt
   */
  get _info() {
    return {
      value: {
        id: { value: this.id.toString(), label: "ID" },
        name: { value: this.name, label: "Name" }
      },
      label: "Arbeitsplatz"
    };
  }
}

export default Arbeitsplatz;
