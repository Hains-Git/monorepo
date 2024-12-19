import Basic from '../basic';

/**
 * Helferklasse um die Daten aus der Api zu Basic-Klassen umzuwandeln.
 * Die Daten kommen als Objekte oder Arrays und werden in jeweils als Basic-Objekte gespeichert.
 * @class
 */
class Data extends Basic {
  constructor(appModel = false) {
    super(appModel);
    this._set('CLASSES', {});
  }

  /**
   * Initialisiert die passende Klasse für die entsprechenden Daten.
   * Objekte und Arrays werden zu Basic
   * und der Inhalt dieser Objekte/Arrays zu den entsprechenden Klasse.
   * Beispiel: rotationen = {rotationIds}
   * und rotationId = {} -> rotationen => Basic mit {rotationId: Rotation()}.
   * Damit dies funktioniert, muss in dem Data-Objekt,
   * z.B. DienstplanerData, CLASSES definiert sein:
   *
   * CLASSES = {
   *
   *  rotationen: (obj) => new Rotation(obj),
   *
   *  schichten: (arr) =>  arr.map(schicht => new Schicht(schicht))
   *
   * }
   * @param {Object|Array} obj Objekt oder Array
   * @param {String} name Name der zugehörigen Klasse
   * @param {Object} basicObj
   * @param {Function} bedingung
   */
  initObjOrArray(obj, name, basicObj = false, bedingung = false) {
    if (!this._isArrayOrObject(obj)) return;
    const basic = basicObj || new Basic(this._appModel);
    const aClass = this?.CLASSES?.[name];
    const check = this._isFunction(bedingung)
      ? (value, key) => value && bedingung(value, key)
      : (value) => value;
    // Falls die Klasse unter Klasses auftaucht,
    // wird die entsprechende Klasse erzeugt, ansonsten ein Basic-Objekt
    const add = (el, key) => {
      if (!check(el, key)) return;
      const value = aClass && this._isArrayOrObject(el) ? aClass(el) : el;
      basic._set(key, value);
    };

    if (obj instanceof Basic) {
      obj._each((el, key) => {
        add(el, key);
      });
    } else if (this._isArray(obj)) {
      obj.forEach((el, i) => {
        add(el, i);
      });
    } else {
      for (const key in obj) {
        const el = obj[key];
        add(el, key);
      }
    }

    if (!basicObj) this._set(name, basic);
  }
}

export default Data;
