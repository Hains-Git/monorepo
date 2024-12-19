import { createRelativeDateId } from "../../../../tools/dates";
import { throttle, wait } from "../../../../tools/debounce";
import { showConsole } from "../../../../tools/flags";
import { returnError } from "../../../../tools/hains";
import { setPageWarning } from "../../../../tools/helper";
import InfoTab from "../../../helper/info-tab";
import Counter from "./counter";
import CustomFeld from "./customfeld";

class CustomFelder extends InfoTab {
  constructor(table, appModel = false) {
    super(appModel);
    this._set("table", table);
    this._setInteger("CUSTOM_ROWS_LIMIT", 25);
    this._setInteger("CUSTOM_COLUMNS_LIMIT", 25);
    this._setObject("vorlagen", {});
    this.setCurrentFeld();
    this._preventExtension();
    this.init();
    if (showConsole) this._whoAmI();
  }

  /**
   * True, wenn die angeklickte Zelle ein Counter-Title ist
   */
  get isHeadCell() {
    const notHead = this?.cell?.mitarbeiter || this?.cell?.dienst || this?.cell?.date;
    return !notHead;
  }

  /**
   * Liefert die Cell-Id für den neuen Counter
   */
  get newCellId() {
    return [
      this?.cell?.mitarbeiterId || 0,
      this?.cell?.dienstId || 0,
      createRelativeDateId(this?.cell?.dateId || "", this?._anfang?.str || ""),
      this.getKomplementaerFeld(this.feld, this.rowIndex, this.colIndex)?.id || 0
    ].join("_");
  }

  /**
   * Liefert das komplementäre Feld zum aktuellen Feld
   */
  get komplementaerFeld() {
    return this.getKomplementaerFeld(this.feld, this.rowIndex, this.colIndex);
  }

  /**
   * Ausgewähltes Feld
   * @param {Object} feld
   * @param {Object} cell
   * @param {Number} rowIndex
   * @param {Number} colIndex
   */
  setCurrentFeld(feld = false, cell = false, rowIndex = 0, colIndex = 0) {
    this._set("feld", feld);
    this._set("cell", cell);
    this._set("rowIndex", rowIndex);
    this._set("colIndex", colIndex);
  }

  /**
   * Liefert den Title zu einem bestimmten Feld und seinem Komplementärfeld
   * @param {Object} feld
   * @param {Object} cell
   * @param {Number} rowIndex
   * @param {Number} colIndex
   * @returns String
   */
  getTitle(feld, cell, rowIndex, colIndex) {
    if (!feld) return "";
    const cellLabel = cell?.date?.label || cell?.dienst?.planname || cell?.mitarbeiter?.planname || "";
    const kompFeldName = cellLabel || this.getKomplementaerFeldName(feld, rowIndex, colIndex);
    let title = feld?.name || "";
    if (kompFeldName) {
      if (feld?.row) {
        title = `${title}, ${kompFeldName}`;
      } else {
        title = `${kompFeldName}, ${title}`;
      }
    }
    return title.trim();
  }

  /**
   * Holt den Namen des Feldes der komplementären Zeile / Spalte
   * @param {Object} feld
   * @param {Number} rowIndex
   * @param {Number} colIndex
   */
  getKomplementaerFeld(feld, rowIndex, colIndex) {
    if (feld) {
      const vorlage = this.getVorlageFelder(this?._vorlageId);
      const rowFeld = this.getFeldFromUser(vorlage?.rows?.[rowIndex]);
      const colFeld = this.getFeldFromUser(vorlage?.columns?.[colIndex]);
      if (feld === rowFeld || feld === colFeld) {
        const komplementaerFeld = rowFeld === feld ? colFeld : rowFeld;
        return komplementaerFeld || false;
      }
    }
    return false;
  }

  /**
   * Holt den Namen des Feldes der komplementären Zeile / Spalte
   * @param {Object} feld
   * @param {Number} rowIndex
   * @param {Number} colIndex
   */
  getKomplementaerFeldName(feld, rowIndex, colIndex) {
    return this.getKomplementaerFeld(feld, rowIndex, colIndex)?.name || "";
  }

  /**
   * Setzt die Überschrift, zu welchem Feld die CustomFelder gehören
   * und speichert das Label.
   * @param {Object} feld
   * @param {Object} cell
   * @param {Number} rowIndex
   * @param {Number} colIndex
   */
  setInfo(feld = false, cell = false, rowIndex = 0, colIndex = 0) {
    this.setInfoTitle(this.getTitle(feld, cell, rowIndex, colIndex));
    this.setCurrentFeld(feld || false, cell || false, rowIndex, colIndex);
    this.setInfoFkt(!!feld);
  }

  /**
   * Update des Custom-Felder-Tabs
   */
  resetInfo() {
    this.setInfo(this.feld, this.cell, this.rowIndex, this.colIndex);
  }

