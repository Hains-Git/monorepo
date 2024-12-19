import { development } from '../tools/flags';
import { deepClone } from '../tools/helper';
import BasicMethods from './basic-helper/basicmethods';

/**
 * Erstellt ein Basic-Objekt.
 * Diese Klasse dient als Basis-Klasse für alle Elemente des Singleton.
 * Hierüber wird der Zugriff auf das Singleton gewährt und wichtige Funktionen
 * zur Kommunikation mit den Komponenten zur Verfügung gestellt.
 * @class
 */
class Basic extends BasicMethods {
  constructor(appModel = false) {
    super();
    // Alle relevanten Eigenschaften der Klasse, über die iteriert werden kann
    this._setArray('_properties_', [], false);
    this._set('_default_id_', '_default_id_', false);
    // Hier können sich Komponenten mit ihren setStates registrieren
    this._setObject('_components_register_', {}, false);
    this._set('_appModel_', appModel, false);
    if (!appModel && development) console.log('appModel fehlt', this, appModel);
  }

  /**
   * Hierüber wird die Klassenvariable _appModel_ mit dem Singleton verbunden.
   * Dadurch ist das Singleton in allen Basic-Objekten verfügbar.
   * @param {Object} appModel Singleton
   */
  _setAppModel_(appModel = false) {
    if (this._isObject(appModel) && !Basic._appModel_) {
      Basic._appModel_ = appModel;
      this._set('_appModel_', appModel, false);
    } else if (!Basic._appModel_) {
      Basic._appModel_ = appModel;
    }
  }

  _isBasicObject(obj) {
    /**
     * Liefert true wenn param ein Basic Object ist ansonsten false
     * @param {Object}
     */
    return obj instanceof Basic;
  }

  /**
   * Liefert den Key für das Filter-Vorlagen-Komponenten-Register
   */
  get _filterVorlagenRegisterKey() {
    return '_filterVorlagenRegister_';
  }

  /**
   * Liefert ein geklontes JSON Objekt mit allen
   * iterablen Eigenschaften des aktuellen Exemplars
   */
  get _me() {
    return deepClone(this._each().obj);
  }

  /**
   * Liefert das Singleton aus der Klassenvariable _appModel_
   */
  get _appModel() {
    return this._appModel_ || Basic._appModel_;
  }

  /**
   * Liefert das mounted-Atrribut aus appModel
   */
  get _mounted() {
    return !!this?._appModel?.mounted;
  }

  get _pageName() {
    return this?._appModel?.pageName || '';
  }

  /**
   * Liefert das das data-Atrribut aus appModel
   */
  get _appData() {
    const data = this?._appModel?.data;
    if (!data) this._throwError(10, 'Data');

    return data;
  }

  /**
   * Liefert alle ArbeitszeitAbsprachen
   * @returns {object} Ein Basic-Objekt, gefüllt mit den ArbeitszeitAbsprachen nach mitarbeiter_id
   */
  get _arbeitszeit_absprachen() {
    const result = this?._appData?.arbeitszeit_absprachen;
    if (!result) this._throwError(11, 'arbeitszeit_absprachen');
    return result;
  }

  /**
   * Liefert alle Bereiche
   * @returns {object} Ein Basic-Objekt, gefüllt mit den Bereichen nach Id
   */
  get _arbeitsplaetze() {
    const result = this?._appData?.arbeitsplaetze;
    if (!result) this._throwError(11, 'arbeitsplaetze');
    return result;
  }

  /**
   * Liefert alle Arbeitszeittypen
   * @returns {object} Ein Basic-Objekt, gefüllt mit den Arbeitszeittypen nach Id
   */
  get _arbeitszeittypen() {
    const result = this?._appData?.arbeitszeittypen;
    if (!result) this._throwError(11, 'arbeitszeittypen');
    return result;
  }

  /**
   * Liefert alle Arbeitszeittypen mit Konflikt-Potenzial
   * @returns {array} Ein Array, gefüllt mit den Arbeitszeittypen
   */
  get _konfliktArbeitszeittypen() {
    const result = this?._appData?.konfliktArbeitszeittypen;
    if (!result) this._throwError(11, 'konfliktArbeitszeittypen');
    return result;
  }

  /**
   * Liefert den ersten Arbeitszeittyp mit der Eigenschaft isFrei
   */
  get _arbeitszeittypFrei() {
    let typ = 0;
    this?._arbeitszeittypen?._each?.((at) => {
      if (at.isFrei) {
        typ = at;
        return true;
      }
    });

    return typ;
  }

