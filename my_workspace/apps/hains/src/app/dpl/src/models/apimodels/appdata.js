import { showConsole } from "../../tools/flags";
import Data from "../helper/data";
import Arbeitsplatz from "./arbeitsplatz";
import ArbeitszeitAbsprache from "./arbeitszeitabsprache";
import Arbeitszeittyp from "./arbeitszeittyp";
import Arbeitszeitverteilung from "./arbeitszeitverteilung";
import Bereich from "./bereich";
import Dienst from "./dienst";
import Dienstgruppe from "./dienstgruppe";
import Dienstkategorie from "./dienstkategorie";
import DienstplanPfad from "./dienstplanpfad";
import Dienstverteilung from "./dienstverteilung";
import Einteilungskontext from "./einteilungskontext";
import Einteilungsstatus from "./einteilungsstatus";
import Freigabe from "./freigabe";
import Freigabestatus from "./freigabestatus";
import Freigabetyp from "./freigabetyp";
import Funktion from "./funktion";
import Kontingent from "./kontingent";
import Kostenstelle from "./kostenstelle";
import Mitarbeiter from "./mitarbeiter";
import NichtEinteilenAbsprache from "./nichteinteilenabsprache";
import Rating from "./rating";
import Standort from "./standort";
import Team from "./team";
import Thema from "./thema";
import Vertrag from "./vertrag";
import Vertragarbeitszeit from "./Vertragarbeitszeit";
import Vertragsphase from "./vertragsphase";
import Vertragsstufe from "./vertragsstufe";
import Vertragsvariante from "./vertragsvariante";
import Vorlage from "./vorlage";
import Zeitraumkategorie from "./zeitraumkategorie";

/**
 * Erzeugt ein neues App-Data-Objekt, mit Daten, welche nur einmalig geladen werden müssen
 * @class
 */
class AppData extends Data {
  constructor(data, appModel = false) {
    super(appModel);
    if (showConsole) console.log("create App Data", data);
    this._setObject("CLASSES", {
      arbeitsplaetze: (obj) => new Arbeitsplatz(obj, appModel),
      bereiche: (obj) => new Bereich(obj, appModel),
      dienstgruppen: (obj) => new Dienstgruppe(obj, appModel),
      dienstplanpfade: (obj) => new DienstplanPfad(obj, appModel),
      dienstverteilungstypen: (obj) => new Dienstverteilung(obj, appModel),
      einteilungskontexte: (obj) => new Einteilungskontext(obj, appModel),
      einteilungsstatuse: (obj) => new Einteilungsstatus(obj, appModel),
      freigabestatuse: (obj) => new Freigabestatus(obj, appModel),
      freigabetypen: (obj) => new Freigabetyp(obj, appModel),
      funktionen: (obj) => new Funktion(obj, appModel),
      kostenstellen: (obj) => new Kostenstelle(obj, appModel),
      publicvorlagen: (obj) => new Vorlage(obj, appModel),
      teams: (obj) => new Team(obj, appModel),
      themen: (obj) => new Thema(obj, appModel),
      standorte: (obj) => new Standort(obj, appModel),
      vertraege: (obj) => new Vertrag(obj, appModel),
      vertragsphasen: (obj) => new Vertragsphase(obj, appModel),
      vertrags_arbeitszeiten: (obj) => new Vertragarbeitszeit(obj, appModel),
      vertragsvarianten: (obj) => new Vertragsvariante(obj, appModel),
      vertragsstufen: (obj) => new Vertragsstufe(obj, appModel),
      arbeitszeittypen: (obj) => new Arbeitszeittyp(obj, appModel),
      arbeitszeitverteilungen: (obj) => new Arbeitszeitverteilung(obj, appModel),
      dienstkategorien: (obj) => new Dienstkategorie(obj, appModel),
      freigaben: (obj) => new Freigabe(obj, appModel),
      kontingente: (obj) => new Kontingent(obj, appModel),
      mitarbeiters: (obj) => new Mitarbeiter(obj, appModel),
      po_dienste: (obj) => new Dienst(obj, appModel),
      ratings: (obj) => new Rating(obj, appModel),
      zeitraumkategorien: (obj) => new Zeitraumkategorie(obj, appModel),
      arbeitszeit_absprachen: (arr) => arr.map((absprache) => new ArbeitszeitAbsprache(absprache, appModel)),
      nicht_einteilen_absprachen: (arr) => arr.map((absprache) => new NichtEinteilenAbsprache(absprache, appModel))
    });
    this.newParams(data);
    this._preventExtension();
    if (showConsole) this._whoAmI();
  }

