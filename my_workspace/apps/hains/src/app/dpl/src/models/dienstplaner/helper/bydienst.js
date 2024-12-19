import Basic from "../../basic";
import DienstplanerAddFeld from "./addfeld";
import ByDienstBereich from "./bydienstbereich";
import DienstplanerDefaultFeld from "./defaultfeld";

class ByDienst extends Basic {
  constructor({
    bedarf_id = 0,
    bereiche_ids = {},
    einteilung_ids = {},
    // rotation_ids = [],
    wunsch_ids = [],
    id = 0
  } = {}, appModel = false, date = false) {
    super(appModel);
    this._setInteger("bedarf_id", bedarf_id);
    this._setObject("bereiche_ids", bereiche_ids);
    this._setObject("einteilung_ids", einteilung_ids);
    // this._setArray("rotation_ids", rotation_ids);
    this._setArray("wunsch_ids", wunsch_ids);
    this._setInteger("id", id);
    this._set("date", date);
    this.setRenderedContent();
    this._preventExtension();
    this.init();
  }

  /**
   * Liefert ein Label
   */
  get label() {
    return `${this.date?.label || ""}, ${this.id}`;
  }

  /**
   * Liefert ein Key
   */
  get key() {
    return `${this.tag}_${this.id}`;
  }

  /**
   * Liefert den Dienst
   */
  get dienst() {
    return this._getIdsObject("_dienste", "id", false);
  }

  /**
   * Liefert die ID des tags
   */
  get tag() {
    return this.date?.id || "";
  }

  /**
   * True, wenn date und dienst writable ist
   */
  get writable() {
    return this.date?.writable && this.dienst?.writable;
  }

  /**
   * Liefert ein Add-Feld
   */
  get addFeldObj() {
    return new DienstplanerAddFeld({
      add: () => {
        const {
          byDienste
        } = this.addFeld("0");
        byDienste?.forEach?.((byDienst) => {
          byDienst?._update?.();
        });
      },
      shouldSetFocus: false,
      byDienstBereich: this,
      value: "+",
      tag: this.tag,
      dienstId: this.id
    }, this._appModel);
  }

  /**
   * Liefert den aktuellen Mindest-Bedarf über alle Bereiche
   */
  get currentMinBedarf() {
    let result = 0;
    this.eachBereich((bereich) => {
      result += bereich?.currentMinBedarf || 0;
    });
    return result;
  }

  /**
   * Liefert den aktuellen optionalen Bedarf über alle Bereiche
   */
  get currentOptBedarf() {
    let result = 0;
    this.eachBereich((bereich) => {
      result += bereich?.currentOptBedarf || 0;
    });
    return result;
  }

  get allEinteilungenPublic() {
    let res = true;
    const felder = this.getFelder();
    if(!this._isArray(felder)) return res;
    const l = felder.length;
    for (let i = 0; i < l; i++) {
      const feld = felder[i];
      const einteilung = feld?.date?.isInMainZeitraum && feld?.visible && feld?.einteilung;
      if(!einteilung) continue;
      if(!einteilung?.public) {
        res = false;
        break;
      }
    }
    return res;
  }

  /**
   * Erstellt ein default-Feld
   */
  getDefaultFeldObj (value = "-") {
    return new DienstplanerDefaultFeld({
      byDienstBereich: this,
      value,
      tag: this.tag,
      dienstId: this.id
    }, this._appModel);
  }

  /**
   * Setzt das Attribut renderedContent
   */
  setRenderedContent(content = false) {
    this._set("renderedContent", content);
  }

  /**
   * Liefert einen bestimmten Bereich
   * @param {Number} bereichId
   * @returns bereich
   */
  getBereich(bereichId = 0) {
    if (!(this.bereiche_ids?.[bereichId] instanceof ByDienstBereich)) {
      this.bereiche_ids[bereichId] = new ByDienstBereich(this.bereiche_ids?.[bereichId] || {
        id: parseInt(bereichId, 10)
      }, this._appModel, this);
    }
    return this.bereiche_ids[bereichId];
  }

  getFirstBereich(dienstId = 0) {
    const el = this.getDienstEl(dienstId);
    const bereichId = Object.keys(el.bereiche_ids)[0];
    return el?.getBereich(bereichId);
  }

  /**
   * Iteriert über die Bereiche-Ids
   * @param {Function} callback
   * @param {Boolean} sorted
   */
  eachBereich(callback = false, sorted = false) {
    if (this._isFunction(callback)) {
      const arr = Object.entries(this.bereiche_ids);
      if (sorted) {
        // Bereiche mit Bedarfeinträgen vor Bereichen ohne
        arr.sort((a, b) => b[1].bedarfeintrag_id - a[1].bedarfeintrag_id);
      }
      arr.forEach((keyValue) => callback(keyValue[1], keyValue[0]));
    }
  }

  /**
   * Initialisiert die Bereiche
   */
  init() {
    if (this.dienst?.hasBedarf) {
      this.eachBereich((bereich) => {
        this.getBereich(bereich.id);
      });
    } else {
      this.getBereich(0);
    }
    this.einteilen();
  }

  /**
   * Teilt die Bereiche ein
   */
  einteilen() {
    this.eachBereich((bereich) => {
      bereich?.einteilen?.();
    }, true);
  }

