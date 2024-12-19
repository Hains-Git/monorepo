import Basic from '../basic';

/**
 * Klasse um ein Einteilungsstatus-Objekt zu erstellen.
 * @class
 */
class Einteilungsstatus extends Basic {
  constructor(obj, appModel = false, preventExtension = true) {
    super(appModel);
    this._set('color', obj.color);
    this._set('public', !!obj.public);
    this._setInteger('id', obj.id);
    this._set('name', obj.name);
    this._set('counts', !!obj.counts);
    this._set('sys', !!obj.sys);
    this._set('waehlbar', !!obj.waehlbar);
    this._set('vorschlag', !!obj.vorschlag);
    if (preventExtension) this._preventExtension();
  }

  /**
   * Liefert True, wenn counts, public und waehlbar = true und vorschlag false ist.
   */
  get isGueltig() {
    return this.counts && this.public && this.waehlbar && !this.vorschlag;
  }

  /**
   * Liefert einen Buchstaben, der den Status kennzeichnet.
   * @returns {string} P für public, C für counts, V für vorschlag, A aufheben
   */
  get statusLetter() {
    if (this.public) return 'P';
    if (this.counts) return 'C';
    if (this.vorschlag) return 'V';
    return 'A';
  }

  /**
   * Liefert ein Objekt mit dem Namen des Einteilungsstatus
   */
  get _info() {
    const result = {
      value: this.name,
      label: 'Status'
    };

    return result;
  }

  /**
   * Vorschläge und Counts-Einteilungen sollen angezeigt werden
   */
  get show() {
    return !!(this.counts || this.vorschlag);
  }
}

export default Einteilungsstatus;
