import { preventDefault } from "../../styles/basic";
import { showConsole, showTime } from "../../tools/flags";
import { autoEinteilen } from "../../tools/helper";
import Mitarbeiter from "../apimodels/mitarbeiter";
import Wunsch from "../apimodels/wunsch";
import Basic from "../basic";
import DienstplanerChannel from "../dienstplaner/channel";
import DienstplanerData from "../dienstplaner/dienstplanerdata";
import DienstplanEinteilungenHistory from "../dienstplaner/einteilungenhistory";
import DienstplanEinteilungsstatusAuswahl from "../dienstplaner/einteilungsstatus-auswahl";
import Farbgruppen from "../dienstplaner/farbgruppen/farbgruppen";
import KonflikteFilter from "../dienstplaner/konfliktefilter/konfliktefilter";
import Screenshot from "../dienstplaner/screenshot/screenshot";
import Statistik from "../dienstplaner/statistiken/statistik";
import DateDienstTable from "../dienstplaner/tables/datedienst";
import MitarbeiterDateTable from "../dienstplaner/tables/mitarbeiterdate";
import MitarbeiterDienstTable from "../dienstplaner/tables/mitarbeiterdienst";

/**
 * Der Dienstplan liefert alle Dienstplanbezogenene Funktionen
 * @class
 */
class Dienstplan extends Basic {
  constructor(data, state, appModel = false) {
    super(appModel);
    this._setArray("tableSortings", [
      "Alphabetisch", 
      "Funktion",
      "Rotation", 
      "Funktion, Rotation", 
      "Rotation, Funktion"
    ].map((name, i) => ({ 
      id: i, 
      name, 
      index: i, 
      fkt: () => {
        if(i === this?._user?.dienstplanTableSettings?.mitarbeiter_sort) return;
        this._user?.setMitarbeiterSort?.(i);
        if(!this._isArray(this.tables)) {
          this.setTables();
        } else {
          this.tables[1] = false;
          this.tables[2] = false;
        }
        this._update();
        this.updateTable();
      }
    })));
    this.reset();
    this.init(data, state);
    this._preventExtension();
    if (showConsole) this._whoAmI();
  }

  /**
   * Liefert die Id des Dienstplans
   */
  get id() {
    return this?._id || 0;
  }

  /**
   * Liefert die aktuelle Tabelle
   */
  get table() {
    return this.getTable(this.ansichtenStart);
  }

  /**
   * Liefert alle Vorlagen des Dientsplans
   */
  get vorlagen() {
    const user = this?._user;
    let newArr = [];
    const {
      _defaultVorlagen
    } = this;
    if (this._isObject(user)) {
      const {
        vorlagen
      } = user;
      if (vorlagen?.forEach) {
        vorlagen.forEach((vorlage) => vorlage?.setTitle(true));
        newArr = newArr.concat(vorlagen);
      }
      if (_defaultVorlagen?.forEach) {
        _defaultVorlagen.forEach((vorlage) => vorlage?.setTitle(true));
        newArr = newArr.concat(_defaultVorlagen);
      }
    }
    return newArr;
  }

  /**
   * Liefert die Namen der Default-Vorlagen
   */
  get defaultVorlagenNamen() {
    return this?._defaultVorlagen?.map
      ? this._defaultVorlagen.map((vorlage) => vorlage.name).join(", ")
      : "";
  }

  /**
   * Liefert ein Array mit den Dienstplan-Pfaden
   */
  get dienstplanpfade() {
    const pfade = [];
    this?._dienstplanpfade?._each?.((el) => {
      pfade.push({
        id: el.id,
        index: pfade.length,
        name: el.path
      });
      return false;
    });

    return pfade;
  }

  /**
   * Liefert den Kalendar aus dem Dienstplaner
   */
  get calendar() {
    return this?.state?.calendar || false;
  }

  /**
   * Liefert die Ansichten aus den APP-Daten
   */
  get ansichten() {
    return this?._appData?.monatsplan_ansichten?.map?.((name, index) => ({
      id: name,
      index,
      fkt: () => {
        this.setAnsichtenStart(index);
        this._update();
        this.updateTable();
      }
    })) || [];
  }

