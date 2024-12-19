import { dateRegEx, dateTimeRegEx, formatDate, today } from '../../tools/dates';
import { shortwait, throttle } from '../../tools/debounce';
import { development, showConsole } from '../../tools/flags';
import { checkType, isArray, isFunction, isObject } from '../../tools/types';
import Page from './page';

/**
 * Enthält die Methoden, die jedes Basic-Objekt erhalten soll
 * @class
 */
class BasicMethods extends Page {
  constructor() {
    super();
  }

  /**
   * Gibt die Anzahl der iterable Properties wieder.
   * @returns {number} Anzahl der iterable Properties
   */
  get _length() {
    return this._hasPropsArray() ? this._properties_.length : 0;
  }

  // INFORMATIONEN
  /**
   * Gibt eine Error-Nachricht in der Console aus
   * @param {Number} typ Zahl für den entsprechenden Error
   * @param {Any} value Wert, der verändert werden soll
   * @param {String} key Falls es sich um ein Attribut handelt, kann der Key mit ausgegeben werden
   * @param {Boolean} always zeigt den Error immer an, auch wenn development false ist
   */
  _throwError(typ, value = '', key = false, always = false) {
    let msg = 'ERROR: ';
    let position = '';
    switch (typ) {
      case 0:
        msg += 'Ich bin nicht teil des Singleton!';
        position = this._appModel;
        break;
      case 1:
        msg += 'Es wurde kein Objekt/Array übergeben!';
        break;
      case 2:
        msg += '_each: Erwartet eine Funktion oder false als zweites Argument!';
        break;
      case 3:
        msg += '_each: Erwartet eine Funktion oder false als erstes Argument!';
        break;
      case 4:
        msg += '_each: _properties_ ist kein Array!';
        position = this._properties;
        break;
      case 5:
        msg +=
          'Um Klasseneigenschaften zu verändern empfiehlt sich objekt._set(key, value)!!!';
        break;
      case 6:
        msg += 'Klasseneigenschaft ist nicht zum Konfigurieren gedacht!!!';
        break;
      case 7:
        msg += 'Page hat keine Daten';
        position = this._page;
        break;
      case 8:
        msg += 'Ich existiere nicht in _page.data -> ';
        position = this._pageData;
        break;
      case 9:
        msg += 'Ich existiere nicht in _page -> ';
        position = this._page;
        break;
      case 10:
        msg += 'Ich existiere nicht in _appModel ->';
        position = this._appModel;
        break;
      case 11:
        msg += 'Ich existiere nicht in _appModel.data -> ';
        position = this._appData;
        break;
    } // Ende switch

    if (key !== false) msg += `; Wert von "${key}" bleibt bei: `;
    if (showConsole || always)
      console.error(
        'ERROR Typ:',
        typ,
        '; Singleton Infos:',
        position,
        '; Ich:',
        this,
        msg,
        value
      );
  }

  /**
   * Objekt gibt sich selbst in der Console aus "I am {this}"
   */
  _whoAmI() {
    console.log('I am ', this);
  }

  /**
   * Testet eine Variable auf ihren Typ.
   * Dabei kann auch zwischen Objekten und Funktionen unterschieden werden.
   * @param {*} value Variable die getestet werden soll
   * @returns {string} Typ der Variablen
   */
  _checkType(value) {
    return checkType(value);
  }

  /**
   * Testet, ob es sich bei der Variablen um ein Array handelt
   * @param {*} value Varibale die getestet werden soll
   * @returns True, wenn es ein Array ist, ansonsten false
   */
  _isArray(value) {
    return isArray(value);
  }

  /**
   * Testet, ob es sich bei der Varibalen um ein Object handelt
   * @param {*} value Varibale die getestet werden soll
   * @returns True, wenn es ein Object ist, ansonsten false
   */
  _isObject(value) {
    return isObject(value);
  }

  /**
   * Testet, ob es sich bei der Variablen um ein Array oder ein Object handelt
   * @param {*} value Varibale die getestet werden soll
   * @returns True, wenn es ein Array oder ein Object ist, ansonsten false
   */
  _isArrayOrObject(value) {
    return this._isObject(value) || this._isArray(value);
  }

