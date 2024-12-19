import Basic from '../basic';
import { formatDate } from '../../tools/dates';

class Antrag extends Basic {
  constructor(obj, appModel = false, preventExtension = true) {
    super(appModel);
    this._setInteger('id', obj.id);
    this._setInteger('mitarbeiter_id', obj.mitarbeiter_id);
    this._setInteger('antragstyp_id', obj.antragstyp_id);
    this._setInteger('antragsstatus_id', obj.antragsstatus_id);
    this._set('start', obj.start ? formatDate(obj.start) : obj.start);
    this._set('ende', obj.ende ? formatDate(obj.ende) : obj.ende);
    this._set('abgesprochen', obj.abgesprochen);
    this._set('kommentar', obj.kommentar);
    if (preventExtension) this._preventExtension();
  }
}

export default Antrag;
