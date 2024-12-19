import { returnError } from '../tools/hains';
import { showConsole } from '../tools/flags';
import Vorlage from './apimodels/vorlage';
import Basic from './basic';
import CustomFeld from './dienstplaner/tables/benutzerdefinierte-felder/customfeld';
import { numericLocaleCompare, setPageWarning } from '../tools/helper';

const defaultSettings = {
  user_settings: {
    dienstplan_fontsize: 0.7,
    wuensche: true,
    only_vorlagedienste: false,
    standard_vorlage_id: 0,
    mark_einteilungsstatus: true
  }
};

/**
 * Erzeugt ein User-Objekt, welches Teil des Singleton ist.
 * @class
 */
class User extends Basic {
  constructor(obj, appModel = false) {
    super(appModel);
    if (showConsole) console.log('User', obj);
    this.setSettings();
    this.setStartVorlage();
    this._set('hainsInfo', obj.hainsinfo);
    this._setArray('roles', obj.roles);
    this._set('id', obj.id);
    this._set('is_admin', obj.is_admin);
    this._set('is_verwaltung', obj.is_verwaltung);
    this.setVorlagen();
    this._setObject('customFelder', {});
    this._set('is_dienstplaner', obj.is_dienstplaner);
    this._set('is_rotationsplaner', obj.is_rotationsplaner);
    this._set('is_urlaubsplaner', obj.is_urlaubsplaner);
    this._setArray('team_ids', obj.teams);
    this._setObject('channels', {});
    this._set('has_tv_vorlagen', !!obj.has_tv_vorlagen);
    this._set('has_wv_vorlagen', !!obj.has_wv_vorlagen);
    this._preventExtension();
    if (showConsole) this._whoAmI();
  }

  /**
   * Fill in zur Vereinheitlichung von Joomla und Dienstplaner
   * Dienstplaner hatte bisher CamelCase, Joomla und Rails aber snake_case
   */
  get isDienstplaner() {
    return this.is_dienstplaner;
  }

  get isRotationsplaner() {
    return this.is_rotationsplaner;
  }

  get isUrlaubsplaner() {
    return this.is_dienstplaner;
  }

  get isAdmin() {
    return this.is_admin;
  }

  /**
   * Liefert die Standard-Vorlage aus den Settings
   */
  get standardVorlageId() {
    return this?.userSettings?.standard_vorlage_id || 0;
  }

  /**
   * Liefert true, wenn Benutzer Dienstplaner oder Urlausbplaner ist
   */
  get showDienstplaner() {
    return this.isDienstplaner || this.isUrlaubsplaner;
  }

  /**
   * Liefert true, wenn Benutzer Dienstplaner ist und Vorlagen für den Tages-Verteiler hat
   */
  get showTV() {
    return this.isDienstplaner && this.has_tv_vorlagen;
  }

  /**
   * Liefert true, wenn Benutzer Dienstplaner ist und Vorlagen für den Wochen-Verteiler hat
   */
  get showWV() {
    return this.isDienstplaner && this.has_wv_vorlagen;
  }

  /**
   * Liefert die Anzahl der CustomFelder (benutzerdefinierte Zeilen und Spalten)
   */
  get hasCustomFelder() {
    return Object.values(this.customFelder).length > 0;
  }

  /**
   * Liefert die Mitarbeiter-Id der Benutzerin
   */
  get mitarbeiterId() {
    return this?.hainsInfo?.mitarbeiter_id || -1;
  }

  /**
   * Liefert den Vollen Namen der Benutzerin
   */
  get name() {
    return `${this?.hainsInfo?.vorname || ''} ${this?.hainsInfo?.nachname || ''}`;
  }

  /**
   * Liefert true, wenn Vorlagen existieren
   */
  get hasOwnVorlagen() {
    const l = this?.vorlagen?.length || 0;
    return l > 0;
  }

  /**
   * AppData wird für Admins, Dienstplaner, Urlaubsplaner und Rotationsplaner angezeigt
   */
  get getAppData() {
    return (
      this.isAdmin ||
      this.isDienstplaner ||
      this.isUrlaubsplaner ||
      this.isRotationsplaner
    );
  }

  /**
   * Rotationsplaner soll für Admins und Dienstplaner angezeigt werden
   */
  get showRotationsplaner() {
    return this.isAdmin || this.isDienstplaner || this.isRotationsplaner;
  }

  /**
   * Liefert ein Array mit den Teams des Users
   */
  get teams() {
    const arr = [];
    const teams = this?._teams;
    if (!teams) return arr;
    this.team_ids.forEach((tId) => {
      const team = teams?.[tId];
      if (team) arr.push(team);
    });

    return arr;
  }

  /**
   * Liefert die User-Settings aus Settings
   */
  get userSettings() {
    if (!this.settings?.user_settings) {
      this.settings.user_settings = defaultSettings.user_settings;
    }
    return this.settings?.user_settings || {};
  }