  /**
   * Testet, ob es sich bei der Variablen um eine Funktion handelt
   * @param {*} value Varibale die getestet werden soll
   * @returns True, wenn es eine Funktion ist, ansonsten false
   */
  _isFunction(value) {
    return isFunction(value);
  }

  /**
   * Testet, ob die Klasse ein Array für die Namen Properties bereithält
   * @returns True, wenn this._properties_ ein Array ist, ansonsten false
   */
  _hasPropsArray() {
    return this._isArray(this._properties_);
  }

  /**
   * Testet, ob der Name des Propertys in dem Properties-Array vorhanden ist.
   * Also ob eine Eigenschaft existiert und iterable ist
   * @param {*} key Name des zu suchenden Properties
   * @returns True, wenn der Key im Properties zu finden ist
   */
  _hasProperty(key) {
    return this._properties_.indexOf(key.toString()) >= 0;
  }

  /**
   * Gibt die iterable Properties in der Console aus
   */
  _showProps() {
    console.log('Props durch die iteriert werden kann: ', this._properties_);
  }

  /**
   * Gibt den Index einer Property aus Properties zurück
   * @param {*} key Name der Property
   * @returns {string} Index
   */
  _getIndex(key) {
    return this._properties_.indexOf(key.toString());
  }

  /**
   * Greift auf eine iterable Property über ihren Index zu
   * @param {Number} i Index der Property
   * @returns Property-Value
   */
  _getByIndex(i) {
    if (i < 0) return false;
    const key = this._properties_[i];
    return this[key];
  }

  isValidDateString(dateInput) {
    // Wenn es bereits ein Date-Objekt ist
    if (dateInput instanceof Date) {
      return !Number.isNaN(dateInput.getTime());
    }

    // Wenn es kein String ist und kein Date-Objekt, ist es ungültig
    if (typeof dateInput !== 'string') return false;

    // Versuche, das Datum zu parsen
    const date = new Date(dateInput);

    // Überprüfen, ob ein gültiges Datum erstellt wurde
    if (!Number.isNaN(date.getTime())) {
      // Zusätzliche Prüfung für Formate wie "20.03.2024"
      const parts = dateInput.split(/[-T:./]/);
      if (parts.length > 1) {
        return true;
      }
    }

    // Spezielle Behandlung für das Format "DD.MM.YYYY"
    const match = dateInput.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
    if (match) {
      const [, day, month, year] = match;
      const testDate = new Date(year, month - 1, day);
      return (
        testDate.getFullYear() === year &&
        testDate.getMonth() === month - 1 &&
        testDate.getDate() === day
      );
    }

    return false;
  }

  /**
   * Gibt ein Datum (YYYY-MM-DD) als Zahl YYYYMMDD zurück
   * @param {String} str Datum
   * @returns Zahl
   */
  _dateZahl(dateStr) {
    const str = this.isValidDateString(dateStr) ? formatDate(dateStr) : dateStr;
    if (typeof str !== 'string' || !dateRegEx.test(str)) {
      if (development)
        console.error(
          'ERROR: _dateZahl: Datum ist nicht im richtigen Format',
          this?.constructor?.name,
          str,
          dateRegEx
        );
      return 0;
    }

    return parseInt(str.replace(/-/g, ''), 10);
  }

  /**
   * Liefert das zum IdName zugehörige Objekt.
   * Dadurch wird folgender Aufruf getätigt und bei Problemen ggf. eine Ausgabe in der Konsole.
   * Bsp. this._dienste[this.po_dienst_id]
   *
   * GetterName greift auf die Elemente aus dem Singleton zu. String(_model)
   * Bsp. this._dienste
   *
   * und idName auf ein Attribute des aktuellen Objekts String/Number(id)
   * Bsp. this.po_dienst_id
   *
   * Wenn IdName ein Array ist, wird über das Array iteriert und ein Array mit den entsprechenden
   * Objekten zurückgegeben.
   *
   * @param {String|Array} getterName
   * @param {String|Number|Array} idName
   * @param {Boolean} warn
   * @returns Ein Objekt aus dem Singleton
   */
  _getIdsObject(getterName, idName, warn = true) {
    const ids = this?.[idName];
    const model = this._isArray(getterName)
      ? this?.[getterName.find((name) => this?.[name] !== undefined)]
      : this?.[getterName];
    if (!model && showConsole && warn) {
      console.error(
        'Model nicht gefunden',
        getterName,
        this,
        model,
        idName,
        ids
      );
    }
    let result = false;
    if (this._isArray(ids)) {
      result = [];
      model &&
        ids.forEach((id) => {
          const el = model?.[id];
          el && result.push(el);
        });
    } else {
      result = model?.[ids];
    }
    if (!result && showConsole && warn) {
      console.log(
        'Objekt nicht gefunden',
        getterName,
        this,
        model,
        idName,
        ids
      );
    }
    return result !== undefined ? result : false;
  }

