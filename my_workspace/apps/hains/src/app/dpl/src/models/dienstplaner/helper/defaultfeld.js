import DienstplanerFeld from "./feld";

class DienstplanerDefaultFeld extends DienstplanerFeld {
  constructor(obj, appModel = false) {
    super(obj, appModel, false);
    this._set("mitarbeiterId", obj.mitarbeiterId || 0);
    this._preventExtension();
  }

  /**
   * Liefert true
   */
  get default() {
    return true;
  }

  /**
   * Liefert false
   */
  get isAddFeld() {
    return false;
  }

  /**
   * Liefert false
   */
  get vorschlaege() {
    return false;
  }

  /**
   * Liefert -1
   */
  get index() {
    return -1;
  }

  /**
   * Default-Felder sind immer visible
   */
  get visible() {
    return true;
  }

  /**
   * Liefert false
   */
  get writable() {
    return false;
  }

  /**
   * Liefert false
   */
  get exceedsBedarf() {
    return false;
  }

  /**
   * Leifert false
   */
  get isOptional() {
    return false;
  }

  /**
   * Gibt den eingeteilten Mitarbeiter zurück
   */
  get mitarbeiter() {
    return this._getIdsObject("_mitarbeiter", "mitarbeiterId", false);
  }

  /**
   * Label für das Auswahl-Tab
   */
  get label() {
    const {
      dienst,
      mitarbeiter,
      date
    } = this;
    let label = `${date?.label || this.tag}, ${dienst?.planname || this.dienstId} (X)`;
    if (mitarbeiter) {
      label = dienst && mitarbeiter
        ? `${mitarbeiter?.planname || this.mitarbeiterId}, ${dienst?.planname || this.dienstId} (X)`
        : `${mitarbeiter?.planname || this.mitarbeiterId}, ${date?.label || this.tag} (X)`;
    }
    return label;
  }

  /**
   * show inaktivieren
   */
  show() {}

  /**
   * hide inaktivieren
   */
  hide() {}

  /**
   * remove inaktivieren
   */
  remove() {}

  /**
   * einteilen inaktivieren
   */
  einteilen() {}

  /**
   * Liefert das value-Attribut
   */
  getValue() {
    return this.value;
  }

  /**
   * Liefert die Default-Werte
   * @returns object
   */
  getStyle() {
    return {
      className: "default-einteilung",
      title: [],
      style: null
    };
  }
}

export default DienstplanerDefaultFeld;
