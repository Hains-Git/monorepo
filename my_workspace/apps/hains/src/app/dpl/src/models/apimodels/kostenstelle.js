import Basic from "../basic";

/**
 * Klasse um ein Kostenstelle-Objekt zu erstellen.
 * @class
 */
class Kostenstelle extends Basic {
  constructor(obj, appModel = false, preventExtension = true) {
    super(appModel);
    this._setInteger("id", obj.id);
    this._set("name", obj.name);
    this._set("nummer", obj.nummer);
    if (preventExtension) this._preventExtension();
  }
}

export default Kostenstelle;