  get dienstkategorien() {
    return this?._dienstkategorien?._each?.()?.arr || [];
  }

  get filteredMitarbeiter() {
    const result = [];
    this?._aktiveMitarbeiter?.forEach((m) => {
      if(this?._dienstplanTable?.filterCheck?.(true, false, false, m)) {
        result.push(m);
      }
    });
    return result;
  }

  get orderedMitarbeiter() {
    let mitarbeiter = this._mitarbeiter._each?.()?.arr || [];
    const tag = this._anfang?.str || "";
    switch(this?._user?.dienstplanTableSettings?.mitarbeiter_sort) {
      case 1:
        mitarbeiter = Mitarbeiter.sortByFunction(mitarbeiter);
        break;
      case 2:
        mitarbeiter = Mitarbeiter.sortByRotation(mitarbeiter, tag);
        break;
      case 3:
        mitarbeiter = Mitarbeiter.sortByFunctionAndRotation(mitarbeiter, tag);
        break;
      case 4:
        mitarbeiter = Mitarbeiter.sortByRotationAndFunction(mitarbeiter, tag);
        break;
      default:
        mitarbeiter = Mitarbeiter.sortAlphabetically(mitarbeiter);
        break;
    }
    return mitarbeiter;
  }

  undo() {
    this._appModel?.undo?.((data) => {
      const feldCopy = data.feld;
      const date = this?._dates?.[feldCopy.tag];
      console.log("undo", data, feldCopy.po_dienst_id, feldCopy.bereich_id, date?.label);
      const byDienstBereich = date?.getBereich?.(feldCopy.po_dienst_id, feldCopy.bereich_id);
      console.log("undo", byDienstBereich, date);
      byDienstBereich?.felder?.find?.((feld) => {
        if(feld.counter === feldCopy.counter) {
          console.log("undo", feld, feldCopy);
          return true;
        }
        return false;
      });
    });
  }

  updateWunsch(data) {
    const wunsch = new Wunsch(data, this._appModel);
    const date = wunsch?.date;
    if(data?.remove_wunsch) {
      date?.removeWunsch?.(wunsch);
    } else {
      date?.addWunsch?.(wunsch);
    }
    wunsch?.mitarbeiter?._update?.();
    this.updateEinteilungsstatusAuswahl();
    this.updateColor();
  } 

  wunschRequestCallback = (data) => {
    if(data?.error) return;
    if(this._isObject(data) && data?.id) {
      this.updateWunsch(data);
      this._appModel?.updateAllCachedDienstplaeneThroughChannel?.({
        wunsch: data,
        remove_wunsch: data?.remove_wunsch
      });
    }
  };

  updateEinteilungsstatusAuswahl() {
    this.einteilungsstatusAuswahl?._update?.();
    this.update("actions", {});
  }

  /**
   * Für das Update der Farbe, der Einteilungen (Dienste)
   */
  updateColor() {
    this.update("colorUpdate", {});
  }

  /**
   * Setzt das Attribut tableSearchHighlight
   * @param {Boolean} bool
   */
  setTableSearchHighlight(bool = false) {
    this._set("tableSearchHighlight", !!bool);
  }

  /**
   * Setzt das warning-Attribut
   * @param {String} warning
   */
  setWarning(warning = "") {
    this._set("warning", typeof warning === "string" ? warning : "");
    this.update("warning", {});
  }

  /**
   * Erzeugt ein Array, in dem die Tabellen gespeichert werden können
   */
  setTables() {
    this._setArray("tables", [false, false, false]);
  }

  toggleTableSearchHighlight = () => {
    this.setTableSearchHighlight(!this.tableSearchHighlight);
    this._update();
    this?.table?.updateSearch?.(true);
  }

