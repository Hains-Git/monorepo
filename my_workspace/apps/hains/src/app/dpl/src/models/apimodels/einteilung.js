import { getFullDate, formatDate } from '../../tools/dates';
import Basic from '../basic';

/**
 * Klasse um ein Einteilung-Objekt zu erstellen.
 * Entspricht Diensteinteilung aus der API.
 * @class
 */
class Einteilung extends Basic {
  constructor(obj, appModel = false, preventExtension = true) {
    super(appModel);
    this._setInteger('arbeitsplatz_id', obj.arbeitsplatz_id);
    this._setInteger('dienstplan_id', obj.dienstplan_id);
    this._set('doppeldienst_id', obj.doppeldienst_id);
    this._setInteger('einteilungskontext_id', obj.einteilungskontext_id);
    this._setInteger('einteilungsstatus_id', obj.einteilungsstatus_id);
    this._setInteger('id', obj.id);
    this._setInteger('mitarbeiter_id', obj.mitarbeiter_id);
    this._set('number', obj.number);
    this._setInteger('po_dienst_id', obj.po_dienst_id);
    this._set('reason', obj.reason);
    this._set('info_comment', obj.info_comment);
    this._set('context_comment', obj.context_comment);
    this._set('tag', formatDate(obj.tag));
    this._set('is_optional', obj.is_optional);
    this._setInteger('bereich_id', obj.bereich_id);
    this._set('created_at', obj.created_at);
    this._set('updated_at', obj.updated_at);
    this.setFeld();
    // Schichtnummern 0 -> alle schichten
    this.setSchichtNummern(obj);
    if (preventExtension) this._preventExtension();
  }

  /**
   * Key im Dienstplan-Hash
   */
  get cacheKey() {
    return `${this.bereich_id || 0}_${this.tag}_${this.po_dienst_id}`;
  }

  /**
   * Liefert den Einteilungsstatus
   */
  get einteilungsstatus() {
    return this._getIdsObject(
      '_einteilungsstatuse',
      'einteilungsstatus_id',
      false
    );
  }

  /**
   * Liefert den einteilungskontext
   */
  get einteilungskontext() {
    return this._getIdsObject(
      '_einteilungskontexte',
      'einteilungskontext_id',
      true
    );
  }

  /**
   * Liefert den eingeteilten Mitarbeiter
   */
  get mitarbeiter() {
    return this._getIdsObject(
      ['_mitarbeiter', '_mitarbeiters'],
      'mitarbeiter_id',
      true
    );
  }

  /**
   * Liefert den Dienst, für den die Einteilung gilt
   */
  get dienst() {
    return this._getIdsObject(
      ['_dienste', '_po_dienste'],
      'po_dienst_id',
      true
    );
  }

  /**
   * Liefert zurück, ob es für den Dienst Bedarfe gibt
   */
  get hasBedarf() {
    return this?.dienst?.hasBedarf || false;
  }

  /**
   * Liefert das Date-Objekt, für die die Einteilung gilt
   */
  get date() {
    return this._getIdsObject('_dates', 'tag', true);
  }

  /**
   * Liefert den Bereich, für den die Einteilung gilt
   */
  get bereich() {
    return this._getIdsObject('_bereiche', 'bereich_id', false);
  }

  /**
   * Liefert den Tag als Zahl YYYYMMDD
   */
  get tagZahl() {
    return this._dateZahl(this.tag);
  }

  /**
   * Liefert die zugehörigen Schichten
   */
  get schichten() {
    return this.schicht_nummern.join(',');
  }

  /**
   * Liefert den Tag im deutschen Format
   */
  get einteilung_tag() {
    return getFullDate(this.tag);
  }

  /**
   * True, falls der Einteilungsstatus als vorschlag gilt
   */
  get vorschlag() {
    return !!this?.einteilungsstatus?.vorschlag;
  }

  /**
   * True, falls der Einteilungsstatus als counts gilt
   */
  get counts() {
    return !!this?.einteilungsstatus?.counts;
  }

