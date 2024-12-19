import Basic from "../basic";

/**
 * Klasse um ein Bereich-Objekt zu erstellen.
 * @class
 */
class Bereich extends Basic {
  constructor(obj, appModel = false, preventExtension = true) {
    super(appModel);
    this._set("name", obj.name);
    this._set("name_url", obj.name_url);
    this._set("info", obj.info);
    this._set("standort_id", obj.standort_id);
    this._setInteger("id", obj.id);
    this._set("planname", obj.planname);
    this._setInteger("bereiches_id", obj.bereiches_id);
    this._set("converted_planname", obj.converted_planname);
    this._set("verteiler_frei", !!obj.verteiler_frei);
    if (preventExtension) this._preventExtension();
  }

  /**
   * Liefert entweder false oder den Bereich, falls auf einen Bereich referenziert wird
   */
  get bereich() {
    let result = false;
    if (this.bereiches_id) result = this._getIdsObject("_bereiche", "bereiches_id", true);

    return result;
  }

  get standort() {
    return this._getIdsObject("_standorte", "standort_id", true);
  }

  /**
   * Liefert ein Objekt mit Informationen zu dem Bereich.
   */
  get mainInfos() {
    const bereichsName = this.bereich?.name || "";
    const standortName = this.standort?.name || "";
    const result = {
      id: { value: this.id.toString(), label: "ID" },
      name: { value: this.name, label: "Name" },
      planname: { value: this.planname, label: "Planname" },
      bereich: { value: bereichsName, label: "Zugehörigkeit", ignore: bereichsName === "" },
      info: { value: this.info, label: "Info", ignore: this.info === "" },
      standort: { value: standortName, label: "Standort"}
    };
    return result;
  }

  /**
   * Liefert ein Info-Objekt
   */
  get _info() {
    return {
      mainInfos: this.mainInfos
    };
  }

  /**
   * Liefert ein Objekt als PopUpInfos Anhang
   */
  get _feldInfo() {
    return {
      value: {
        ...this.mainInfos
      },
      label: 'Bereich'
    };
  }

  /**
   * Erstellt die Informationen zu dem Dienst
   */
  setInfo(evt, cleanup = true) {
    this._setPageInfoPopup(`Bereich: ${this.planname}`, this, cleanup);
  }
}

export default Bereich;