  // ITERATIONEN
  /**
   * Hiermit wird durch alle Eigenschaften einer Klasse iteriert.
   * Diese Funktion ist ähnlich zur Array.map,Array.filter und Array.forEach.
   * Hierbei ist der Ruckgabewert dieser Funktione ein Objekt und ein Array.
   * Über den Callback, wird die ForEach-Funktion realisiert, allerdings erfordert es keinen Return.
   * Bei einem return true (=== true) im Callback, wird die Iteration abgebrochen.
   *
   * Der Filter-Callback dient dazu, nur Eigenschaften, die eine bestimmte Bedingung erfüllen
   * zurückzugeben, bei einem return false (=== false),
   * wird mit der nächsten Eigenschaft weitergemacht
   * @param {Function} callback Funktion, um die Schleife ggf. frühzeitig abzubrechen. Muss True || False zurückgeben
   * @param {Function} filter Funktion, um eine Bedingung zu definieren,
   * nach welchen Elementen gefiltert werden soll
   * @param {Boolean} reverse Soll die Iteration rückwärts erfolgen?
   * @returns Object
   * Gibt ein Objekt mit einem Array und einem Objekt gefüllt mit den entsprechenden Elementen zurück
   */
  _each(callback = false, filter = false, reverse = false) {
    const arr = [];
    const obj = {};
    const filterFkt = this._isFunction(filter) ? filter : () => true;
    const callBackFkt = this._isFunction(callback) ? callback : () => false;
    const props = this?._properties_ || [];
    const propsLength = props.length;
    const getIndex = reverse ? (i) => propsLength - i - 1 : (i) => i;
    for (let i = 0; i < propsLength; i++) {
      const key = props?.[getIndex(i)];
      const value = this?.[key];
      if (value === undefined) continue;
      if (!filterFkt(value, key, i)) continue;
      arr.push(value);
      obj[key] = value;
      if (callBackFkt(value, key, i) === true) break;
    }

    return { arr, obj };
  }

  /**
   * Testet, ob die Klasse eine bestimmte Eigenschaft enthält
   * und gibt die zutreffenden Eigenschaften aus
   * @param {*} value Wert der Eigenschaft
   * @param {*} end Bei true, bricht die Iteration nach dem ersten Fund ab
   * @returns
   * Gibt die Anzahl der gefundenen Elemente und die gefundenen Elemente mit key und value zurück
   */
  _includes(value, end = false) {
    const includes = [];
    this._each((propValue, key) => {
      // Vergleicht den Value mit einem Value aus den Properties
      if (value === propValue) {
        includes.push({ key, value: propValue });
        // Bricht die Each-Funktion ab, wenn Value gefunden wurde und abbrechen gewünscht ist
        if (end) return true;
      }
    });

    return { includes: includes.length > 0, matches: includes };
  }

  /**
   * Gibt die Keys und Values der Eigenschaften zurück
   * @param {String} props Bei "keys" werden nur die Keys zurückgegeben, bei "values" nur die Values
   * @returns Gibt ein Array mit den Einträgen zurück
   */
  _entries(props = '') {
    const arr = [];
    this._each((propValue, key) => {
      // Vergleicht den Value mit einem Value aus den Properties
      if (props === 'keys') arr.push(key);
      else if (props === 'values') arr.push(propValue);
      else arr.push({ key, value: propValue });
    });

    return arr;
  }

