import { createDateTimeInput } from "../../../tools/dates";
import { debounce, wait } from "../../../tools/debounce";
import { development, showConsole } from "../../../tools/flags";
import { returnError } from "../../../tools/hains";
import InfoTab from "../../helper/info-tab";
import DateTable from "./datetable";

class Screenshot extends InfoTab {
  constructor(appModel = false) {
    super(appModel);
    this.reset();
    this.setTime();
    this._preventExtension();
    if (showConsole) this._whoAmI();
  }

  /**
   * Liefert das Komplette ISO-Format der Time
   */
  get timeISO() {
    return `${this.time}:00.000Z`;
  }

  /**
   * Erstellt eine Tabelle mit den Daten aus dem Screenshot
   * @param {Array} tables
   */
  setTables(tables = []) {
    this._setArray("tables", tables);
  }

  /**
   * Setzt das Data-Attribut
   * @param {Object} data
   */
  setData(data = {}) {
    this._setObject("data", data);
    this._update();
  }

  reset() {
    this.setTables();
    this.setData();
  }

  /**
   * Setzt das Time-Attribut
   * @param {String} time
   */
  setTime(time = "") {
    this._set("time", createDateTimeInput(time));
    this._update();
  }

  /**
   * Holt die Daten aus der API
   */
  getScreenshot = debounce((callback) => {
    if (this?._hains?.api) {
      this._hains.api("dienstplan_screenshot", "GET", {
        dienstplan_id: this?._id || 0,
        time: this.timeISO
      }).then((r) => {
        if (!this?._mounted) return;
        if (development) console.log("Screenshot", r);
        const d = {};
        const tableData = {};
        const tables = [];
        r?.forEach?.((e) => {
          const einteilung = JSON.parse(e.einteilung);
          if (!d[e.item_id]) {
            d[e.item_id] = [einteilung];
            if (!tableData[einteilung.tag]) {
              const tableParent = new DateTable(einteilung.tag || "", this, this._appModel);
              tableData[einteilung.tag] = tableParent;
              tables.push(tableParent.table);
            }
            tableData[einteilung.tag].addDienst(einteilung.po_dienst_id || 0)
              .addBereich(einteilung.bereich_id || 0)
              .addMitarbeiter(einteilung.mitarbeiter_id || 0, einteilung, e.item_id || 0);
          } else {
            d[e.item_id].push(einteilung);
          }
        });
        this.setTables(tables);
        this.setData(r);
        callback?.();
      }, (err) => {
        returnError(err); 
        callback?.();
      });
    }
  }, wait);
}

export default Screenshot;
