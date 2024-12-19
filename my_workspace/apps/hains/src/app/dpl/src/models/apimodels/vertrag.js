import Basic from '../basic';
import { formatDate } from '../../tools/dates';

/**
 * Klasse um ein Vertrag-Objekt zu erstellen.
 * @class
 */
class Vertrag extends Basic {
  constructor(obj, appModel = false, preventExtension = true) {
    super(appModel);
    this._setInteger('id', obj.id);
    this._setInteger('mitarbeiter_id', obj.mitarbeiter_id);
    this._setInteger('vertragstyp_id', obj.vertragstyp_id);
    this._set('anfang', obj.anfang ? formatDate(obj.anfang) : obj.anfang);
    this._set('ende', obj.ende ? formatDate(obj.ende) : obj.ende);
    if (preventExtension) this._preventExtension();
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
   * Liefert anfang als Zahl YYYYMMDD
   */
  get anfangZahl() {
    let result = 0;
    if (this.anfang) result = this._dateZahl(this.anfang);
    return result;
  }

  /**
   * Liefert ende als Zahl YYYYMMDD
   * Falls kein ende existiert, wird der heutige Tag + 5 Jahre genommen
   */
  get endeZahl() {
    let result = this.getDateZahlGreaterEndDate();
    if (this.ende) result = this._dateZahl(this.ende);
    return result;
  }

  /**
   * Liefert ein Objekt mit Informationen zu dem Vertrag
   */
  get _info() {
    const info = {
      id: { value: this.id, label: "ID" },
      anfang: { value: this.anfang, label: "Anfang" },
      ende: { value: this.ende, label: "Ende", ignore: !this.ende },
      typ: { value: this.vertragstyp_id, label: "Typ ID" },
      varianten: {
        value: {},
        label: 'Varianten',
        ignore: true,
        sorting: 'desc'
      }
    };

    if (this._vertragsvarianten) {
      const firstdate = this._dates._getByIndex(0);
      const thisDateZahl = firstdate?._zahl || 0;
      this._vertragsvarianten._each((variante) => {
        const isInRange =
          thisDateZahl &&
          variante.vonZahl <= thisDateZahl &&
          variante.bisZahl >= thisDateZahl;
        if (isInRange && variante.vertragstyp_id === this.vertragstyp_id) {
          info.varianten.ignore = false;
          info.varianten.value[variante.id] = variante._info;
        }
      });
    }

    return info;
  }

  gueltigAmByZahl(dateZahl){
    return dateZahl && this.anfangZahl <= dateZahl && this.endeZahl >= dateZahl;
  }

  gueltigAm(dateId = "") {
    const dateZahl = this?._dateZahl?.(dateId) || 0;
    return this.gueltigAmByZahl(dateZahl);
  }

  gueltigInByZahl(dateZahlVon, dateZahlBis){
    if(!dateZahlVon || !dateZahlBis) return false;
    const vertragAnfang = this.anfangZahl;
    const vertragEnde = this.endeZahl;
    const checkAnfang = (vertragAnfang < dateZahlVon && vertragEnde < dateZahlVon);
    const checkEnde = (vertragAnfang > dateZahlBis && vertragEnde > dateZahlBis)
    return !(checkAnfang || checkEnde);
  }

  gueltigIn(dateIdVon, dateIdBis){
    const dateZahlVon = this?._dateZahl?.(dateIdVon) || 0;
    const dateZahlBis = this?._dateZahl?.(dateIdBis) || 0;
    return this.gueltigInByZahl(dateZahlVon, dateZahlBis);
  }
}

export default Vertrag;