  /**
   * Liefert die Settings für den Konflikte-Filter des Dienstplans
   */
  get konflikteSettings() {
    const settings = this.userSettings;
    const result = {};
    [
      ['abwesend', false],
      ['mehrfacheinteilung', true],
      ['ueberschneidung', true],
      ['wochenenden', false],
      ['arbeitszeittyp', false],
      ['freigaben', true],
      ['team', true],
      ['dienstgruppe', true],
      ['fordertdienstgruppe', true],
      ['predienstgruppe', true]
    ].forEach(([key, value]) => {
      result[key] = settings?.[key] !== undefined ? settings[key] : value;
    });
    return result;
  }

  /**
   * Liefert die Settings für die Farbgruppen des Dienstplans
   */
  get farbgruppenSettings() {
    const settings = this.userSettings;
    const farbgruppen = this?.settings?.farbgruppen;
    return {
      dienstfarben:
        settings?.dienstfarben !== undefined ? settings.dienstfarben : true,
      dientkategoriefarben:
        settings && settings.dientkategoriefarben !== undefined
          ? settings.dientkategoriefarben
          : false,
      farbgruppen: this._isArray(farbgruppen) ? farbgruppen : []
    };
  }

  /**
   * Liefert die Fontsize des Dienstplans
   */
  get fontSize() {
    return this.userSettings?.dienstplan_fontsize || 0.7;
  }

  /**
   * Gibt die auf 2 Nachkommastellen gerundete Fontsize zurück
   */
  get fontSizeRounded() {
    return Math.round(this.fontSize * 100) / 100;
  }

  /**
   * Liefert die Settings der Dienstplan-Tabelle
   */
  get dienstplanTableSettings() {
    const {
      wuensche,
      only_vorlagedienste,
      only_planungszeitraum,
      mark_einteilungsstatus,
      empty_as_regeldienst,
      mitarbeiter_sort
    } = this.userSettings;
    return {
      wuensche: wuensche === undefined ? true : wuensche,
      only_vorlagedienste: !!only_vorlagedienste,
      only_planungszeitraum: !!only_planungszeitraum,
      mark_einteilungsstatus: !!mark_einteilungsstatus,
      empty_as_regeldienst: !!empty_as_regeldienst,
      mitarbeiter_sort: mitarbeiter_sort || 0
    };
  }

  /**
   * Liefert ein Objekt mit Informationen zu dem User.
   */
  get _info() {
    const result = {
      mainInfos: {
        id: { value: this.id, label: 'ID' },
        name: { value: this.name, label: 'Name' },
        admin: { value: this.isAdmin ? 'Ja' : 'Nein', label: 'Admin' },
        dienstplaner: {
          value: this.isDienstplaner ? 'Ja' : 'Nein',
          label: 'Dienstplaner/in'
        },
        urlaubsplaner: {
          value: this.isUrlaubsplaner ? 'Ja' : 'Nein',
          label: 'Urlaubsplaner/in'
        },
        rotationsplaner: {
          value: this.isRotationsplaner ? 'Ja' : 'Nein',
          label: 'Rotationsplaner/in'
        }
      },
      popupInfos: {}
    };
    const { teams, roles } = this;
    if (teams?.length) {
      result.popupInfos.Teams = {
        value: {},
        label: 'Freigegebene Teams',
        sorting: 'alph-asc'
      };
      teams.forEach((t) => {
        result.popupInfos.Teams.value[t.id] = {
          value: '',
          label: t.name,
          sort: t.name
        };
      });
    }
    if (roles?.length) {
      result.popupInfos.Rollen = {
        value: {},
        label: 'Rollen',
        sorting: 'alph-asc'
      };
      roles.forEach((r, i) => {
        result.popupInfos.Rollen.value[i] = {
          value: '',
          label: r,
          sort: r
        };
      });
    }
    const channelInfo = this?._appModel?.channel?._userInfo;
    console.log('channelInfo', channelInfo);
    if (channelInfo) {
      result.popupInfos.Channel = channelInfo;
    }

    return result;
  }

  /**
   * Liefert alle Vorlagen des Dientsplans
   */
  get allDienstplanVorlagen() {
    const defaultVorlagen = this._defaultVorlagen;
    if (this._isArray(defaultVorlagen)) {
      return this.vorlagen.concat(defaultVorlagen);
    }
    return this.vorlagen;
  }

  /**
   * Initialisiert die Vorlagen, Settings, die benutzerdefinierten Zeilen und Spalten, etc. für den Monatsplan.
   * @param {Object} settings
   */
  initMonatsplanungSettings(settings) {
    if (showConsole) console.log('initMonatsplanungSettings', settings);
    this.setVorlagen(settings?.vorlagen);
    this.setSettings(
      this?._isObject(settings?.dienstplaner_settings)
        ? settings.dienstplaner_settings
        : false
    );
    this.setCustomFelder([
      settings.dienstplan_custom_felder,
      settings.dienstplan_custom_counter
    ]);
  }

