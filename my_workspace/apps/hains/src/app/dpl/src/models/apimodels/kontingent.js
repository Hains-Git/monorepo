import { numericLocaleCompare } from '../../tools/helper';
import Basic from '../basic';

/**
 * Klasse um ein Kontingent-Objekt zu erstellen.
 * @class
 */
class Kontingent extends Basic {
  constructor(obj, appModel = false, preventExtension = true) {
    super(appModel);
    this._set('kurzname', obj.kurzname);
    this._set('kommentar', obj.kommentar);
    this._setInteger('position', obj.position);
    this._setArray('thema_ids', obj.thema_ids);
    this._setInteger('id', obj.id);
    this._set('name', obj.name);
    this._setInteger('team_id', obj.team_id);
    this._set('sonderrotation', !!obj.sonderrotation);
    this._setArray(
      'kontingent_po_dienst',
      obj?.kontingent_po_diensts
        ? obj?.kontingent_po_diensts
        : obj.kontingent_po_dienst
    );
    this._set('show_all_rotations', !!obj.show_all_rotations);
    if (preventExtension) this._preventExtension();
  }

  get isMagicEinteilungPrio() {
    return this.diensteNamenAndPrio.count;
  }

  get diensteNamenAndPrio() {
    const dienste = [];
    let count = 0;
    this.sortedEachMagicEinteilungDienst((dienst, weight) => {
      dienste.push(`${dienst.planname} (${weight})`);
      count++;
    });
    return {
      count,
      dienste
    };
  }

  /**
   * Liefert Team des Kontingents
   */
  get team() {
    return this._getIdsObject('_teams', 'team_id', true);
  }

  /**
   * Liefert Name des Kontingent-Teams oder Kein Team, falls kein Team im Kontingent existiert
   */
  get teamName() {
    return this?.team?.name || 'Kein Team';
  }

  /**
   * Liefert die Themen
   */
  get themen() {
    return this._getIdsObject('_themen', 'thema_ids', true);
  }

  /**
   * Liefert ein Info-Objekt
   */
  get _info() {
    const info = {
      value: {
        id: { value: this.id.toString(), label: 'ID' },
        name: { value: this.name, label: 'Name' },
        position: { value: this.position.toString(), label: 'Position' },
        team: { value: this.teamName, label: 'Team' }
      },
      label: 'Kontingent',
      sort: this.name
    };
    if (this.kurzname) {
      info.value.kurzname = { value: this.kurzname, label: 'Kurzname' };
    }
    if (this.kommentar) {
      info.value.kommentar = { value: this.kommentar, label: 'Kommentar' };
    }
    const { themen } = this;
    if (themen.length) {
      info.value.Themen = { value: {}, label: 'Themen', sorting: 'alph-asc' };
      themen.forEach((t) => {
        info.value.Themen.value[t.id] = t._info;
      });
    }
    return info;
  }

  /**
   * @param {Array} themenIds
   * @returns True, wenn themenIds und thema_ids mindestens eine gleiche ID haben.
   */
  hasThema(themenIds) {
    return !!(
      themenIds?.includes && this.thema_ids.find((id) => themenIds.includes(id))
    );
  }

  sortedEachMagicEinteilungDienst(callback) {
    const dienste = this._dienste || this._po_dienste;
    if (!dienste || !this._isFunction(callback)) return;
    if (this.kontingent_po_dienst?.length) {
      this.kontingent_po_dienst
        ?.sort?.((a, b) => {
          const aValue = parseInt(a?.eingeteilt_count_factor, 10) || Infinity;
          const bValue = parseInt(b?.eingeteilt_count_factor, 10) || Infinity;
          const sort = aValue - bValue;
          if (sort) return sort;
          return numericLocaleCompare(
            dienste[a.po_dienst_id]?.planname,
            dienste[b.po_dienst_id]?.planname
          );
        })
        ?.forEach?.((kp) => {
          const dienst = dienste[kp.po_dienst_id];
          const weight = parseInt(kp?.eingeteilt_count_factor, 10);
          if (kp?.magic_einteilung && weight) {
            callback(dienst, weight, kp);
          }
        });
    }
  }
}

export default Kontingent;