  // ZUSTÄNDE
  /**
   * Erstellt über Object.defineProperty Properties mit einem eigenen Setter für eine Klasse.
   * Für Methoden, die über this.key ausgeführt werden sollen
   * Dadurch wird eine Neuzuweisung unter x = y ausgeschlossen.
   * @param {String} key
   * @param {Function} fkt
   */
  _setGetter(key, fkt) {
    if (!this._isFunction(fkt)) {
      return false;
    }
    Object.defineProperty(this, key, {
      configurable: false,
      get() {
        return fkt();
      },
      set() {
        this._throwError(5, fkt, key);
      }
    });
  }

  /**
   * Erstellt über Object.defineProperty Properties mit einem eigenen Setter für eine Klasse.
   * Dadurch wird eine Neuzuweisung unter x = y ausgeschlossen.
   * Über iterable wird definiert, ob das Property durch die _each Funktion aufgerufen werden kann.
   * Dazu wird der Key (Name) in einem Array gespeichert.
   * @param {(string|number)} key Name der Property
   * @param {any} value Wert der Property
   * @param {Boolean} iterable Soll das Property über die _each Funktion erreichbar sein?
   */
  _set(key, value, iterable = true) {
    if (this._hasPropsArray()) {
      const thisKey = key.toString();
      if (iterable === true) this._properties = thisKey;
      else {
        const props = this._properties;
        const i = props.indexOf(thisKey);
        if (i >= 0) props.splice(i, 1);
      }
    }
    Object.defineProperty(this, key, {
      configurable: true,
      get() {
        return value;
      },
      set() {
        this._throwError(5, value, key, true);
      }
    });
  }

  /**
   * Stellt sicher, dass ein Wert einem Array entspricht
   * @param {(string|number)} key Name der Property
   * @param {Array} value Wert der Property
   * @param {Boolean} iterable Soll das Property über die _each Funktion erreichbar sein?
   */
  _setArray(key, value, iterable = true) {
    this._set(key, this._isArray(value) ? value : [], iterable);
  }

  /**
   * Stellt sicher, dass ein Wert einem Integer entspricht
   * @param {(string|number)} key Name der Property
   * @param {Number} value Wert der Property
   * @param {Boolean} iterable Soll das Property über die _each Funktion erreichbar sein?
   * @param {Boolean} min Kleinste akzeptierte Zahl
   * @param {Boolean} min Größte akzeptierte Zahl
   */
  _setInteger(key, value, iterable = true, min = false, max = false) {
    let v = parseInt(value, 10) || 0;
    if(typeof min === 'number' && v < min) v = min;
    else if(typeof max === 'number' && v > max) v = max;
    this._set(key, v, iterable);
  }

  /**
   * Stellt sicher, dass ein Wert einem Float entspricht
   * @param {(string|number)} key Name der Property
   * @param {Number} value Wert der Property
   * @param {Boolean} iterable Soll das Property über die _each Funktion erreichbar sein?
   * @param {Boolean} min Kleinste akzeptierte Zahl
   * @param {Boolean} min Größte akzeptierte Zahl
   */
  _setFloat(key, value, iterable = true, min = false, max = false) {
    let v = parseFloat(value) || 0.0;
    if(typeof min === 'number' && v < min) v = min;
    else if(typeof max === 'number' && v > max) v = max;
    this._set(key, v, iterable);
  }

  /**
   * Stellt sicher, dass ein Wert einem Objekt entspricht
   * @param {(string|number)} key Name der Property
   * @param {Object} value Wert der Property
   * @param {Boolean} iterable Soll das Property über die _each Funktion erreichbar sein?
   */
  _setObject(key, value, iterable = true) {
    this._set(key, this._isObject(value) ? value : {}, iterable);
  }

  /**
   * Stellt sicher, dass ein Wert einer Funktion entspricht entspricht
   * @param {(string|number)} key Name der Property
   * @param {Function} value Wert der Property
   * @param {Boolean} iterable Soll das Property über die _each Funktion erreichbar sein?
   */
  _setFunction(key, value, iterable = true) {
    this._set(key, this._isFunction(value) ? value : () => false, iterable);
  }

