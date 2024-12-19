import React from "react";
import Basic from "../../basic";
import Mitarbeiter from "./mitarbeiter";
import BereichColumnCom from "../../../pages/dienstplaner/screenshot/helper/BereichColumn";

class BereichColumn extends Basic {
  constructor(id, dienstColumn, appModel = false) {
    super(appModel);
    this._set("id", id);
    this._set("dienstColumn", dienstColumn);
    this._setObject("mitarbeiter", {});
    this._setArray("rows", []);
    this._preventExtension();
  }

  get bereich() {
    return this._getIdsObject("_bereiche", "id", true);
  }

  get label() {
    return this.bereich?.name || "-";
  }

  get sort() {
    return this.bereich?.name || "zzz";
  }

  get column() {
    return <BereichColumnCom key={this.id} column={this} sort={this.sort} />
  }

  addMitarbeiter(mitarbeiterId, einteilung, itemId) {
    if (!this.mitarbeiter[mitarbeiterId]) {
      this.mitarbeiter[mitarbeiterId] = new Mitarbeiter(mitarbeiterId, this, this._appModel);
    }
    const row = this.mitarbeiter[mitarbeiterId].getRow(einteilung, itemId);
    if (row) this.rows.push(row);
    return {
      mitarbeiter: this.mitarbeiter[mitarbeiterId],
      row
    };
  }
}

export default BereichColumn;