import React from "react";
import ContentContainer from "../../../components/dienstplaner/content-container/ContentContainer";
import DienstplanTable, { defaultDienstplanTable } from "./dienstplan";
import DateAuswahl from "./einteilung-auswahl/dateauswahl";

const createId = (
  name = "",
  rowpos = 0,
  cellpos = 0
) => `mitarbeiter-dienst-table_${name}_${rowpos}_${cellpos}`;
class MitarbeiterDienstTable extends DienstplanTable {
  constructor(name = "dienstplan-table", appModel = false) {
    super(defaultDienstplanTable(createId, name, "mitarbeiter-dienst"), createId, appModel);
    this._set("ignoreBaseSearchValueFor", "dienste");
    this._set("checkForNotIgnoringBaseSearchValue", "dates");
    this.initTable();
  }

  /**
   * Liefert das erste Date-Objekt
   */
  get date() {
    return this?._dates?._getByIndex?.(0);
  }

  /**
   * Liefert die Default-Parameter für die Filter-Vorlage
   */
  get defaultFilterVorlageParams() {
    return {
      inVorlageTeam: true,
      notInVorlageTeam: false,
      inVorlageDiensten: true,
      notInVorlageDiensten: false,
      inVorlageFunktionen: true,
      notInVorlageFunktionen: false,
      aktiv: true,
      inaktiv: false,
      anwesendMarkiert: true,
      abwesendMarkiert: true,
      dienste: [],
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
    return 2;
  }

  /**
   * Liefert den Namen für die Veröffentlichung,
   * muss mit dem Namen aus Ansichten übereinstimmen
   */
  get publishName() {
    return this?._appData?.monatsplan_ansichten?.[this.ansichtIndex] || "";
  }

  /**
   * Liefert das getTableDienstHeadEl
   * @param {Number} mitarbeiterId
   * @param {Number} dienstId
   * @returns Object
   */
  getTableDienstHeadEl(mitarbeiterId = 0, dienstId = 0) {
    return this.date?.getTableDienstHeadEl?.(mitarbeiterId, dienstId);
  }

  /**
   * Fügt einer Zeile die Dienstauswahl hinzu
   * @param {Object} row
   * @param {Object} mitarbeiter
   * @param {Object} dienst
   * @param {Number} rowPos
   * @returns Zelle
   */
  createDateAuswahlCell(row, mitarbeiter, dienst, rowPos) {
    const el = this.getTableDienstHeadEl(mitarbeiter?.id, dienst?.id);
    const cellPos = row?.cells?.length || 0;
    const id = createId("bodydienst", rowPos, cellPos);
    const cell = row?.addCell?.({
      id,
      el,
      visible: true,
      header: false,
      dienstId: dienst?.id,
      mitarbeiterId: mitarbeiter?.id,
      getColumn: () => this.getColumn(cellPos),
      getContent: (
        component = true,
        {
          withColor = false,
          publish = false
        } = {}
      ) => (component
        ? (
          <ContentContainer
            key={id}
            el={el}
            dienstplan={this._page}
          />
        ) : (el?.getTage?.(withColor, publish) || "-")
      )
    });
    return cell;
  }

  /**
   * Erstellt alle Zeilen und Spalten der Tabelle
   */
  createTable() {
    const m = this.orderedMitarbeiter;
    this.orderedDienste.forEach((dienst) => {
      this.createDienstHeadCell(dienst);
      m?.forEach?.((mitarbeiter, rowPos) => {
        const row = this?.body?.rows?.[rowPos] || this.defaultMitarbeiterRow(
          mitarbeiter
        );
        row && this.createDateAuswahlCell(row, mitarbeiter, dienst, rowPos);
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
    this.setAuswahl(new DateAuswahl(this._appModel, this));
  }
}

export default MitarbeiterDienstTable;
