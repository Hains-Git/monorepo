import Basic from "../basic";

class DienstplanPfad extends Basic {
  constructor(obj, appModel = false, preventExtension = true) {
    super(appModel);
    this._set("path", obj.path);
    this._set("name", obj.name);
    this._setInteger("position", obj.position || 0);
    this._set("begin_on_monday", !!obj.begin_on_monday);
    this._set("plan_pattern", obj.plan_pattern || "");
    this._setInteger("nr_versions", obj.nr_versions || 0);
    this._setInteger("nr_intervalls", obj.nr_intervalls || 0);
    this._setInteger("offset_to_now", obj.offset_to_now || 0);
    this._setInteger("planinterval_id", obj.planinterval_id || 0);
    this._setInteger("plan_tab_id", obj.plan_tab_id || 0);
    this._setInteger("id", obj.id);
    if (preventExtension) this._preventExtension();
  }
}

export default DienstplanPfad;
