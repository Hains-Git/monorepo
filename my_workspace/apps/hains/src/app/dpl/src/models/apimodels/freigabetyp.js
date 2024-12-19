import Basic from "../basic";

/**
 * Klasse um ein Freigabetyp-Objekt zu erstellen.
 * @class
 */
class Freigabetyp extends Basic {
  constructor(obj, appModel = false, preventExtension = true) {
    super(appModel);
    this._set("planname", obj.planname);
    this._set("beschreibung", obj.beschreibung);
    this._set("sort", obj.sort);
    this._setInteger("id", obj.id);
    this._set("name", obj.name);
    if (preventExtension) this._preventExtension();
  }

  /**
   * Liefert Informationen zu dem Freigabetyp
   */
  get _info() {
    const info = {
      value: {
        id: { value: this.id.toString(), label: "ID" },
        name: { value: this.name, label: "Name" },
        planname: { value: this.planname, label: "Planname" },
        sort: { value: this.sort.toString(), label: "Position" }
      },
      label: this.name,
      sort: this.name
    };
    if (this.beschreibung && this.beschreibung.trim() !== "") {
      info.value.beschreibung = { value: this.beschreibung, label: "Beschreibung" };
    }
    return info;
  }
}

export default Freigabetyp;