  /**
   * Liefert vorlage.
   * @param {Number} vId
   * @returns Object mit rows, columns und isInit oder einfach false
   */
  getVorlageFelder(vId = false) {
    const vorlageId = vId === false ? this._vorlageId : vId;
    return this.vorlagen?.[vorlageId] || false;
  }

  /**
   * Liefert true, wenn es zur Vorlage keine benutzerefinierten Splaten und Zeilen gibt.
   * @param {Number} vorlageId
   * @returns {boolean} true/false
   */
  isVorlageEmpty(vorlageId) {
    const vorlage = this.getVorlageFelder(vorlageId);
    const rowFelder = vorlage?.rows?.length || 0;
    const columnFelder = vorlage?.columns?.length || 0;
    return (rowFelder + columnFelder) < 1;
  }

  /**
   * Fügt die Informationen der Zähler für eine Vorlage hinzu.
   * @param {Object} feld
   * @param {Boolean} addToUser
   */
  addCustomfeld(feld, addToUser = true) {
    if (feld?.ansicht_id !== this?.table?.ansichtIndex) return;
    const {
      vorlage_id,
      row
    } = feld;
    if (!this.vorlagen[vorlage_id]) {
      this.vorlagen[vorlage_id] = {
        rows: [],
        columns: []
      };
    }
    const vorlage = row
      ? this.vorlagen[vorlage_id].rows
      : this.vorlagen[vorlage_id].columns;
    if (!vorlage.includes(feld.id)) vorlage.push(feld.id);
    if (addToUser && this?._user?.addFeld) {
      this?._user?.addFeld(feld, true);
    }
  }

  /**
   * Entfernt eine benutzerdefinierte Zeile/Spalte und entfernt entsprechende Keys aus
   * den vorlagen.
   * @param {Object} feld
   * @param {Boolean} removeFromUser
   * @param {Number} vId
   */
  removeCustomFeld(feld, removeFromUser = true, vId = false) {
    if (!feld) return;
    const {
      vorlage_id,
      row,
      id
    } = feld;
    const thisVorlageId = vId || vorlage_id;
    const vorlage = this.getVorlageFelder(thisVorlageId);
    const felder = row ? vorlage?.rows : vorlage?.columns;
    if (!felder) return;
    const i = felder.indexOf(id);
    if (i >= 0) {
      felder.splice(i, 1);
      if (removeFromUser && this?._user?.removeFeld) {
        this._user.removeFeld(feld);
      }
    }
    if (this.isVorlageEmpty(thisVorlageId)) {
      delete this.vorlagen[thisVorlageId];
    }
  }

  /**
   * Initialisiert die Vorlagen für die CustomFelder aus dem User
   */
  init() {
    if (this?._user?.eachCustomFeld) {
      this._user.eachCustomFeld((feld) => {
        this.addCustomfeld(feld, false);
      });
    }
  }

  /**
   * Ordnet der customFeld-Id ein customFeld aus dem User zu.
   * @param {Number} id
   */
  getFeldFromUser(id) {
    return this?._user?.getFeld?.(id);
  }

  /**
   * Iteriert über alle Felder einer bestimmten Vorlage
   * @param {Number} vId
   * @param {Function} callback
   * @returns Array
   */
  eachFeld(vId = 0, callback = false) {
    const result = [];
    const felder = this.getVorlageFelder(vId);
    const addFeld = (id) => {
      const feld = this.getFeldFromUser(id);
      if (feld) {
        result.push(this._isFunction(callback) ? callback(feld, result.length) : feld);
      }
    };
    felder?.rows?.forEach?.(addFeld);
    felder?.columns?.forEach?.(addFeld);
    return result;
  }

  /**
   * Testen, ob das Limit an benutzerdefinierten Zeilen erreicht ist.
   * @returns {boolean} true/false
   */
  customRowLimitReached() {
    const l = this?.table?.head?.length || 0;
    return l > this.CUSTOM_ROWS_LIMIT;
  }

  /**
   * Testen, ob das Limit an benutzerdefinierten Spalten erreicht ist.
   * @returns {boolean} true/false
   */
  customColumnLimitReached() {
    const l = this?.table?.customColumnsPositions?.length || 0;
    return l > this.CUSTOM_COLUMNS_LIMIT;
  }

  /**
   * Testen, ob benutzerdefinierte Zeilen existieren.
   * @returns {boolean} true/false
   */
  hasNoCustomRows() {
    const l = this?.table?.head?.length || 0;
    return l < 2;
  }

  /**
   * Testen, ob benutzerdefinierte Spalten existieren.
   * @returns {boolean} true/false
   */
  hasNoCustomColumns() {
    const l = this?.table?.customColumnsPositions?.length || 0;
    return l < 1;
  }