  /**
   * Erstellt die entsprechenden Klassen aus Data
   * @param {Object} data
   */
  newParams(data) {
    if (!this._isObject(data)) {
      console.log("Es wird ein Objekt erfordert!", data);
      return;
    }

    if (data.monatsplan_ansichten) this._setArray("monatsplan_ansichten", data.monatsplan_ansichten);
    if (data.MAX_RATING) this._setInteger("MAX_RATING", data.MAX_RATING);
    if (data.MAX_WOCHENENDEN) this._setInteger("MAX_WOCHENENDEN", data.MAX_WOCHENENDEN);
    if (data.arbeitsplaetze) this.initObjOrArray(data.arbeitsplaetze, "arbeitsplaetze");
    if (data.bereiche) this.initObjOrArray(data.bereiche, "bereiche");
    if (data.dienstgruppen) this.initObjOrArray(data.dienstgruppen, "dienstgruppen");
    if (data.dienstplanpfade) this.initObjOrArray(data.dienstplanpfade, "dienstplanpfade");
    if (data.dienstverteilungstypen) this.initObjOrArray(data.dienstverteilungstypen, "dienstverteilungstypen");
    if (data.einteilungskontexte) this.initObjOrArray(data.einteilungskontexte, "einteilungskontexte");
    if (data.einteilungsstatuse) this.initObjOrArray(data.einteilungsstatuse, "einteilungsstatuse");
    if (data.freigabestatuse) this.initObjOrArray(data.freigabestatuse, "freigabestatuse");
    if (data.freigabetypen) this.initObjOrArray(data.freigabetypen, "freigabetypen");
    if (data.funktionen) this.initObjOrArray(data.funktionen, "funktionen");
    if (data.kostenstellen) this.initObjOrArray(data.kostenstellen, "kostenstellen");
    if (data.publicvorlagen) this.initObjOrArray(data.publicvorlagen, "publicvorlagen");
    if (data.themen) this.initObjOrArray(data.themen, "themen");
    if (data.standorte) this.initObjOrArray(data.standorte, "standorte");
    if (data.teams) this.initObjOrArray(data.teams, "teams");
    if (data.vertraege) this.initObjOrArray(data.vertraege, "vertraege");
    if (data.vertragsphasen) this.initObjOrArray(data.vertragsphasen, "vertragsphasen");
    if (data.vertragsvarianten) this.initObjOrArray(data.vertragsvarianten, "vertragsvarianten");
    if (data.vertragstyp_varianten) this.initObjOrArray(data.vertragstyp_varianten, "vertragstyp_varianten");
    if(data.vertrags_arbeitszeiten) this.initObjOrArray(data.vertrags_arbeitszeiten, "vertrags_arbeitszeiten");
    if(data.vertragsstufen) this.initObjOrArray(data.vertragsstufen, "vertragsstufen");

    if (data.mitarbeiters) this.initObjOrArray(data.mitarbeiters, "mitarbeiters");
    if (data.po_dienste) this.initObjOrArray(data.po_dienste, "po_dienste");
    if (data.arbeitszeittypen) this.initObjOrArray(data.arbeitszeittypen, "arbeitszeittypen");
    if (data.arbeitszeitverteilungen) this.initObjOrArray(data.arbeitszeitverteilungen, "arbeitszeitverteilungen");
    if (data.dienstkategorien) this.initObjOrArray(data.dienstkategorien, "dienstkategorien");
    if (data.freigaben) this.initObjOrArray(data.freigaben, "freigaben");
    if (data.kontingente) this.initObjOrArray(data.kontingente, "kontingente");
    if (data.ratings) this.initObjOrArray(data.ratings, "ratings");
    if (data.zeitraumkategorien) this.initObjOrArray(data.zeitraumkategorien, "zeitraumkategorien");
    if(data.arbeitszeit_absprachen) this.initObjOrArray(data.arbeitszeit_absprachen, "arbeitszeit_absprachen");
    if(data.nicht_einteilen_absprachen) this.initObjOrArray(data.nicht_einteilen_absprachen, "nicht_einteilen_absprachen");
    this._setArray("konfliktArbeitszeittypen", []);
  }

  /**
   * Initialisieren von Daten
   */
  updateMe() {
    const {
      dienstkategorien,
      po_dienste,
      mitarbeiters,
      arbeitszeittypen
    } = this;
    let first = true;
    po_dienste?._each?.((d) => {
      dienstkategorien?._each?.((dk) => {
        dk?.addDienst?.(d);
      });
      mitarbeiters?._each?.((m) => {
        d?.addQualifizierteMitarbeiter?.(m);
        if(first) {
          m?.initRatingDienst?.();
        }
      });
      first = false;
    });
    if(!this.konfliktArbeitszeittypen?.length) {
      arbeitszeittypen?._each?.((typ) => {
        if (typ?.count) {
          this.konfliktArbeitszeittypen.push(typ);
        }
      });
    }
  }

  /**
   * Setzt die Attribute der Teams zurück
   */
  resetTeams() {
    this.teams?._each?.((team) => {
      team?.resetAttributes?.();
    });
  }

  /**
   * Setzt die Attribute der Mitarbeiter zurück
   */
  resetMitarbeiter() {
    this.mitarbeiters?._each?.((m) => {
      m?.resetAttributes?.();
    });
  }
}

export default AppData;
