import Basic from "../basic";

/**
 * Klasse um ein Freigabestatus-Objekt zu erstellen.
 * @class
 */
class Freigabestatus extends Basic {
  constructor(obj, appModel = false, preventExtension = true) {
    super(appModel);
    this._set("color", obj.color);
    this._set("beschreibung", obj.beschreibung);
    this._set("counts_active", obj.counts_active);
    this._setInteger("id", obj.id);
    this._set("qualifiziert", obj.qualifiziert);
    this._set("sys", obj.sys);
    this._set("name", obj.name);
    if (preventExtension) this._preventExtension();
  }

  /**
   * Freigabestatus mit counts_active gelten als erteilte Freigabe
   */
  get erteilt() {
    return this.counts_active;
  }

  /**
   * Liefert Informationen zu dem Freigabestatus
   */
  get _info() {
    const info = {
      value: {
        id: { value: this.id.toString(), label: "ID" },
        name: { value: this.name, label: "Name" },
        qualifiziert: { value: this.qualifiziert ? "Ja" : "Nein", label: "Qualifiziert" },
        erteilt: { value: this.erteilt ? "Ja" : "Nein", label: "Erteilt" },
        color: { value: this.color || "", label: "Farbe" }
      },
      label: this.name
    };
    if (this.beschreibung && this.beschreibung.trim() !== "") {
      info.value.beschreibung = { value: this.beschreibung, label: "Beschreibung" };
    }
    return info;
  }
}

export default Freigabestatus;
