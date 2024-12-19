import Freigabe from "../apimodels/freigabe";
import Rotation from "../apimodels/rotation";
import Basic from "../basic";

class Channel extends Basic {
  constructor(key = "channel", parent = false, appModel = false, preventExtension = false) {
    super(appModel);
    this._set("parent", parent);
    this._set("key", key);
    this.setOnline();
    if (preventExtension) this._preventExtension();
  }

  /**
   * Liefert den Channel aus dem User
   */
  get channel() {
    return this?._user?.getChannel?.(this.key);
  }

  /**
   * Setzt das online Attribut
   * @param {Boolean} bool
   */
  setOnline(bool = false) {
    this._set("online", bool);
    this._update();
  }

  /**
   * Empfängt die Daten und führt entsprechende Operationen aus
   * @param {Object} data
   */
  receive(data = false) {
    console.log("Channel received:", {
      channel: this,
      data
    });
  }

  /**
   * Führt ein Update der Freigabe durch
   * @param {Object} freigabe
   * @param {Array} dienste_ids
   * @param {Function} callback
   */
  freigabeUpdate(freigabe, dienste_ids = [], callback = false) {
    if (this._isObject(freigabe)) {
      // Alte Freigabe entfernen
      const f = new Freigabe(freigabe, this._appModel);
      const mitarbeiter = f.mitarbeiter;
      const oldF = this?._freigaben?.[freigabe?.id];
      const oldM = oldF?.mitarbeiter;
      oldM?.updateFreigabe?.(oldF, false);
      mitarbeiter?.updateFreigabe?.(f, f?.qualifiziert);
      // Mitarbeiter aus qualifizierte Mitarbeiter entfernen und neue Mitarbeiterin hinzufügen
      dienste_ids?.forEach?.((dId) => {
        const dienst = this?._dienste?.[dId] || this?._po_dienste?.[dId];
        if (this._isObject(oldM)) {
          dienst?.removeQualifizierteMitarbeiter?.(oldM);
        }
        if (this._isObject(mitarbeiter)) {
          dienst?.addQualifizierteMitarbeiter?.(mitarbeiter);
        }
      });
      if (this._isFunction(callback)) {
        callback(f, mitarbeiter, oldM);
      }
      this.addOrRemoveElement("_freigaben", f, f?.qualifiziert);
      this.updateThroughMitarbeiter(mitarbeiter, oldM);
    }
  }

  wunschUpdate(wunsch) {
    if(!this._isObject(wunsch)) return;
    this._page?.updateWunsch(wunsch);
  }

  /**
   * Führt ein Update der Rotation durch
   * @param {Object} rotation
   * @param {Boolean} add
   */
  rotationUpdate(rotation, add = false, callback = false) {
    if (this._isObject(rotation)) {
      // Alte Rotation entfernen
      const oldR = this?._rotationen?.[rotation?.id];
      const oldM = oldR?.mitarbeiter;
      oldM?.updateFreigabe?.(oldR, false);
      // Neue Rotation hinzufügen
      const r = new Rotation(rotation, this._appModel);
      const mitarbeiter = r.mitarbeiter;
      mitarbeiter?.updateRotation?.(r, add);
      if (this._isFunction(callback)) {
        callback(r, oldR, mitarbeiter, oldM);
      }
      this.addOrRemoveElement("_rotationen", r, add);
      this.updateThroughMitarbeiter(mitarbeiter, oldM);
    }
  }

  /**
   * Führt ein Update der Datensammlung aus
   * @param {String} key
   * @param {Object} el
   * @param {Boolean} add
   */
  addOrRemoveElement(key, el, add = true) {
    if (!this?.[key]?._set) return false;
    if (add) {
      this[key]._set(el.id, el);
    } else if (this?.[key]?.[el.id]) {
      delete this[key][el.id];
    }
    return this?.[key]?.[el.id];
  }

  /**
   * Führt ein Update über die Mitarbeiterin durch
   * @param {Object} mitarbeiter
   * @param {Object} oldM
   */
  updateThroughMitarbeiter(mitarbeiter, oldM) {
    if (oldM !== mitarbeiter && oldM?._update) {
      oldM._update();
    }
    mitarbeiter?._update?.();
  }
}

export default Channel;