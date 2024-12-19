import Basic from '../basic';
import { formatDate } from '../../tools/dates';

/**
 * Klasse um ein Wunsch-Objekt zu erstellen.
 * @class
 */
class Wunsch extends Basic {
  constructor(obj, appModel = false, preventExtension = true) {
    super(appModel);
    this._setInteger('dienstkategorie_id', obj.dienstkategorie_id);
    this._setInteger('mitarbeiter_id', obj.mitarbeiter_id);
    this._set('tag', obj.tag ? formatDate(obj.tag) : obj.tag);
    this._setInteger('id', obj.id);
    if (preventExtension) this._preventExtension();
  }

  /**
   * Leifert den tag als Zahl YYYYMMDD
   */
  get tagZahl() {
    return this._dateZahl(this.tag);
  }

  /**
   * Liefert den tag in der Form d.m.y
   */
  get wunschTag() {
    const wunschTagArr = this.tag.split('-');
    return `${wunschTagArr[2]}.${wunschTagArr[1]}.${wunschTagArr[0]}`;
  }

  /**
   * Liefert den eingeteilten Mitarbeiter
   */
  get mitarbeiter() {
    return this._getIdsObject(
      ['_mitarbeiter', '_mitarbeiters'],
      'mitarbeiter_id',
      true
    );
  }

  /**
   * Liefert die gewünschte Dienstkategorie
   */
  get dienstkategorie() {
    return this._getIdsObject('_dienstkategorien', 'dienstkategorie_id', true);
  }

  /**
   * Liefert das zu Tag enstprechende Date-Objekt
   */
  get date() {
    return this._getIdsObject('_dates', 'tag', true);
  }

  /**
   * Liefert die Informationen zu dem aktuellen Wunsch für einen Mitarbeiter
   */
  get _popupInfo() {
    const wInfo = {
      value: {
        id: { value: this.id.toString(), label: 'ID' },
        date: { value: this?.date?.label || this.wunschTag, label: 'Tag' },
        mitarbeiter: {
          value: this?.mitarbeiter?.planname || '',
          label: 'Mitarbeiter'
        },
        dienstkategorie: {
          value: this?.dienstkategorie?._feldInfo || '',
          label: 'Dienstkategorie'
        },
        eruellt: { value: {}, label: 'Erfüllt', ignore: true },
        nichtErfuellt: { value: {}, label: 'Nicht erfüllt', ignore: true }
      },
      label: this?.date?.label || this.wunschTag,
      sort: this?.tagZahl || 0
    };
    const addToInfo = (key, feld) => {
      wInfo.value[key].ignore = false;
      const feldInfo = feld?._infoBasis;
      wInfo.value[key].value[feld.id] = {
        value: { ...feldInfo.mainInfos, ...feldInfo.popupInfos },
        label: feld.label,
        sort: feld.label
      };
    };
    const result = this.checkErfuellt;
    result?.erfuellt?.forEach?.((feld) => {
      addToInfo('eruellt', feld);
    });
    result?.nichtErfuellt?.forEach?.((feld) => {
      addToInfo('nichtErfuellt', feld);
    });
    return wInfo;
  }

  /**
   * Liefert die Informationen zu dem aktuellen Wunsch für ein Feld
   */
  get _feldInfo() {
    return {
      value: this?.dienstkategorie?._feldInfo || '',
      label: 'Wunsch'
    };
  }

  /**
   * Liefert die Information, ob ein Wunsch erfüllt,
   * nicht erfüllt oder nicht eingeteilt ist
   */
  get checkErfuellt() {
    const result = {
      erfuellt: [],
      nichtErfuellt: []
    };
    const einteilungen = this?.mitarbeiter?.getEinteilungenNachTag?.(this.tag);
    einteilungen?.forEach?.((feld) => {
      const key = this.hasDienst(feld?.dienstId || 0)
        ? 'erfuellt'
        : 'nichtErfuellt';
      result[key].push(feld);
    });
    return result;
  }

  /**
   * Liefert die Initialien der Dienstkategorie
   */
  getInitialien() {
    return this?.dienstkategorie?.initialien || '';
  }

  /**
   * Liefert den Namen der Dienstkategorie
   */
  getName() {
    return this?.dienstkategorie?.name || '';
  }

  /**
   * Liefert die benutzerdefinierte Farbe der Dienstkategorie
   */
  getColor() {
    const dk = this?.dienstkategorie;
    return dk?.getColor?.() || 'transparent';
  }

  /**
   * @param {Number} dienstId
   * @returns True, wenn die Dienst-Id in der Dienstkategorie auftaucht
   */
  hasDienst(dienstId = 0) {
    return this?.dienstkategorie?.hasDienst?.(dienstId);
  }

  pushToPage = (setState) => {
    this?._page?.push('colorUpdate', setState);
  };

  pullFromPage = (setState) => {
    this?._page?.pull('colorUpdate', setState);
  };
}

export default Wunsch;
