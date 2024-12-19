import Basic from '../basic';

/**
 * Klasse um ein Dienstkategorie-Objekt zu erstellen.
 * @class
 */
class Dienstkategorie extends Basic {
  constructor(obj, appModel = false, preventExtension = true) {
    super(appModel);
    this._set('color', obj.color);
    this._set('beschreibung', obj.beschreibung);
    this._set('poppix_name', obj.poppix_name);
    this._set('selectable', obj.selectable);
    this._setInteger('id', obj.id);
    this._set('name', obj.name);
    this._setArray(
      'thema_ids',
      obj?.dienstkategoriethemas ? obj?.dienstkategoriethemas : obj.thema_ids
    );
    this.resetAttributes();
    this.setCustomColor();
    if (preventExtension) this._preventExtension();
  }

  /**
   * Gibt den verkürzten Namen der Dienstkategorie zurück
   */
  get initialien() {
    return this.poppix_name;
  }

  /**
   * Liefert die Themen
   */
  get themen() {
    return this._getIdsObject('_themen', 'thema_ids', false) || [];
  }

  /**
   * Liefert die Dienste
   */
  get dienste() {
    return (
      this._getIdsObject(['_dienste', '_po_dienste'], 'dienste_ids', false) ||
      []
    );
  }

  /**
   * Erstellt die Informationen für eine Einteilung
   */
  get _feldInfo() {
    const info = {
      id: { value: this.id.toString(), label: 'ID' },
      name: { value: this.name, label: 'Name' },
      initialien: { value: this.initialien, label: 'Initialien' },
      color: { value: this.color || '', label: 'Farbe' },
      selectable: {
        value: this.selectable ? 'Ja' : 'Nein',
        label: 'Auswählbar'
      }
    };
    if (this.beschreibung && this.beschreibung.trim() !== '') {
      info.beschreibung = { value: this.beschreibung, label: 'Beschreibung' };
    }
    const { themen, dienste } = this;
    if (themen.length) {
      info.themen = { value: {}, label: 'Themen', sorting: 'alph-asc' };
      themen.forEach((thema) => {
        info.themen.value[thema.id] = thema._info;
      });
    }
    if (dienste.length) {
      info.dienste = { value: {}, label: 'Dienste', sorting: 'alph-asc' };
      dienste.forEach((dienst) => {
        const label = dienst.planname;
        info.dienste.value[dienst.id] = {
          value: '',
          label,
          sort: label
        };
      });
    }
    return info;
  }

  /**
   * Zurücksetzen einiger Attribute
   */
  resetAttributes() {
    this._setArray('dienste_ids', []);
  }

  /**
   * Setzt die Custom-Color, womit der Dienstkategorie eine benutzerdefinierte Farbe
   * für den Dienstplan zugeordnet werden kann
   * @param {String} color
   */
  setCustomColor(color = false) {
    if (typeof color !== 'string' && color !== false) {
      console.log('Es werden nur Strings oder false akzeptiert!');
      return;
    }
    this._set('customColor', color || this.color);
  }

  /**
   * Gibt die benutzerdefinierte Farbe zurück
   * @returns {string} Benutzerdefinierte Farbe
   */
  getColor() {
    return this.customColor;
  }

  /**
   * Testet, ob alle Themen in thema_ids enthalten sind
   * @param {Array} themaIds
   * @returns true, wenn alle Themen enthalten sind
   */
  includesThemaIds(themaIds) {
    let same = false;
    if (this._isArray(themaIds)) {
      const l = this.thema_ids.length;
      for (let i = 0; i < l && l <= themaIds.length; i++) {
        same = themaIds.includes(this.thema_ids[i]);
        if (!same) break;
      }
    }
    return same;
  }

  /**
   * Fügt den Dienst hinzu, wenn alle Themen der Dienstkategorie
   * in den Themen des Dienstes enthalten sind
   * @param {Object} dienst
   * @returns Array mit allen enthaltenen Dienstkategorie-IDs
   */
  addDienst(dienst) {
    const { id, thema_ids } = dienst;
    if (!this.hasDienst(id) && this.includesThemaIds(thema_ids)) {
      this.dienste_ids.push(id);
    }
    return this.dienste_ids;
  }

  /**
   * @param {Number} dienstId
   * @returns True, wenn die Dienst-Id in den dienste-ids existiert
   */
  hasDienst(dienstId = 0) {
    return this.dienste_ids.includes(parseInt(dienstId, 10));
  }
}

export default Dienstkategorie;
