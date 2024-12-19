import Basic from "../basic";

/**
 * Klasse um ein Vertragsphase-Objekt zu erstellen.
 * @class
 */
class Vertragsstufe extends Basic {
  constructor(obj, appModel = false, preventExtension = true) {
    super(appModel);
    this._setInteger("id", obj.id);
    this._setInteger("stufe", obj.stufe);
    this._setInteger("nach_jahren", obj.nach_jahren, true, 0);
    this._setFloat("monatsgehalt", obj.monatsgehalt, true, 0);
    this._setInteger("vertragsgruppe_id", obj.vertragsgruppe_id);
    this._setInteger("vertrags_variante_id", obj.vertrags_variante_id);
    if (preventExtension) this._preventExtension();
  }

  get vertragsvariante() {
    return this._getIdsObject("_vertragsvarianten", "vertrags_variante_id", true);
  }
}

export default Vertragsstufe;