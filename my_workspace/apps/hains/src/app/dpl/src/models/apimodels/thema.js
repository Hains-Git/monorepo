import Basic from "../basic";

/**
 * Klasse um ein Thema-Objekt zu erstellen.
 * @class
 */
class Thema extends Basic {
  constructor(obj, appModel = false, preventExtension = true) {
    super(appModel);
    this._set("color", obj.color);
    this._set("beschreibung", obj.beschreibung);
    this._setInteger("id", obj.id);
    this._set("name", obj.name);
    if (preventExtension) this._preventExtension();
  }

  /**
   * Liefert Informationen zu dem Thema
   */
  get _info() {
    const info = {
      value: {
        id: { value: this.id.toString(), label: "ID" },
        color: { value: this.color || "", label: "Farbe" }
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

export default Thema;
