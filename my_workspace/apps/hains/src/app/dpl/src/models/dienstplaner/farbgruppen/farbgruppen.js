import { debounce, wait } from "../../../tools/debounce";
import { showConsole } from "../../../tools/flags";
import Basic from "../../basic";

class Farbgruppen extends Basic {
  constructor(appModel = false) {
    super(appModel);
    this.init();
    this._preventExtension();
    if (showConsole) this._whoAmI();
  }

  get max() {
    return 30;
  }

  get options() {
    const tablesOptions = this._dienstplanTable?.farbgruppenOptions;
    return tablesOptions || {
      dienste: true,
      dienstkategorien: true,
      einteilungskontext: true,
      farbgruppen: true
    }
  }

  init() {
    this._setArray("KEYS", [
      "dienste",
      "dienstkategorien",
      "gruppen",
      "transparent"
    ]);
    this._setInteger("gruppenLength", 0);
    this._setObject(this.KEYS[0], {});
    this._setObject(this.KEYS[1], {});
    this._setObject(this.KEYS[2], {});
    this._set("defaultColor", "#000000");
    this?._dienste?._each?.((dienst) => {
      this.dienste[dienst.id] = false;
    });
    this?._dienstkategorien?._each?.((dk) => {
      this.dienstkategorien[dk.id] = false;
    });
    this.initFromUser();
  }

  initFromUser() {
    if (this?._user?.farbgruppenSettings) {
      const {
        dienstfarben,
        dientkategoriefarben,
        farbgruppen
      } = this._user.farbgruppenSettings;
      this.setShowEinteilungskontextFarben();
      this.setShowDienstfarben(dienstfarben);
      this.setShowDienstkategoriefarben(dientkategoriefarben);
      farbgruppen.forEach((gruppe) => {
        this.addGruppe(gruppe.color, gruppe.show);
        const pos = this.gruppenLength.toString();
        let key = this.KEYS[0];
        const updateElements = (id) => {
          this.changeGruppe(key, id, pos);
        };
        gruppe.dienste_ids.forEach(updateElements);
        key = this.KEYS[1];
        gruppe.dienstkategorien_ids.forEach(updateElements);
        this.updateColors(pos);
      });
    } else {
      this.setShowEinteilungskontextFarben();
      this.setShowDienstfarben();
      this.setShowDienstkategoriefarben();
    }
  }

  setCustomColors(key = this.KEYS[0], color = false, bedingung = () => true) {
    this.eachElement(key, (el, id, elObj) => {
      if (bedingung(el, id, elObj, key)) {
        if (elObj.setCustomColor) {
          elObj.setCustomColor(color);
        } else console.log(`Bei ein Problem bei ${key} (${id})`, elObj.setCustomColor);
      }
    });
  }

  eachElement(key = this.KEYS[0], callback = false, checkSingleton = true) {
    const elemente = this[key];
    if (!this._isFunction(callback)) return false;
    for (const id in elemente) {
      const basicKey = `_${key}`;
      const basicElements = checkSingleton ? this[basicKey] : false;
      const elObj = basicElements && basicElements[id];
      if (elObj || !checkSingleton) {
        if (callback(elemente[id], id, elObj, elemente) === true) break;
      } else console.log(`Es gibt ein Problem mit ${key}`, key, elemente, basicKey, basicElements, elObj);
    }
  }

  toggle(type = 0) {
    if (type === 0) this.setShowDienstfarben(!this.showDienstfarben);
    else if (type === 1) this.setShowEinteilungskontextFarben(!this.showEinteilungskontextFarben);
    else this.setShowDienstkategoriefarben(!this.showDienstkategoriefarben);
    this._update();
    this.updateTable();
  }

  debouncedToogle = debounce((type = 0) => {
    this.toggle(type);
  }, wait);

  checkGruppe(el) {
    if (el === false) return true;
    const gruppe = this.getGruppe(el);
    if (gruppe && gruppe.show) return false;
    return true;
  }

  setShowDienstfarben(check = true) {
    this._set("showDienstfarben", check);
    this.setCustomColors(this.KEYS[0], check ? false : this.KEYS[3], (el) => this.checkGruppe(el));
  }

  setShowDienstkategoriefarben(check = false) {
    this._set("showDienstkategoriefarben", check);
    this.setCustomColors(this.KEYS[1], check ? false : this.KEYS[3], (el) => this.checkGruppe(el));
  }

  setShowEinteilungskontextFarben(check = false) {
    this._set("showEinteilungskontextFarben", check);
    // this.setCustomColors(this.KEYS[0], check ? false : this.KEYS[3], (el) => this.checkGruppe(el));
  }

  incrementGruppenLength(add = true) {
    const toAdd = add ? 1 : -1;
    if (!add && this.gruppenLength < 1) return;
    this._set("gruppenLength", this.gruppenLength + toAdd);
  }

  addGruppe(color = false, show = true) {
    if (this.gruppenLength < this.max) {
      this.incrementGruppenLength(true);
      this.setGruppenColor(this.gruppenLength, color, show);
      this._update();
    }
  }

