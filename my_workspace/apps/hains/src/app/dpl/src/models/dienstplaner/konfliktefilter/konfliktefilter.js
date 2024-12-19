import { debounce, wait } from "../../../tools/debounce";
import { showConsole } from "../../../tools/flags";
import Basic from "../../basic";
import KonflikteTyp from "./konfliktetyp";

/**
 * Erstellt ein neues Objekt vom Typ KonflikteFilter
 * @class
 */
class KonflikteFilter extends Basic {
  constructor(appModel = false) {
    super(appModel);
    const {
      abwesend,
      mehrfacheinteilung,
      ueberschneidung,
      wochenenden,
      arbeitszeittyp,
      freigaben,
      team,
      dienstgruppe,
      fordertdienstgruppe,
      predienstgruppe
    } = this?._user?.konflikteSettings || {
      abwesend: false,
      mehrfacheinteilung: true,
      ueberschneidung: true,
      wochenenden: false,
      arbeitszeittyp: false,
      freigaben: true,
      team: true,
      dienstgruppe: true,
      fordertdienstgruppe: true,
      predienstgruppe: true
    };
    this._setObject("typen", {});
    this.createFilterTyp(
      "abwesend",
      "Abwesend",
      "Inaktiv oder als abwesend markiert",
      1,
      abwesend
    );
    this.createFilterTyp(
      "mehrfacheinteilung",
      "Mehrfacheinteilung",
      "Einteilungen am selben Tag",
      2,
      mehrfacheinteilung
    );
    this.createFilterTyp(
      "ueberschneidung",
      "Überschneidung",
      "Zeitliche Überschneidungen",
      3,
      ueberschneidung
    );
    this.createFilterTyp(
      "wochenenden",
      "Wochenenden",
      "Zuviele Wochenenden eingeteilt",
      4,
      wochenenden
    );
    this.createFilterTyp(
      "arbeitszeittyp",
      "Arbeitszeittyp",
      "Zuviel bestimmter Arbeitszeittyps",
      5,
      arbeitszeittyp
    );
    this.createFilterTyp(
      "freigaben",
      "Freigaben",
      "Erforderliche Freigaben fehlen",
      6,
      freigaben
    );
    this.createFilterTyp(
      "team",
      "Team",
      "Team des Dienstes und der Mitarbeiter sind unterschiedlich",
      7,
      team
    );
    this.createFilterTyp(
      "dienstgruppe",
      "Dienstgruppe",
      "Für einen bestimmten Zeitraum sind nur Dienste gewisser Dienstgruppen vorgesehen",
      8,
      dienstgruppe
    );
    this.createFilterTyp(
      "fordertdienstgruppe",
      "Fordert Dienstgruppe",
      "Fordert für einen bestimmten Zeitraum nur Dienste einer gewissen Gruppe",
      9,
      fordertdienstgruppe
    );
    this.createFilterTyp(
      "predienstgruppe",
      "Fordert Dienstgruppe vorher",
      "Fordert, dass vorher ein bestimmter Dienst eingeteilt ist.",
      10,
      predienstgruppe
    );
    this._preventExtension();
    if (showConsole) this._whoAmI();
  }

  /**
   * Erstellt die Parameter für den jeweiligen Filter
   * @param {String} key
   * @param {String} label
   * @param {String} title
   * @param {Number} sort
   * @param {Boolean} show
   * @returns Object
   */
  createFilterTyp(key = "", label = "", title = "", sort = 0, show = true) {
    this.typen[key] = new KonflikteTyp(
      this._appModel,
      this,
      key,
      title,
      label,
      sort,
      show
    );
  }

  /**
   * Iteriert über alle Filter-Typen und führt eine Funktion aus
   * @param {Function} callback
   */
  eachTyp(callback) {
    const typen = this.typen;
    for (const key in typen) {
      const typ = typen[key];
      if (this._isFunction(callback)) {
        if (callback(typ, key) === true) break;
      }
    }
  }

  /**
   * Liefert alle Filter-Typen in einem Array.
   * @param {Function} callback
   * @returns Array
   */
  getKonflikte(callback) {
    const konflikte = [];
    this.eachTyp((typ, key) => {
      konflikte.push(this._isFunction(callback) ? callback(typ, key) : typ);
    });

    return konflikte;
  }

  /**
   * Liefert die Parameter des Konflikte-Filters
   * @returns Object
   */
  getSettings() {
    const parameter = {};
    this.eachTyp((typ, key) => {
      parameter[key] = typ.check;
    });

    return parameter;
  }

  /**
   * Führt ein asynchrones update für alle Mitarbeiter aus.
   */
  debouncedUpdateMitarbeiter = debounce(() => {
    const mitarbeiter = this?._mitarbeiter || this?._mitarbeiters;
    mitarbeiter?._each?.((m) => {
      m?._update?.();
    });
  }, wait);

  /**
   * Liefert das Check-Attribut des Filters
   * @param {String} key
   * @returns Boolean
   */
  isInFilter(key) {
    const typ = this?.typen?.[key];
    return typ ? !!typ?.check : true;
  }
}

export default KonflikteFilter;
