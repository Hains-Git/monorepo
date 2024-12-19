import React from "react";
import Basic from "../../basic";
import DienstColumn from "./dienstcolumn";
import DateTableCom from "../../../pages/dienstplaner/screenshot/helper/DateTable";

class DateTable extends Basic {
  constructor(tag, screenshot, appModel = false) {
    super(appModel);
    this._set("screenshot", screenshot);
    this._set("tag", tag);
    this._set("date", new Date(tag));
    this._setObject("dienste", {});
    this._setArray("columns", []);
    this._preventExtension();
  }

  get _date() {
    return this._getIdsObject("_dates", "tag", true);
  }

  get sort() {
    return this.date.getTime();
  }

  get label() {
    return this?._date?.label || this.date.toLocaleDateString();
  }

  get table() {
    return <DateTableCom key={this.tag} sort={this.sort} table={this} />;
  }

  get _info() {
    return this?._date?._info || {};
  }

  addDienst(po_dienst_id) {
    if (!this.dienste[po_dienst_id]) {
      this.dienste[po_dienst_id] = new DienstColumn(po_dienst_id, this, this._appModel);
      this.columns.push(this.dienste[po_dienst_id].column);
    }
    return this.dienste[po_dienst_id];
  }

  setInfo() {
    if (this?.screenshot?.setInfoPopUp) {
      this.screenshot.setInfoPopUp(this.label, this);
    }
  }
}

export default DateTable;