  removeGruppe() {
    const id = this.gruppenLength;
    const stringId = id.toString();
    if (this.gruppen[id]) {
      let key = this.KEYS[0];
      const callback = (el, id) => {
        if (el === stringId) {
          this.changeGruppe(key, id, false);
        }
      };

      this.eachElement(key, callback);
      key = this.KEYS[1];
      this.eachElement(key, callback);

      delete this.gruppen[id];
      this.incrementGruppenLength(false);
      this._update();
      this.updateTable();
    }
  }

  setGruppenColor(id = 1, color = false, show = true) {
    const clr = color || this.defaultColor;
    this.gruppen[id] = { color: clr, pos: id, show };
    this._update();
  }

  debouncedSetGruppenColor = debounce((id = 1, color = false) => {
    const clr = color || this.defaultColor;
    const gruppe = this.getGruppe(id);
    if (gruppe) {
      gruppe.color = clr;
      this.updateColors(id);
      this._update();
    }
  }, wait);

  debouncedSetGruppenShow = debounce((id = 1, checked = true) => {
    const gruppe = this.getGruppe(id);
    if (gruppe) {
      gruppe.show = checked;
      this.updateColors(id);
      this._update();
    }
  }, wait);

  updateColors(id = 1) {
    const gruppe = this.getGruppe(id);
    if (gruppe) {
      const { show, color } = gruppe;
      const bedingung = (el) => el === id;
      let c = color;
      if (!show) c = this.showDienstfarben ? false : this.KEYS[3];
      this.setCustomColors(this.KEYS[0], c, bedingung);
      if (!show) c = this.showDienstkategoriefarben ? false : this.KEYS[3];
      this.setCustomColors(this.KEYS[1], c, bedingung);
      this.updateTable();
    }
  }

  setColorOfEl(elObj, key, gruppenId, neueGruppe = false) {
    if (!neueGruppe || gruppenId === false) {
      const showOwnColor = this.KEYS[0] === key
        ? this.showDienstfarben
        : this.showDienstkategoriefarben;
      elObj?.setCustomColor?.(showOwnColor ? false : this.KEYS[3]);
    }
  }

  setAll(key = this.KEYS[0], gruppenId = 0, setColor = true) {
    const elemente = this[key];
    if(elemente) {
      this.eachElement(key, (el, id, elObj) => {
        const neueGruppe = el !== gruppenId;
        elemente[id] = setColor ? gruppenId : false;
        this.setColorOfEl(elObj, key, gruppenId, neueGruppe);
      });
    }
    this._update();
  }

  changeGruppe(key = this.KEYS[0], elementId = 0, gruppenId = 0) {
    const elemente = this[key];
    if (elemente) {
      const thisGruppe = elemente[elementId];
      const neueGruppe = thisGruppe !== gruppenId;
      elemente[elementId] = neueGruppe ? gruppenId : false;
      const apiKey = `_${key}`;
      this.setColorOfEl(this[apiKey]?.[elementId], key, gruppenId, neueGruppe);
    }
    this._update();
  }

  getDienste(callback = false) {
    const dienste = [];
    this.eachElement(this.KEYS[0], (el, id, elObj) => {
      if (elObj) dienste.push(callback ? callback(elObj, el, id) : [elObj, el, id]);
    });
    return dienste;
  }

  getDienstkategorien(callback = false) {
    const dienstkategorien = [];
    this.eachElement(this.KEYS[1], (el, id, elObj) => {
      if (elObj) dienstkategorien.push(callback ? callback(elObj, el, id) : [elObj, el, id]);
    });
    return dienstkategorien;
  }

  getGruppen(callback = false) {
    const gruppen = [];
    this.eachElement(this.KEYS[2], (el, id) => {
      gruppen.push(callback ? callback(el, id) : [el, id]);
    }, false);

    return gruppen;
  }

  getGruppe(id) {
    return this.gruppen[id];
  }

  getGruppenColor(id) {
    let color = this.defaultColor;
    const gruppe = this.getGruppe(id);
    if (gruppe) {
      color = gruppe.color;
    }

    return color;
  }

  getGruppenShow(id) {
    let show = false;
    const gruppe = this.getGruppe(id);
    if (gruppe) {
      show = gruppe.show;
    }

    return show;
  }

  updateTable() {
    this?._page?.updateColor?.();
  }

  getSettings() {
    const gruppen = {
      dienstfarben: this.showDienstfarben,
      dientkategoriefarben: this.showDienstkategoriefarben
    };
    const addGruppe = (id, callback) => {
      const gruppe = this.getGruppe(id);
      if (gruppe) {
        if (gruppen[id] === undefined) {
          gruppen[id] = {
            dienste_ids: [],
            dienstkategorien_ids: [],
            pos: gruppe.pos,
            color: gruppe.color,
            show: gruppe.show
          };
        }
        callback(gruppen[id]);
      }
    };
    this.eachElement(this.KEYS[0], (id, dienst_id) => {
      if (id === false) return false;
      addGruppe(id, (gruppe) => {
        gruppe.dienste_ids.push(parseInt(dienst_id, 10));
      });
    });
    this.eachElement(this.KEYS[1], (id, dienstkategorie_id) => {
      if (id === false) return false;
      addGruppe(id, (gruppe) => {
        gruppe.dienstkategorien_ids.push(parseInt(dienstkategorie_id, 10));
      });
    });

    return gruppen;
  }
}

export default Farbgruppen;
