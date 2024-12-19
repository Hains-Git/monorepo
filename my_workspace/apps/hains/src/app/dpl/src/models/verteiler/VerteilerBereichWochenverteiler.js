import Basic from "../basic";

/**
 * Klasse für die Untergruppen Bereich-Wochenverteiler im Wochenverteiler.
 * @class VerteilerBereichWochenverteiler
 */
class VerteilerBereichWochenverteiler extends Basic{
  constructor(obj, parent, appModel = false) {
    super(appModel);
    this._setObject("parent", parent);
    this._setInteger("bereich_id", obj?.bereich_id, true, 0);
    this._setInteger("id", obj?.id);
    this._set("color_bg", obj?.color_bg || "");
    this._set("color_hl", obj?.color_hl || "");
    this._set("content_layout", obj?.content_layout || "");
    this._setInteger("po_dienst_id", obj?.po_dienst_id, true, 0);
    this._set("created_at", obj?.created_at || "");
    this._set("updated_at", obj?.updated_at || "");
    this._setInteger("order", obj.order);
  }

   /**
   * True, wenn bereich_id oder dienst_id in der Vorlage auftaucht.
   */
   get isInVorlage() {
    const vorlage = this?._vorlage;
    if (this.bereich_id) {
      return !!vorlage?.includesBereichId?.(this.bereich_id);
    }
    return !!vorlage?.includesDienstId?.(this.po_dienst_id);
  }

  /**
   * True, wenn cotent_layout = one_col_list
   */
  get isOneColList() {
    return this.content_layout === 'one_col_list';
  }

  get isOneCol(){
    return this.content_layout === 'one_col';
  }

  /**
   * Liefert den Po-Dienst aus den API-Models
   */
  get po_dienst() {
    return this._getIdsObject(["_dienste", "_po_dienste"], "po_dienst_id", false);
  }

  /**
   * Liefert den Bereich aus den API-Models
   */
  get bereich() {
    return this._getIdsObject(["_bereiche"], "bereich_id", false);
  }

  get isDienstfrei() {
    return !!this.bereich?.verteiler_frei;
  }

  /**
   * Name des Bereiches oder des Dienstes
   */
  get name() {
    return (this.bereich
      ? this.bereich?.name
      : this.po_dienst?.name) || "";
  }

  /**
   * Name der Section
   */
  get sectionName() {
    return (this.bereich
      ? this.bereich?.converted_planname
      : this.po_dienst?.converted_planname) || "";
  }
};

export default VerteilerBereichWochenverteiler;