import React from "react";
import DienstplanTable, { defaultDienstplanTable } from "./dienstplan";
import DienstAuswahl from "./einteilung-auswahl/dienstauswahl";
import ContentWithWunsch from "../../../components/dienstplaner/content-container/ContentWithWunsch";

const createId = (
  name = "",
  rowpos = 0,
  cellpos = 0
) => `mitarbeiter-date-table_${name}_${rowpos}_${cellpos}`;
class MitarbeiterDateTable extends DienstplanTable {
  constructor(name = "dienstplan-table", appModel = false) {
    super(defaultDienstplanTable(createId, name, "mitarbeiter-date"), createId, appModel);
    this._set("checkForNotIgnoringBaseSearchValue", "dienste");
    this.initTable();
  }

  /**
   * Liefert die Default-Parameter für die Filter-Vorlage
   */
  get defaultFilterVorlageParams() {
    return {
      inVorlageTeam: true,
      notInVorlageTeam: false,
      inVorlageFunktionen: true,
      notInVorlageFunktionen: false,
      aktiv: true,
      inaktiv: false,
      anwesendMarkiert: true,
      abwesendMarkiert: true,
      dates: [],
      teams: [],
      funktionen: [],
      mitarbeiter: [],
      mitFreigegebeneDienste: true,
      ohneFreigegebeneDienste: false,
      isWritable: true,
      notIsWritable: true
    };
  }

  /**
   * Index der Ansicht im Dienstplan
   */
  get ansichtIndex() {
    return 1;
  }

  /**
   * Liefert den Namen für die Veröffentlichung,
   * muss mit dem Namen aus Ansichten übereinstimmen
   */
  get publishName() {
    return this?._appData?.monatsplan_ansichten?.[this.ansichtIndex] || "";
  }

  /**
   * Fügt einer Zeile die Dienstauswahl hinzu
   * @param {Object} row
   * @param {Object} mitarbeiter
   * @param {Object} date
   * @param {Number} rowPos
   * @returns Zelle
   */
  createDienstAuswahlCell(row, mitarbeiter, date, rowPos) {
    const cellPos = row?.cells?.length || 0;
    const id = createId("bodydate", rowPos, cellPos);
    const el = date?.getMitarbeiterEl?.(mitarbeiter?.id);
    const cell = row?.addCell?.({
      id,
      el,
      visible: true,
      header: false,
      className: date?._className || "",
      dateId: date?.id,
      mitarbeiterId: mitarbeiter?.id,
      getColumn: () => this.getColumn(cellPos),
      getContent: (
        component = true,
        {
          withColor = false,
          withWunsch = false,
          publish = false
        } = {}
      ) => (
        component ? (
          <ContentWithWunsch
            key={id}
            el={el}
            dienstplan={this._page}
            parent={this}
          />
        ) : (el?.getDienste?.(withColor, withWunsch, publish) || "-")
      )
    });
    return cell;
  }

  /**
   * Erstellt alle Zeilen und Spalten der Tabelle
   */
  createTable() {
    const m = this.orderedMitarbeiter;
    this?._dates?._each?.((date) => {
      this.createDateHeadCell(date);
      m?.forEach?.((mitarbeiter, rowPos) => {
        const row = this?.body?.rows?.[rowPos] || this.defaultMitarbeiterRow(
          mitarbeiter,
          rowPos
        );
        row && this.createDienstAuswahlCell(row, mitarbeiter, date, rowPos);
      });
    });
  }

  /**
   * Initialisiert die Tabelle
   */
  initTable() {
    this.setFilterVorlage(this.defaultFilterVorlage);
    this.setShowToggle(true, true);
    this.createTableMenue();
    this.createTable();
    this.setAuswahl(new DienstAuswahl(this._appModel, this));
  }
}

export default MitarbeiterDateTable;