  /**
   * Setzt die Standard-Vorlage-Id
   * @param {Number} standardVorlageId
   */
  updateStandardVorlage(standardVorlageId = 0) {
    const id = parseInt(standardVorlageId, 10) || 0;
    this.userSettings.standard_vorlage_id = id;
    this._update();
  }

  /**
   * Setzt die only_vorlagedienste-Settings
   * @param {Boolean} bool
   */
  setOnlyVorlageDienste(bool = false) {
    this.userSettings.only_vorlagedienste = !!bool;
  }

  /**
   * Setzt die only_planungszeitraum-Settings
   * @param {Boolean} bool
   */
  setOnlyPlanungszeitraum(bool = false) {
    this.userSettings.only_planungszeitraum = !!bool;
  }

  setEmptyAsRegeldienst(bool = false) {
    this.userSettings.empty_as_regeldienst = !!bool;
  }

  setMitarbeiterSort(sort = 0) {
    this.userSettings.mitarbeiter_sort = sort;
  }

  /**
   * Setzt die mark_einteilungsstatus-Settings
   * @param {Boolean} bool
   */
  setMarkEinteilungsstatus(bool = false) {
    this.userSettings.mark_einteilungsstatus = !!bool;
  }

  /**
   * Setzt die wuensche-Settings
   * @param {Boolean} bool
   */
  setAddWunesche(bool = false) {
    this.userSettings.wuensche = bool;
  }

  /**
   * Setzt das Settings-Attribut
   * @param {Object} settings
   */
  setSettings(settings = false) {
    this._setObject('settings', settings || defaultSettings);
    const fontsize =
      this?.userSettings?.dienstplan_fontsize ||
      defaultSettings?.user_settings?.dienstplan_fontsize ||
      0.7;
    this._setFloat('defaultFontSize', fontsize);
  }

  /**
   * Verändert die Fontsize
   * @param {Number} add
   * @param {Boolean} reset
   */
  setFontSize(add = 0, reset = false) {
    let newFontSize = this.fontSize;
    newFontSize += add * 0.05;
    if (reset) newFontSize = this.defaultFontSize;
    if (newFontSize > 1.5) newFontSize = 1.5;
    else if (newFontSize < 0.3) newFontSize = 0.3;
    this.userSettings.dienstplan_fontsize = newFontSize;
    return this.fontSize;
  }

  /**
   * Liefert das customFeld zur übergebenen Id
   * @param {Number} feldId
   * @returns CustomFeld
   */
  getFeld(feldId) {
    return this.customFelder[feldId];
  }

  /**
   * Iteriert durch alle benutzerdefinierten Zeilen und Spalten (customFelder)
   * @param {Function} callback
   */
  eachCustomFeld(callback) {
    if (!this._isFunction(callback)) {
      console.log('Es wird eine Funktion erwartet', callback);
      return;
    }

    for (const feldId in this.customFelder) {
      const feld = this.customFelder[feldId];
      callback(feld);
    }
  }

  /**
   * Initialisiert die benutzerdefinierten Zeilen/Spalten und ihre Zähler
   * @param {Array} arr
   */
  setCustomFelder(arr) {
    arr?.forEach?.((el, i) => {
      el?.forEach?.((obj) => {
        if (!this._isObject(obj)) return;
        if (i === 0) {
          this.addFeld(obj);
        } else {
          this.addCounter(obj);
        }
      });
    });
  }

  /**
   * Fügt einen Zähler zu seinem Feld hinzu
   * @param {Object} counter
   */
  addCounter(counter) {
    const thisFeld = this.customFelder[counter.dienstplan_custom_feld_id];
    thisFeld?.createCounter?.(counter, true);
  }

  /**
   * Erstellt ein neues Feld
   * @param {Object} feld
   */
  addFeld(feld) {
    const thisFeld = this.customFelder[feld.id];
    if (thisFeld?.init) {
      thisFeld.init(feld);
    } else {
      this.customFelder[feld.id] = new CustomFeld(feld, this, this?._appModel);
    }
  }

  /**
   * Entfernt ein customFeld
   * @param {Object} feld
   */
  removeFeld(feld) {
    if (this.customFelder[feld.id]) {
      delete this.customFelder[feld.id];
    }
  }

