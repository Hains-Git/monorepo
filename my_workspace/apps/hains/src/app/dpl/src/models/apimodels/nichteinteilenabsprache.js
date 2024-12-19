import Basic from '../basic';
import { formatDate } from '../../tools/dates';

/**
 * Klasse um ein NichtEinteilenAbsprache-Objekt zu erstellen.
 * @class
 */
class NichtEinteilenAbsprache extends Basic {
  constructor(obj, appModel = false, preventExtension = true) {
    super(appModel);
    this._setInteger('id', obj.id);
    this._setInteger('zeitraumkategorie_id', obj.zeitraumkategorie_id);
    this._setArray('standorte_themen', obj.nicht_einteilen_standort_themens);
    this._setInteger('mitarbeiter_id', obj.mitarbeiter_id);
    this._set('von', obj.von ? formatDate(obj.von) : obj.von);
    this._set('bis', obj.bis ? formatDate(obj.bis) : obj.bis);
    this._set('anfang', obj.anfang ? formatDate(obj.anfang) : obj.anfang);
    this._set('ende', obj.ende ? formatDate(obj.ende) : obj.ende);
    if (preventExtension) this._preventExtension();
  }

  /**
   * Liefert die Zusammenfassung zu den Standorten und Themen als Objekt
   */
  get standortThemen() {
    const standorte = {};
    this.standorte_themen?.forEach((obj) => {
      const standortId = obj?.standort_id || 0;
      const themaId = obj?.thema_id || 0;
      const thema = this._themen?.[themaId];
      const standort = this._standorte?.[standortId];
      if (!thema || !standort) return;
      if (!standorte[standortId])
        standorte[standortId] = {
          standort,
          themen: []
        };
      if (!standorte[standortId].themen.includes(thema)) {
        standorte[standortId].themen.push(thema);
      }
    });
    return standorte;
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
        ende: { value: this.ende, label: 'Ende' }
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
    const standorte = this.standortThemen;
    for (const standortId in standorte) {
      if (!info.value.standorte)
        info.value.standorte = { value: {}, label: 'Nicht einteilen' };
      const obj = standorte[standortId];
      const themen = obj.themen.map((thema) => thema.name).join('\n');
      info.value.standorte.value[standortId] = {
        value: themen,
        label: obj.standort.name
      };
    }
    return info;
  }

  /**
   * Liefert den Titel der Absprache
   */
  get title() {
    const title = [];
    for (const standortId in this.standortThemen) {
      const obj = this.standortThemen[standortId];
      const themen = [];
      // Neben dem Standort sollen 2 Themenname stehen
      // Ansonsten immer 3 Themennamen in einer Zeile stehen
      obj.themen.forEach((thema, i) => {
        const check = themen.length ? i % 3 : i % 2;
        if (check === 0) themen.push([]);
        themen[themen.length - 1].push(thema.name);
      });
      title.push(
        `${obj.standort.name}: ${themen.map((msg) => msg.join(', ')).join('\n')}`
      );
    }
    return title.join('\n');
  }

  /**
   * @param {Object} date
   * @param {Object} dienst
   * @param {Object} bereich
   * @returns True, wenn Date, Dienst und Bereich auf die Absprache zutreffen
   */
  showAbsprache(date, dienst, bereich) {
    const dateInZeitraumkategorie = date?.isInZeitraumkategorie?.(
      this.zeitraumkategorie_id
    );
    const dateZahl = date?._zahl || 0;
    const inAnfang = this.anfang
      ? dateZahl >= this._dateZahl(this.anfang)
      : true;
    const inEnde = this.ende ? dateZahl <= this._dateZahl(this.ende) : true;
    const checkStandortAndThema = !!this.standorte_themen?.find?.(
      (obj) =>
        dienst?.hasThemaId?.(obj?.thema_id) &&
        obj?.standort_id === bereich?.standort_id
    );
    return (
      dateInZeitraumkategorie && inAnfang && inEnde && checkStandortAndThema
    );
  }
}

export default NichtEinteilenAbsprache;

