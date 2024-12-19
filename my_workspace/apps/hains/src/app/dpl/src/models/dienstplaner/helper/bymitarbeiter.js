import { getPrioRotationHelper, getRGB } from "../../../tools/helper";
import Basic from "../../basic";
import DienstplanerAddFeld from "./addfeld";
import DienstplanerDefaultFeld from "./defaultfeld";

class ByMitarbeiter extends Basic {
  constructor({
    einteilung_ids = {},
    wunsch_id = 0,
    rotation_ids = [],
    id = 0
  } = {}, appModel = false, date = false) {
    super(appModel);
    this._set("date", date);
    this._setObject("einteilung_ids", einteilung_ids);
    this._setArray("rotation_ids", rotation_ids);
    this._setInteger("wunsch_id", wunsch_id);
    this._setInteger("id", id);
    this.setRenderedContent();
    this.init();
    this._preventExtension();
  }

  /**
   * Liefert ein Label
   */
  get label() {
    return `${this?.date?.label || this.tag}, ${this.mitarbeiter?.planname || this.id}`;
  }

  /**
   * Liefert ein Key
   */
  get key() {
    return `${this.tag}_${this.id}`;
  }

  /**
   * Liefert den Mitarbeiter
   */
  get mitarbeiter() {
    return this._getIdsObject("_mitarbeiter", "id", false);
  }

  /**
   * Liefert den Wunsch
   */
  get wunsch() {
    return this._getIdsObject("_wuensche", "wunsch_id", false);
  }

  /**
   * Liefert die ID des tags
   */
  get tag() {
    return this?.date?.id || "";
  }

  /**
   * Liefert ein Add-Feld
   */
  get addFeldObj() {
    return new DienstplanerAddFeld({
      add: false,
      shouldSetFocus: true,
      byDienstBereich: this,
      value: "+",
      tag: this.tag,
      dienstId: 0,
      mitarbeiterId: this.id
    }, this._appModel);
  }

  /**
   * True, wenn date und mitarbeiter writable ist
   */
  get writable() {
    return this?.date?.writable && this?.mitarbeiter?.writable?.(this.tag, 0);
  }

  /**
   * Liefert ob nur die Dienste aus der Vorlage angezeigt werden sollen
   */
  get onlyVorlageDienste() {
    return this?._user?.dienstplanTableSettings?.only_vorlagedienste;
  }

  /**
   * Liefert die _zahl des Datums
   */
  get dateZahl() {
    return this?.date?._zahl || 0;
  }

  get allEinteilungenPublic() {
    let res = true;
    const felder = this.getFelder();
    if(!this._isArray(felder)) return res;
    const l = felder.length;
    for (let i = 0; i < l; i++) {
      const feld = felder[i];
      if (!this.onlyVorlageDienste || feld?.dienstIsInVorlage) {
        const einteilung = feld?.date?.isInMainZeitraum && feld?.visible && feld?.einteilung;
        if(!einteilung) continue;
        if(!einteilung?.public) {
          res = false;
          break;
        }
      }
    }
    return res;
  }

  /**
   * Liefert die Rotationen
   */
  get rotationen() {
    return this._getIdsObject('_rotationen', 'rotation_ids', true);
  }

  get prioRotation() {
    return getPrioRotationHelper(this._rotationen, this.rotation_ids);
  }

  /**
   * Erstellt ein default-Feld
   */
  getDefaultFeldObj(value = "-") {
    return new DienstplanerDefaultFeld({
      byDienstBereich: this,
      value,
      tag: this.tag,
      dienstId: 0,
      mitarbeiterId: this.id
    }, this._appModel);
  }

  /**
   * Setzt das Attribut renderedContent
   */
  setRenderedContent(content = false) {
    this._set("renderedContent", content);
  }

  /**
   * Liefert ein By-Dienst-Element des Datums
   * @param {Number} dienstId
   * @returns object
   */
  getDienstEl(dienstId = 0) {
    return this?.date?.getDienstEl?.(dienstId);
  }

  /**
   * @returns True, wenn ein neues Feld angehängt werden kann oder ein Feld leer ist
   */
  showAddFeldAlleDienste() {
    let show = false;
    if (this.writable) {
      this?._dienste?._each?.((dienst) => {
        const dienstEl = this.getDienstEl(dienst.id);
        if (dienst?.writable && dienstEl?.showAddFeld
          && (!this.onlyVorlageDienste || dienst.isInVorlage)) {
          show = dienstEl.showAddFeld();
        }
        return show;
      });
    }
    return show;
  }

  /**
   * Liefert alle Felder
   * @returns array
   */
  getFelder() {
    return (this?.mitarbeiter?.getEinteilungenNachTag?.(this.tag)) || [];
  }

   /**
   * Liefert die Namen der Dienste, Wünsche und die Farbe der Dienste
   * @returns Array
   */
   getDiensteEl() {
    const result = [];
    this.getFelder().forEach((feld) => {
      if ((!this.onlyVorlageDienste || feld?.dienstIsInVorlage) && feld?.dienst) {
        result.push(feld.dienst);
      } 
    });
    return result;
  }

