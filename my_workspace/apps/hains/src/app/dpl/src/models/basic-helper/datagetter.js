/**
 * Enthält die Getter für die Basic-Klasse
 * @class
 */
class DataGetter {
  /**
   * Gibt die aktiven Mitarbeiter zurück, falls sie unter pageData vorhanden sind
   * @returns {array} Array gefüllt mit aktiven Mitarbeitern
   */
  get _aktiveMitarbeiter() {
    let result = [];
    const mitarbeiter = this?._pageData?.aktiveMitarbeiter;
    if (!mitarbeiter) this._throwError(8, "aktiveMitarbeiter");
    else result = mitarbeiter;

    return result;
  }

  /**
   * Gibt die varibale anfang aus pageData zurück
   * (Im Dienstplaner entspricht das dem ersten Datum des Haupt-Monats)
   * @returns {object} Ein Objekt mit Datum als String und als Zahl
   * @returns {string} YYYY-MM-DD
   * @returns {number} YYYYMMDD
   * @returns {object} JS-Date
   */
  get _anfang() {
    const result = { str: "", zahl: 0 };
    const anfang = this?._pageData?.anfang;
    if (!anfang) this._throwError(8, "anfang");
    else {
      result.str = anfang;
      result.zahl = this._dateZahl(anfang);
      result.jsdate = new Date(anfang);
    }
    return result;
  }

  /**
   * Liefert das zum Anfang enstprechende Datums-Objekt
   * (Im Dienstplaner entspricht das dem ersten Datum des Haupt-Monats)
   * @returns {object} Ein Datum-Objekt
   */
  get _mainDate() {
    let result = {};
    if (this._dates && this._anfang) result = this._dates[this._anfang.str];
    else console.log(this._dates, this._anfang, "Dates oder Anfang existiert nicht!");

    return result;
  }

  /**
   * Liefert alle Arbeitszeittypen, die als Bereitschaftsdienst gelten
   * @returns {array} Ein Array, gefüllt mit den Arbeitszeittypen
   */
  get _bereitschaftArbeitszeittypen() {
    let result = [];
    if (!this._arbeitszeittypen) {
      result = this._arbeitszeittypen._each(false, (a) => a.bereitschaft).arr;
    }

    return result;
  }

  /**
   * Liefert alle Arbeitszeittypen, die als Rufdienst gelten
   * @returns {array} Ein Array, gefüllt mit den Arbeitszeittypen
   */
  get _rufbereitschaftArbeitszeittypen() {
    let result = [];
    if (!this._arbeitszeittypen) {
      result = this._arbeitszeittypen._each(false, (a) => a.rufbereitschaft).arr;
    }

    return result;
  }

  /**
   * Liefert alle DienstBedarfe
   * @returns {object} Ein Basic-Objekt, gefüllt mit den DienstBedarfen nach Id
   */
  get _bedarfe() {
    const result = this?._pageData?.bedarfe;
    if (!result) this._throwError(8, "bedarfe");
    return result;
  }

  /**
   * Liefert alle BedarfsEinträge
   * @returns {object} Ein Basic-Objekt, gefüllt mit den BedarfsEinträgen nach Id
   */
  get _bedarfseintraege() {
    const result = this?._pageData?.bedarfseintraege;
    if (!result) this._throwError(8, "bedarfseintraege");
    return result;
  }

  /**
   * Leifert die Beschreibung aus pageData
   * @returns {string}
   */
  get _beschreibung() {
    return this?._pageData?.beschreibung || "";
  }

  /**
   * Liefert alle Datums-Objekte
   * @returns {object} Ein Basic-Objekt, gefüllt mit den Datums nach Id
   */
  get _dates() {
    const result = this?._pageData?.dates;
    if (!result) this._throwError(8, "dates");
    return result;
  }

  /**
   * Liefert die DefaultVorlagen aus der PageData
   * (Im Dienstplan sind das: alle Dienste, Dienste mit Bedarf, Dienste ohne Bedarf)
   * @returns {Array} Ein Array gefüllt mit Vorlagen
   */
  get _defaultVorlagen() {
    const result = this?._pageData?.defaultVorlagen;
    if (!result) this._throwError(8, "defaultVorlagen");
    return result;
  }

  /**
   * Liefert eine Matrix, bei der den Diensten ihre jeweiligen BedarfsEinträge zugeordnet sind
   * @returns {object} Ein Matrix {dienstId: [BedarfsEinträge]}
   */
  get _dienstBedarfeintraege() {
    const result = this?._pageData?.dienst_bedarfeintrag;
    if (!result) this._throwError(8, "dienst_bedarfeintrag");
    return result;
  }

  /**
   * Liefert alle Dienste
   * @returns {object} Ein Basic-Objekt, gefüllt mit den Diensten nach Id
   */
  get _dienste() {
    const result = this?._pageData?.dienste;
    if (!result) this._throwError(8, "dienste");
    return result;
  }