  /**
   * Entfernt alle Felder einer bestimmten Vorlage
   * @param {Array} felder
   * @param {Number} vorlageId
   */
  removeFelder(felder, vorlageId) {
    const callback =
      this?._dienstplanTable?.customFelder?.removeCustomFeld && vorlageId
        ? (feld) => {
            this._dienstplanTable.customFelder.removeCustomFeld(
              feld,
              true,
              vorlageId
            );
          }
        : (feld) => {
            this.removeFeld(feld);
          };

    felder?.forEach?.((id) => {
      let feldId = id;
      if (this._isObject(id)) {
        feldId = id.id;
      }
      const feld = this.customFelder[feldId];
      if (feld) callback(feld);
    });
  }

  /**
   * Setzt den Index der aktuellen Vorlage,
   * sodass bei Wechsel zwischen Ansichten die gleiche Vorlage verwendet wird
   * @param {Number} index
   */
  setStartVorlage(index = 0) {
    this._set('startVorlage', index);
  }

  /**
   * Initialisiert die Vorlagen der Benutzerin
   * @param {Array} vorlagen
   */
  setVorlagen(vorlagen = []) {
    let newVorlagen = [];
    if (this._isArray(vorlagen)) {
      let hasStandard = false;
      // Checkt, ob eine Vorlage als Standard-Vorlage markiert wurde
      newVorlagen = vorlagen.map((vorlage, i) => {
        const thisStandard = vorlage.standard;
        if (thisStandard && !hasStandard) this.setStartVorlage(i);
        if (hasStandard && thisStandard) vorlage.standard = false;
        if (thisStandard) hasStandard = true;
        return new Vorlage(vorlage, this._appModel);
      });
      // Falls es keine Standardvorlage gibt, wird die erste Vorlage als Standardvorlage gesetzt
      if (!hasStandard) this.updateStandardVorlage(newVorlagen?.[0]?.id || 0);
    } else if (vorlagen !== undefined && showConsole) {
      console.log(
        'Error: SetVorlagen(), Argument war kein Array, this.vorlagen = []!',
        vorlagen
      );
    }

    this._set(
      'vorlagen',
      newVorlagen.sort((a, b) => {
        if (a.id < 0 && b.id > 0) return -1;
        if (a.id > 0 && b.id < 0) return 1;
        const score = a.position - b.position;
        if (score !== 0) return score;
        return numericLocaleCompare(a.name, b.name);
      })
    );
  }

  /**
   * Speichert die Settings des Dienstplans in der API
   * @param {Function} callback
   */
  saveDienstplanTableSettings(callback) {
    const { _hains, _farbgruppen, _konflikteFilter, dienstplanTableSettings } =
      this;
    const data = {
      konflikteSettings: _konflikteFilter?.getSettings?.() || {},
      farbgruppenSettings: _farbgruppen?.getSettings?.() || {},
      wuensche: !!dienstplanTableSettings.wuensche,
      only_vorlagedienste: !!dienstplanTableSettings.only_vorlagedienste,
      only_planungszeitraum: !!dienstplanTableSettings.only_planungszeitraum,
      mark_einteilungsstatus: !!dienstplanTableSettings.mark_einteilungsstatus,
      empty_as_regeldienst: !!dienstplanTableSettings.empty_as_regeldienst,
      mitarbeiter_sort: dienstplanTableSettings?.mitarbeiter_sort || 0,
      dienstplan_fontsize: this.fontSizeRounded
    };

    if (!_hains?.api) return;
    _hains.api('save_user_settings', 'post', data).then((response) => {
      if (!this?._mounted) return;
      if (this._isObject(response)) {
        this.setSettings(response);
      } else {
        setPageWarning(
          this?._page,
          'Beim Speichern der Setting ist etwas schief gelaufen!'
        );
      }
      callback();
    }, returnError);
  }

  /**
   * Speichert einen neuen channel
   * @param {Object} channel
   * @param {String} key
   */
  subscribe(channel, key) {
    if (this.channels[key]) {
      this.unsubscribe(key);
    }
    this.channels[key] = channel;
    return this.channels[key];
  }

  /**
   * Entfernt einen Channel
   * @param {String} key
   */
  unsubscribe(key) {
    if (this.channels[key]) {
      const channel = this.channels[key];
      channel.unsubscribe();
      channel.consumer.disconnect();
      delete this.channels[key];
      return true;
    }
    return false;
  }

  /**
   * Entfernt alle Channels
   */
  unsubscribeAll() {
    for (const key in this.channels) {
      this.unsubscribe(key);
    }
    return this.channels;
  }

  /**
   * Liefert den channel mit dem passenden Key
   * @param {String} key
   * @returns channel
   */
  getChannel(key) {
    return this.channels?.[key];
  }

  /**
   * Erstellt die Informationen zu der Nutzerin
   */
  setInfo() {
    this._setPageInfoPopup(this.name, this);
  }

  /**
   * @param {Number} teamId
   * @returns True, wenn die ID in den team_ids enthalten ist
   */
  hasTeamId(teamId = 0) {
    return this.team_ids.includes(teamId);
  }
}

export default User;
