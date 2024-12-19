import Kontingent from '../../apimodels/kontingent';
import Helper from '../helper';

class RotationsplanKontingent extends Kontingent {
  constructor(obj, appModel) {
    super(obj, appModel, false);
    this.rotations_id = [];
    this.helper = null;
    this.rotationenByMonth = {};
  }

  get vk() {
    return this?._page?.getVKKontingent?.(this.team_id, this.id) || 0;
  }

  get vkTitle() {
    return this?._page?.getVKKontingentTitle?.(this.team_id, this.id) || '';
  }

  reset() {
    this.rotations_id = [];
    this.helper = null;
  }

  resetIds() {
    this.rotations_id = [];
  }

  pushRotationIdByMonth(rotation) {
    const vonDate = new Date(rotation.von);
      const bisDate = new Date(rotation.bis);
      vonDate.setDate(1);
      bisDate.setDate(1);
      while(vonDate <= bisDate) {
        const yearMonth = `${vonDate.getFullYear()}-${vonDate.getMonth()}`;
        if (!this.rotationenByMonth[yearMonth]) {
          this.rotationenByMonth[yearMonth] = [rotation.id];
        } else {
          this.rotationenByMonth[yearMonth].push(rotation.id);
        }
        vonDate.setMonth(vonDate.getMonth() + 1);
      }
  }

  pushRotationId(rotation) {
    if (!this.rotations_id.includes(rotation.id)) {
      this.pushRotationIdByMonth(rotation);
      this.rotations_id.push(rotation.id);
    }
  }

  sortAndSetPos() {
    this.helper = new Helper(this.rotations_id, this._timeline);

    this.rotations_id = this.helper.sortObj(this._rotationen);
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

  hasCollisions(curRotation, rotationenByContingent) {
    const curRotationBis = new Date(curRotation.bis).getTime();
    const curRotationVon = new Date(curRotation.von).getTime();
    return rotationenByContingent.find((_rotation) => {
      const rotationVon = new Date(_rotation.von).getTime();
      if (parseInt(curRotation.position, 10) !== parseInt(_rotation.position, 10)) return;
      return curRotationVon <= rotationVon && curRotationBis > rotationVon;
    });
  }

  findCollisions(rotation) {
    const rotationenByContingent = Object.values(this._rotationen).filter(
      (_rotation) =>
        parseInt(_rotation.kontingent_id, 10) === parseInt(rotation.kontingent_id, 10) &&
        parseInt(_rotation.id, 10) !== parseInt(rotation.id, 10)
    );
    if (this.hasCollisions(rotation, rotationenByContingent)) {
      rotation.collision = true;
    }
  }
}

export default RotationsplanKontingent;