  /**
   * Ruft alle Funktionen aus dem unter id definierten Register aus.
   * Ein Register ist ein Objekt,
   * bei dem für unterschiedliche Keys ein Array erstellt wird, in das Funktionen gepusht werden
   * @param {*} value Wert der an die Funktionen aus dem Register übergeben werden soll
   * @param {(string|number)} id  Key, unter dem das passende Register gesucht wird
   * @returns  Nachricht, ob die Komponente registriert ist
   */
  _setState = (value = {}, id = false) => {
    let message = 'not in register';
    const key = id && typeof id === 'string' ? id : this._default_id_;
    if (this._components_register[key]) {
      this._components_register[key].forEach((set) => set(value));
      message = 'state set';
    }

    return message;
  };

  /**
   * Fügt eine Funktion einer Komponente in das Register des aktuellen Objektes ein,
   * um die Komponente aus der Klasse zu updaten
   * @param {callback} setState
   * @param {(string|number)} id key unter dem sich eine Komponente im Register anmeldet
   * @returns Nahricht, ob ein neues Register angelegt wurde und sich die Komponente registriert hat
   */
  _pushToRegister = (setState = false, id = false) => {
    let message = 'Only Functions allowed';
    if (this._isFunction(setState)) {
      message = '';
      const key = id && typeof id === 'string' ? id : this._default_id_;
      if (!this._components_register_[key]) {
        message = `register created '${key}',`;
        this._components_register_[key] = [];
      }
      const register = this._components_register_[key];
      if (!register.includes(setState)) register.push(setState);
      message += ` pushed state in ${key}`;
    } else console.log(message, setState, typeof setState);

    return message;
  };

  /**
   * Hiermit kann sich eine Komponente aus einem register abmelden.
   * Jede Komponente sollte sich beim Unmounten abmelden.
   * @param {callback} setState Funktion, mit der sich eine Komponente registriert
   * @param {(string|number)} id Key untert dem sich eine Komponente registriert
   * @returns Eine Nachricht,
   * ob die Komponente registriert war, entfernt wurde und ob das Register gelöscht wurde
   */
  _pullFromRegister = (setState = false, id = false) => {
    let message = 'Only Functions allowed';
    if (this._isFunction(setState)) {
      message = 'not in register';
      const key = id && typeof id === 'string' ? id : this._default_id_;
      if (this._components_register_[key]) {
        const register = this._components_register_[key];
        const i = register.indexOf(setState);
        if (i >= 0) register.splice(i, 1);
        message = `removed state from ${key}`;
        if (!register.length) {
          delete this._components_register_[key];
          message += `, '${key}' deleted`;
        } // Ende register.length == 0
      } // Ende if this._components_register_[key]
    } else console.log(message, setState, typeof setState);

    return message;
  };

  /**
   * Verhindert Erweitern eines Objekt, sodass keine neuen Attribute hinzugefügt werden können
   */
  _preventExtension() {
    Object.preventExtensions(this);
  }

  /**
   * Friert das Objekt ein,
   * sodass keine Attribute mehr hinzugefügt oder entfernt verändert werden können
   */
  _freeze() {
    Object.freeze(this);
  }

  /**
   * Wandelt das erste Zeichen eines String zu einem Großbuchstaben um
   * @param {String} str ein String,
   * dessen erstes Zeichen zu einem Großbuchstaben gewandelt werden soll
   * @returns String mit erstem Zeichen als Großbuchstabe
   */
  _capitalFirstLetter(str = '') {
    if (typeof str === 'string' && str.length) {
      return `${str.slice(0, 1).toUpperCase()}${str.slice(1)}`;
    }
    console.log('Es wird ein String mit einer Länge > 0 erwartet', str);
    return '';
  }

  /**
   * Updaten aller im "update"-Komponenten-Register registrierten Komponenten
   */
  _update = throttle(() => {
    this._setState({}, 'update');
  }, shortwait);

  /**
   * Fügt eine Funktion in das Komponenten-Register update hinzu
   * @param {callback} setUpdate
   * Funktion einer komponente, um sich im Register unter dem key "update" anzumelden
   */
  _push = (setUpdate) => {
    if (setUpdate) this._pushToRegister(setUpdate, 'update');
  };