  /**
   * Liefert die DienstplanBedarfId des aktuellen Dienstplanes
   * @return {number} ID
   */
  get _dienstplanbedarfId() {
    const result = this?._pageData?.dienstplanbedarf_id;
    if (!result) this._throwError(8, "dienstplanbedarfId");
    return result;
  }

  /**
   * Liefert die DienstplanStatusId des aktuellen Dienstplanes
   * @return {number} ID
   */
  get _dienstplanstatusId() {
    const result = this?._pageData?.dienstplanstatus_id;
    if (!result) this._throwError(8, "dienstplanstatusId");
    return result;
  }

  /**
   * Liefert alle Einteilungen
   * @returns {object} Ein Basic-Objekt, gefüllt mit den Einteilungen nach Id
   */
  get _einteilungen() {
    const result = this?._pageData?.einteilungen;
    if (!result) this._throwError(8, "einteilungen");
    return result;
  }

  /**
   * Gibt die varibale ende aus pageData zurück
   * (Im Dienstplaner entspricht das dem letzten Datum des Haupt-Monats)
   * @returns {object} Ein Objekt mit Datum als String und als Zahl
   * @returns {string} YYYY-MM-DD
   * @returns {number} YYYYMMDD
   * @returns {object} JS-Date
   */
  get _ende() {
    const result = { str: "", zahl: 0 };
    const ende = this?._pageData?.ende;
    if (!ende) this._throwError(8, "ende");
    else {
      result.str = ende;
      result.zahl = this._dateZahl(ende);
      result.jsdate = new Date(ende);
    }
    return result;
  }

  /**
   * Liefert die ID des aktuellen Dienstplanes
   * @return {number} ID
   */
  get _id() {
    const result = this?._pageData?.id;
    return result;
  }

  /**
   * Liefert alle Kalenderwochen der Wochenbilanzen aus dem Vormonat
   * @returns {object} Ein Basic-Objekt, gefüllt mit den KWs nach Id
   */
  get _kws() {
    const result = this?._pageData?.kws;
    if (!result) this._throwError(8, "kws");
    return result;
  }

  /**
   * Liefert alle Mitarbeiter
   * @returns {object} Ein Basic-Objekt, gefüllt mit den Mitarbeitern nach Id
   */
  get _mitarbeiter() {
    const result = this?._pageData?.mitarbeiter;
    if (!result) this._throwError(8, "mitarbeiter");
    return result;
  }

  /**
   * Liefert den Namen aus PageData
   * (Im Dienstplan ist es der Name des Dienstplans)
   * @return {string} Name des Dienstplans
   */
  get _name() {
    return this?._pageData?.name || "";
  }

  /**
   * Liefert die ID des Parametersets für den aktuellen Dienstplan
   * @return {number} ID
   */
  get _parametersetId() {
    const result = this?._pageData?.parametersetId;
    if (!result) this._throwError(8, "parametersetId");
    return result;
  }

  /**
   * Liefert alle Rotationen
   * @returns {object} Ein Basic-Objekt, gefüllt mit den Rotationen nach Id
   */
  get _rotationen() {
    const result = this?._pageData?.rotationen;
    if (!result) this._throwError(8, "rotationen");
    return result;
  }

  /**
   * Liefert alle Schichten
   * @returns {object} Ein Basic-Objekt, gefüllt mit den Schichten nach Id
   */
  get _schichten() {
    const result = this?._pageData?.schichten;
    if (!result) this._throwError(8, "schichten");
    return result;
  }

  /**
   * Liefert den Filter für die Dienste aus bestimmten Team.
   * Wird im Dienstplan bei der erstellung der Vorlage genutzt, um Dienste einzugrenzen
   * @return {object} Ein Objekt mit bestimmten Eigenschaften
   */
  get _teamFilter() {
    const result = this?._pageData?.teamFilter;
    if (!result) this._throwError(8, "teamFilter");
    return result;
  }

  /**
   * Liefert alle vordefinierten Vorlagen
   * @returns {array} Ein Array, gefüllt mit den vordefinierten Vorlagen
   */
  get _vordefinierteVorlagen() {
    const result = this?._pageData?.vordefinierteVorlagen;
    if (!result) this._throwError(8, "vordefinierteVorlagen");
    return result;
  }

  /**
   * Liefert alle wochenbilanzen
   * @returns {object} Ein Basic-Objekt, gefüllt mit den wochenbilanzen nach KW und MitarbeiterID
   */
  get _wochenbilanzen() {
    const result = this?._pageData?.wochenbilanzen;
    if (!result) this._throwError(8, "wochenbilanzen");
    return result;
  }

  /**
   * Liefert alle Wünsche
   * @returns {object} Ein Basic-Objekt, gefüllt mit den Wünschen nach Id
   */
  get _wuensche() {
    const result = this?._pageData?.wuensche;
    if (!result) this._throwError(8, "wuensche");
    return result;
  }
}

export default DataGetter;
