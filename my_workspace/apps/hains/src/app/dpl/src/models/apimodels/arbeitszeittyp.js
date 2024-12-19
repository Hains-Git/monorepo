import Basic from "../basic";

/**
 * Klasse um ein Arbeitszeittyp-Objekt zu erstellen.
 * @class
 */
class Arbeitszeittyp extends Basic {
  constructor(obj, appModel = false, preventExtension = true) {
    super(appModel);
    this._set("arbeitszeit", obj.arbeitszeit);
    this._set("beschreibung", obj.beschreibung);
    this._set("count", obj.count);
    this._set("dienstzeit", obj.dienstzeit);
    this._setInteger("id", obj.id);
    this._setInteger("min", obj.min, true, 0);
    this._setInteger("max", obj.max, true, 0);
    this._set("name", obj.name);
    this._set("bereitschaft", obj.bereitschaft);
    this._set("rufbereitschaft", obj.rufbereitschaft);
    if (preventExtension) this._preventExtension();
  }

  /**
   * Als Arbeitszeit gelten Arbeitszeittypen,
   * die sowohl dienstzeit als auch arbeitszeit auf true haben
   */
  get isArbeitszeit() {
    return this.arbeitszeit && this.dienstzeit;
  }

  /**
   * Als Frei gelten Arbeitszeittypen, die sowohl arbeitszeit als auch dienstzeit auf false haben
   */
  get isFrei() {
    return !this.arbeitszeit && !this.dienstzeit;
  }

  /**
   * Liefert ein Objekt mit dem Namen des Arbeitszeittyps
   */
  get _info() {
    return {
      value: this.name,
      label: "Typ"
    };
  }

  /**
   * Liefert die Informationen des Arbeitszeittyps
   */
  get _infoMitarbeiter() {
    return {
      value: {
        Name: { value: this.name, label: "Name" },
        Score: { value: 0, label: "Score" },
        Felder: {
          value: {}, label: "Felder", sorting: "asc", ignore: true
        },
        Count: { value: this.count ? "Ja" : "Nein", label: "Zählen" },
        Min: { value: this.min, label: "Min" },
        Max: { value: this.max, label: "Max" },
        Arbeitszeit: { value: this.arbeitszeit ? "Ja" : "Nein", label: "Arbeitszeit" },
        Dienstzeit: { value: this.dienstzeit ? "Ja" : "Nein", label: "Dienstzeit" },
        Bereitschaft: { value: this.bereitschaft ? "Ja" : "Nein", label: "Bereitschaft" },
        Rufbereitschaft: { value: this.rufbereitschaft ? "Ja" : "Nein", label: "Rufbereitschaft" },
        Beschreibung: { value: this.beschreibung, label: "Beschreibung", ignore: !this.beschreibung }
      },
      label: this.name,
      sort: this.name
    };
  }
}

export default Arbeitszeittyp;