  /**
   * True, falls der Einteilungsstatus als public gilt
   */
  get public() {
    return !!this?.einteilungsstatus?.public;
  }

  /**
   * Vorschläge und Counts-Einteilungen sollen angezeigt werden
   */
  get show() {
    return !!this?.einteilungsstatus?.show;
  }

  get isOptional() {
    return !!(this.is_optional && this.show);
  }

  /**
   * Liefert den zugehörigen Arbeitsplatz
   */
  get arbeitsplatz() {
    return this._getIdsObject('_arbeitsplaetze', 'arbeitsplatz_id', false);
  }

  /**
   * Gibt alle relevanten Objekte zur Einteilung zurück
   */
  get getObjects() {
    return {
      date: this?.date,
      mitarbeiter: this?.mitarbeiter,
      dienst: this?.dienst,
      status: this?.einteilungsstatus,
      kontext: this?.einteilungskontext,
      bereich: this?.bereich,
      arbeitsplatz: this?.arbeitsplatz
    };
  }

  /**
   * Liefert Informationen zur Einteilung
   */
  get mainInfos() {
    const { date, dienst, mitarbeiter } = this.getObjects;
    const dateLabel = date?.label || this.tag.toString();
    const dienstLabel = dienst?.planname || this.po_dienst_id.toString();
    const mitarbeiterLabel =
      mitarbeiter?.planname || this.mitarbeiter_id.toString();
    const mainInfos = {
      id: { value: this.id.toString(), label: 'ID' },
      Tag: { value: dateLabel, label: 'Tag' },
      Mitarbeiter: { value: mitarbeiterLabel, label: 'Mitarbeiter' },
      Dienst: { value: dienstLabel, label: 'Dienst' },
      erstellt: { value: this.created_at, label: 'Erstellt am' },
      aktualisiert: { value: this.updated_at, label: 'Aktualisiert am' },
      dienstplanId: {
        value: this.dienstplan_id.toString(),
        label: 'Dienstplan ID'
      },
      show: { value: this.show ? 'Ja' : 'Nein', label: 'Anzeigen' },
      optional: { value: this.is_optional ? 'Ja' : 'Nein', label: 'Optional' }
    };
    return mainInfos;
  }

  /**
   * Liefert weitere Informationen zur Einteilung
   */
  get popupInfos() {
    const infos = {};
    const { status, kontext, bereich, arbeitsplatz } = this.getObjects;
    if (status) infos.Status = status._info;
    if (kontext) infos.Kontext = kontext._info;
    if (bereich) infos.Bereich = bereich._feldInfo;
    if (arbeitsplatz) infos.Arbeitsplatz = arbeitsplatz._info;
    return infos;
  }

  /**
   * Liefert ein Info-Objekt
   */
  get _info() {
    return {
      mainInfos: this.mainInfos,
      popupInfos: this.popupInfos
    };
  }

  /**
   * Liefert ein Info-Objekt
   */
  get _feldInfo() {
    const {
      date,
      dienst,
      mitarbeiter,
      status,
      kontext,
      bereich,
      arbeitsplatz
    } = this.getObjects;

    const dateLabel = date?.label || this.tag.toString();
    const dienstLabel = dienst?.planname || this.po_dienst_id.toString();
    const mitarbeiterLabel =
      mitarbeiter?.planname || this.mitarbeiter_id.toString();
    const value = {
      id: { value: this.id.toString(), label: 'ID' },
      Tag: { value: dateLabel, label: 'Tag' },
      Mitarbeiter: { value: mitarbeiterLabel, label: 'Mitarbeiter' },
      Dienst: { value: dienstLabel, label: 'Dienst' },
      erstellt: { value: this.created_at, label: 'Erstellt am' },
      aktualisiert: { value: this.updated_at, label: 'Aktualisiert am' },
      dienstplanId: {
        value: this.dienstplan_id.toString(),
        label: 'Dienstplan ID'
      },
      aktiv: { value: this.show ? 'Ja' : 'Nein', label: 'Aktiv' }
    };

    if (status) value.Status = status._info;
    if (kontext) value.Kontext = kontext._info;
    if (bereich) value.Bereich = bereich._feldInfo;
    if (arbeitsplatz) value.Arbeitsplatz = arbeitsplatz._info;

    return {
      value: {
        ...this.mainInfos,
        ...this.popupInfos
      },
      label: 'Einteilung'
    };
  }

