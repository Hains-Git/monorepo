import Rotation from '../../apimodels/rotation';

class RotationsplanRotation extends Rotation {
  constructor(obj, appModel) {
    super(obj, appModel, false);
  }

  /**
   * Liefert Kontingent der Rotation
   */
  get kontingent() {
    return this._pageData.kontingente[this.kontingent_id];
  }

  /**
   * Liefert den eingeteilten Mitarbeiter
   */
  get mitarbeiter() {
    return this._pageData.mitarbeiter[this.mitarbeiter_id];
  }

  addToContingent() {
    this.kontingent.pushRotationId(this);
  }

  addToEmployee() {
    this.mitarbeiter.pushRotationId(this);
  }
}

export default RotationsplanRotation;
