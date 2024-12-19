import EinteilungsstatusAuswahl from "../helper/einteilungsstatus-auswahl";

class DienstplanEinteilungsstatusAuswahl extends EinteilungsstatusAuswahl {
  constructor(
    appModel = false
  ) {
    super(appModel, true);
  }

  /**
   * Liefert das erste Date-Objekt
   */
  get firstDate() {
    return this?._dates?._getByIndex?.(0);
  }

  /**
   * Überschreibt den Standard-Callback, sodass die By Mitarbeiter- und Dienst-Elemente aktualisiert werden.
   * @param {Array} res 
   */
  removeCallback(res) {
    const mitarbeiterEl = {};
    const dienstEl = {};
    const dateEl = {};
    const firstDate = this?.firstDate;
    super.removeCallback(res, (e) => {
      const mitarbeiterElKey = `${e.tag}_${e.mitarbeiter_id}`;
      const dienstElKey = `${e.tag}_${e.po_dienst_id}`;
      const dateElKEy = `${e.po_dienst_id}_${e.mitarbeiter_id}`;
      const date = this?._dates?.[e.tag];
      if(!mitarbeiterEl[mitarbeiterElKey]) {
        mitarbeiterEl[mitarbeiterElKey] = date?.getMitarbeiterEl?.(e.mitarbeiter_id);
      }
      if(!dienstEl[dienstElKey]) {
        dienstEl[dienstElKey] = date?.getDienstEl?.(e.po_dienst_id);
      }
      if(!dateEl[dateElKEy]) {
        dateEl[dateElKEy] = firstDate?.getTableDienstHeadEl?.(e.mitarbeiter_id, e.po_dienst_id);
      }
    });
    Object.values(mitarbeiterEl)?.forEach?.((el) => el?._update?.());
    Object.values(dienstEl)?.forEach?.((el) => el?._update?.());
    Object.values(dateEl)?.forEach?.((el) => el?._update?.());
  }

  /**
   * Filtert die Einteilungen nach bestimmten Bedingungen
   * @param {object} e 
   * @returns {boolean} True, wenn die Einteilung berücksichtigt werden soll
   */
  showEinteilung(e) {
    return !!this?._dienstplanTable?.isEinteilungInFilter?.(e);
  }
}

export default DienstplanEinteilungsstatusAuswahl;