import React from "react";
import Basic from "../../basic";
import BereichColumn from "./bereichcolumn";
import DienstColumnCom from "../../../pages/dienstplaner/screenshot/helper/DienstColumn";

class DienstColumn extends Basic {
  constructor(id, dateTable, appModel = false) {
    super(appModel);
    this._set("id", id);
    this._set("dateTable", dateTable);
    this._setObject("bereiche", {});
    this._setArray("columns", []);
    this._preventExtension();
  }

  get dienst() {
    return this._getIdsObject(["_dienste", "_po_dienste"], "id", true);
  }

  get sort() {
    return this.dienst?.planname || this.dienst?.name || "zzz";
  }

  get label() {
    return this.dienst?.planname || this.dienst?.name || "-";
  }

  get column() {
    return <DienstColumnCom key={this.id} table={this?.dateTable} column={this} sort={this.sort} />;
  }

  get _info() {
    const date = this?.dateTable?._date;
    const byDienst = date?.getDienstEl && date.getDienstEl(this.id);
    const result = {
      popupInfos: {}
    };
    if (byDienst?.eachEinteilung) {
      if (date) {
        result.popupInfos.date = date._feldInfo;
      }
      if (this.dienst) {
        result.popupInfos.dienst = this.dienst._feldInfo;
      }
      byDienst.eachEinteilung((feld) => {
        const key = `bereich-${feld.bereichId}`;
        const value = feld.getValue("mitarbeiter");
        if (!value) return;
        if (!result.popupInfos[key]) {
          const label = feld?.bereich?.label || "Ohne Bereich";
          result.popupInfos[key] = {value: {}, label, sorting: "alph-asc"};
        }
        result.popupInfos[key].value[feld.id] = { value: "", label: value, sort: value };
      });
    }
    return result;
  }

  addBereich(bereichId) {
    if (!this.bereiche[bereichId]) {
      this.bereiche[bereichId] = new BereichColumn(bereichId, this, this._appModel);
      this.columns.push(this.bereiche[bereichId].column);
    }
    return this.bereiche[bereichId];
  }

  setInfo() {
    if (this?.dateTable?.screenshot?.setInfoPopUp) {
      this.dateTable.screenshot.setInfoPopUp(this.label, this);
    }
  }
}

export default DienstColumn;