  /**
   * Erstellt ein neues Feld für einen Bereich.
   * Das Feld soll für jeden Bedarf des Blockes erstellt werden.
   * @param {String} schichtnr
   * @returns feld
   */
  addFeld(schichtnr = "0") {
    const lastBereiche = [];
    const byDienste = [this];
    const felder = [];
    const currentDate = this.date;
    const dates = this._dates;
    for (const bereichId in this.bereiche_ids) {
      const bereich = this.bereiche_ids[bereichId];
      lastBereiche[0] = bereich;
      if (bereich.gesamtBedarf < 1) continue;
      // Funktion für jeden Tag des Blockes ausführen
      const tage = bereich.bedarf?.getBlockTage?.();
      let i = 1;
      tage?.forEach((tag) => {
        const date = dates?.[tag];
        if (date === currentDate || !date?.getBereich) return;
        const nextBereich = date.getBereich(bereichId, this.id);
        if ((nextBereich?.hidden?.[0] || nextBereich?.showAddFeld)
          && nextBereich?.byDienst) {
          lastBereiche[i] = nextBereich;
          byDienste[i] = nextBereich.byDienst;
          i++;
        }
      });
      if (bereich?.hidden?.[0] || bereich?.showAddFeld) {
        break;
      }
    }
    lastBereiche?.forEach?.((bereich) => {
      const feld = bereich?.firstHiddenField;
      if (feld) {
        feld.show();
        felder.push(feld);
      } else if (bereich?.createFeld) {
        felder.push(bereich.createFeld(schichtnr));
      }
    });
    return {
      felder,
      byDienste
    };
  }

  /**
   * @returns True, wenn ein neues Feld angehängt werden kann oder ein Feld leer ist
   */
  showAddFeld() {
    let show = false;
    this.eachBereich((bereich) => {
      if (!show) show = bereich.showAddFeld || bereich.hasEmptyContent;
    });
    return show;
  }

  /**
   * Liefert alle Felder
   * @returns array
   */
  getFelder() {
    let felder = [];
    this.eachBereich((bereich) => {
      felder = felder.concat(bereich.content);
    });
    return felder;
  }

  /**
   * Liefert die eingeteilten Mitarbeiter
   * @returns Array
   */
  getMitarbeiterEl() {
    const felder = this.getFelder();
    const result = [];
    felder?.forEach?.((feld) => {
      if (feld?.mitarbeiter) result.push(feld.mitarbeiter);
    });
    return result;
  }

  /**
   * Liefert die Namen der eingeteilten Mitarbeiter
   * @param {Boolean} publish
   * @returns Array
   */
  getMitarbeiter(publish = false) {
    const felder = this.getFelder();
    const result = [];
    felder?.forEach?.((feld) => {
      const value = feld.getValue("mitarbeiter");
      const einteilung = feld?.einteilung;
      if(!value || (
        publish && !(einteilung?.writable || einteilung?.public)
      )) return;
      result.push(value);
    });
    if (!result.length) result.push("-");
    return result;
  }

  /**
   * Iteriert über alle Einteilungen und führt eine Funktion aus
   * @param {Function} callback 
   */
  eachEinteilung(callback = false) {
    if (!this._isFunction(callback)) return;
    const felder = this.getFelder();
    felder?.forEach?.((feld) => {
      if (!feld.empty) callback(feld);
    });
  }

  /**
   * Liefert die Componeneten des By-Dienst-Elements
   * @param {Function} callback
   * @returns array
   */
  getContent(callback = false) {
    const content = [];
    let showAddFeld = this.showAddFeld();
    const type = "mitarbeiter";
    const getFromCallback = this._isFunction(callback) 
      ? (feld) => callback(feld, type) 
      : (feld) => feld;
    this.getFelder().forEach((feld) => {
      if (!showAddFeld) showAddFeld = feld?.byDienstBereich?.showAddFeld;
      if (feld?.visible) content.push(getFromCallback(feld));
    });
    if (showAddFeld) showAddFeld = this.writable;
    if (!(content.length || showAddFeld)) {
      content.push(getFromCallback(this.getDefaultFeldObj("-")));
    }
    if (showAddFeld) {
      content.push(getFromCallback(this.addFeldObj));
    }
    return content;
  }

  /**
   * Liefert die besetzten Felder
   * @returns array
   */
  besetzt() {
    const felder = this.getFelder() || [];
    return felder.filter((feld) => !feld?.empty);
  }

  /**
   * Liefert die unbesetzten Felder
   * @returns array
   */
  unbesetzt() {
    const felder = this.getFelder() || [];
    return felder.filter((feld) => feld?.empty);
  }

  /**
   * Liefert das passendste leere Feld zu der Mitarbeiterin und dem Dienst an diesem Tag
   * @param {Object} mitarbeiter
   * @returns Feld
   */
  getEmptyBestFittingFeld(mitarbeiter = false) {
    const felder = [];
    this.eachBereich((bereich) => {
      const emptyFelder = bereich?.getEmptyFelder?.();
      emptyFelder?.forEach?.((feld) => {
        felder.push({
          props: {
            feld,
            mitarbeiter,
            score: mitarbeiter?.getScore?.(feld)
          }
        });
      });
    }, true);
    return felder?.[0]?.props?.feld || false;
  }
}

export default ByDienst;
