import Basic from "../basic";

/**
 * Erstellt ein neues Zeitverteilung-Objekt
 * @class
 */
class Zeitverteilung extends Basic {
  constructor(obj, appModel = false) {
    super(appModel);
    this._set("arbeitszeiten", obj.arbeitszeiten);
    this._set("freizeiten", obj.freizeiten);
    this._set("schichten", obj.schichten);
    this._preventExtension();
  }

  /**
   * Liefert die Infos zu Arbeitszeiten
   */
  get arbeitszeitenInfos() {
    return this.setZeitInfos("Arbeitszeiten");
  }

  /**
   * Liefert die Infos zu Freizeiten
   */
  get freizeitenInfos() {
    return this.setZeitInfos("Freizeiten");
  }

  /**
   * Erstellt ein Info-Objekt
   * @param {String} label
   * @returns object
   */
  setZeitInfos(label) {
    const key = label.toLowerCase();
    const zeiteinteilungen = this[key];
    const infos = { value: {}, label };

    if (zeiteinteilungen) {
      for (const diff in zeiteinteilungen) {
        const tag = zeiteinteilungen[diff];
        const tagInfo = { value: {}, label: `Tag ${parseInt(diff, 10) + 1}` };
        tag.forEach((e, i) => {
          tagInfo.value[i] = { value: `${e.von} - ${e.bis} Uhr`, label: e.typ };
        });
        infos.value[diff] = tagInfo;
      }
      infos.ignore = false;
    }

    return infos;
  }
}

export default Zeitverteilung;