  /**
   * Entfernt die Funktion einer Komponente aus dem Komponenten-Register einer Klasse
   * @param {callback} setUpdate
   * Funktion mit dem sich eine Komponente unter dem Key "update" im Register anmelden kann
   */
  _pull = (setUpdate) => {
    if (setUpdate) this._pullFromRegister(setUpdate, 'update');
  };

  /**
   * Fügt eine Funktion in das Komponenten-Register update hinzu
   * @param {String} key
   * @param {callback} setUpdate
   * Funktion einer komponente, um sich im Register unter dem key "update" anzumelden
   */
  push = (key, setState) => {
    if (setState && key) this._pushToRegister(setState, key);
  };

  /**
   * Entfernt die Funktion einer Komponente aus dem Komponenten-Register einer Klasse
   * @param {String} key
   * @param {callback} setUpdate
   * Funktion mit dem sich eine Komponente unter dem Key "update" im Register anmelden kann
   */
  pull = (key, setState) => {
    if (setState && key) this._pullFromRegister(setState, key);
  };

  /**
   * Updaten aller im "update"-Komponenten-Register registrierten Komponenten
   * @param {String} key
   */
  update = (key, value = {}) => {
    if (key) this._setState(value, key);
  };

  /**
   * Führt setInfoPopUp der Page aus
   * @param {String} title
   * @param {Object} obj
   */
  _setPageInfoPopup(title = '', obj = {}, cleanup = true) {
    if (cleanup) {
      this?._page?.cleanupPopupExtras?.();
    }
    if (this?._page?.setInfoPopUp) {
      this._page.setInfoPopUp(title, obj);
    } else {
      this._appModel.setInfoPopUp(title, obj);
    }
  }

  /**
   * Formatiert einen String nach verschiedenen Mustern
   * @param {String} string Format: 0000-00-00T00:00:00.000Z
   * @returns {Object} Object
   * @returns {string} obj.local: DD.MM.YYYY
   * @returns {string} obj.time: HH:MM Uhr
   * @returns {string} obj.date: YYYY-MM-DD
   * @returns {number} obj.timenr: 0000
   * @returns {number} obj.datenr: 00000000
   * @returns {number} obj.fullnr: 000000000000
   * @returns {string} obj.fullstr: 0000-00-00T00:00:00.000Z
   * @returns {string} obj.fullLocal: localDate HH:MM
   */
  _formatTime(str) {
    if (!dateTimeRegEx.test(str)) {
      if (development)
        console.error(
          'ERROR: _formatTime: Datetime ist nicht im richtigen Format',
          this?.construtor?.name,
          str,
          dateTimeRegEx
        );
      return {};
    }

    const date = str.split('T');
    const full_date = date[0];
    const localeDate = new Date(full_date).toLocaleDateString();
    // Nur den Uhrzeit String nehmen, ohne Zeitzone und die Sekunden abschneiden
    // hh:mm:ss.zz -> hh:mm
    const timeWithSeconds = date[1].split('.')[0];
    const timeStr = timeWithSeconds.slice(0, -3);
    const time = `${timeStr} Uhr`;
    // Aus den Werten Zahlen erstellen, die sich durch < | > vergleichen lassen
    const replacedTime = timeWithSeconds.replace(/:/g, '');
    const timeZahl = parseInt(replacedTime, 10);
    const replacedDate = full_date.replace(/-/g, '');
    const dateZahl = parseInt(replacedDate, 10);
    const zahl = parseInt(replacedDate + replacedTime, 10);

    return {
      local: localeDate,
      time,
      date: full_date,
      timenr: timeZahl,
      datenr: dateZahl,
      fullnr: zahl,
      fullStr: str,
      fullLocal: `${localeDate} ${timeStr}`
    };
  }

  /**
   * Falls this._ende existiert -> eine Zahl this._ende.zahl + 10000 = Ende + 1 Jahr
   * Ansonsten Heute + 1 Jahr
   */
  getDateZahlGreaterEndDate() {
    let result = 10000;
    const endZahl = this._ende && this._ende.zahl;
    if (endZahl && typeof endZahl === 'number') {
      result += endZahl;
    } else {
      result += this._dateZahl(today().toISOString().split('T')[0]);
    }

    return result;
  }
}

export default BasicMethods;
