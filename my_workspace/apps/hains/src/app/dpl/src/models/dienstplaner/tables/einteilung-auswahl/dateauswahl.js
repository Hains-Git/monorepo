import { debounce, wait } from "../../../../tools/debounce";
import FilterVorlage from "../../filtervorlagen/filtervorlage";
import SharedEinteilungAuswahl from "./shared";
import { booleanPlanerDateSearch } from "../../../../tools/helper";

class DateAuswahl extends SharedEinteilungAuswahl {
  constructor(appModel = false, parent = false) {
    super(appModel, parent, false);
    this.setInfoTitle("Tagauswahl");
    this.setType("tag");
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
      dates: [],
      teams: [],
      aktiveMitarbeiter: [],
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
    const vorlage = new FilterVorlage(params, this._appModel);

    // Filter, nach denen die Einteilungen gefiltert werden können
    const filter = [
      {
        id: "Verfügbar",
        fkt: () => {
          this.getVerfuegbareTage(0);
        },
        index: 0,
        title: "Schlägt nur Tage für Dienste aus dem Vorlage-Team vor, falls einer gewählt wurde, für die Mitarbeiter alle Freigaben haben, anwesend sind und eine Funktion aus der Vorlage erfüllen haben"
      },
      {
        id: "Alle",
        fkt: () => {
          this.getAlleTage(1);
        },
        index: 1,
        title: "Schlägt alle Tage für Dienste mit einem Bedarf vor, wenn die Mitarbeiter eine Funktion aus der Vorlage erfüllen"
      },
      {
        id: "Freigaben",
        fkt: () => {
          this.getFreigegebeneTage(2);
        },
        index: 2,
        title: "Schlägt nur Tage vor für Dienste, für die Mitarbeiter Freigaben haben, unabhängig der Funktion der Mitarbeiter"
      },
      {
        id: "Wünsche",
        fkt: () => {
          this.getWunschTage(3);
        },
        index: 3,
        title: "Schlägt nur Tage für Dienste aus dem Vorlage-Team vor, falls eines gewählt wurde, an denen Mitarbeiter anwesend sind, Wünsche erfüllt werden und die eine Funktion aus der Vorlage erfüllen"
      },
      {
        id: "Anwesend",
        fkt: () => {
          this.getAnwesendTage(4);
        },
        index: 4,
        title: "Schlägt nur Tage für Dienste aus dem Vorlage-Team vor, falls eines gewählt wurde, an denen Mitarbeiter anwesend sind und eine Funktion aus der Vorlage erfüllen"
      },
      {
        id: "Benutzerdefiniert",
        fkt: () => {
          this.getCustomFilter(5);
        },
        index: 5,
        title: "Filter kann beliebig eingestellt werden"
      }
    ];

    this.setFilterVorlage(vorlage);
    this.setFilter(filter);
  }

  /**
   * Liefert die gefilterten Tag-Vorschläge
   * @param {Function} callback
   */
  getVorschlaege = debounce((callback) => {
    const vorschlaege = [];
    const feld = this?.feld?.vorschlaege && this.feld;
    if (this._isObject(feld)
      && this?._dates?._each
      && this?.filterVorlage?.isInFilter) {
      const {
        dienst,
        mitarbeiter,
        id
      } = feld;
      const mWritable = mitarbeiter?.aktivAm?.(feld?.tag) && mitarbeiter?.writable && mitarbeiter?.getScore;
      mWritable && this._dates._each((date) => {
        const dateFeld = feld?.getEmptyDateFeld?.(date, mitarbeiter);
        const isInFilter = dateFeld?.writable
          && mitarbeiter.writable(date?.id, dienst?.id)
          && booleanPlanerDateSearch(date, this.searchValue, "date")
          && !mitarbeiter.hasDoppelteEinteilung(
            dateFeld?.tag,
            dateFeld?.dienstId,
            dateFeld?.bereichId,
            dateFeld?.dienst?.isFreiEintragbar ? false : dateFeld?.schichtnr)
          && this.filterVorlage.isInFilter({
            mitarbeiter,
            date,
            dienst,
            feld: dateFeld,
            teams: {
              mitarbeiter,
              date
            }
          });
        if (isInFilter) {
          vorschlaege.push(this.createAuswahlComponent(mitarbeiter, dateFeld, id, feld));
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
   * Gibt alle Dienste mit einem Bedarf zurück
   * @param {Number} index
   */
  getAlleTage(index) {
    this.setShowVorlage(false);
    const params = this.defaultParams;
    params.notInVorlageFunktionen = false;
    this.setFilterParams(params);
    this.initVorschlaege(index);
  }

  /**
   * Liefert nur Tage an denen Mitarbeiter verfügbar sind
   * @param {Number} index
   */
  getVerfuegbareTage(index) {
    this.setShowVorlage(false);
    const params = this.defaultParams;
    params.notInDienstTeam = false;
    params.notInVorlageFunktionen = false;
    params.abwesend = false;
    params.einigeFreigaben = false;
    params.keineFreigaben = false;
    params.notInVorlageTeam = !this._team;
    this.setFilterParams(params);
    this.initVorschlaege(index);
  }

  /**
   * Liefert nur Tage, für die Freigaben bestehen
   * @param {Number} index
   */
  getFreigegebeneTage(index) {
    this.setShowVorlage(false);
    const params = this.defaultParams;
    params.keineFreigaben = false;
    this.setFilterParams(params);
    this.initVorschlaege(index);
  }

  /**
   * Liefert nur Tage, an denen Wünsch existiert
   * @param {Number} index
   */
  getWunschTage(index) {
    this.setShowVorlage(false);
    const params = this.defaultParams;
    params.notInDienstTeam = false;
    params.notInVorlageFunktionen = false;
    params.ohneWuensche = false;
    params.abwesend = false;
    params.wunschNotErfuellt = false;
    params.notInVorlageTeam = !this._team;
    this.setFilterParams(params);
    this.initVorschlaege(index);
  }

  /**
   * Liefert nur Tage, an denen Mitarbeiter abwesend sind
   * @param {Number} index
   */
  getAnwesendTage(index) {
    this.setShowVorlage(false);
    const params = this.defaultParams;
    params.notInDienstTeam = false;
    params.notInVorlageFunktionen = false;
    params.abwesend = false;
    params.notInVorlageTeam = !this._team;
    this.setFilterParams(params);
    this.initVorschlaege(index);
  }
}

export default DateAuswahl;