  /**
   * Liefert die Namen der Dienste, Wünsche und die Farbe der Dienste
   * @param {Boolean} withWunsch
   * @param {Boolean} withColor
   * @param {Boolean} publish
   * @returns Array
   */
  getDienste(withColor = false, withWunsch = false, publish = false) {
    const result = [];
    if (withWunsch) {
      const wunsch = this?.wunsch;
      wunsch && result.push(withColor && wunsch?.getColor
        ? [`Wunsch: ${wunsch.getInitialien()}`, getRGB(wunsch.getColor())]
        : `Wunsch: ${wunsch.getInitialien()}`);
    }
    this.getFelder().forEach((feld) => {
      const einteilung = feld?.einteilung;
      if (publish && !(einteilung?.writable || einteilung?.public)) return;
      if (!this.onlyVorlageDienste || feld?.dienstIsInVorlage) {
        if(withColor) {
          const showEinteilungskontextFarbe = this?._farbgruppen?.showEinteilungskontextFarben;
          const colorEl = showEinteilungskontextFarbe ? feld?.einteilung : feld?.dienst;
          if(colorEl?.getColor) {
            result.push([feld.getValue("dienst"), getRGB(colorEl.getColor())]);
            return;
          }
        } 
        result.push(feld.getValue("dienst"));
      }
    });
    if (!result.length) result.push("-");
    return result;
  }

  /**
   * Liefert die Componeneten des By-Mitarbeiter-Elements
   * @param {Function} callback
   * @returns array
   */
  getContent(callback = false) {
    const content = [];
    const type = "dienst";
    const getFromCallback = this._isFunction(callback) 
      ? (feld) => callback(feld, type) 
      : (feld) => feld;
    this.getFelder().forEach((feld) => {
      if ((!this.onlyVorlageDienste || feld.dienstIsInVorlage) && feld?.visible) {
        content.push(getFromCallback(feld));
      }
    });
    const showAddFeld = this.showAddFeldAlleDienste();
    if (!(content.length || showAddFeld)) {
      content.push(getFromCallback(this.getDefaultFeldObj("-")));
    }
    // !content.length &&
    if(showAddFeld) {
      content.push(getFromCallback(this.addFeldObj));
    }
    return content;
  }

  /**
   * Fügt den Teams die zugehörigen Mitarbeiter und tage hinzu
   */
  init() {
    if (this?._rotationen) {
      const rotationen = this._rotationen;
      this?.rotation_ids?.forEach?.((rId) => {
        const team = rotationen?.[rId]?.team;
        team?.addMitarbeiter?.(this.tag, this.id, rId);
        this.mitarbeiter?.addRotationId?.(rId);
      });
    }
  }

  /**
   * Führt ein update der Mitarbeiterdaten durch
   * @param {Object} rotation
   * @param {Boolean} add
   */
  updateRotation(rotation, add = true) {
    const rId = rotation?.id;
    if (!rId) return;
    if (add) {
      this.addRotation(rotation);
    } else {
      this.removeRotation(rotation);
    }
  }

  /**
   * Entfernt die Rotation-Id aus der Liste und den Mitarbeiter aus dem Team
   * @param {Obejct} rotation
   */
  removeRotation(rotation) {
    const rId = rotation?.id;
    if (!this.rotation_ids.includes(rId) || !rId) return;
    const team = this._rotationen?.[rId]?.team;
    const rotIndex = this.rotation_ids.findIndex(
      (rotId) => (rId !== rotId && team === this._rotationen?.[rotId]?.team)
    );
    // Aus dem Team entfernen, wenn es die einzige Rotation ist
    if (rotIndex < 0) {
      team?.removeMitarbeiter?.(this.tag, this.id, rId);
    }
    const i = this.rotation_ids.indexOf(rId);
    if (i >= 0) {
      this.rotation_ids.splice(i, 1);
    }
  }

  /**
   * Fügt die Rotation-Id der Liste hinzu und den Mitarbeiter dem Team
   * @param {Object} rotation
   */
  addRotation(rotation) {
    const rId = rotation?.id;
    if (!rId) return;
    if (this.isInRotationTimeInterval(rotation)) {
      if (!this.rotation_ids.includes(rId)) {
        this.rotation_ids.push(rId);
      }
      const team = rotation?.team;
      team?.addMitarbeiter?.(this.tag, this.id, rId);
    }
  }

  /**
   * @param {Object} rotation
   * @returns true, wenn dateZahl im Zeitraum der Rotation liegt
   */
  isInRotationTimeInterval(rotation) {
    if (this?.date?.isInRotationTimeInterval) {
      return this.date.isInRotationTimeInterval(rotation);
    }
    return false;
  }

  /**
   * Testet, ob die Rotationen für den Einteilungstag
   * zum Dienst passen.
   * @param {Object} dienst
   * @returns Object
   */
  checkRotationen(dienst) {
    const result = {
      dienst,
      date: this?.date,
      fit: [],
      noFit: []
    };
    const rotationen = dienst && this.rotation_ids;
    const rots = this?._rotationen;
    rotationen?.forEach?.((rId) => {
      const r = rots?.[rId];
      if (!this.isInRotationTimeInterval(r)) return false;
      // Rotationen passen zum Dienst, wenn sie ein gleiches Thema beinhalten
      const key = r?.hasThema?.(dienst?.thema_ids) ? "fit" : "noFit";
      result[key].push(r);
      if (r?.kontingent?.sonderrotation) result.hasSonderroration = true;
    });
    return result;
  }

  isMitarbeiterInKontingent(kId) {
    const rotationen = this._rotationen;
    return !!(rotationen && this.rotation_ids?.find?.(
      (rId) => `${rotationen?.[rId]?.kontingent_id}` === `${kId}`)
    );
  }

  /**
   * Überschrieben der _push-Methode
   * Push auch in Mitarbeiter
   */
  _push = (setUpdate) => {
    if (setUpdate) this._pushToRegister(setUpdate, "update");
    this?.mitarbeiter?._push?.(this._update);
    this?._user?._push?.(this._update);
  };

  /**
   * Überschrieben der _pull-Methode
   * Pull auch aus Mitarbeiter
   */
  _pull = (setUpdate) => {
    if (setUpdate) this._pullFromRegister(setUpdate, "update");
    this?.mitarbeiter?._pull?.(this._update);
    this?._user?._pull?.(this._update);
  };
}

export default ByMitarbeiter;
