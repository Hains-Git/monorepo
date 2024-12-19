import { debounce, wait } from "../../../../tools/debounce";
import FilterVorlage from "../../filtervorlagen/filtervorlage";
import SharedEinteilungAuswahl from "./shared";
import { booleanSearch } from "../../../../tools/helper";

class MitarbeiterAuswahl extends SharedEinteilungAuswahl {
  constructor(appModel = false, parent = false) {
    super(appModel, parent, false);
    this.setInfoTitle("Mitarbeiterauswahl");
    this.setType("mitarbeiter");
    this.initFilter();
    this._preventExtension();
  }

  /**
   * Default Filter Parameter
   */
  get defaultParams() {
    return {
      inDienstTeam: true,
      notInDienstTeam: true,
      inVorlageTeam: true,
      notInVorlageTeam: true,
      inVorlageFunktionen: true,
      notInVorlageFunktionen: true,
      ohneWuensche: true,
      wunschErfuellt: true,
      wunschNotErfuellt: true,
      anwesend: true,
      abwesend: true,
      anwesendMarkiert: true,
      abwesendMarkiert: true,
      alleFreigaben: true,
      einigeFreigaben: true,
      keineFreigaben: true,
      wuensche: [],
      aktiveMitarbeiter: [],
      teams: [],
      funktionen: [],
      mitFreigegebeneDienste: true,
      ohneFreigegebeneDienste: true,
      isWritable: true,
      notIsWritable: true
    };
  }

  /**
   * Initialisiert die Filter
   */
  initFilter() {
    const params = this.defaultParams;
    params.parent = this;
    params.uncheckAllButton = false;
    params.resetDefaultParams = false;
    // Initialisiert die Vorlage mit true für alle Mitarbeiter
    const filterVorlage = new FilterVorlage(params, this._appModel);
    const filter = [
      {
        id: "Verfügbar",
        fkt: () => {
          this.getVerfuegbareMitarbeiter(0);
        },
        index: 0,
        title: "Schlägt nur aktive, anwesende Mitarbeiter aus dem Vorlage-Team, falls eines gewählt wurde, vor, die alle Freigaben haben und eine Funktion aus der Vorlage erfüllen"
      },
      {
        id: "Alle",
        fkt: () => {
          this.getAlleMitarbeiter(1);
        },
        index: 1,
        title: "Schlägt alle aktiven Mitarbeiter vor, die eine Funktion aus der Vorlage erfüllen"
      },
      {
        id: "Freigaben",
        fkt: () => {
          this.getFreigegebeneMitarbeiter(2);
        },
        index: 2,
        title: "Schlägt nur aktive Mitarbeiter vor, die Freigaben haben, unabhängig der Funktion der Mitarbeiter"
      },
      {
        id: "Wünsche",
        fkt: () => {
          this.getMitarbeiterMitWuenschen(3);
        },
        index: 3,
        title: "Schlägt nur aktive Mitarbeiter aus dem Vorlage-Team, falls eines gewählt wurde, vor, die Wünsche haben und die eine Funktion aus der Vorlage erfüllen"
      },
      {
        id: "Anwesend",
        fkt: () => {
          this.getAnwesendeMitarbeiter(4);
        },
        index: 4,
        title: "Schlägt nur aktive Mitarbeiter aus dem Vorlage-Team, falls eines gewählt wurde, vor, die anwesend sind und die eine Funktion aus der Vorlage erfüllen"
      },
      {
        id: "Abwesend",
        fkt: () => {
          this.getAbwesendeMitarbeiter(5);
        },
        index: 5,
        title: "Schlägt nur aktive Mitarbeiter aus dem Vorlage-Team, falls eines gewählt wurde, vor, die abwesend sind und die eine Funktion aus der Vorlage erfüllen"
      },
      {
        id: "Benutzerdefiniert",
        fkt: () => {
          this.getCustomFilter(6);
        },
        index: 6,
        title: "Filter kann beliebig eingestellt werden"
      }
    ];

    this.setFilterVorlage(filterVorlage);
    this.setFilter(filter);
  }