  /**
   * Liefert die Tabelle aus Tables oder erstellt eine neue Tabelle
   * @param {Number} index
   * @returns table
   */
  getTable(index = 0) {
    const i = [0, 1, 2].includes(index) ? index : 1;
    if (!this.tables[i]) {
      const name = "dienstplan-table";
      switch (i) {
        case 0:
          this.tables[i] = new DateDienstTable(name, this._appModel);
          break;
        case 1:
          this.tables[i] = new MitarbeiterDateTable(name, this._appModel);
          break;
        case 2:
          this.tables[i] = new MitarbeiterDienstTable(name, this._appModel);
          break;
      }
    }
    return this.tables[i];
  }

  /**
   * Der Index der aktuellen Tabelle
   * @param {Number} index
   * @param {Boolean} update
   */
  setAnsichtenStart(index = 0) {
    this._set("ansichtenStart", index);
  }

  /**
   * Aktuelle Tabelle updaten
   */
  updateTable() {
    this.updateEinteilungsstatusAuswahl();
    this?.table?.changedVorlage?.();
  }

  /**
   * Setzt das Attribut statistic
   * @param {Object} statistic
   */
  setStatistic(statistic = false) {
    this._set("statistic", statistic);
  }

  /**
   * Initialisiert die Screenshot-Seite
   */
  setScreenshot(screenshot = false) {
    this._set("screenshot", screenshot);
  }

  /**
   * Setzt das Attribut data
   * @param {Object} data
   */
  setData(data = {}) {
    this._set("data", data);
  }

  /**
   * Setzt das Attribut refresh
   * @param {Boolean} refresh
   */
  setRefresh(refresh = false) {
    this._set("refresh", !!refresh);
  }

  /**
   * Setzt das Attribut ignoreCache
   * @param {Boolean} ignore
   */
  setIgnoreCache(ignore = false) {
    this._set("ignoreCache", !!ignore);
  }

  /**
   * Setzt das Attribut state
   * @param {Object} state
   */
  setState(state = {}) {
    this._set("state", state);
  }

  /**
   * Setzt das Attribut channel
   * @param {Object} channel
   */
  setChannel(channel = false) {
    this._set("channel", channel);
  }

  /**
   * Setzt das Attribut einteilungenHistory
   * @param {Object} history
   */
  setEinteilungenHistory(history = false) {
    this._set("einteilungenHistory", history);
  }

  /**
   * Setzt das Attribut vorlage und ersetzt die StartAnsicht ggf. mit der Ansicht aus der Vorlage.
   * Vorlagen sollen beim Monatswechsel nicht aktualisiert werden
   * Dafür wird die ID der letzten Vorlage im Kalender gespeichert
   * @param {Object} vorlage
   * @param {Boolean} updateAnsicht
   */
  setVorlage(vorlage = false, updateAnsicht = false) {
    this._set("vorlage", vorlage);
    this.setAnsichtenStart(this.ansichtenStart || 0);
    if (vorlage) {
      const lastVorlageId = this.calendar?.getFromState?.("lastVorlageId");
      
      const vorlageToGet = !this._isObject(vorlage) && lastVorlageId 
        ? { id: lastVorlageId } : vorlage;
      const v = this.getVorlageAndSetStartVorlage(vorlageToGet);
      this._set("vorlage", v);
      // updateAnsicht && this.setAnsichtenStart(v?.ansicht_id || 0);
      this.setAnsichtenStart(v?.ansicht_id || 0);
      this._update();
      this.updateTable();
      if(this.vorlage) {
        this.calendar?.addToState?.("lastVorlageId", this.vorlage.id);
      }
    }
    return this.vorlage;
  }

  /**
   * Index der gewählten Vorlage
   * @param {Number} start
   */
  setStartVorlage(start = 0) {
    this._set("startVorlage", start);
  }

  /**
   * Setzt das Attribut farbgruppen
   * @param {Object} farbgruppen
   */
  setFarbgruppen(farbgruppen = {}) {
    this._set("farbgruppen", farbgruppen);
  }

  /**
   * Setzt das Attribut konflikteFilter
   * @param {Object} konflikteFilter
   */
  setKonflikteFilter(filter = false) {
    this._set("konflikteFilter", filter);
  }

