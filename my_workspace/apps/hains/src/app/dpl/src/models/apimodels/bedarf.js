import Basic from '../basic';
import { formatDate } from '../../tools/dates';

/**
 * Klasse um ein Bedarf-Objekt zu erstellen.
 * Bedarf entspricht den Dienstbedarves aus der API.
 * @class
 */
class Bedarf extends Basic {
  constructor(obj, appModel = false, preventExtension = true) {
    super(appModel);
    this._setInteger('arbeitszeitverteilung_id', obj.arbeitszeitverteilung_id);
    this._setInteger('bereich_id', obj.bereich_id);
    this._setInteger('dienstverteilungstyp_id', obj.dienstverteilungstyp_id);
    this._set(
      'end_date',
      obj?.end_date ? formatDate(obj.end_date) : obj.end_date
    );
    this._setInteger('kostenstelle_id', obj.kostenstelle_id);
    this._setInteger('id', obj.id);
    this._setInteger('opt', obj.opt);
    this._setInteger('min', obj.min);
    this._setInteger('po_dienst_id', obj.po_dienst_id);
    this._set('verteilungscode', obj.verteilungscode);
    this._setInteger('zeitraumkategories_id', obj.zeitraumkategories_id);
    if (preventExtension) this._preventExtension();
  }

  /**
   * Liefert die entsprechende Zeitraumkategorie
   */
  get zeitraumkategorie() {
    return this._getIdsObject(
      '_zeitraumkategorien',
      'zeitraumkategories_id',
      true
    );
  }

  /**
   * Liefert die entsprechende Arbeitszeitverteilung
   */
  get arbeitszeitverteilung() {
    return this._getIdsObject(
      '_arbeitszeitverteilungen',
      'arbeitszeitverteilung_id',
      true
    );
  }

  /**
   * Liefert den entsprechenden Dienst
   */
  get dienst() {
    return this._getIdsObject(
      ['_dienste', '_po_dienste'],
      'po_dienst_id',
      true
    );
  }

  /**
   * Liefert den entsprechenden Dienstverteilungstyp
   */
  get dienstverteilungstyp() {
    return this._getIdsObject(
      '_dienstverteilungstypen',
      'dienstverteilungstyp_id',
      true
    );
  }

  /**
   * Liefert den entsprechenden Bereich
   */
  get bereich() {
    return this._getIdsObject('_bereiche', 'bereich_id', true);
  }

  /**
   * Liefert die entsprechende Kostenstelle
   */
  get kostenstelle() {
    return this._getIdsObject('_kostenstellen', 'kostenstelle_id', true);
  }

  /**
   * Liefert ein Objekt mit Informationen zu dem Bedarf.
   * Darunter fallen die ID, die Zeitraumkategorie, Min und Max Bedarf,
   * Infos über die Arbeitszeitverteilung, Bereich, Dienstverteilungstyp...
   */
  get _info() {
    const arbeitszeitverteilung = this.arbeitszeitverteilung?._info || {
      value: this.arbeitszeitverteilung_id,
      label: 'Arbeitszeitverteilung'
    };

    const bedarfInfos = {
      id: { value: this.id.toString(), label: 'ID' },
      name_z: {
        value:
          this?.zeitraumkategorie?.name ||
          this.zeitraumkategories_id.toString(),
        label: 'Zeitraumkategorie'
      },
      min: { value: this.min.toString(), label: 'Min. Bedarf' },
      max: { value: (this.min + this.opt).toString(), label: 'Max. Bedarf' },
      name_a: arbeitszeitverteilung
    };

    if (this.end_date !== null)
      bedarfInfos.endeBedarf = { value: this.end_date, label: 'Ende' };
    if (this?.bereich) bedarfInfos.bereich = this.bereich._feldInfo;
    if (this?.zeitraumkategorie)
      bedarfInfos.zeitraum = this.zeitraumkategorie._info;
    if (this?.dienstverteilungstyp)
      bedarfInfos.verteilungstyp = this.dienstverteilungstyp._info;

    return bedarfInfos;
  }
}

export default Bedarf;
