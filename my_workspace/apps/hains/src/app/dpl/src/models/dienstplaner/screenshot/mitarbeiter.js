import React from "react";
import Basic from "../../basic";
import MitarbeiterRow from "../../../pages/dienstplaner/screenshot/helper/MitarbeiterRow";

class Mitarbeiter extends Basic {
  constructor(id, bereichColumn, appModel = false) {
    super(appModel);
    this._set("id", id);
    this._set("bereichColumn", bereichColumn);
    this._setObject("einteilungen", {});
    this._preventExtension();
  }

  get mitarbeiter() {
    return this._getIdsObject("_mitarbeiter", "id", true);
  }

  get label() {
    return this.mitarbeiter?.cleanedPlanname || this.mitarbeiter?.name || this.id.toString();
  }

  addEinteilung(einteilung, itemId) {
    if (!this.einteilungen[itemId]) {
      this.einteilungen[itemId] = [einteilung];
    } else {
      this.einteilungen[itemId].push(einteilung);
    }

    return this.einteilungen[itemId];
  }

  getSort(einteilung) {
    return Date.parse(einteilung?.updated_at) || 0;
  }

  getCounts(einteilung) {
    return this._einteilungsstatuse[einteilung?.einteilungsstatus_id]?.counts;
  }

  getRow(einteilung, itemId) {
    const l = this.addEinteilung(einteilung, itemId).length;
    return this.getCounts(einteilung) ? (
      <MitarbeiterRow 
        key={`${this.id}-${itemId}-${l}`} 
        id={`${this.id}-${itemId}-${l}`}
        row={this} 
        sort={this.getSort(einteilung)}
        title={einteilung?.updated_at || ""}
      />
    ) : null;
  }
}

export default Mitarbeiter;