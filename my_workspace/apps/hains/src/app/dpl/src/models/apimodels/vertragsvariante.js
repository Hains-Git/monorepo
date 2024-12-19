import Basic from '../basic';
import { formatDate } from '../../tools/dates';

/**
 * Klasse um ein Vertragsvariante-Objekt zu erstellen.
 * @class
 */
class Vertragsvariante extends Basic {
  constructor(obj, appModel = false, preventExtension = true) {
    super(appModel);
    this._setInteger("id", obj.id);
    this._set('von', obj.von ? formatDate(obj.von) : obj.von);
    this._set('bis', obj.bis ? formatDate(obj.bis) : obj.bis);
    this._setInteger("vertragstyp_id", obj.vertragstyp_id);
    this._setFloat('tage_monat', obj.tage_monat);
    this._set("name", obj.name);
    this._setInteger("wochenstunden", obj.wochenstunden);
    if (preventExtension) this._preventExtension();
  }

  /**
   * Liefert bis als Zahl YYYYMMDD
   */
  get bisZahl() {
    let result = this.getDateZahlGreaterEndDate();
    if (this.bis) result = this._dateZahl(this.bis);
    return result;
  }

  /**
   * Liefert von als Zahl YYYYMMDD
   */
  get vonZahl() {
    let result = 0;
    if (this.von) result = this._dateZahl(this.von);
    return result;
  }

  /**
   * Liefert ein Objekt mit Informationen zu der Vertragsvarianten
   */
  get _info() {
    const info = {
      value: {
        id: { value: this.id, label: "ID" },
        von: { value: this.von, label: "Von" },
        bis: { value: this.bis, label: "Bis", ignore: !this.bis },
        wochenstunden: { value: this.wochenstunden?.toString?.() || "Unbekannt", label: "Wochenstunden" },
        tageMonat: { value: this.tage_monat?.toString?.() || "Unbekannt", label: "Urlaubstage/Monat" }
      },
      label: this.name,
      sort: this.vonZahl
    };
    return info;
  }

  gueltigAmByZahl(dateZahl){
    return dateZahl && this.vonZahl <= dateZahl && this.bisZahl >= dateZahl;
  }

  gueltigAm(dateId = "") {
    const dateZahl = this?._dateZahl?.(dateId) || 0;
    return this.gueltigAmByZahl(dateZahl);
  }

  gueltigInByZahl(dateZahlVon, dateZahlBis){
    if(!dateZahlVon || !dateZahlBis) return false;
    const vertragAnfang = this.vonZahl;
    const vertragEnde = this.bisZahl;
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

export default Vertragsvariante;
