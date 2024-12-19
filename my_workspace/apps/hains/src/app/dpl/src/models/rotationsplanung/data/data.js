import Basic from '../../basic';
import RotationsplanKontingent from './kontingent';
import RotationsplanMitarbeiter from './mitarbeiter';
import RotationsplanRotation from './rotation';
import RotationsplanFunktion from './funktion';

class Data extends Basic {
  constructor(data, appModel = false) {
    super(appModel);
    this.kontingente = this.initKontingente();
    this.mitarbeiter = this.initMitarbeiter();
    this.rotationen = this.initRotationen(data.rotationen);
    this.funktionen = this.initFunktionen();
  }

  createRotation(rotation) {
    return new RotationsplanRotation(rotation, this._appModel);
  }

  initRotationen(rotationen) {
    const rotObj = {};

    for (const id in rotationen) {
      rotObj[id] = this.createRotation(rotationen[id]);
    }
    return rotObj;
  }

  initMitarbeiter() {
    const mitObj = {};
    this?._mitarbeiters?._each((mitarbeiter) => {
      mitObj[mitarbeiter.id] = new RotationsplanMitarbeiter(
        mitarbeiter._me,
        this._appModel
      );
    });
    return mitObj;
  }

  initKontingente() {
    const kontingentObj = {};
    this?._kontingente?._each((kontingent) => {
      kontingentObj[kontingent.id] = new RotationsplanKontingent(
        kontingent._me,
        this._appModel
      );
    });
    return kontingentObj;
  }

  initFunktionen() {
    const funktionenObj = {};
    this?._funktionen?._each((funktion) => {
      funktionenObj[funktion.id] = new RotationsplanFunktion(
        funktion._me,
        this._appModel
      );
    });
    return funktionenObj;
  }

  isCurrentEmployeeActive(rotationApi) {
    const mitarbeiter_id = rotationApi.mitarbeiter_id;
    const mitarbeiter = this.mitarbeiter[mitarbeiter_id];
    if (mitarbeiter) {
      return mitarbeiter.aktiv;
    }
    return false;
  }

  addNewRotationenToContingent(rotationen, mode = 'add') {
    const rotObj = {};
    for (const id in rotationen) {
      const rotationObj = this.createRotation(rotationen[id]);

      rotationObj.addToContingent();
      rotObj[id] = rotationObj;
    }

    if (mode === 'add') {
      this.rotationen = {
        ...this.rotationen,
        ...rotObj
      };
    }
    if (mode === 'new') {
      this.rotationen = {
        ...rotObj
      };
    }

    Object.values(this.kontingente).forEach((kontingent) => kontingent.sortAndSetPos());

    return this.rotationen;
  }

  addNewRotationenToEmployee(rotationen, mode = 'add') {
    const rotObj = {};
    for (const id in rotationen) {
      const rotationObj = this.createRotation(rotationen[id]);
      rotationObj.addToEmployee();
      rotObj[id] = rotationObj;
    }

    if (mode === 'add') {
      this.rotationen = {
        ...this.rotationen,
        ...rotObj
      };
    }
    if (mode === 'new') {
      this.rotationen = {
        ...rotObj
      };
    }

    Object.values(this.mitarbeiter).forEach((mitarbeiter) => mitarbeiter.sortAndSetPos());

    return this.rotationen;
  }

  removeRotationFromContingent(rotation) {
    this.kontingente[rotation.kontingent_id].resetIds();

    const rotObj = {};
    for (const id in this.rotationen) {
      if (parseInt(id, 10) !== rotation.id) {
        const rotationObj = this.createRotation(this.rotationen[id]);
        rotationObj.addToContingent();
        rotObj[id] = rotationObj;
      }
    }

    this.rotationen = {
      ...rotObj
    };

    Object.values(this.kontingente).forEach((kontingent) => kontingent.sortAndSetPos());

    return this.rotationen;
  }

  removeRotationFromEmployee(rotation) {
    this.mitarbeiter[rotation.mitarbeiter_id].resetIds();

    const rotObj = {};
    for (const id in this.rotationen) {
      if (parseInt(id, 10) !== rotation.id) {
        const rotationObj = this.createRotation(this.rotationen[id]);
        rotationObj.addToEmployee();
        rotObj[id] = rotationObj;
      }
    }

    this.rotationen = {
      ...rotObj
    };

    Object.values(this.mitarbeiter).forEach((mitarbeiter) => mitarbeiter.sortAndSetPos());

    return this.rotationen;
  }
}

export default Data;
