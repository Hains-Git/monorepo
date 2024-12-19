import Basic from "../basic";

/**
 * Klasse um ein Standort-Objekt zu erstellen.
 * @class
 */
class Standort extends Basic{
  constructor(obj, appModel = false, preventExtension = true){
    super(appModel);
    this._setInteger("id", obj.id);
    this._setInteger("klinik_id", obj.klinik_id);
    this._setFloat("lat", obj.lat);
    this._setFloat("long", obj.long);
    this._set("name", obj.name);
    this._set("planname", obj.planname);
    this._set("name_url", obj.name_url);
    this._set("adresse", obj.adresse);
    this._set("clinic", !!obj.clinic);
    this._set("sys", !!obj.sys);
    if (preventExtension) this._preventExtension();
  }
}

export default Standort;