  /**
   * Liefert die gefilterten Mitarbeiter-Vorschläge
   * @param {Function} callback
   */
  getVorschlaege = debounce((callback) => {
    const vorschlaege = [];
    const feld = this?.feld?.vorschlaege && this.feld;
    if (this._isObject(feld)
      && this?._aktiveMitarbeiter?.forEach
      && this?.filterVorlage?.isInFilter) {
      const {
        date,
        dienst,
        id,
        tag,
        dienstId,
        bereichId,
        schichtnr
      } = feld;
      this._aktiveMitarbeiter.forEach((mitarbeiter) => {
        const isInFilter = mitarbeiter?.getScore
          && mitarbeiter?.writable
          && mitarbeiter.writable(tag, dienstId)
          && booleanSearch(mitarbeiter?.planname || "", this.searchValue)
          && !mitarbeiter.hasDoppelteEinteilung(
            tag, 
            dienstId, 
            bereichId, 
            dienst?.hasBedarf ?  schichtnr : false)
          && this.filterVorlage.isInFilter({
            mitarbeiter,
            date,
            dienst,
            feld,
            teams: {
              mitarbeiter,
              date
            }
          });
        if (isInFilter) {
          vorschlaege.push(this.createAuswahlComponent(mitarbeiter, feld, id, false));
        }
      });
    }
    if (this._isFunction(callback)) callback(vorschlaege);
  }, wait);

  /**
  * Filtert die Vorschläge und aktualisiert sie ansynchron
  * @param {Number} index
  */
  initVorschlaege(index) {
    super.initVorschlaege(index, [this.loadFelder]);
    this.getVorschlaege((vorschlaege) => {
      super.initVorschlaege(index, vorschlaege);
    });
  }

  /**
   * Gibt nur aktive Mitarbeiter mit allen Freigaben zurück
   * @param {Number} index
   */
  getVerfuegbareMitarbeiter(index) {
    this.setShowVorlage(false);
    const params = this.defaultParams;
    params.notInDienstTeam = false;
    params.notInVorlageFunktionen = false;
    params.notInVorlageTeam = !this._team;
    params.einigeFreigaben = false;
    params.keineFreigaben = false;
    params.abwesend = false;
    this.setFilterParams(params);
    this.initVorschlaege(index);
  }

  /**
   * Liefert nur aktive Mitarbeiter mit Freigabe
   * @param {Number} index
   */
  getFreigegebeneMitarbeiter(index) {
    this.setShowVorlage(false);
    const params = this.defaultParams;
    params.keineFreigaben = false;
    this.setFilterParams(params);
    this.initVorschlaege(index);
  }

  /**
   * Liefert alle aktvien Mitarbeiter
   * @param {Number} index
   */
  getAlleMitarbeiter(index) {
    this.setShowVorlage(false);
    const params = this.defaultParams;
    params.notInVorlageFunktionen = false;
    this.setFilterParams(params);
    this.initVorschlaege(index);
  }

  /**
   * Liefert nur aktive Mitarbeiter mit Wünschen
   * @param {Number} index
   */
  getMitarbeiterMitWuenschen(index) {
    this.setShowVorlage(false);
    const params = this.defaultParams;
    params.notInVorlageFunktionen = false;
    params.notInDienstTeam = false;
    params.ohneWuensche = false;
    params.notInVorlageTeam = !this._team;
    this.setFilterParams(params);
    this.initVorschlaege(index);
  }

  /**
   * Gibt nur Vorschlage mit aktiven anwesenden Mitarbeitern zurück
   * @param {Number} index
   */
  getAnwesendeMitarbeiter(index) {
    this.setShowVorlage(false);
    const params = this.defaultParams;
    params.notInVorlageFunktionen = false;
    params.notInDienstTeam = false;
    params.abwesend = false;
    params.notInVorlageTeam = !this._team;
    this.setFilterParams(params);
    this.initVorschlaege(index);
  }

  /**
   * Liefert nur abwesende Mitarbeiter
   * @param {Number} index
   */
  getAbwesendeMitarbeiter(index) {
    this.setShowVorlage(false);
    const params = this.defaultParams;
    params.notInVorlageFunktionen = false;
    params.notInDienstTeam = false;
    params.anwesend = false;
    params.abwesend = true;
    params.notInVorlageTeam = !this._team;
    this.setFilterParams(params);
    this.initVorschlaege(index);
  }
}

export default MitarbeiterAuswahl;
