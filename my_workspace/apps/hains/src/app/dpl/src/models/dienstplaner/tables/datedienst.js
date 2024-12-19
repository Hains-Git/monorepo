import React from "react";
import ContentContainer from "../../../components/dienstplaner/content-container/ContentContainer";
import Label from "../../../components/dienstplaner/label/Label";
import { zIndexes } from "../../../styles/basic";
import DienstplanTable, { defaultDienstplanTable } from "./dienstplan";
import MitarbeiterAuswahl from "./einteilung-auswahl/mitarbeiterauswahl";

const createId = (
  name = "",
  rowpos = 0,
  cellpos = 0
) => `date-dienst-table_${name}_${rowpos}_${cellpos}`;
class DateDienstTable extends DienstplanTable {
  constructor(name = "dienstplan-table", appModel = false) {
    super(defaultDienstplanTable(createId, name, "date-dienst"), createId, appModel);
    this.initTable();
  }

  get farbgruppenOptions() {
    return {
      dienste: false,
      dienstkategorien: false,
      einteilungskontext: true,
      farbgruppen: false
    }
  }

  /**
   * Einstellung welche Abfragen im Export angezeigt werden sollen
   */
  get exportAbfrage() {
    return {
      ...super.exportAbfrage,
      withColorAbfrage: false,
      withWunschAbfrage: false
    };
  }

  /**
   * Liefert die Default-Parameter für die Filter-Vorlage
   */
  get defaultFilterVorlageParams() {
    return {
      inVorlageTeam: true,
      notInVorlageTeam: true,
      inVorlageDiensten: true,
      notInVorlageDiensten: false,
      dienste: [],
      dates: [],
      teams: [],
      isWritable: true,
      notIsWritable: true
    };
  }

  /**
   * Index der Ansicht im Dienstplan
   */
  get ansichtIndex() {
    return 0;
  }

  /**
   * Liefert den Namen für die Veröffentlichung,
   * muss mit dem Namen aus Ansichten übereinstimmen
   */
  get publishName() {
    return this?._appData?.monatsplan_ansichten?.[this.ansichtIndex] || "";
  }

  /**
   * Fügt einer Zeile die Mitarbeiterauswahl hinzu
   * @param {Object} row
   * @param {Object} date
   * @param {Object} dienst
   * @param {Number} rowPos
   * @returns Zelle
   */
  createMitarbeiterAuswahlCell(row, date, dienst, rowPos) {
    const el = date?.getDienstEl?.(dienst?.id);
    const cellPos = row?.cells?.length || 0;
    const id = createId("bodymitarbeiter", rowPos, cellPos);
    const cell = row?.addCell?.({
      id,
      el,
      visible: true,
      header: false,
      dienstId: dienst?.id,
      dateId: date?.id,
      className: date?._className || "",
      getColumn: () => this.getColumn(cellPos),
      getContent: (
        component = true, 
        {
          publish = false
        } = {}
      ) => (component
        ? (
          <ContentContainer
            key={id}
            el={el}
            dienstplan={this._page}
          />
        ) : (el?.getMitarbeiter?.(publish) || "-")
      )
    });
    return cell;
  }

  /**
   * Erstellt eine neue Zeile im Body mit einem Date als erste Zelle
   * @param {Object} date
   * @param {Number} rowPos
   * @returns Zeile
   */
  defaultDateRow(date = false, rowPos = 0) {
    return this?.body?.addRow?.({
      id: createId("bodyrow", rowPos),
      visible: true,
      dateId: date?.id,
      className: date?._className || "",
      cells: [
        {
          id: createId("bodydate", rowPos, 0),
          visible: true,
          header: true,
          dateId: date?.id,
          style: {
            position: "sticky",
            left: "0px",
            zIndex: zIndexes.z5,
            fontSize: "1.1em"
          },
          getColumn: () => this.getColumn(0),
          getContent: (component = true) => (component ? (
            <Label
              name={date?.label || ""}
              title={date?.feiertagName || ""}
              parent={date}
            />
          ) : date?.contentArray || "")
        }
      ]
    });
  }

  /**
   * Erstellt alle Zeilen und Spalten der Tabelle
   */
  createTable() {
    const dates = this?._dates;
    this.orderedDienste.forEach((dienst) => {
      this.createDienstHeadCell(dienst);
      dates?._each?.((date, id, rowPos) => {
        const row = this?.body?.rows?.[rowPos] || this.defaultDateRow(
          date,
          rowPos
        );
        row && this.createMitarbeiterAuswahlCell(row, date, dienst, rowPos);
      });
    });
  }

  /**
   * Initialisiert die Tabelle
   */
  initTable() {
    this.setFilterVorlage(this.defaultFilterVorlage);
    this.setShowToggle(false, false);
    this.createTableMenue();
    this.createTable();
    this.setAuswahl(new MitarbeiterAuswahl(this._appModel, this));
  }
}

export default DateDienstTable;
