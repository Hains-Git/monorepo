// Klassen 1
import DienstplanerDataDienst from './dienst';
import DienstplanerDataMitarbeiter from './mitarbeiter';
// Klassen 2
import Bedarf from '../apimodels/bedarf';
import DienstplanerDataPlanerDate from './planerdate';
import DienstplanerDataEinteilung from './einteilung';
import Rotation from '../apimodels/rotation';
import Wunsch from '../apimodels/wunsch';
// Additional
import { showConsole, showTime } from '../../tools/flags';
import Data from '../helper/data';
import Vorlage from '../apimodels/vorlage';
import Schicht from '../apimodels/schicht';
import Bedarfeintrag from '../apimodels/bedarfeintrag';
import { numericLocaleCompare } from '../../tools/helper';

/**
 * Erzeugt ein neues Dienstplaner-Data-Objekt
 * @class
 */
class DienstplanerData extends Data {
  constructor(data, appModel = false) {
    super(appModel);
    if (showConsole) console.log('create Dienstplaner Data', data);
    this._setObject('CLASSES', {
      mitarbeiter: (obj) => new DienstplanerDataMitarbeiter(obj, appModel),
      dienste: (obj) => new DienstplanerDataDienst(obj, appModel),
      bedarfe: (obj) => new Bedarf(obj, appModel),
      bedarfseintraege: (obj) => new Bedarfeintrag(obj, appModel),
      dates: (obj) => new DienstplanerDataPlanerDate(obj, appModel),
      einteilungen: (obj) => new DienstplanerDataEinteilung(obj, appModel),
      rotationen: (obj) => new Rotation(obj, appModel),
      schichten: (arr) => arr.map((schicht) => new Schicht(schicht, appModel)),
      wuensche: (obj) => new Wunsch(obj, appModel)
    });
    this.newParams(data);
    this._preventExtension();
    if (showConsole) this._whoAmI();
  }

  /**
   * Initialisiert das Modell neu
   * */
  newParams(data) {
    if (!this._isObject(data)) {
      console.log('Es wird ein Objekt erfordert!', data);
      return;
    }
    if (data.plantime_anfang) this._set('anfang', data.plantime_anfang);
    if (data.plantime_ende) this._set('ende', data.plantime_ende);
    if (data.anfang_frame) this._set('anfang_frame', data.anfang_frame);
    if (data.ende_frame) this._set('ende_frame', data.ende_frame);
    if (data.beschreibung) this._set('beschreibung', data.beschreibung);
    if (data.dienstplanbedarf_id)
      this._setInteger('dienstplanbedarf_id', data.dienstplanbedarf_id);
    if (data.dienstplanstatus_id)
      this._setInteger('dienstplanstatus_id', data.dienstplanstatus_id);
    if (data.id) this._setInteger('id', data.id);
    if (data.name) this._set('name', data.name);
    if (data.parameterset_id)
      this._setInteger('parameterset_id', data.parameterset_id);
    if (data.bedarf) this.initObjOrArray(data.bedarf, 'bedarfe');
    if (data.bedarfs_eintraege)
      this.initObjOrArray(data.bedarfs_eintraege, 'bedarfseintraege');
    if (data.dates) this.initObjOrArray(data.dates, 'dates');
    if (data.einteilungen)
      this.initObjOrArray(data.einteilungen, 'einteilungen');
    if (data.rotationen) this.initObjOrArray(data.rotationen, 'rotationen');
    if (data.schichten) this.initObjOrArray(data.schichten, 'schichten');
    if (data.wuensche) this.initObjOrArray(data.wuensche, 'wuensche');
    if (data.kws) this.initObjOrArray(data.kws, 'kws');
    if (data.wochenbilanzen)
      this.initObjOrArray(data.wochenbilanzen, 'wochenbilanzen');
    if (data.dienst_bedarfeintrag)
      this.initObjOrArray(data.dienst_bedarfeintrag, 'dienst_bedarfeintrag');
    if (this._mitarbeiters) {
      this.initObjOrArray(this._mitarbeiters, 'mitarbeiter');
      this._setArray('aktiveMitarbeiter', this.getActiveMitarbeiter());
    }
    if (this._po_dienste) this.initObjOrArray(this._po_dienste, 'dienste');
    this.createDefaultVorlagen();
    this.resetTeamFilter();
  }

