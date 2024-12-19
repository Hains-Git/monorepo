import Basic from '../basic';

/**
 * Klasse um ein Schicht-Objekt zu erstellen.
 * @class
 */
class Schicht extends Basic {
  constructor(obj, appModel = false, preventExtension = true) {
    super(appModel);
    this._set('anfang', obj.anfang);
    this._setInteger('arbeitszeit', obj.arbeitszeit);
    this._setInteger('arbeitszeittyp_id', obj.arbeitszeittyp_id);
    this._setInteger('bedarfs_eintrag_id', obj.bedarfs_eintrag_id);
    this._set('ende', obj.ende);
    this._setInteger('schicht_nummer', obj.schicht_nummer);
    this._set('id', obj.id || -1);
    this._set('ausgleich', obj.ausgleich === undefined ? false : obj.ausgleich);
    if (preventExtension) this._preventExtension();
  }

  /**
   * Liefert den entsprechenden Bedarfseintrag der Schicht
   */
  get bedarfsEintrag() {
    return this._getIdsObject('_bedarfseintraege', 'bedarfs_eintrag_id', true);
  }

  /**
   * Liefert den Arbeitszeittyp der Schicht
   */
  get arbeitszeittyp() {
    return this._getIdsObject('_arbeitszeittypen', 'arbeitszeittyp_id', true);
  }

  /**
   * True, wenn der Arbeitszeittyp als Frei gilt oder kein Arbeitszeittyp gefunden wird
   */
  get isFrei() {
    const thisArbeitszeit = this.arbeitszeittyp;
    return thisArbeitszeit ? thisArbeitszeit.isFrei : true;
  }

  /**
   * True, wenn der Arbeitszeittyp als Arbeitszeit gilt
   */
  get isArbeit() {
    const thisArbeitszeit = this.arbeitszeittyp;
    return thisArbeitszeit ? thisArbeitszeit.isArbeitszeit : false;
  }

  /**
   * True, wenn der Arbeitszeittyp als Rufbereitschaft gilt
   */
  get isRufdienst() {
    const thisArbeitszeit = this.arbeitszeittyp;
    return thisArbeitszeit ? thisArbeitszeit.rufbereitschaft : false;
  }

  /**
   * True, wenn der Arbeitszeittyp als Bereitschaftsdienst gilt
   */
  get isBereitschaftsdienst() {
    const thisArbeitszeit = this.arbeitszeittyp;
    return thisArbeitszeit ? thisArbeitszeit.bereitschaft : false;
  }

  /**
   * Liefert eine formatierte Version von anfang.
   * @return ein Objekt mit verschiedenen Formaten des Datums und der Zeit
   */
  get _anfang() {
    const res = this._formatTime(this.anfang);
    return res;
  }

  /**
   * Liefert eine formatierte Version von ende.
   * @return ein Objekt mit verschiedenen Formaten des Datums und der Zeit
   */
  get _ende() {
    const res = this._formatTime(this.ende);
    return res;
  }

  /**
   * Liefert den namen des Arbeitszeittyps
   */
  get typ() {
    return this?.arbeitszeittyp?.name || this.arbeitszeittyp_id;
  }

  /**
   * Liefert ein Objekt mit Informationen zu der Schicht.
   * Darunter fallen ID, Schichtnummer, anfang, ende, Arbeitszeit in Minuten und Stunden.
   */
  get _info() {
    const anfang = this._anfang;
    const ende = this._ende;
    const schichtInfos = {
      value: {
        id: { value: this.id.toString(), label: 'ID' },
        nr: { value: this.schicht_nummer.toString(), label: 'Nr' },
        anfang: { value: anfang.time, label: anfang.local },
        ende: { value: ende.time, label: ende.local },
        minuten: {
          value: this.arbeitszeit.toString(),
          label: 'Arbeitszeit (min)'
        },
        stunden: {
          value: (this.arbeitszeit / 60).toFixed(2).toString(),
          label: 'Arbeitszeit (Std)'
        },
        ausgleich: {
          value: this.ausgleich ? 'Ja' : 'Nein',
          label: 'Ausgleich-Schicht'
        },
        anteilNachtDienst: {
          value: this.anteilNachtDienst.toString(),
          label: 'Anteil an Nachtdienst (Std)'
        }
      },
      label: this.typ
    };

    return schichtInfos;
  }

  /**
   * Gibt die DienstId aus dem Bedarfseintrag wieder
   */
  get dienstId() {
    return this?.bedarfsEintrag?.po_dienst_id || 0;
  }

  /**
   * Liefert den Dienst aus dem Bedarfseintrag
   */
  get dienst() {
    return this._getIdsObject(['_dienste', '_po_dienste'], 'dienstId', true);
  }

  /**
   * Liefert den Namen des Dienstes aus dem Bedarfseintrag
   */
  get dienstName() {
    return this?.dienst?.planname || 'Unbekannt';
  }

  /**
   * Liefert den ersten Bedarfseintrag aus einem Block
   */
  get startBedarf() {
    return this?.bedarfsEintrag?.startBedarfsEintrag || false;
  }

  /**
   * Testet, ob anfang oder ende auf ein Wochenende fällt
   */
  get isWeekend() {
    const anfang = this._anfang;
    const ende = this._ende;
    const dateAnfang = this?._dates?.[anfang.date];
    const dateEnde = this?._dates?.[ende.date];
    if (!dateAnfang || !dateEnde) return false;
    let is_weekend = dateAnfang.is_weekend || dateEnde.is_weekend;
    // Montags bis 5:00:00 Uhr
    if (dateAnfang && !is_weekend) {
      is_weekend = dateAnfang.week_day_nr === 1 && anfang.timenr < 50000;
    }
    // Freitags ab 21:00:00 Uhr
    if (dateEnde && !is_weekend) {
      is_weekend = dateEnde.week_day_nr === 5 && ende.timenr > 210000;
    }
    return is_weekend;
  }