  /**
   * Liefert ein Info Objekt mit dem Tag am Anfang
   */
  get _nachDatumInfo() {
    const value = this._feldInfo.value;
    return {
      value,
      label: `${value.Tag.value} (${value.Mitarbeiter.value})`,
      sort: this?.date?._zahl || 0
    };
  }

  /**
   * Liefert ein Info Objekt mit dem Dienst am Anfang
   */
  get _nachDienstInfo() {
    const value = this._feldInfo.value;
    return {
      value,
      label: `${value.Dienst.value} (${value.Mitarbeiter.value})`,
      sort: this?.dienst?.planname || `zzz${value.Dienst.value}`
    };
  }

  /**
   * Liefert ein Info Objekt mit dem Mitarbeiter am Anfang und dann den Tag
   */
  get _nachMitarbeiterDateInfo() {
    const value = this._feldInfo.value;
    return {
      value,
      label: `${value.Mitarbeiter.value} (${value.Tag.value})`,
      sort: this?.mitarbeiter?.planname || `zzz${value.Mitarbeiter.value}`
    };
  }

  /**
   * Liefert ein Info Objekt mit dem Mitarbeiter am Anfang und dann den Dienst
   */
  get _nachMitarbeiterDienstInfo() {
    const value = this._feldInfo.value;
    return {
      value,
      label: `${value.Mitarbeiter.value} (${value.Dienst.value})`,
      sort: this?.mitarbeiter?.planname || `zzz${value.Mitarbeiter.value}`
    };
  }

  /**
   * Liefert die Zahl des letzten updates
   */
  get updatedAtZahl() {
    return this._formatTime(this.updated_at)?.fullnr || 0;
  }

  /**
   * Liefert einen Key für den Check auf doppelte Einteilungen
   */
  get checkMehrfacheEinteilungKey() {
    return `${this.mitarbeiter_id}-${this.po_dienst_id}-${this.tag}-${this.schicht_nummern}`;
  }

  /**
   * Feld der doppelten Einteilung, wenn die Mitarbeitering schon eine Einteilung für diesen
   * Tag, Dienst, Bereich und Schicht hat
   * @returns {Object|Boolean} feld || false
   */
  get doppelteEinteilung() {
    return (
      this?.mitarbeiter?.hasDoppelteEinteilung?.(
        this.tag,
        this.po_dienst_id,
        this.bereich_id,
        this?.dienst?.hasBedarf ? this.schichten : false
      ) || false
    );
  }

  /**
   * Feld der doppelten Einteilung, wenn die Mitarbeitering schon eine Einteilung für diesen
   * Tag, Dienst und Id hat
   * @returns {Object|Boolean} feld || false
   */
  get doppelteEinteilungById() {
    return (
      this?.mitarbeiter?.hasDoppelteEinteilungById?.(
        this.id,
        this.tag,
        this.po_dienst_id
      ) || false
    );
  }

  /**
   * Setzt das feld Attribut
   * @param {Object} feld
   * @returns {Object} feld
   */
  setFeld(feld = false) {
    this._set('feld', feld);
    return this.feld;
  }

  /**
   * Setzt ein Array mit Informationen,
   * welche Schichten im Bedarfseintrag berücksichtigt werden sollen.
   * [0] bedeutet alle Schichten berücksichtigen.
   * [x, y, z] bedeutet, die Einteilung gilt nur für die Schichten mit der Schichtnummer x, y, z
   * @param {Object} obj Einteilung aus der API
   */
  setSchichtNummern(obj) {
    let schichtnr = this._isArray(obj?.schicht_nummern)
      ? obj.schicht_nummern
      : [0];
    if (schichtnr.includes(0)) schichtnr = [0];
    this._setArray('schicht_nummern', schichtnr);
  }

