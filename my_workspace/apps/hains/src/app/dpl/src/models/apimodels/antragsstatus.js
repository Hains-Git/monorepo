import Basic from "../basic";

class Antragsstatus extends Basic {
  constructor(obj, appModel = false, preventExtension = true) {
    super(appModel);
    this._setInteger("id", obj.id);
    this._set("name", obj.name);
    this._set("color", obj.color);
    if (preventExtension) this._preventExtension();
  }
}

export default Antragsstatus;
