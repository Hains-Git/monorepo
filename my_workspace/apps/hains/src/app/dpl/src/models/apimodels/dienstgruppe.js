import Basic from "../basic";

/**
 * Klasse um ein Dienstgruppe-Objekt zu erstellen.
 * @class
 */
class Dienstgruppe extends Basic {
  constructor(obj, appModel = false, preventExtension = true) {
    super(appModel);
    this._set("name", obj.name);
    this._setInteger("id", obj.id);
    this._setArray("diensteIds", obj.dienste);
    if (preventExtension) this._preventExtension();
  }

  /**
   * Liefert ein Array mit allen existierenden Diensten aus der Dienstgruppe
   */
  get dienste() {
    return this._getIdsObject(['_dienste', '_po_dienste'], 'diensteIds', false) || [];
  }

  /**
   * Liefert die Plannamen der Dienste
   */
  get diensteNamen() {
    return this?.dienste?.map?.((dienst) => dienst.planname) || [];
  }

  /**
   * Liefert true, wenn sich die DienstId unter den DienstIds befindet, ansonsten false
   * @param {String|Number} dienstId
   * @returns
   */
  includesDienst(dienstId) {
    const dId = parseInt(dienstId, 10);
    return this.diensteIds.includes(dId);
  }
}

export default Dienstgruppe;
