import { getFullDate, formatDate } from '../../tools/dates';
import Basic from '../basic';

/**
 * Klasse um ein Rotation-Objekt zu erstellen.
 * Entspricht EinteilungRotation aus der API.
 * @class
 */
class Rotation extends Basic {
  constructor(obj, appModel = false, preventExtension = true) {
    super(appModel);
    this._set('bis', formatDate(obj.bis));
    this._set('kommentar', obj.kommentar);
    this._setInteger('kontingent_id', obj.kontingent_id);
    this._setInteger('mitarbeiter_id', obj.mitarbeiter_id);
    this._setInteger('id', obj.id);
    this._set('mitarbeiter_planname', obj.mitarbeiter_planname);
    this._setInteger('position', obj.position);
    this._setInteger('prioritaet', obj.prioritaet);
    this._set('published', obj.published);
    this._set('published_at', obj.published_at);
    this._set('published_by', obj.published_by);
    this._set('von', formatDate(obj.von));
    this._setArray(
      'all_rotations',
      obj.all_rotations?.map?.((r) => new Rotation(r, appModel, false)) || []
    );
    this.formatTime('von');
    this.formatTime('bis');
    if (preventExtension) this._preventExtension();
  }

  get verteilerHoverLabelNoPrio() {
    return `${this.name}${this.teamName ? ` (${this.teamName})` : ''}`;
  }

  get verteilerHoverLabel() {
    return `${this.prioritaet}: ${this.name}${this.teamName ? ` (${this.teamName})` : ''}`;
  }

  /**
   * Liefert "name (von - bis, team)" der Rotation
   */
  get kontingentLabel() {
    return `${this.name} (${this.vonDateString} - ${this.bisDateString})`;
  }

  /**
   * Liefert Kontingent der Rotation
   */
  get kontingent() {
    return this._getIdsObject('_kontingente', 'kontingent_id', true);
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
   * Liefert Name des Kontingents
   */
  get name() {
    return this?.kontingent?.name || this.kontingent_id;
  }

  get kontingentPosition() {
    return this?.kontingent?.position || 0;
  }

  /**
   * Liefert Team des Kontingents
   */
  get team() {
    return this?.kontingent?.team || false;
  }

  /**
   * Liefert Name des Kontingent-Teams oder Kein Team, falls kein Team im Kontingent existiert
   */
  get teamName() {
    return this?.team?.name || 'Kein Team';
  }

  /**
   * Liefert Informationen zu der Bewertung
   */
  get _info() {
    const info = this._infoNotAll;
    if (this.all_rotations.length > 0) {
      info.value.all_rotations = {
        value: {},
        label: 'Alle Rotationen'
      };
      this.all_rotations.forEach((r) => {
        if (r.id === this.id) return;
        info.value.all_rotations.value[r.id] = r._infoNotAll;
      });
    }
    return info;
  }

  get _infoNotAll() {
    const info = {
      value: {
        id: { value: this.id.toString(), label: 'ID' },
        position: { value: this.position.toString(), label: 'Position' },
        prioritaet: { value: this.prioritaet.toString(), label: 'Priorität' },
        von: { value: this.vonDateString, label: 'Von' },
        bis: { value: this.bisDateString, label: 'Bis' }
      },
      label: this.name.toString(),
      sort: this.name.toString()
    };
    if (this.kommentar) {
      info.value.kommentar = {
        value: this.kommentar.toString(),
        label: 'Komentar'
      };
    }
    const kontingent = this?.kontingent?._info;
    if (kontingent) {
      info.value.kontingent = kontingent;
    }
    return info;
  }

  /**
   * Formatiert das von/bis aus der Api (Form eines Datums mit Zeit)
   * zu einem Datum.
   * Dabei wird das Datum als Zahl YYYYMMDD
   * und als String d.m.y gespeichert
   * @param {String} key
   */
  formatTime(key) {
    if (typeof this[key] !== 'string') {
      console.error('Rotation kann Zeit nicht formatieren', key, this[key]);
    }
    this._set(`${key}Zahl`, this._dateZahl(this[key]));
    this._set(`${key}DateString`, getFullDate(this[key]));
  }

  /**
   * @param {Array} themenIds
   * @returns True, wenn Kontingent das ein passendes Thema hat
   */
  hasThema(themenIds) {
    return !!this?.kontingent?.hasThema?.(themenIds);
  }
}

export default Rotation;
