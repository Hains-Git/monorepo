import Basic from '../basic';
import { formatDate } from '../../tools/dates';

/**
 * Klasse um ein ArbeitszeitAbsprache-Objekt zu erstellen.
 * @class
 */
class ArbeitszeitAbsprache extends Basic {
  constructor(obj, appModel = false, preventExtension = true) {
    super(appModel);
    this._setInteger('id', obj.id);
    this._setInteger('zeitraumkategorie_id', obj.zeitraumkategorie_id);
    this._setInteger('pause', obj.pause);
    this._setInteger('mitarbeiter_id', obj.mitarbeiter_id);
    this._set('von', obj.von ? formatDate(obj.von) : obj.von);
    this._set('bis', obj.bis ? formatDate(obj.bis) : obj.bis);
    this._set('anfang', obj.anfang);
    this._set('ende', obj.ende);
    this._set('arbeitszeit_von', obj.arbeitszeit_von_time);
    this._set('arbeitszeit_bis', obj.arbeitszeit_bis_time);
    this._set('bemerkung', obj.bemerkung?.toString?.() || '');
    if (preventExtension) this._preventExtension();
  }

  /**
   * Liefert die entsprechende Zeitraumkategorie
   */
  get zeitraumkategorie() {
    return this._getIdsObject(
      '_zeitraumkategorien',
      'zeitraumkategorie_id',
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
   * Liefert die Informationen zu der Absprache
   */
  get _info() {
    const info = {
      value: {
        id: { value: this.id.toString(), label: 'ID' },
        anfang: { value: this.anfang, label: 'Anfang' },
        ende: { value: this.ende, label: 'Ende' },
        arbeitszeitvon: {
          value: this.arbeitszeit_von,
          label: 'Arbeitszeit von'
        },
        arbeitszeitbis: {
          value: this.arbeitszeit_bis,
          label: 'Arbeitszeit bis'
        },
        pause: { value: this.pause, label: 'Pause' }
      },
      label: `Absprache ${this.id}`
    };
    if (this.von) {
      info.value.von = { value: this.von || '', label: 'Von' };
    }
    if (this.bis) {
      info.value.bis = { value: this.bis || '', label: 'Bis' };
    }
    const zeitraum = this.zeitraumkategorie?._info?.typ;
    if (zeitraum) info.value.zeitraumkategorie = zeitraum;
    return info;
  }

  /**
   * Liefert den Titel der Absprache
   */
  get title() {
    return `${this.arbeitszeit_von} - ${this.arbeitszeit_bis} Uhr (${this.pause} Min. Pause${this.bemerkung ? `, ${this.bemerkung}` : ''})`;
  }

  /**
   * @param {Object} date
   * @returns True, wenn Date auf die Absprache zutrifft
   */
  showAbsprache(date) {
    const dateInZeitraumkategorie = date?.isInZeitraumkategorie?.(
      this.zeitraumkategorie_id
    );
    const dateZahl = date?._zahl || 0;
    const inAnfang = this.anfang
      ? dateZahl >= this._dateZahl(this.anfang)
      : true;
    const inEnde = this.ende ? dateZahl <= this._dateZahl(this.ende) : true;
    return dateInZeitraumkategorie && inAnfang && inEnde;
  }
}

export default ArbeitszeitAbsprache;