  /**
   * Dendet eine Anfrage zur Datenbank, um ein neues Feld zu erzeugen.
   * Das erzeugte Feld wird als Antwort erwartet und anschließend im Dienstplaner untergebracht
   * und CustomZeilenSpalten mit diesem Objekt ergänzt und dann neue Felder in der Tabelle angelegt.
   * @param {Boolean} row
   * @param {Number} index
   * @param {Function} callback
   */
  createCustomField(row, index = 0, callback = false) {
    if (!this?._hains?.api || !this._isFunction(callback)) return;
    let name = "";
    let send = true;
    let i = 0;
    while (name === "" && i < 5) {
      name = prompt(`Welchen Namen soll die ${row ? "Zeile" : "Spalte"} haben?`);
      if (name) name = name.trim();
      else {
        i++;
        send = false;
      }
    }

    const data = {
      row,
      ansicht_id: this?.table?.ansichtIndex || 0,
      index,
      name,
      vorlage_id: this?._vorlageId,
      id: 0
    };

    if (send) {
      this._hains.api("update_feld", "post", data).then((response) => {
        if (!this?._mounted) return;
        if (showConsole) console.log("data", data, "response", response);
        if (response?.id) {
          callback(new CustomFeld(response, this?._user, this?._appModel));
        } else {
          setPageWarning(this?._page, response?.info || "Feld konnte erstellt werden!");
        }
      }, returnError);
    }
  }

  /**
   * Sendet eine Anfrage an die Datenbank, um ein bestimmtes Feld zu entfernen.
   * Bei erfolgreichem Entfernen, sollen das Feld auch aus Dienstplaner und CustomZeilenSpalten
   * entfernt werden.
   * @param {Object} feld
   * @param {Function} callback
   */
  destroyCustomFeld(feld, callback = false) {
    if (!this?._hains?.api || !feld?.id || !this._isFunction(callback)) return;
    this._hains.api("destroy_feld", "post", {
      id: feld.id
    }).then((response) => {
      if (!this?._mounted) return;
      if (showConsole) console.log("feld", feld, "response", response);
      if (response?.destroyed) {
        callback();
      } else {
        setPageWarning(this?._page, response?.info || "Feld konnte nicht gelöscht werden!");
      }
    }, returnError);
  }

  /**
   * Fügt der Tabelle eine Zeile im Kopf oder eine neue Spalte hinzu
   * @param {Boolean} row
   */
  add(row = false) {
    const feld = this?.table?.getLastCustomFeld && this.table.getLastCustomFeld(row);
    const index = (feld?.index || 0) + 1;
    const shouldAdd = row
      ? index <= this.CUSTOM_ROWS_LIMIT
      : index <= this.CUSTOM_COLUMNS_LIMIT;
    if (!shouldAdd) return;
    const table = this?.table;
    this.createCustomField(row, index, (feld) => {
      this.addCustomfeld(feld, true);
      if (row) {
        if (table?.addCustomRow) {
          table.addCustomRow(feld, table?.firstHeadRow);
        }
      } else if (table?.addCustomColumn) {
        table.addCustomColumn(feld, table?.customColumnsPositions);
      }
      table?.update && table.update();
      this._update();
      table?.updateColumns && table.updateColumns();
    });
  }

  /**
   * Entfernt aus der Tabelle die letzte Zeile im Kopf oder die letzte benutzerdefinierte Spalte
   * @param {Boolean} row
   */
  remove(row = false) {
    const feld = this?.table?.getLastCustomFeld && this.table.getLastCustomFeld(row);
    const table = this?.table;
    this.destroyCustomFeld(feld, () => {
      this.removeCustomFeld(feld, true, false);
      table?.removeLastCustomFeld && table.removeLastCustomFeld(row);
      table?.update && table.update();
      this._update();
      table?.updateColumns && table.updateColumns();
    });
  }

  /**
   * Erstellt eine neue benutzerdefinierte Zeile.
   * (Throttled -> kann nur alle x Millisekunden aufgerufen werden)
   */
  throttledAdd = throttle((row) => {
    this.add(row);
  }, wait);

  /**
   * Entfertn die letzte benutzerdefinierte Zeile.
   * (throttled -> kann nur alle x Millisekunden aufgerufen werden)
   */
  throttledRemove = throttle((row) => {
    this.remove(row);
  }, wait);

  /**
   * Erstellt einen neuen Counter
   * @param {Object} counter
   */
  newCounter(counter) {
    if (!this?.feld) return false;
    const me = counter?._me;
    let oldCounter = {
      cell_id: this.newCellId,
      dienstplan_custom_feld_id: this.feld.id,
      evaluate_seperate: this.isHeadCell
    };
    if(this._isObject(me)) {
      oldCounter = {...me, cell_id: this.newCellId};
    }
    const newCounter = new Counter(oldCounter, this?._appModel);
    newCounter.init();
    return newCounter;
  }
}

export default CustomFelder;