  /**
   * Setzt das Attribut einteilungsstatusAuswahl
   * @param {Object} p 
   */
  setEinteilungsstatusAuswahl(p = false) {
    this._set('einteilungsstatusAuswahl', p);
  }

  /**
   * Setzt alle Attribute des Dienstplans zurück
   * @param {Boolean} resetCounter
   */
  reset() {
    this.setEinteilungsstatusAuswahl();
    this.setWarning();
    this.setRefresh();
    this.setIgnoreCache();
    this.setStatistic();
    this.setData();
    this.setState();
    this.setChannel();
    this.setTableSearchHighlight();
    this.setScreenshot();
    this.setEinteilungenHistory();
    this.setKonflikteFilter();
    this.setFarbgruppen();
    this.setTables();
    this.setAnsichtenStart(0);
    this.setVorlage(false, false);
    this.setStartVorlage();
    this._update();
  }

  /**
   * Initialisiert den Dienstplan
   * @param {Object} data
   * @param {Object} otherProps
   */
  init(data = false, otherProps = false) {
    showTime && console.time("init dpl");
    if (!data && !otherProps) this.reset();
    if (otherProps) this.setState(otherProps);
    if (data) {
      showTime && console.time("create Data");
      this?._appModel?.addDienstplan?.(data);
      this.setData(new DienstplanerData(data, this._appModel));
      showTime && console.timeEnd("create Data");
      this.setKonflikteFilter(new KonflikteFilter(this._appModel));
      this.setChannel(new DienstplanerChannel(this, this._appModel));
      this.setScreenshot(new Screenshot(this._appModel));
      this.setEinteilungenHistory(new DienstplanEinteilungenHistory(this._appModel));
      this.setEinteilungsstatusAuswahl(new DienstplanEinteilungsstatusAuswahl(this._appModel));
    }
    showTime && console.timeEnd("init dpl");
  }

  /**
   * Updaten der Daten des Dienstplans
   */
  updateMe() {
    showTime && console.time("update dpl");
    showTime && console.time("update data");
    this.data.updateMe();
    showTime && console.timeEnd("update data");
    this.setVorlage(true, true);
    this.setFarbgruppen(new Farbgruppen(this._appModel));
    this.setStatistic(new Statistik(this._appModel));
    this.einteilungsstatusAuswahl.initEinteilungsstatuse();
    this.einteilungsstatusAuswahl.setDienstplaene([{
      id: this.data.id,
      plantime_anfang: this.data.anfang
    }]);
    showTime && console.timeEnd("update dpl");
  }

  /**
   * Gibt den Index einer bestimmte Vorlage zurück oder den Index der StandardVorlage
   * @param {Object} vorlage
   * @returns Number
   */
  getVorlageIndex(vorlage) {
    let index = 0;
    let i = -1;
    if (this._isObject(vorlage)) {
      i = this.vorlagen.findIndex((v) => v.id === vorlage.id);
    } else {
      i= this.vorlagen.findIndex((v) => v.standard);
    }
    if(i >= 0) index = i;
    return index;
  }

  /**
   * Gibt eine bestimmte Vorlage oder die erste Default/Standard-Vorlage zurück
   * @param {Object} vorlage
   * @returns vorlage
   */
  getVorlageAndSetStartVorlage(vorlage = false) {
    const index = this.getVorlageIndex(vorlage);
    let v = this.vorlagen[0];
    if (this.vorlagen[index]) {
      v = this.vorlagen[index];
    }
    this.setStartVorlage(v ? index : 0);
    return v || false;
  }

  /**
   * Testet auf Vorlagen mit dem gleichen Namen
   * @param {String} name
   * @param {Number} id
   */
  checkVorlagenNamen(name = "", id = 0) {
    const vergeben = this?.vorlagen?.find?.((vorlage) => (Number.isNaN(vorlage.id)
      ? vorlage.name.toLowerCase() === name.toLowerCase()
      : vorlage.name === name && vorlage.id !== id
    ));
    return !!vergeben;
  }

  /**
   * Liefert den Namen der aktuellen Ansicht
   * @param {Number} index
   * @returns string
   */
  getAnsichtName(index) {
    return this?.ansichten?.[index]?.id || "";
  }

