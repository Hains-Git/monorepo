import { formatDate, today } from '../../tools/dates';
import InfoTab from '../helper/info-tab';
import FeldV from './FeldV';

/**
 * Klasse für eine MitarbeiterVorschlaege-Instanz.
 * Mit dieser Klasse wird das Popup für die Mitarbeiter-Vorschläge
 * des Verteilers verwaltet.
 * @extends InfoTab
 * @param {AppModel} appModel
 * @class
 */
class MitarbeiterVorschlaege extends InfoTab {
  constructor(parent, appModel = false) {
    super(appModel);
    this._setObject('parent', parent);
    this.resetFeld();
  }

  /**
   * Setzt den Header des Popups.
   */
  setHeader() {
    this.setInfoTitle(this.feld.label);
  }

  /**
   * Setzt die Default-Werte für das Feld.
   */
  resetFeld() {
    this.feld = new FeldV(
      {
        tag: formatDate(today()),
        bereichId: 0,
        dienstId: 0,
        bedarfeintragId: 0
      },
      this._appModel
    );
    this.setHeader();
  }

  /**
   * Setzt die Daten für die Mitarbeiter-Vorschläge.
   * @param {String} date
   * @param {Number} po_dienst_id
   * @param {Number} be_id
   * @param {Number} bereich_id
   */
  set(date, po_dienst_id = 0, be_id = 0, bereich_id = 0) {
    this.feld = new FeldV(
      {
        tag: date,
        bereichId: bereich_id,
        dienstId: po_dienst_id,
        bedarfeintragId: be_id
      },
      this._appModel
    );
    this.setHeader();
    this.setInfoFkt(true);
  }

  /**
   * Schließt das Tab
   */
  setInfo() {
    super.setInfo();
    this.resetFeld();
  }

  /**
   * Testet, ob die Mitarbeiter im Team-Filter sind.
   * @param {Number} mitarbeiterId
   * @returns {Boolean} True, wenn ein Team, die Mitarbeiter enthält.
   */
  isMitarbeiterInTeamFilter(mitarbeiterId) {
    const tag = this?.feld?.tag || false;
    return !!this.parent?.isMitarbeiterInTeamFilter?.(mitarbeiterId, tag);
  }

  /**
   * Liefert die Vorschläge nach dem Callback.
   * Vorschläge werden anhand des Team-Filters gefiltert.
   * @param {Function} callback
   * @returns {Array} Array
   */
  getVorschlaege(callback) {
    const vorschlaege = [];
    const defaultScore = { value: 0, title: '', props: false };
    const feld = this.feld;
    const appModel = this._appModel;
    const returnMitarbeiter = this._isFunction(callback)
      ? (m) =>
          callback(
            m,
            new FeldV(
              {
                tag: feld.tag,
                bereichId: feld.bereichId,
                dienstId: feld.dienstId,
                bedarfeintragId: feld.bedarfeintragId,
                value: m?.id || 0
              },
              appModel
            ),
            m?.getScore?.(feld) || defaultScore
          )
      : (m) => m;
    this?._aktiveMitarbeiter?.forEach?.((m) => {
      if (!this.isMitarbeiterInTeamFilter(m.id)) return;
      vorschlaege.push(returnMitarbeiter(m));
    });
    return vorschlaege;
  }
}

export default MitarbeiterVorschlaege;