  /**
   * Liefert alle Arbeitszeitverteilungen
   * @returns {object} Ein Basic-Objekt, gefüllt mit den Arbeitszeitverteilungen nach Id
   */
  get _arbeitszeitverteilungen() {
    const result = this?._appData?.arbeitszeitverteilungen;
    if (!result) this._throwError(11, 'arbeitszeitverteilungen');
    return result;
  }

  /**
   * Liefert alle Bereiche
   * @returns {object} Ein Basic-Objekt, gefüllt mit den Bereichen nach Id
   */
  get _bereiche() {
    const result = this?._appData?.bereiche;
    if (!result) this._throwError(11, 'bereiche');
    return result;
  }

  /**
   * Liefert alle Dienstgruppen
   * @returns {object} Ein Basic-Objekt, gefüllt mit den Dienstgruppen nach Id
   */
  get _dienstgruppen() {
    const result = this?._appData?.dienstgruppen;
    if (!result) this._throwError(11, 'dienstgruppen');
    return result;
  }

  /**
   * Liefert alle Dienstkategorien
   * @returns {object} Ein Basic-Objekt, gefüllt mit den Dienstkategorien nach Id
   */
  get _dienstkategorien() {
    const result = this?._appData?.dienstkategorien;
    if (!result) this._throwError(11, 'dienstkategorien');
    return result;
  }

  /**
   * Liefert eine Matrix, bei der den Diensten ihre jeweiligen Mitarbeiter zugeordnet sind
   * @returns {object} Ein Matrix {dienstId: [Mitarbeiter]}
   */
  get _dienstMitarbeiter() {
    const result = this?._appData?.dienst_mitarbeiter;
    if (!result) this._throwError(11, 'dienst_mitarbeiter');
    return result;
  }

  /**
   * Liefert alle DienstplanPfade
   * @returns {object} Ein Basic-Objekt, gefüllt mit den DienstplanPfaden nach Id
   */
  get _dienstplanpfade() {
    const result = this?._appData?.dienstplanpfade;
    if (!result) this._throwError(11, 'dienstplanpfade');
    return result;
  }

  /**
   * Liefert alle Dienstverteilungstypen
   * @returns {object} Ein Basic-Objekt, gefüllt mit den Dienstverteilungstypen nach Id
   */
  get _dienstverteilungstypen() {
    const result = this?._appData?.dienstverteilungstypen;
    if (!result) this._throwError(11, 'dienstverteilungstypen');
    return result;
  }

  /**
   * Liefert alle Einteilungskontexte
   * @returns {object} Ein Basic-Objekt, gefüllt mit den Einteilungskontexten nach Id
   */
  get _einteilungskontexte() {
    const result = this?._appData?.einteilungskontexte;
    if (!result) this._throwError(11, 'einteilungskontexte');
    return result;
  }

  get _defaultEinteilungsKontext() {
    const result = this._einteilungskontexte?._each?.(false, (ek) => ek.default)?.arr?.[0] || false; 
    if (!result) this._throwError(11, 'default_kontext');
    return result;
  }

  get _defaultEinteilungsKontextId() {
    return this._defaultEinteilungsKontext?.id || 5;
  }

  /**
   * Liefert alle Einteilungsstatuse
   * @returns {object} Ein Basic-Objekt, gefüllt mit den Einteilungsstatusen nach Id
   */
  get _einteilungsstatuse() {
    const result = this?._appData?.einteilungsstatuse;
    if (!result) this._throwError(11, 'einteilungsstatuse');
    return result;
  }

  /**
   * Liefert alle Freigaben
   * @returns {object} Ein Basic-Objekt, gefüllt mit den Freigaben nach Id
   */
  get _freigaben() {
    const result = this?._appData?.freigaben;
    if (!result) this._throwError(11, 'freigaben');
    return result;
  }

  /**
   * Liefert alle Freigabestatuse
   * @returns {object} Ein Basic-Objekt, gefüllt mit den Freigabestatusen nach Id
   */
  get _freigabestatuse() {
    const result = this?._appData?.freigabestatuse;
    if (!result) this._throwError(11, 'freigabestatuse');
    return result;
  }

  /**
   * Liefert alle Freigabetypen
   * @returns {object} Ein Basic-Objekt, gefüllt mit den Freigabetypen nach Id
   */
  get _freigabetypen() {
    const result = this?._appData?.freigabetypen;
    if (!result) this._throwError(11, 'freigabetypen');
    return result;
  }

  /**
   * Liefert alle Funktionen für Mitarbeiter
   * @returns {object} Ein Basic-Objekt, gefüllt mit den Funktionen nach Id
   */
  get _funktionen() {
    const result = this?._appData?.funktionen;
    if (!result) this._throwError(11, 'funktionen');
    return result;
  }

