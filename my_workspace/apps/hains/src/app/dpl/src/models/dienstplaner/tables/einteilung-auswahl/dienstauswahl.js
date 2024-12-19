import { debounce, wait } from "../../../../tools/debounce";
import FilterVorlage from "../../filtervorlagen/filtervorlage";
import SharedEinteilungAuswahl from "./shared";
import { booleanSearch } from "../../../../tools/helper";

class DienstAuswahl extends SharedEinteilungAuswahl {
  constructor(appModel = false, parent = false) {
    super(appModel, parent, false);
    this.setInfoTitle("Dienstauswahl");
    this.setType("dienst");
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
      inVorlageDiensten: true,
      notInVorlageDiensten: false,
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
      dienste: [],
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
          this.getVerfuegbareDienste(0);
        },
        index: 0,
        title: "Schlägt nur Dienste aus dem Vorlage-Team vor, falls einer gewählt wurde, für die Mitarbeiter alle Freigaben haben, anwesend sind und eine Funktion aus der Vorlage erfüllen"
      },
      {
        id: "Alle",
        fkt: () => {
          this.getAlleDienste(1);
        },
        index: 1,
        title: "Schlägt alle Dienste mit einem Bedarf vor, wenn die Mitarbeiter eine Funktion aus der Vorlage erfüllen"
      },
      {
        id: "Freigaben",
        fkt: () => {
          this.getFreigegebeneDienste(2);
        },
        index: 2,
        title: "Schlägt nur Dienste vor, für die Mitarbeiter Freigaben haben, unabhängig der Funktion der Mitarbeiter"
      },
      {
        id: "Wünsche",
        fkt: () => {
          this.getWunschDienste(3);
        },
        index: 3,
        title: "Schlägt nur Dienste aus dem Vorlage-Team vor, falls einer gewählt wurde, an denen Mitarbeiter anwesend sind, Wünsche efüllt werden und die eine Funktion aus der Vorlage erfüllen"
      },
      {
        id: "Anwesend",
        fkt: () => {
          this.getAnwesendDienste(4);
        },
        index: 4,
        title: "Schlägt nur Dienste aus dem Vorlage-Team vor, falls eines gewählt wurde, an denen Mitarbeiter anwesend sind und eine Funktion aus der Vorlage erfüllen"
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
   * Liefert die gefilterten Dienst-Vorschläge
   * @param {Function} callback
   */
  getVorschlaege = debounce((callback) => {
    const vorschlaege = [];
    const feld = this?.feld?.vorschlaege && this.feld;
    if (this._isObject(feld)
      && this?._dienste?._each
      && this?.filterVorlage?.isInFilter) {
      const {
        mitarbeiter,
        id,
        date
      } = feld;
      const mWritable = mitarbeiter?.aktivAm?.(feld?.tag) && mitarbeiter?.writable && mitarbeiter?.getScore;
      mWritable && this._dienste._each((dienst) => {
        const dienstFeld = feld?.getEmptyDienstFeld?.(dienst, mitarbeiter);
        const isInFilter = dienstFeld?.writable
          && mitarbeiter.writable(date?.id, dienst?.id)
          && booleanSearch(dienst?.planname || "", this.searchValue)
          && !mitarbeiter.hasDoppelteEinteilung(
            dienstFeld?.tag, 
            dienstFeld?.dienstId, 
            dienstFeld?.bereichId, 
            dienstFeld?.dienst?.hasBedarf ? dienstFeld?.schichtnr : false)
          && this.filterVorlage.isInFilter({
            mitarbeiter,
            date,
            dienst,
            feld: dienstFeld,
            teams: {
              mitarbeiter,
              date
            }
          });
        if (isInFilter) {
          vorschlaege.push(this.createAuswahlComponent(mitarbeiter, dienstFeld, id, feld));
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
  getAlleDienste(index) {
    this.setShowVorlage(false);
    const params = this.defaultParams;
    params.notInVorlageFunktionen = false;
    this.setFilterParams(params);
    this.initVorschlaege(index);
  }

  /**
   * Liefert nur Dienste an denen Mitarbeiter verfügbar sind
   * @param {Number} index
   */
  getVerfuegbareDienste(index) {
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
   * Liefert nur Dienste, für die Freigaben bestehen
   * @param {Number} index
   */
  getFreigegebeneDienste(index) {
    this.setShowVorlage(false);
    const params = this.defaultParams;
    params.keineFreigaben = false;
    this.setFilterParams(params);
    this.initVorschlaege(index);
  }

  /**
   * Liefert nur Dienste, an denen Wünsch existiert
   * @param {Number} index
   */
  getWunschDienste(index) {
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
   * Liefert nur Dienste, an denen Mitarbeiter abwesend sind
   * @param {Number} index
   */
  getAnwesendDienste(index) {
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

export default DienstAuswahl;
