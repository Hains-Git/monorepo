import { deepClone, hainsOAuth } from '../tools/helper';
import Dienstplan from './pages/dienstplan';
import Rotationsplan from './pages/rotationsplan.model';
import Tagesverteiler from './pages/tagesverteiler';
import Wochenverteiler from './pages/wochenverteiler';
import Urlaubsantraege from './pages/urlaubsantraege';
import Urlaubsliste from './pages/urlaubsliste';
import AppData from './apimodels/appdata';
import Konflikte from './helper/konflikte';
import Statistiken from './helper/statistiken';
import Feld from './helper/feld';
import Scores from './helper/scores';
import { showConsole } from '../tools/flags';
import AppChannel from './channel';
import { toDate } from '../tools/dates';
import InfoTab from './helper/info-tab';

/**
 * Das AppModel ist ein Singleton und enthält alle Daten und Funktionen der App.
 * Diese Klasse ist für die meisten Komponenten erreichbar und mit ihr werden
 * jegliche seitenbezogene Funktionen der App realisiert.
 * @class
 */
class AppModel extends InfoTab {
  constructor() {
    super();
    if (!AppModel._instance) {
      AppModel._instance = this;
      this._setAppModel_(this);
      this._set('hains', hainsOAuth);
      this._set('konflikte', new Konflikte());
      this._set('statistiken', new Statistiken());
      this._set('scores', new Scores());
      this._set('channel', new AppChannel(this));
      this.reset(true);
      this.setMounted();
      this._preventExtension();
      if (showConsole) this._whoAmI();
    }
  }

  /**
   * Liefert true, wenn channel online ist
   */
  get isChannelOnline() {
    return !!this?.channel?.online;
  }

  setUndo() {
    this._set('undoStack', []);
  }

  undo(callback) {
    if(this.undoStack?.length) {
      const data = this.undoStack.pop();
      callback(data);
    }
  }

  /**
   * Setzt das online Attribut des Channels auf true
   */
  online() {
    this?.channel?.setOnline?.(true);
  }

  /**
   * Setzt das online Attribut des Channels auf false
   */
  offline() {
    this?.channel?.setOnline?.(false);
  }

  /**
   * Empfängt Daten aus dem Channel und führt entsprechende Funktionen aus
   * @param {any} data
   */
  receive(data = false) {
    this?.channel?.receive?.(data);
  }

  /**
   * Setzt das mounted-Flag
   * @param {Boolean} mounted
   */
  setMounted(mounted = false) {
    this._set('mounted', mounted);
  }

  /**
   * Setzt mounted true
   */
  mount(user = false) {
    this.setMounted(true);
    this.setUser(user);
  }

  setPageName(name = '') {
    this._set('pageName', name);
  }

  /**
   * Setzt mounted false
   */
  unmount() {
    this.setMounted(false);
  }

  /**
   * Leert den Dienstpläne Cache
   */
  resetDienstplaene() {
    this._setObject('dienstplaene', {});
  }

  /**
   * @param {String} anfang
   * @returns Dienstplan, wenn einer existiert
   */
  getDienstplan(anfang) {
    return this.dienstplaene[anfang]?.plan;
  }

  /**
   * Speichert einen Dienstplan in der Liste der Dienstpläne
   * @param {Object} dienstplan
   */
  addDienstplan(dienstplan) {
    if (this._isObject(dienstplan) && dienstplan?.plantime_anfang) {
      const oldPlan = this.getDienstplan(dienstplan.plantime_anfang);
      if (oldPlan) {
        this.dienstplaene[dienstplan.plantime_anfang].plan =
          deepClone(dienstplan);
      } else {
        this.dienstplaene[dienstplan.plantime_anfang] = {
          plan: deepClone(dienstplan),
          added: Date.now()
        };
      }
    }
  }

  /**
   * Führt ein update einer Einteilung des gecashten Dienstplans durch
   * @param {Object} einteilung
   * @param {Object} dienstplan
   */
  updateDienstplanEinteilung(einteilung, dienstplan) {
    const einteilungsStatus =
      this?._einteilungsstatuse?.[einteilung?.einteilungsstatus_id];
    // Counts und Vorschläge im Cache speichern, ansonsten entfernen
    if (
      einteilungsStatus?.counts ||
      (einteilungsStatus?.vorschlag &&
        parseInt(dienstplan?.id, 10) ===
          parseInt(einteilung?.dienstplan_id, 10))
    ) {
      dienstplan.einteilungen[einteilung.id] = deepClone(einteilung);
    } else if (dienstplan?.einteilungen?.[einteilung?.id]) {
      delete dienstplan.einteilungen[einteilung.id];
    }
  }