  /**
   * Liefert das Attrubut hains -> hello("hains"), welches zur Kommunikation mit der API dient.
   */
  get _hains() {
    const hains = this?._appModel?.hains;
    if (!hains) this._throwError(10, 'Hains');

    return hains;
  }

  /**
   * Liefert alle Kontingente
   * @returns {object} Ein Basic-Objekt, gefüllt mit den Kontingenten nach Id
   */
  get _kontingente() {
    const result = this?._appData?.kontingente;
    if (!result) this._throwError(11, 'kontingente');
    return result;
  }

  /**
   * Liefert alle Kostenstellen
   * @returns {object} Ein Basic-Objekt, gefüllt mit den Kostenstellen nach Id
   */
  get _kostenstellen() {
    const result = this?._appData?.kostenstellen;
    if (!result) this._throwError(11, 'kostenstellen');
    return result;
  }

  /**
   * Liefert die Konflikte Schnittstelle
   */
  get _konflikte() {
    const result = this?._appModel?.konflikte;
    if (!result) this._throwError(11, 'konflikte');
    return result;
  }

  /**
   * Liefert das Max-Rating für den Dienstplan
   * @return {number} Zahl des höchstmöglichen Dienst-Ratings
   */
  get _MAX_RATING() {
    const result = this?._appData?.MAX_RATING;
    if (!result) this._throwError(11, 'MAX_RATING');
    return result;
  }

  /**
   * Liefert die Anzahl der maximal pro Monat zulässigen Wochenenden für den Dienstplan
   * @return {number} Zahl der möglichen Wochenenden
   */
  get _MAX_WOCHENENDEN() {
    const result = this?._appData?.MAX_WOCHENENDEN;
    if (!result) this._throwError(11, 'MAX_WOCHENENDEN');
    return result;
  }

  /**
   * Liefert alle Mitarbeiter
   * @returns {object} Ein Basic-Objekt, gefüllt mit den Mitarbeitern nach Id
   */
  get _mitarbeiters() {
    const result = this?._appData?.mitarbeiters;
    if (!result) this._throwError(11, 'mitarbeiters');
    return result;
  }

  /**
   * Liefert alle NichtEinteilenAbsprachen
   * @returns {object} Ein Basic-Objekt, gefüllt mit den NichtEinteilenAbsprachen nach mitarbeiter_id
   */
  get _nicht_einteilen_absprachen() {
    const result = this?._appData?.nicht_einteilen_absprachen;
    if (!result) this._throwError(11, 'nicht_einteilen_absprachen');
    return result;
  }

  /**
   * Liefert alle Dienste
   * @returns {object} Ein Basic-Objekt, gefüllt mit den Diensten nach Id
   */
  get _po_dienste() {
    const result = this?._appData?.po_dienste;
    if (!result) this._throwError(11, 'po_dienste');
    return result;
  }

  /**
   * Liefert alle public_vorlagen
   * @returns {object} Ein Basic-Objekt, gefüllt mit den public_vorlagen nach Id
   */
  get _publicvorlagen() {
    const result = this?._appData?.publicvorlagen;
    if (!result) this._throwError(11, 'publicvorlagen');
    return result;
  }

  /**
   * Liefert alle Dienst-Ratings
   * @returns {object} Ein Basic-Objekt, gefüllt mit den Dienst-Ratings nach Id
   */
  get _ratings() {
    const result = this?._appData?.ratings;
    if (!result) this._throwError(11, 'ratings');
    return result;
  }

  /**
   * Liefert die Scores Schnittstelle
   */
  get _scores() {
    const result = this?._appModel?.scores;
    if (!result) this._throwError(10, 'scores');
    return result;
  }

  /**
   * Liefert die Statistiken Schnittstelle
   */
  get _statistiken() {
    const result = this?._appModel?.statistiken;
    if (!result) this._throwError(10, 'statistiken');
    return result;
  }

  /**
   * Liefert die Standorte Schnittstelle
   */
  get _standorte() {
    const result = this?._appData?.standorte;
    if (!result) this._throwError(11, 'standorte');
    return result;
  }

  /**
   * Liefert alle Teams
   * @returns {object} Ein Basic-Objekt, gefüllt mit den Teams nach Id
   */
  get _teams() {
    const result = this?._appData?.teams;
    if (!result) this._throwError(11, 'teams');
    return result;
  }