  /**
   * Gibt eine Liste mit den aktiven Mitarbeitern (für die Vorschläge) zurück,
   * sortiert nach Planname.
   * @returns Array mit aktiven Mitarbeitern
   */
  getActiveMitarbeiter() {
    return (
      this?.mitarbeiter
        ?._each?.(false, (m) => m?.aktiv)
        ?.arr?.sort?.((a, b) => numericLocaleCompare(a.planname, b.planname)) ||
      []
    );
  }

  /**
   * Setzt den Team-Filter zurück
   */
  resetTeamFilter() {
    this._setArray('teamFilter', [
      {
        id: '',
        index: 0,
        name: 'Kein Team',
        title: 'Gilt für alle Dienste und alle Mitarbeiter'
      }
    ]);
  }

  /**
   * Erstelle Vorlagen, Dienste mit und ohne Bedarf und alle Dienste.
   */
  createDefaultVorlagen() {
    const relevantDienste = [];
    const noRelevantDienste = [];
    const alle = [];
    const funktionen = [];
    const newVorlagen = [];

    this?.dienste?._each?.((dienst) => {
      dienst.hasBedarf
        ? relevantDienste.push(dienst.id)
        : noRelevantDienste.push(dienst.id);
    });

    this?._funktionen?._each?.((f) => {
      funktionen.push(f.id);
    });

    const defaultStandart = false;
    const defaultTeam = null;
    const defaultAnsicht = 0;
    this._set('vordefinierteVorlagen', [
      new Vorlage(
        {
          name: 'Dienste mit Bedarf',
          id: -1,
          dienste: relevantDienste,
          funktionen_ids: funktionen,
          ansicht_id: defaultAnsicht,
          standard: defaultStandart,
          team_id: defaultTeam,
          position: 0
        },
        this._appModel
      ),
      new Vorlage(
        {
          name: 'Dienste ohne Bedarf',
          id: -2,
          dienste: noRelevantDienste,
          funktionen_ids: funktionen,
          ansicht_id: defaultAnsicht,
          standard: defaultStandart,
          team_id: defaultTeam,
          position: 0
        },
        this._appModel
      ),
      new Vorlage(
        {
          name: 'Alle Dienste',
          id: -3,
          dienste: alle,
          funktionen_ids: funktionen,
          ansicht_id: defaultAnsicht,
          standard: defaultStandart,
          team_id: defaultTeam,
          position: 0
        },
        this._appModel
      )
    ]);

    this?._publicvorlagen?._each?.((vorlage) => {
      newVorlagen.push(vorlage);
    });
    this?.vordefinierteVorlagen?.forEach?.((vorlage) => {
      newVorlagen.push(vorlage);
    });

    this._set('defaultVorlagen', newVorlagen);
  }

  /**
   * Initialisieren allen Daten
   */
  updateMe() {
    if (showConsole)
      console.log('update diensplaner-data', this?._einteilungen?._length);
    this.updateTeamFilter();
    this.initDates();
  }

  /**
   * Teams zum Team-Filter hinzufügen
   */
  updateTeamFilter() {
    showTime && console.time('init team filter');
    this.resetTeamFilter();
    this?._teams?._each?.((team) => {
      team.resetAttributes();
      const l = this.teamFilter.length;
      this.teamFilter.push({
        id: team.id,
        index: l,
        name: team.name,
        title: `Gibt alle Dienste des Teams (${team.name}) zurück`
      });
    });
    showTime && console.timeEnd('init team filter');
  }

  /**
   * Initialisiert die Einteilungen und Min-Felder
   */
  initDates() {
    showTime && console.time('init Dates filter');
    this?.dates?._each?.((date) => {
      date.initMitarbeiter(false);
      date.initDienste(false);
    });
    showTime && console.timeEnd('init Dates filter');
  }
}

export default DienstplanerData;