  /**
   * Führt ein Update einer gecachten Dienstplan-Einteilung durch
   * @param {Object} einteilung
   */
  updateCachedDienstplaeneEinteilung(einteilung) {
    try {
      const date = einteilung?.tag && toDate(einteilung.tag);
      if (!(einteilung?.id && date)) return;
      for (const anfang in this.dienstplaene) {
        const dienstplan = this.getDienstplan(anfang);
        const anfangFrame =
          dienstplan?.anfang_frame && toDate(dienstplan.anfang_frame);
        const endeFrame =
          dienstplan?.ende_frame && toDate(dienstplan.ende_frame);
        if (!(this._isObject(dienstplan) && anfangFrame && endeFrame)) continue;
        // Nur Einteilungen aus dem Dienstplan-Frame bearbeiten
        if (!(date >= anfangFrame && date <= endeFrame)) continue;
        this.updateDienstplanEinteilung(einteilung, dienstplan);
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Führt ein update aller gecashten Dienstpläne durch
   * @param {Object} data
   */
  updateAllCachedDienstplaeneThroughChannel(data) {
    for (const anfang in this.dienstplaene) {
      this.updateCachedDienstplanThroughChannel(anfang, data);
    }
  }

  /**
   * Führt ein Update der Rotationen des gecashten Dienstplans durch
   * @param {Object} dienstplan
   * @param {Object} data
   */
  updateDienstplanRotation(dienstplan, data) {
    // Alte Rotationen entfernen und neue ggf. hinzufügen
    if (data?.rotation?.id) {
      if (dienstplan?.rotationen?.[data.rotation.id]) {
        delete dienstplan.rotationen[data.rotation.id];
      }
      if (data?.addRotation) {
        dienstplan.rotationen[data.rotation.id] = deepClone(data.rotation);
      }
    }
  }

  /**
   * Führt ein Update der Einteilungen des gecashten Dienstplans durch
   * @param {Object} dienstplan
   * @param {Objetc} data
   */
  updateDienstplanEinteilungen(dienstplan, data) {
    if (!this._isObject(data?.einteilungen)) return;
    try {
      const anfangFrame =
        dienstplan?.anfang_frame && toDate(dienstplan.anfang_frame);
      const endeFrame = dienstplan?.ende_frame && toDate(dienstplan.ende_frame);
      if (!(anfangFrame && endeFrame)) return;
      const structuredEinteilungen = {};
        Object.values(dienstplan?.einteilungen || {})?.forEach?.((e) => {
        const key = `${e.bereich_id || 0}_${e.tag}_${e.po_dienst_id}`;
        if (structuredEinteilungen[key]) {
          structuredEinteilungen[key].push(e);
        } else {
          structuredEinteilungen[key] = [e];
        }
      });
      for (const key in data.einteilungen) {
        const [bereich_id, tag, po_dienst_id] = key.split('_');
        const date = tag && toDate(tag);
        if (!(date && date >= anfangFrame && date <= endeFrame)) continue;
        const einteilungen = data.einteilungen[key];
        // Alle alten Einteilungen für den Bereich entfernen
        structuredEinteilungen?.[key]?.forEach?.((e) => {
          if (dienstplan?.einteilungen?.[e.id]) {
            delete dienstplan.einteilungen[e.id];
          }
        });
        einteilungen?.forEach?.((e) => {
          this.updateDienstplanEinteilung(e, dienstplan);
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  updateDienstplanWunsch(data, dienstplan) {
    const wunsch = data?.wunsch;
    if(!this._isObject(wunsch)) return;
    dienstplan.wunsche = dienstplan.wunsche || {};
    const date = dienstplan?.dates?.[wunsch?.tag];
    const byMitarbeiter = date?.by_mitarbeiter?.[wunsch?.mitarbeiter_id];
    const diensteIds = this?._dienstkategorien?.[wunsch?.dienstkategorie_id]?.dienste_ids;
    if (data?.remove_wunsch) {
      if(dienstplan?.wunsche?.[wunsch.id]) {
        delete dienstplan.wuensche[wunsch.id];
      }
      if(this._isObject(byMitarbeiter)) {
        byMitarbeiter.wunsch_id = 0;
      }
      diensteIds?.forEach?.((dienstId) => {
        const wunschIds = date?.by_dienst?.[dienstId]?.wunsch_ids;
        const i = this._isArray(wunschIds) ? wunschIds.indexOf(wunsch.id) : -1;
        if(i >= 0) wunschIds.splice(i, 1);
      });
    } else {
      dienstplan.wuensche[wunsch.id] = deepClone(wunsch);
      if(this._isObject(byMitarbeiter)) {
        byMitarbeiter.wunsch_id = wunsch.id
      }
      diensteIds?.forEach?.((dienstId) => {
        const wunschIds = date?.by_dienst?.[dienstId]?.wunsch_ids;
        if(this._isArray(wunschIds) && !wunschIds.includes(wunsch.id)) {
          wunschIds.push(wunsch.id);
        }
      });
    }
  }

  /**
   * Führt ein Update des gecachten Dienstplans durch
   * @param {String} anfang
   * @param {Object} data
   */
  updateCachedDienstplanThroughChannel(anfang, data) {
    const dienstplan = this.getDienstplan(anfang);
    if (!this._isObject(dienstplan)) return;
    this.updateDienstplanRotation(dienstplan, data);
    this.updateDienstplanEinteilungen(dienstplan, data);
    this.updateDienstplanWunsch(data, dienstplan);
  }

  /**
   * Setzt die Eigenschaften des AppModells zurück
   * @param {Boolean} resetAll
   */
  reset(resetAll = false) {
    if (resetAll) {
      this.setUser();
      this.setData();
      this.resetDienstplaene();
    }
    this.setPage();
    this.setToolTip();
    this.setUndo();
    this.setPageName();
    if (showConsole) this._whoAmI();
  }

  /**
   * Fügt Daten hinzu
   * @param {Object} data
   */
  setData(data = false) {
    this._set('data', data);
  }

  /**
   * Fügt eine Benutzerin hinzu
   * @param {Object} user
   */
  setUser(user = false) {
    this._set('user', user);
  }

  /**
   * Fügt die Daten der aktuellen Seite hinzu
   * @param {Object} page
   */
  setPage(page = false) {
    this._set('page', page);
  }

  /**
   * Zeigt ein Tooltip an oder versteckt es
   * @param {Object} tooltip
   */
  setToolTip(tooltip = false) {
    this._set('tooltip', tooltip);
    this._update();
  }

  /**
   * Initialisiert die Daten des AppModells
   * @param {Object} obj
   */
  init({ data = false, pageName = '', pageData = false, state = false } = {}) {
    this.reset(false);
    // Übergibt die seitenübergreifenden Daten
    if (data) {
      if (showConsole) console.log(data);
      this.setData(new AppData(data, this));
      this.data?.updateMe?.();
    }
    // Initialisiert die Seite
    if (pageData) {
      if (showConsole) console.log('init', pageData, pageName, state);
      this.setPageName(pageName);
      Feld.resetCounter();
      switch (pageName) {
        case 'dienstplaner':
          this.setPage(new Dienstplan(pageData, state, this));
          this?.page?.updateMe?.();
          break;
        case 'rotationsplan': {
          this.setPage(new Rotationsplan(pageData, state, this));
          this?.page?.updateMe?.();
          break;
        }
        case 'tagesverteiler': {
          this.setPage(new Tagesverteiler(pageData, state, this));
          break;
        }
        case 'wochenverteiler': {
          this.setPage(new Wochenverteiler(pageData, state, this));
          break;
        }
        case 'urlaubsantraege': {
          this.setPage(new Urlaubsantraege(pageData, state, this));
          break;
        }
        case 'urlaubsliste': {
          this.setPage(new Urlaubsliste(pageData, state, this));
          this?.page?.updateMe?.();
          break;
        }
        default:
          this.setPage();
      }
      this.channel?.receivePageChannel?.();
    }
  }

  addToUndo(data) {
    this.undoStack.push(data);
    console.log('addToUndo', this.undoStack.length, data);
    if(this.undoStack.length > 10) this.undoStack.shift();
  }
}

// Es wird eine Instanz erstellt, da wir mit einem Singleton arbeiten
const instance = new AppModel();

/**
 * Gibt die Instanz des AppModells zurück
 * @returns appModel
 */
const initAppModel = () => instance;

export default initAppModel;
