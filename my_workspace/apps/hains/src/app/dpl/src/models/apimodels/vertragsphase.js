import Basic from '../basic';
import { formatDate } from '../../tools/dates';

/**
 * Klasse um ein Vertragsphase-Objekt zu erstellen.
 * @class
 */
class Vertragsphase extends Basic {
  constructor(obj, appModel = false, preventExtension = true) {
    super(appModel);
    this._setInteger('id', obj.id);
    this._setInteger('vertrag_id', obj.vertrag_id);
    this._setInteger("vertragsstufe_id", obj.vertragsstufe_id);
    this._set('von', obj.von ? formatDate(obj.von) : obj.von);
    this._set('bis', obj.bis ? formatDate(obj.bis) : obj.bis);
    if (preventExtension) this._preventExtension();
  }

  /**
   * Liefert den zugehörigen Vertrag
   */
  get vertrag() {
    return this._getIdsObject('_vertraege', 'vertrag_id', true);
  }

  /**
   * Liefert den zugehörigen Vertrag
   */
  get vertragsstufe() {
    return this._getIdsObject("_vertragsstufen", "vertragsstufe_id", true);
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
   * Liefert ein Objekt mit Informationen zu der Vertragsphase
   */
  get _info() {
    const info = {
      value: {
        von: { value: this.von || "", label: "Von" },
        bis: { value: this.bis || "", label: "Bis", ignore: !this.bis },
        stufe: { value: this.vertragsstufe?.stufe?.toString?.() || "Unbekannt", label: "Stufe" }
      },
      label: this.von || this.bis,
      sort: this.vonZahl
    };

    if (this.vertrag) {
      info.value.vertrag = { value: this.vertrag._info, label: 'Vertrag' };
    }

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

export default Vertragsphase;
