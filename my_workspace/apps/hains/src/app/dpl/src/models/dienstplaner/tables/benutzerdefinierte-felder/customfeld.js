import { returnError } from "../../../../tools/hains";
import { showConsole } from "../../../../tools/flags";
import Basic from "../../../basic";
import Counter from "./counter";
import { setPageWarning } from "../../../../tools/helper";

/**
 * Klasse für Informationen zu benuterdefinierten Spalten und Zeilen.
 * @class
 */
class CustomFeld extends Basic {
  constructor(obj, parent, appModel = false) {
    super(appModel);
    this._set("parent", parent);
    this.init(obj);
    this._setObject("counter", obj.counter);
    this._preventExtension();
    if (showConsole) this._whoAmI();
  }

  get key() {
    // Jedes CustomFeld gehört eindeutig zu einer Vorlage
    return `${this.id}_${this.vorlage_id}`;
  }

  /**
   * Liefert die aktuelle Dienstplan-Tabelle
   */
  get table() {
    return this?._dienstplanTable;
  }

  /**
   * Liefert die customFelder aus dem Dienstplan
   */
  get customFelder() {
    return this.table?.customFelder;
  }

  /**
   * Setzt die Eigenschaft count_all_type
   */
  setCountAllType(index = 0) {
    this._set("count_all_type", index);
  }

  /**
   * Update der Attribute des benutzerdefinierten Feldes
   */
  init({
    id,
    name,
    row,
    index,
    ansicht_id,
    vorlage_id,
    count_all_typ,
    custom_counter_ids
  }) {
    this._setArray("custom_counter_ids", custom_counter_ids);
    this._setInteger("id", id);
    this._setInteger("ansicht_id", ansicht_id);
    this._setInteger("vorlage_id", vorlage_id);
    this._set("row", row);
    this._setInteger("index", index);
    this.setCountAllType(count_all_typ);
    this.setName(name, false);
  }

  /**
   * Erstellt einen neuen Counter
   * @param {Object} response
   * @param {Boolean} fromUser
   * @returns
   */
  createCounter(response, fromUser = false) {
    const counter = new Counter(response, this?._appModel);
    if (fromUser) {
      this.counter[counter.id] = counter;
    } else if (counter?.parent?.counter) {
      counter.parent.counter[counter.id] = counter;
    } else if (showConsole) {
      console.error("Counter konnte nicht erstellt werden", counter?.parent, fromUser);
    }

    return counter;
  }

  /**
   * Iteriert über alle Counter
   * @param {Function} callback
   * @returns Array
   */
  eachCounter(callback = false) {
    const result = [];
    for (const counterId in this.counter) {
      const counter = this.counter[counterId];
      result.push(this._isFunction(callback)
        ? callback(counter, result.length)
        : counter);
    }
    return result;
  }

  /**
   * Liefert die Counter zu einer CustomCounter-Komponente, ansonsten false
   * @param {Object} cell
   */
  getCounter(cell, callback = false) {
    const result = [];
    let i = 0;
    this.eachCounter((counter) => {
      if (counter?.hasCell?.(cell)) {
        result.push(this._isFunction(callback) ? callback(counter, i) : counter);
        i++;
      }
    });
    return result;
  }

  /**
   * Liefert den Text aus den zugehörigen Countern
   * @param {Object} cell
   * @returns Array
   */
  getCounterTxt(cell) {
    const result = [];
    this.getCounter(cell, (counter) => {
      const txt = counter?.countFkt?.(cell)?.txt;
      if (txt) result.push(txt?.join ? txt.join("\n") : txt);
    });
    return result;
  }

  /**
   * Fügt alle Counter außer den Default-Countern in ein Array ein und liefert das Array.
   * Wenn ein Callback definiert wird, wird der Return-Wert des Callbacks in das Array eingefügt.
   * @param {Function} callback
   * @param {Boolean} komp
   * @returns Array mit Countern oder Callback
   */
  getAllCounter(callback = false, komp = true) {
    const result = [];
    let i = 0;
    const get = this._isFunction(callback)
      ? (counter, j) => callback(counter, j)
      : (counter) => counter;
    for (const key in this.counter) {
      const counter = this.counter[key];
      i++;
      const toPush = get(counter, i);
      toPush && result.push(toPush);
    }
    const komplementaerFeld = komp && this.customFelder?.komplementaerFeld;
    if (komplementaerFeld?.getAllCounter) {
      komplementaerFeld.getAllCounter((counter) => {
        i++;
        const toPush = get(counter, i);
        toPush && result.push(toPush);
      }, false);
    }
    return result;
  }