  /**
   * Liefert alle Themen
   * @returns {object} Ein Basic-Objekt, gefüllt mit den Themen nach Id
   */
  get _themen() {
    const result = this?._appData?.themen;
    if (!result) this._throwError(11, 'themen');
    return result;
  }

  /**
   * Liefert alle Verträge
   * @returns {object} Ein Basic-Objekt, gefüllt mit den Verträgen nach Id
   */
  get _vertraege() {
    const result = this?._appData?.vertraege;
    if (!result) this._throwError(11, 'vertraege');
    return result;
  }

  /**
   * Liefert alle Vertragsphasen
   * @returns {object} Ein Basic-Objekt, gefüllt mit den Vertragphasen nach Id
   */
  get _vertragsphasen() {
    const result = this?._appData?.vertragsphasen;
    if (!result) this._throwError(11, 'vertragsphasen');
    return result;
  }

   /**
   * Liefert alle Vertragsphasen
   * @returns {object} Ein Basic-Objekt, gefüllt mit den Vertragphasen nach Id
   */
   get _vertrags_arbeitszeiten() {
    const result = this?._appData?.vertrags_arbeitszeiten;
    if (!result) this._throwError(11, 'vertrags_arbeitszeiten');
    return result;
  }

  /**
   * Liefert alle Vertragsvarianten
   * @returns {object} Ein Basic-Objekt, gefüllt mit den Vertragsvarianten nach Id
   */
  get _vertragsvarianten() {
    const result = this?._appData?.vertragsvarianten;
    if (!result) this._throwError(11, 'vertragsvarianten');
    return result;
  }

  get _vertragsstufen(){
    const result = this?._appData?.vertragsstufen;
    if (!result) this._throwError(11, 'vertragsstufen');
    return result;
  }

  /**
   * Liefert die Verbidungen zwischen Vertragstypen und Vertragsvarianten
   * @returns {object} Ein Basic-Objekt, gefüllt mit den Vertragsvarianten nach Vertragstyp_id
   */
  get _vertragstyp_varianten() {
    const result = this?._appData?.vertragstyp_varianten;
    if (!result) this._throwError(11, 'vertragstyp_varianten');
    return result;
  }

  /**
   * Liefert alle Zeitraumkategorien
   * @returns {object} Ein Basic-Objekt, gefüllt mit den Zeitraumkategorien nach Id
   */
  get _zeitraumkategorien() {
    const result = this?._appData?.zeitraumkategorien;
    if (!result) this._throwError(11, 'zeitraumkategorien');
    return result;
  }

  /**
   * Liefert den user
   */
  get _user() {
    const user = this?._appModel?.user;
    if (!user) this._throwError(10, 'User');

    return user;
  }

  /**
   * Gibt ein Array aus, mit allen iterablen keys des Exemplars
   */
  get _properties() {
    return this._properties_;
  }

  /**
   * Pusht ein key in das _properties Array, sodass mit der _each-Methode über das Attribut
   * iteriert werden kann.
   */
  set _properties(key) {
    if (typeof key !== 'string') {
      console.log('_properties_ akzeptiert nur Strings', key, typeof key);
      return;
    }

    if (!this._properties_.includes(key)) this._properties_.push(key);
  }

  /**
   * Liefert das Objekt, welches als Komponenten-Register für das Exemplar dient
   */
  get _components_register() {
    return this._components_register_;
  }

  /**
   * Fügt ein Callback in das Komponenten-Register unter der
   * default-Id hinzu.
   */
  set _components_register(setState) {
    if (this._isFunction(setState)) {
      const id = this._default_id_;
      if (!this._components_register_[id]) {
        this._components_register_[id] = [];
      }
      if (!this._components_register_[id].includes(setState)) {
        this._components_register_[id].push(setState);
      }
    } else console.log('Only Functions allowed', setState, typeof setState);
  }

  /**
   * Liefert True, wenn das Exemplar erweiterbar ist, ansonsten false
   */
  get _is_extensible() {
    return Object.isExtensible(this);
  }

  /**
   * Liefert true, wenn das Exemplar eingefroren wurde, ansonsten false
   */
  get _is_frozen() {
    return Object.isFrozen(this);
  }

  /**
   * Liefert Zugriff auf das Datenmodel der aktuellen Seite
   */
  get _page() {
    const result = this?._appModel?.page;
    if (!result) this._throwError(10, 'Page');

    return result;
  }

  /**
   * Liefert Zugriff auf die Daten aus dem Datenmodell der aktuellen Seite
   */
  get _pageData() {
    const result = this._page && this._page.data;
    if (!result) this._throwError(7);

    return result;
  }
}

export default Basic;
