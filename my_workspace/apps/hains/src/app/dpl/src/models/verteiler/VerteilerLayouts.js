import Basic from "../basic";
import VerteilerLayout from "./VerteilerLayout";

class VerteilerLayouts extends Basic{
  constructor(layouts, parent, appModel = false) {
    super(appModel);
    this._setObject("parent", parent);
    this.init(layouts);
  }

  /**
   * Liefert das zur Vorlage passende Layout.
   * Erstellt die Default-Layouts für die Vorlage, wenn es für die Vorlage noch keine gibt 
   * und die Vorlage eine gültige ID hat.
   */
  get layout() {
    const vorlageId = this?._vorlage?.id || 0;
    if (!this?.[vorlageId] && vorlageId > 0) {
      this.createLayoutsForVorlage(vorlageId);
    }
    return this?.[vorlageId] || this.getDefaultLayouts(vorlageId);
  }

  /**
   * Erstellt die Standardlayouts für eine Vorlage
   * @param {Number} vorlageId 
   * @returns Object
   */
  getDefaultLayouts(vorlageId = 0) {
    if (vorlageId < 1) return false;
    return {
      desktop: this.getLayoutOrDefault(false, "desktop", vorlageId),
      tablet: this.getLayoutOrDefault(false, "tablet", vorlageId),
      mobile: this.getLayoutOrDefault(false, "mobile", vorlageId)
    };
  }

  /**
   * Erstellt ein neues VerteilerLayout-Objekt oder liefert ein Standard-Layout zurück.
   * @param {Object} layout 
   * @param {String} name 
   * @param {Number} vorlageId 
   * @returns Object
   */
  getLayoutOrDefault(layout, name = "desktop", vorlageId = 0) {
    return new VerteilerLayout(this._isObject(layout) ? layout : {
      device: name,
      rows: 1,
      cols: 1,
      grid: { 0: "."},
      verteiler_vorlagen_id: vorlageId
    }, this, this._appModel);
  }

  /**
   * Erstellt neue Layouts für eine Vorlage
   * @param {Number} vorlageId 
   * @param {Object} layouts 
   */
  createLayoutsForVorlage(vorlageId, layouts) {
    this._setObject(vorlageId, {
      desktop:  this.getLayoutOrDefault(layouts?.desktop, "desktop", vorlageId),
      tablet: this.getLayoutOrDefault(layouts?.tablet, "tablet", vorlageId),
      mobile: this.getLayoutOrDefault(layouts?.mobile, "mobile", vorlageId)
    });
  }

  /**
   * Initialisiert die Layouts der Vorlagen
   * @param {Object} layouts 
   */
  init(layouts) {
    if(!this._isObject(layouts)) return false;
    for(const vorlageId in layouts) {
      this.createLayoutsForVorlage(vorlageId, layouts[vorlageId]);
    }
  }

  /**
   * Führt ein Update des entsprechenden Layouts durch
   * @param {Object} data 
   */
  updateLayout(data) {
    this.init(data?.layout);
  }

  /**
   * Entfernt die Layout dieser Vorlage
   * @param {Number} vorlageId 
   */
  remove(vorlageId) {
    if (this?.[vorlageId]) delete this[vorlageId];
  }
}

export default VerteilerLayouts;