  /**
   * Sendet die Daten an die API und erstellt anhand des Response neue Counter
   * @param {String} pfad
   * @param {Array} data
   * @param {Function} callback
   */
  sendData(pfad = "", data = {}, callback = false, defaultMsg = "Counter konnte nicht verändert werden.") {
    if (this._isObject(data) && this?._hains?.api && this._isFunction(callback)) {
      this._hains.api(pfad, "post", data).then((response) => {
        if (!this?._mounted) return;
        if (showConsole) console.log("data", data, "response", response);
        if (response?.id) callback(response);
        else if (response) {
          if (response?.destroyed) {
            callback(response);
          } else {
            setPageWarning(this?._page, response?.info || defaultMsg);
          }
        }
      }, returnError);
    }
  }

  /**
   * Methode um den Namen für die benutzerdefinierte Zeile/Splate festzulegen
   * @param {String} name
   * @param {Boolean} sendPost
   */
  setName(name = "", sendPost = false) {
    if (sendPost) {
      this.sendData("update_feld", {
        id: this.id,
        name,
        ansicht_id: this.ansicht_id,
        vorlage_id: this.vorlage_id,
        index: this.index
      }, (response) => {
        this._set("name", response?.name);
        this._update();
        if (this.customFelder?.resetInfo) {
          this.customFelder.resetInfo();
        }
      }, "Feld konnte nicht aktualisiert werden!");
    } else {
      this._set("name", name);
      this._update();
    }
  }

  /**
   * Führt ein Update auf die referenzierenden Counter durch, falls es welche gibt
   * @param {Object} response
   */
  updateReferencingCounters(response) {
    const user = this._user;
    if (user?.getFeld) {
      response?.referencing_counters?.forEach?.((c) => {
        const feld = user.getFeld(c.dienstplan_custom_feld_id);
        if (feld?.createCounter && feld._update) {
          feld._update();
        }
      });
    }
  }

  /**
   * Aktualisiert das zum Counter gehörende CustomFeld
   * @param {Object} response
   */
  updateCounterParent(response, id) {
    const parent = response?.parent?.[0];
    const parentFeld = parent?.id && this?._user?.getFeld ?.(parent.id);
    if (parentFeld?.init && parentFeld._update) {
      if (parentFeld?.counter?.[id]) {
        delete parentFeld.counter[id];
      }
      parentFeld.init(parent);
      parentFeld._update();
    }
  }

  /**
   * Funktion, um einen Counter zu speichern
   */
  save(thisCounter = false, callback = false) {
    const call = (bool) => {
      if (this._isFunction(callback)) callback(bool);
    };
    if (!thisCounter) return call(false);
    const noNameError = thisCounter.name === "";

    if (noNameError) {
      let msg = "";
      if (!thisCounter) msg += "Ungültige Auswahl!\n";
      if (noNameError) msg += "Der Name für den Zähler ist ungültig!\n";
      setPageWarning(this?._page, msg);
      return call(false);
    }

    this.sendData("update_counter", thisCounter._me, (response) => {
      if (this._isObject(response?.dienstplan_custom_feld)) {
        this.init(response.dienstplan_custom_feld);
        this.createCounter(response, false);
        call(true);
        this._update();
      }
      this.updateColumns();
    });
  }

  /**
   * Funktion um einen Counter zu löschen.
   * Soll die Summen-Counter durchsuchen
   * und den gelöschten Counter aus seinen Zeilen/Spalten entfernen
   * @param {Object} thisCounter
   */
  remove(thisCounter = false, callback = false) {
    const call = (bool) => {
      if (this._isFunction(callback)) callback(bool);
    };
    if (!thisCounter) return call(false);
    this.sendData(
      "destroy_counter",
      { id: thisCounter.id },
      (response) => {
        this.updateReferencingCounters(response);
        this.updateCounterParent(response, thisCounter.id);
        call(true);
        this._update();
        this.updateColumns();
      }
    );
  }

  /**
   * Spalten der Tabelle aktualisieren
   */
  updateColumns() {
    this.table?.updateColumns && this.table.updateColumns();
  }
}

export default CustomFeld;
