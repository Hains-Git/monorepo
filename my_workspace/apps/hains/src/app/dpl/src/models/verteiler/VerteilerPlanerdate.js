import PlanerDate from '../apimodels/planerdate';

class VerteilerPlanerdate extends PlanerDate {
  constructor(obj, appModel = false) {
    super(obj, appModel, false);
  }

  updateRotation(rotation, add = true) {
    super.updateRotation(rotation, add);
    if (add) {
      this.addRotationByMitarbeiter(rotation);
    } else {
      this.removeRotationByMitarbeiter(rotation);
    }
  }

  /**
   * Entfernt die Rotation-Id aus der Liste und den Mitarbeiter aus dem Team
   * @param {Obejct} rotation
   */
  removeRotationByMitarbeiter(rotation) {
    const rId = rotation?.id;
    if (!rId) return;
    const bymitarbeiter = this.getMitarbeiterEl(rotation?.mitarbeiter?.id);
    if (this._isArray(bymitarbeiter?.rotation_ids)) {
      bymitarbeiter.rotation_ids = bymitarbeiter.rotation_ids.filter(
        (rotId) => rId !== rotId
      );
    }
    const team = this._rotationen?.[rId]?.team;
    if (team?.removeMitarbeiter) {
      team.removeMitarbeiter(this.id, rotation?.mitarbeiter?.id || 0, rId);
    }
  }

  /**
   * Fügt die Rotation-Id der Liste hinzu und den Mitarbeiter dem Team
   * @param {Object} rotation
   */
  addRotationByMitarbeiter(rotation) {
    const rId = rotation?.id;
    if (!rId) return;
    const bymitarbeiter = this.getMitarbeiterEl(rotation?.mitarbeiter?.id);
    if (!this._isArray(bymitarbeiter?.rotation_ids)) return;
    if (this.isInRotationTimeInterval(rotation)) {
      if (!bymitarbeiter.rotation_ids.includes(rId)) {
        bymitarbeiter.rotation_ids.push(rId);
      }
      const team = rotation?.team;
      if (team?.addMitarbeiter) {
        team.addMitarbeiter(this.id, rotation?.mitarbeiter?.id || 0, rId);
      }
    }
  }
}
export default VerteilerPlanerdate;
