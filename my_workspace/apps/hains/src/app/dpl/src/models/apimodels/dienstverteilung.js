import Basic from "../basic";

/**
 * Klasse um ein Dienstverteilung-Objekt zu erstellen.
 * @class
 */
class Dienstverteilung extends Basic {
  constructor(obj, appModel = false, preventExtension = true) {
    super(appModel);
    this._set("beschreibung", obj.beschreibung);
    this._setInteger("id", obj.id);
    this._set("sys", obj.sys);
    this._set("name", obj.name);
    if (preventExtension) this._preventExtension();
  }

  /**
   * Liefert ein Objekt mit Informationen zu dem Dienstverteilungstyp.
   * Darunter fallen der Name und die Beschreibung
   */
  get _info() {
    const verteilungInfos = {
      value: {
        typ: {
          value: this.beschreibung && this.beschreibung.trim() !== "" ? {
            beschreibung: {
              value: "",
              label: this.beschreibung
            }
          } : "",
          label: this.name
        }
      },
      label: "Dienstverteilungstyp"
    };
    return verteilungInfos;
  }
}

export default Dienstverteilung;