  /**
   * Liefert den Anteil in Std. der Schicht, der in den NachtDienst fällt.
   * 0 - 6 Uhr und 21 - 24 Uhr fällt
   */
  get anteilNachtDienst() {
    if (this.isArbeit && !this.isRufdienst) {
      const anfang = this._anfang;
      const ende = this._ende;
      return anfang.datenr === ende.datenr
        ? this.getAnteilNacht(anfang.timenr, ende.timenr) // Gleicher Tag
        : this.getAnteilNacht(anfang.timenr, 24000) + // Unterschiedliche Tage
            this.getAnteilNacht(0, ende.timenr);
    }
    return 0.0;
  }

  /**
   * Testet, ob anfang oder ende auf einen Feiertag fällt
   */
  get isFeiertag() {
    const anfang = this._anfang;
    const ende = this._ende;
    const feiertagAnfang = this?._dates?.[anfang.date]?.isFeiertag;
    const feiertagEnde = this?._dates?.[ende.date]?.isFeiertag;
    return feiertagAnfang || feiertagEnde;
  }

  /**
   * Liefert den Arbeitszeittypen und Anfang und Ende
   */
  get typLabel() {
    return `${this.typ} (${this._anfang.time} - ${this._ende.time})`;
  }

  hasDayFrei(dateId = '') {
    if (this.isFrei) {
      if (new Date(dateId).getTime()) {
        const startDate = this._dateZahl(dateId);
        const checkAnfang = this._anfang.datenr <= startDate;
        const checkEnde = this._ende.datenr > startDate;
        return checkAnfang && checkEnde;
      }
      return this.ausgleich;
    }
    return false;
  }

  /**
   * Berechnet die Stunden im Bereich 0 - 6 Uhr und 21 - 24 Uhr
   * @param {Number} anfang
   * @param {Number} ende
   * @returns Number
   */
  getAnteilNacht(anfang, ende) {
    let value = 0.0;
    if (ende > anfang) {
      const sechs = 60000;
      const neun = 210000;
      if (anfang < sechs) {
        const diff = ende <= sechs ? ende - anfang : sechs - anfang;
        value += this.getStundenFromTimeNr(diff);
      }
      if (ende > neun) {
        const diff = anfang >= neun ? ende - anfang : ende - ende;
        value += this.getStundenFromTimeNr(diff);
      }
    }
    return value;
  }

  /**
   * Ermittelt die Stunden aus einer timenr
   * @param {Number} timenr
   * @returns Number
   */
  getStundenFromTimeNr(timenr) {
    let value = 0.0;
    const str = timenr.toString();
    if (str.length > 4) {
      const end = str.length > 5 ? 2 : 1;
      value += parseInt(str.slice(0, end), 10);
      value += parseFloat(str.slice(end, end + 2), 10) / 60;
      value += parseFloat(str.slice(end + 2), 10) / 3600;
    } else if (str.length > 2) {
      const end = str.length > 3 ? 2 : 1;
      value += parseInt(str.slice(0, end), 10);
      value += parseFloat(str.slice(end), 10) / 60;
    } else {
      value += timenr;
    }
    return parseFloat(value.toFixed(2));
  }

  /**
   * Liefert die Anzahk überschneidender Minuten mit einer anderen Schicht.
   * @param {Object} konfliktSchicht
   * @returns {Number} Number > 0 (Überschneidung in Minuten),
   * wenn sich die Schichten überschneiden.
   */
  checkUeberschneidung(konfliktSchicht) {
    const { _anfang, _ende } = this;
    const _konfliktAnfang = konfliktSchicht?._anfang;
    const _konfliktEnde = konfliktSchicht?._ende;
    // Prüfen, ob es valide Schichten sind
    // Valide Schichten: Ende > Anfang
    const start = _anfang.fullnr;
    const end = _ende.fullnr;
    const konfliktStart = _konfliktAnfang?.fullnr || 0;
    const konfliktEnd = _konfliktEnde?.fullnr || 0;
    if (!(konfliktStart < konfliktEnd && start < end)) return 0;
    // Überschneidung testen
    const startDateTime = Date.parse(_anfang.fullStr);
    const endDateTime = Date.parse(_ende.fullStr);
    const konfliktStartDateTime = Date.parse(_konfliktAnfang.fullStr);
    const konfliktEndDateTime = Date.parse(_konfliktEnde.fullStr);
    // Mögliche Überschneidungen
    const times = [
      endDateTime - startDateTime,
      konfliktEndDateTime - startDateTime,
      endDateTime - konfliktStartDateTime,
      konfliktEndDateTime - konfliktStartDateTime
    ];
    // Überschneidungen können nur für Werte > 0 auftreten
    const min = Math.min(...times.map((t) => (t < 0 ? 0 : t))) / 60000;
    return min;
  }

  /**
   * Liefert ein Array mit den Tagen aus anfang und ende
   * @returns Array
   */
  getTage() {
    const anfang = this._anfang;
    const ende = this._ende;
    if (anfang.datenr !== ende.datenr) {
      return [this._anfang.date, this._ende.date];
    }
    return [this._anfang.date];
  }
}

export default Schicht;
