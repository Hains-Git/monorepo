import Basic from '../basic';
import { formatDate } from '../../tools/dates';

/**
 * Klasse um ein Zeitraumkategorie-Objekt zu erstellen.
 * @class
 */
class Zeitraumkategorie extends Basic {
  constructor(obj, appModel = false, preventExtension = true) {
    super(appModel);
    this._set('anfang', obj.anfang ? formatDate(obj.anfang) : obj.anfang);
    this._set('beschreibung', obj.beschreibung);
    this._set('dauer', obj.dauer);
    this._set('ende', obj.ende ? formatDate(obj.ende) : obj.ende);
    this._setInteger('id', obj.id);
    this._set('prio', obj.prio);
    this._set('regelcode', obj.regelcode);
    this._set('name', obj.name);
    this._set('sys', obj.sys);
    this._setInteger('zeitraumregel_id', obj.zeitraumregel_id);
    if (preventExtension) this._preventExtension();
  }

  /**
   * Liefert ein Objekt mit Informationen zu der Zeitraumkategorie.
   * Darunter fallen name, anfang, ende, dauer, und den Zeitraumregel-Code
   */
  get _info() {
    const zeitraumInfos = {
      typ: { value: {}, label: this.name }
    };
    const value = zeitraumInfos.typ.value;
    if (this.anfang) value.anfang = { value: this.anfang, label: 'Anfang' };
    if (!Number.isNaN(parseInt(this.dauer, 10))) {
      value.dauer = { value: this.dauer.toString(), label: 'Dauer in Tagen' };
    }
    if (this.ende) value.ende = { value: this.ende, label: 'Ende' };
    if (this.regelcode) value.regel = { value: this.regelcode, label: 'Regel' };
    if (this.beschreibung)
      value.beschreibung = { value: this.beschreibung, label: 'Beschreibung' };

    return zeitraumInfos;
  }
}

export default Zeitraumkategorie;
