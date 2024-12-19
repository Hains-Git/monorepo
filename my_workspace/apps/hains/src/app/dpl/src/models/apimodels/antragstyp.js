import Basic from '../basic';

class Antragstyp extends Basic {
  constructor(obj, appModel = false, preventExtension = true) {
    super(appModel);
    this._setInteger('id', obj.id);
    this._set('name', obj.name);
    this._setInteger('po_dienst_id', obj.po_dienst_id);
    this._setInteger('we_holiday_po_dienst_id', obj.we_holiday_po_dienst_id);
    this._setInteger(
      'check_alternative_po_dienst_id',
      obj.check_alternative_po_dienst_id
    );
    this._setInteger('alternative_po_dienst_id', obj.alternative_po_dienst_id);
    if (preventExtension) this._preventExtension();
  }
}

export default Antragstyp;