  /**
   * Einteilungsstatus entfernen.
   * Einteilungsstatus-Id wird auf 0 gesetzt.
   * @returns {Number} einteilungsstatus_id
   */
  deactivate() {
    this._set('einteilungsstatus_id', 0);
    return this.einteilungsstatus_id;
  }

  /**
   * Aktualisiert den Bereich der Einteilung anhand dem eingeteilten Feld.
   * @returns {Number} bereich_id
   */
  updateBereich() {
    if (this?.feld?.bereichId) {
      const { bereichId } = this.feld;
      this._setInteger('bereich_id', bereichId);
    }
    return this.bereich_id;
  }

  /**
   * Entfernt das entsprechende Feld aus der Mitarbeiterin
   * @returns {Boolean} true, falls das Feld entfernt werden konnte
   */
  removeFromMitarbeiter() {
    const m = this?.mitarbeiter;
    return !!m?.removeEinteilung?.(this?.feld);
  }

  /**
   * Aktualisiert den Mitarbeiter um das neue Feld
   */
  addToMitarbeiter() {
    const m = this?.mitarbeiter;
    return !!m?.addEinteilung?.(this?.feld);
  }

  /**
   * Aktualisiert die alten und neuen Mitarbeiter
   * und deaktiviert die Einteilung ggf.
   */
  updateMitarbeiter() {
    if (this.show) return this.addToMitarbeiter();
    this.deactivate();
    return this.removeFromMitarbeiter();
  }

  /**
   * Entfernt das Feld aus den Einteilungen
   * und entfernt das Feld aus dem Mitarbeiter
   */
  remove() {
    this.removeFromMitarbeiter();
    this.setFeld();
    // Entferne nicht gültige Einteilungen
    // !this.counts &&
    if (this?._einteilungen?.[this.id]) {
      delete this._einteilungen[this.id];
    }
    this?.date?.updateEinteilungen?.(this, false);
  }

  /**
   * Aktualisiert die Bereich-Id und die Mitarbeiter-Id
   * und fügt die Einteilung den Einteilungen hinzu
   * @param {Object} feld
   * @returns einteilung
   */
  add(feld) {
    this.setFeld(feld || false);
    this.updateBereich();
    this.updateMitarbeiter();
    this?._einteilungen?._set?.(this.id, this);
    this?.date?.updateEinteilungen?.(this, true);
  }

  /**
   * Erstellt die Informationen zu dem Dienst
   */
  setInfo() {
    this._setPageInfoPopup(`Einteilung: ${this.id}`, this);
  }

  /**
   * Entfernt die Einteilung komplett (Abhängig von der Seite)
   * Soll seitenspezifisch überschrieben werden
   */
  completeRemove() {
    this.remove();
    this.updateCachedDienstplan();
  }

  /**
   * Führt ein Update des Einteilungsstatus durch.
   *
   * @param {Number} einteilungsstatus_id
   * @param {Number} dienstplan_id
   */
  updateStatus(einteilungsstatus_id = 0, dienstplan_id = 0) {
    const status = this?._einteilungsstatuse[einteilungsstatus_id];
    if (status?.show) {
      this._setInteger('einteilungsstatus_id', einteilungsstatus_id);
      this._setInteger('dienstplan_id', dienstplan_id);
      this.updateCachedDienstplan();
    } else {
      this.completeRemove();
    }
    return status?.show;
  }

  /**
   * Führt ein Update des gecachten Dienstplans durch.
   * Sollte seitenspezifisch überschrieben werden.
   */
  updateCachedDienstplan() {
    this?._appModel?.updateCachedDienstplaeneEinteilung?.(this._me);
  }

  /**
   * Liefert die benutzerdefinierte Farbe
   * @returns {string} Benutzerdefinierte Farbe
   */
  getColor() {
    return this.einteilungskontext?.color || '';
  }
}

export default Einteilung;
