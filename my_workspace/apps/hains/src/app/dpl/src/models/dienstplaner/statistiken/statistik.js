import Basic from "../../basic";
import FilterVorlage from "../filtervorlagen/filtervorlage";
import Arbeitszeiten from "./arbeitszeiten";
import Arbeitszeittypen from "./arbeitszeittypen";
import Einteilungen from "./einteilungen";
import Konflikte from "./konflikte";
import Nachtdienste from "./nachtdienste";
import Rotationen from "./rotationen";
import Wochenenden from "./wochenenden";
import Wochentage from "./wochentage";
import Wuensche from "./wuensche";

/**
 * Erstellt ein neues Statistik-Objekt
 * @class
 */
class Statistik extends Basic {
  constructor(appModel = false) {
    super(appModel);
    this.setCurrent();
    this._setArray("statistics", []);
    this.setRef();
    this._setArray("models", []);
    this.addModel(
      `Einteilungen`,
      `Gibt die Einteilungen aller Mitarbeiter für den entsprechenden Monat aus.`,
      (index) => new Einteilungen(index, this, this._appModel)
    );
    this.addModel(
      `Arbeitszeit (Std.)`,
      `Gibt die Arbeitszeit aller Mitarbeiter für den entsprechenden Monat aus.`,
      (index) => new Arbeitszeiten(index, this, this._appModel)
    );
    this.addModel(
      `Arbeitszeittypen`,
      `Gibt die Arbeitszeittypen, z.B. Bereitschaftsdienst, aller Mitarbeiter für den entsprechenden Monat aus.`,
      (index) => new Arbeitszeittypen(index, this, this._appModel)
    );
    this.addModel(
      `Wochenenden DPL`,
      `Gibt die Anzahl der mit min. einem Dienst belegten Wochenenden, aller Mitarbeiter aus.`,
      (index) => new Wochenenden(index, this, this._appModel)
    );
    this.addModel(
      `Nachtdienste`,
      `Gibt die Verteilung der Nachtdienste von Diensten mit Bedarf innerhalb des entsprechenden Monats aus.`,
      (index) => new Nachtdienste(index, this, this._appModel)
    );
    this.addModel(
      `Wochentage DPL`,
      `Gibt die Verteilung der Einteilungen in Wochentage, Wochenende und Feiertage aus.`,
      (index) => new Wochentage(index, this, this._appModel)
    );
    this.addModel(
      `Konflikte`,
      `Gibt die Anzahl der Konflikte aus.`,
      (index) => new Konflikte(index, this, this._appModel)
    );
    this.addModel(
      `Wuensche`,
      `Gibt die Erfüllung der Wünsche aus.`,
      (index) => new Wuensche(index, this, this._appModel)
    );
    this.addModel(
      `Rotationen`,
      `Gibt die Verteilung der Einteilungen in Rotation aus.`,
      (index) => new Rotationen(index, this, this._appModel)
    );
    this._set("filterVorlage", new FilterVorlage({
      ...this.defaultFilterVorlageParams,
      parent: this,
      uncheckAllButton: false,
      resetDefaultParams: false
    }, this._appModel));
    this._preventExtension();
  }

  /**
   * Liefert die Default-Parameter für die Filter-Vorlage
   */
  get defaultFilterVorlageParams() {
    return {
      inVorlageTeam: true,
      notInVorlageTeam: true,
      inVorlageDiensten: true,
      notInVorlageDiensten: true,
      inVorlageFunktionen: true,
      notInVorlageFunktionen: true,
      aktiv: true,
      inaktiv: true,
      anwesendMarkiert: true,
      abwesendMarkiert: true,
      dienste: [],
      dates: [],
      teams: [],
      funktionen: [],
      mitarbeiter: []
    };
  }

  /**
   * Liefert das aktuell gewählte Model
   */
  get currentAuswahl() {
    return this.models[this.current || 0];
  }

  /**
   * Liefert die Anzahl der Statistiken
   */
  get length() {
    return this?.statistics?.length || 0;
  }

  /**
   * Fügt ein neues Statistik-Model hinzu
   * @param {String} id
   * @param {String} title
   * @param {Function} fkt
   */
  addModel(id = "", title = "", fkt = () => {}) {
    const index = this.models.length;
    this.models.push({
      id,
      index,
      title,
      fkt: () => fkt(index)
    });
  }

  /**
   * Setzt das ref-Attribut und führt ein update aus.
   * @param {Object} ref
   */
  setRef(ref = false) {
    this._set("ref", ref, false);
    this.updateFilter();
    this.initDefaultStatistics();
  }

  /**
   * Setzt die Default-Statistiken, wenn keine vorhanden sind.
   */
  initDefaultStatistics() {
    if (this.ref && !this.length) {
      this.statistics.push(this.models[0].fkt());
      this.statistics.push(this.models[1].fkt());
    }
  }

  /**
   * Aktualisiert die Statistiken
   */
  updateFilter() {
    if (!this.ref) return;
    this?.statistics?.forEach?.((st) => {
      st?.updateData?.();
    });
    this._update();
  }

  /**
   * Setzt das current-Attribut
   * @param {Number} current
   */
  setCurrent(current = 0) {
    this._setInteger("current", current);
    this._update();
  }

  /**
   * Erstellt eine neue Statistik und fügt diese hinzu.
   */
  addStatistic() {
    const model = this?.currentAuswahl?.fkt && this.currentAuswahl;
    if (model) {
      this.statistics.push(model.fkt());
      this._update();
    }
  }

  /**
   * Entfernt eine Statistik.
   * @param {Number} pos
   */
  removeStatistic(pos) {
    if (this.length < 2) return;
    if (this.statistics?.[pos]) {
      this.statistics.splice(pos, 1);
      this._update();
    }
  }

  /**
   * Ändert eine Statistik.
   * @param {Number} pos
   */
  changeStatistic(pos, item) {
    if (this.statistics?.[pos] && this._isFunction(item?.fkt)) {
      this.statistics[pos] = item.fkt();
      this._update();
    }
  }

  /**
   * Iteriert über alle Statistiken.
   * @param {Function} callback
   * @returns Array
   */
  eachStatistic(callback = false) {
    const result = [];
    this.statistics.forEach((statistic, i) => {
      result.push(this._isFunction(callback) ? callback(statistic, i) : statistic);
    });
    return result;
  }
}

export default Statistik;
