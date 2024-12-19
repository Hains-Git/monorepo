import Basic from "../basic";

/**
 * Klasse um ein Einteilungskontext-Objekt zu erstellen.
 * @class
 */
class Einteilungskontext extends Basic {
  constructor(obj, appModel = false, preventExtension = true) {
    super(appModel);
    this._set("color", obj.color);
    this._set("beschreibung", obj.beschreibung);
    this._setInteger("id", obj.id);
    this._set("name", obj.name);
    this._set("tagesverteiler", !!obj.tagesverteiler);
    this._set("default", !!obj.default);
    if (preventExtension) this._preventExtension();
  }

  /**
   * Liefert ein Objekt mit Informationen zur dem Einteilungskontext.
   * Darunter fallen Name und Beschreibung
   */
  get _info() {
    const result = {
      value: this.beschreibung && this.beschreibung.trim() !== "" ? {
        beschreibung: {
          label: this.beschreibung,
          value: ""
        }
      } : "",
      label: this.name
    };

    return result;
  }
}

export default Einteilungskontext;