  /**
   * Gibt den Index des Teams mit der entsprechenden Id zurück
   * @param {Number} id
   * @returns index
   */
  getTeamIndex(id) {
    let index = 0;
    if (this?._teams?.[id]) {
      const obj = this?._teamFilter?.find?.((item) => item.id === parseInt(id, 10));
      if (obj) {
        index = obj.index;
      }
    }

    return index;
  }

  /**
   * Handler für die Tastatursteuerung
   * @param {Object} evt
   */
  handleKeyDown(evt) {
    evt.stopPropagation();
    const keyCode = evt.key;
    if (this.dienstplanKeyCode(keyCode)) {
      const tagName = evt.target.tagName;
      const type = evt.target.getAttribute("type");
      const hasPreventDefault = evt.target.className.includes(preventDefault);
      const textInput = type === "text" || !type;
      const input = (tagName === "INPUT" && textInput) || tagName === "TEXTAREA";
      if (input && !hasPreventDefault) return;
      evt.preventDefault();
      this.throttledNextField(keyCode, false);
    }
  }

  /**
   * @param {Number} keyCode
   * @returns True, wenn der KeyCode von der Tabelle genutzt wird
   */
  dienstplanKeyCode(keyCode) {
    return !!this?.table?.usesKeyCode?.(keyCode);
  }

  /**
   * Sucht das nächste Feld in der Tabelle
   * @param {Number} keyCode
   * @param {Object} feld
   */
  throttledNextField(keyCode, feld = false) {
    this?.table?.throttledNextField?.(keyCode, feld);
  }

  /**
   * Liefert den Index des Dienstplanpfades
   * @param {Number} pfadId
   * @returns number
   */
  getStartDienstplanPfad(pfadId = 0) {
    let start = 0;
    const checkId = pfadId?.toString?.() || "0";
    this?._dienstplanpfade?._each?.((el, id, i) => {
      if (el.id.toString() === checkId) {
        start = i;
        return true;
      }
      return false;
    });

    return start;
  }

  /**
   * Iteriert über die Dienste und testet, ob diese im Team sind
   * und führt einen Callback aus
   * @param {Number} teamId
   * @param {Boolean} isTeam
   * @param {Function} callback
   */
  eachTeamDienst(teamId, isTeam, callback) {
    const team = this?._teams?.[teamId];
    if (this._isFunction(callback) && this._dienste._each) {
      this._dienste._each((dienst) => {
        if (team) {
          const isInTeam = team.hasDienst(dienst.id);
          if ((isTeam && !isInTeam) || (!isTeam && isInTeam)) return false;
          if (!isTeam) callback(dienst);
        }
        if (isTeam) callback(dienst);
      });
    }
  }

  /**
   * Iteriert über die Funktionen und führt einen Callback aus
   * @param {Function} callback
   */
  eachFunktion(callback) {
    if (this._isFunction(callback)) {
      this?._funktionen?._each?.((f) => {
        callback(f);
      });
    }
  }

  /**
   * Iteriert über die Dienste und führt einen Callback aus
   * @param {Function} callback
   */
  eachDienst(callback) {
    if (this._isFunction(callback)) {
      this?._dienste?._each?.((dienst) => {
        callback(dienst);
      });
    }
  }

  /**
   * Erstellt die Infos zu einem Element
   * @param {String} title
   * @param {Object} el
   */
  setInfoPopUp(title = "", el = false) {
    this?.table?.setInfoPopUp?.(title, el);
  }

  /**
   * Führt automatische Einteilungen in der API durch
   * @param {Function} setLoading 
   */
  autoEinteilen(setLoading) {
    const l = this?._dates?._length || 0;
    if(l > 2) {
      let start = null;
      let ende = null;
      this?._dates?._each?.((date, id, i) => {
        if(date?.isInMainZeitraum && !start) start = id;
        if(start && date?.isInMainZeitraum) ende = id;
      });
      if(start && ende) autoEinteilen(start, ende,  setLoading);
    }
  }
}

export default Dienstplan;
