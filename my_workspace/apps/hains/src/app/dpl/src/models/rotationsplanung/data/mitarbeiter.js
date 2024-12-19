import Mitarbeiter from '../../apimodels/mitarbeiter';
import Helper from '../helper';

class RotationsplanMitarbeiter extends Mitarbeiter {
  constructor(obj, appModel) {
    super(obj, appModel, false);
    this.rotations_id = [];
    this.helper = null;
  }

  reset() {
    console.log('Reset');
    this.rotations_id = [];
    this.helper = null;
  }

  resetIds() {
    this.rotations_id = [];
  }

  pushRotationId(rotation) {
    if (!this.rotations_id.includes(rotation.id)) {
      this.rotations_id.push(rotation.id);
    }
    // console.log("mitarbeiter:pushRotationId", this.planname, this.rotations_id)
  }

  sortAndSetPos() {
    // console.log("sortAndSetPos", this.planname, this.rotations_id)
    this.helper = new Helper(this.rotations_id, this._timeline);
    this.rotations_id = this.helper.sortByPrio(this._rotationen);
    this.helper.createFirstItemInTmp(this._rotationen);

    const forTesting = {};

    this.rotations_id.forEach((id) => {
      const rotation = this._rotationen[id];
      const [left, right, top] = this.helper.getUiPositions(rotation);
      rotation.left = left;
      rotation.right = right;
      rotation.top = top;

      forTesting[rotation.id] = {
        id: rotation.id,
        left,
        right,
        top
      };
    });

    return forTesting;
  }

  isEmployeeActive(mitarbeiter_id) {
    return this._pageData.mitarbeiter[mitarbeiter_id].aktiv;
  }

  eachRotation(callback) {
    const arr = [];
    const onlyActiveEmployees = this._page.timeline.onlyActiveEmployees;
    this.rotations_id.forEach((id) => {
      const rotation = this._rotationen[id];
      if (onlyActiveEmployees) {
        if (this.isEmployeeActive(rotation.mitarbeiter_id)) {
          arr.push(callback(rotation));
        }
      } else {
        arr.push(callback(rotation));
      }
    });
    return arr;
  }

  getHeight() {
    return this.helper.getHeight();
  }
}

export default RotationsplanMitarbeiter;
