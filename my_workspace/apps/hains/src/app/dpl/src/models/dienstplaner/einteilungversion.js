import React from "react";
import { showConsole } from "../../tools/flags";
import DienstplanerDataEinteilung from "./einteilung";
import AuswahlRow from "../../components/dienstplaner/einteilung-auswahl/AuswahlRow";

/**
 * Erstellt eine DienstplanEintelungVersion Instanz.
 * Beim Anzeigen dieser Einteilungen für ein bestimmtes Feld,
 * sollen nur Mitarbeiter angezeigt werden,
 * die nicht schon in dieser Konfiguration (tag, dienst, schichten) eingeteilt sind.
 * @class
 */
class DienstplanEinteilungVersion extends DienstplanerDataEinteilung {
  constructor(obj, item_id, appModel = false) {
    super(obj, appModel, false);
    // this._setObject("arbeitsplatz", obj?.arbeitsplatz);
    // this._setObject("bereich", obj?.bereich);
    // this._setObject("einteilungskontext", obj?.einteilungskontext);
    // this._setObject("einteilungsstatus", obj?.einteilungsstatus);
    // this._setObject("mitarbeiter", obj?.mitarbeiter);
    // this._setObject("po_dienst", obj?.po_dienst);
    // this._setObject("dienstplan", obj?.dienstplan);
    this._setInteger("referenz_item_id", item_id);
    this._preventExtension();
    if (showConsole) this._whoAmI();
  }

  /**
   * Erstellt eine React-Componente für die Einteilung-Version
   * @param {Object} feld
   * @param {String} type
   * @param {Number} index
   * @returns ReactComponent
   */
  createAuswahl(feld, type = "mitarbeiter", index = 0) {
    const mitarbeiter = this.mitarbeiter;
    const key = `${this.id}_${index}`;
    if (!this.show) return null;
    if (feld?.id && mitarbeiter?.getScore) {
      return (
        <AuswahlRow
          mitarbeiter={mitarbeiter}
          infoParent={this}
          feld={feld}
          type={type}
          key={`${feld.id}_${key}`}
          score={mitarbeiter.getScore(feld)}
          showBedarfe={type !== "mitarbeiter"}
        />
      );
    }
    switch (type) {
      case "dienst":
        return (<p key={key}>{this?.dienst?.planname || this?.po_dienst_id}</p>);
      case "tag":
        return (<p key={key}>{this?.date?.labe || this?.tag}</p>);
      default:
        return (<p key={key}>{this?.mitarbeiter?.planname || this?.mitarbeiter_id}</p>);
    }
  }
}

export default DienstplanEinteilungVersion;
