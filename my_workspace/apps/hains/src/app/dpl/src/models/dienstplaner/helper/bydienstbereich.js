import Basic from "../../basic";
import Feld from "../../helper/feld";
import DienstplanerFeld from "./feld";

class ByDienstBereich extends Basic {
  constructor(obj = {
    id: 0,
    bedarfeintrag_id: 0,
    einteilungen: []
  }, appModel = false, byDienst = false) {
    super(appModel);
    this._set("byDienst", byDienst);
    this._setInteger("id", obj?.id);
    this._setInteger("bedarfeintrag_id", obj?.bedarfeintrag_id);
    this.setGesamtBedarf(0);
    this.setMinBedarf(0);
    this.updateEinteilungenIds(obj?.einteilungen);
    this._setArray("content", []);
    this._setArray("hidden", []);
    this._preventExtension();
    this.init();
  }

  /**
   * Liefert den Bedarfseintrag
   */
  get bedarf() {
    return this._getIdsObject("_bedarfseintraege", "bedarfeintrag_id", false);
  }

  /**
   * Liefert den ersten Bedarfseintrag aus einem Block
   */
  get startBedarf() {
    return this?.bedarfsEintrag?.startBedarfsEintrag || false;
  }

  /**
   * Liefert den Dienst
   */
  get bereich() {
    return this._getIdsObject("_bereiche", "id", false);
  }

  /**
   * Liefert die Dienst-Id aus By-Dienst
   */
  get dienstId() {
    return this?.byDienst?.id || 0;
  }

  /**
   * Liefert den Dienst
   */
  get dienst() {
    return this?.byDienst?.dienst;
  }

  /**
   * Liefert das Datum-Objekt
   */
  get date() {
    return this?.byDienst?.date;
  }

  /**
   * True, wenn weniger content als gesamtBedarf
   */
  get showAddFeld() {
    return this.content.length < this.gesamtBedarf;
  }

  /**
   * True, wenn mindestens ein Feld leer ist
   */
  get hasEmptyContent() {
    return !!this.content.find((feld) => feld.empty);
  }

  /**
   * Erzeugt ein Label zu dem Tag, Dienst und Bereich
   */
  get label() {
    const tag = this?.date?.label || false;
    const dienst = this?.dienst?.planname || false;
    const bereich = this?.bereich?.name || false;
    const label = [];
    if (tag) label.push(tag);
    if (dienst) label.push(dienst);
    if (bereich) label.push(bereich);
    return label.join(", ");
  }

  /**
   * Liefert die bereiche_ids aus By-Dienst
   */
  get bereiche() {
    return this?.byDienst?.bereiche_ids || {};
  }

  /**
   * Liefert die Informationen zu dem Tag, Dienst und Bereich
   */
  get _info() {
    const content = {};
    const hidden = {};
    const addInfo = (feld, obj) => {
      const feldInfo = feld._infoNoByDienstBereich;
      obj[feld.id] = {
        value: {
          ...feldInfo.mainInfos,
          ...feldInfo.popupInfos
        },
        label: feld.id,
        sort: feld.label
      };
    };
    this.content.forEach((feld) => {
      addInfo(feld, content);
    });
    this.hidden.forEach((feld) => {
      addInfo(feld, hidden);
    });
    return {
      value: {
        gesamtBedarf: { value: this.gesamtBedarf.toString(), label: "Gesamtbedarf" },
        minBedarf: { value: this.minBedarf.toString(), label: "Mindestbedarf" },
        optBedarf: { value: (this.gesamtBedarf - this.minBedarf).toString(), label: "Optionaler Bedarf" },
        content: { value: content, label: "Felder", sorting: "alph-asc" },
        hidden: { value: hidden, label: "Optionale Felder", sorting: "alph-asc" }
      },
      label: this.label
    };
  }

  /**
   * Liefert den aktuellen Bedarf über alle Bereiche
   */
  get currentMinBedarf() {
    return this.content.filter(
      (feld, i) => feld?.empty && i < this.minBedarf
    ).length;
  }

  /**
   * Liefert den optionalen Bedarf über alle Bereiche
   */
  get currentOptBedarf() {
    const optEingeteilt = this.content.filter(
      (feld, i) => !feld?.empty && i >= this.minBedarf
    ).length;
    return this.gesamtBedarf - this.minBedarf - optEingeteilt;
  }

  /**
   * Liefert die Einteilung-Objekte zu den EinteilungIDs
   */
  get einteilungen() {
    const result = [];
    this.einteilungenIds.forEach((id) => {
      const einteilung = this.getEinteilung[id];
      if (einteilung) result.push(einteilung);
    });
    return result;
  }

  /**
   * Liefert das erste wirklich versteckte Feld.
   */
  get firstHiddenField() {
    return this.hidden?.find?.((feld) => {
      const index = feld?.index || 0;
      return index < 0;
    });
  }

  get felder(){
    return [...this.content, ...this.hidden];
  }

  /**
   * Liefert die Einteilung aus this._einteilungen
   * @param {Number} id
   * @returns Object
   */
  getEinteilung(id) {
    return this._getIdsObject("_einteilungen", id, false);
  }

  /**
   * Setzt das einteilungen Attribut
   * @param {Array} einteilungen
   */
  updateEinteilungenIds(einteilungen = []) {
    this._setArray("einteilungenIds", einteilungen);
    // Felder update, wenn keine Einteilungen existieren
    if (!this.einteilungenIds.length) {
      this.update("feld", {});
    }
  }

  /**
   * Setzt den Bedarf des Bereiches
   * @param {Number} bedarf
   */
  setGesamtBedarf(bedarf = 0) {
    this._setInteger("gesamtBedarf", bedarf);
  }

  /**
   * Setzt den Mindest-Bedarf des Bereiches
   * @param {Number} bedarf
   */
  setMinBedarf(bedarf = 0) {
    this._setInteger("minBedarf", bedarf);
    for (let i = 0; i < bedarf; i++) {
      this.createFeld("0");
    }
  }

  /**
   * Initialisiert den Bereich.
   * frei eingtragbare Dienste werden mit der Anzahl der Mitarbeiter initialisiert.
   * Dienste mit Bedarf werden mit dem Bedarf initialisiert.
   * Dienste ohne Bedarf werden mit der Anzahl der Mitarbeiter initialisiert, 
   * wenn beschreibbar sind.
   */
  init() {
    if (this?.dienst?.isFreiEintragbar) {
      this.setGesamtBedarf(this?._mitarbeiter?._length || 0);
    } else if(this?.dienst?.hasBedarf) {
      const bedarf = this?.bedarf;
      bedarf?.startBedarfsEintrag?.addToBlock?.(bedarf.id);
      this.setGesamtBedarf(bedarf?.gesamtBedarf || 0);
      this.setMinBedarf(bedarf?.min || 0);
    } else if(this?.dienst?.writable) {
      this.setGesamtBedarf(this?._mitarbeiter?._length || 0);
    }
  }

  /**
   * Erstellt ein neues Feld
   * @returns Feld
   */
  createFeld(schichtnr = "0") {
    const feld = new DienstplanerFeld({
      byDienstBereich: this,
      tag: this?.date?.id || "",
      dienstId: this.dienstId,
      bereichId: this.id,
      bedarfeintragId: this.bedarfeintrag_id,
      schichtnr
    }, this._appModel);
    feld.show();
    // Felder im Default auf checked setzen
    feld.setBlockChecked(true, false);
    return feld;
  }

  /**
   * Hilfsfunktion, um Felder aus hidden bzw. content zu entfernen
   * @param {String} key
   * @param {Object} feld
   */
  removeFrom(key = "content", feld = false) {
    const arr = this?.[key];
    const i = arr?.indexOf
      ? arr.indexOf(feld)
      : -1;
    if (i >= 0) {
      arr.splice(i, 1);
      if (key === "content" && feld?.bedarf?.removeFeld) {
        feld?.bedarf?.removeFeld(feld);
      }
    }
  }

  /**
   * @param {Object} feld
   * @returns True, wenn das Element ein Feld ist
   */
  isFeld(feld = false) {
    return feld instanceof Feld;
  }

  /**
   * Hilfsfunktion, um Felder content oder hidden hinzuzufügen
   * @param {String} key
   * @param {Object} feld
   */
  addTo(key = "content", feld = false) {
    const arr = this?.[key];
    if (this.isFeld(feld) && arr?.includes && !arr.includes(feld)) {
      arr.push(feld);
      if (key === "content" && feld?.bedarf?.addFeld) {
        feld?.bedarf?.addFeld(feld);
      }
    }
  }

  /**
   * Toggled das Feld zwischen hidden und content.
   * @param {Boolean} show
   * @param {Object} feld
   */
  toggleHidden(show = false, feld = false) {
    this.addTo(show ? "content" : "hidden", feld);
    this.removeFrom(show ? "hidden" : "content", feld);
    this._update();
  }

  /**
   * Entfernt das Feld aus hidden und content
   * @param {Object} feld
   */
  remove(feld = false) {
    this.removeFrom("hidden", feld);
    this.removeFrom("content", feld);
  }

  /**
   * @param {Object} feld
   * @returns Index des Feldes in content
   */
  getIndex(feld = false) {
    return this.content.indexOf(feld);
  }

  /**
   * Erstellt ein neues Feld
   * @param {String} schichtnr
   * @returns Feld
   */
  addFeld(schichtnr = "0") {
    return this?.byDienst?.addFeld?.(schichtnr);
  }

  /**
   * Erstellt eine neue Einteilung mit Feld
   * @param {String} schichten
   * @param {Object} data
   * @returns feld | false
   */
  createNewEinteilung(schichten, data) {
    const felder = this.addFeld(schichten)?.felder;
    const feld = felder?.[0];

    if (feld?.einteilen) {
      feld.einteilen(data);
      return feld;
    }
    return false;
  }

  /**
   * Teilt eine Einteilung ein
   * @param {Object} einteilung
   * @param {Boolean} updatedThroughChannel
   * @returns Object, wenn eingeteilt wurde
   */
  setEinteilung(einteilung, updatedThroughChannel = false) {
    const {
      id,
      show,
      mitarbeiter_id,
      tag,
      bereich_id,
      schichten,
      dienst,
      po_dienst_id
    } = einteilung;
    if (!dienst) return false;
    let value = "";
    if (show && mitarbeiter_id) {
      value = mitarbeiter_id;
    }
    const data = {
      value,
      einteilungId: id,
      post: false,
      updatedThroughChannel
    };
    const l = this.content.length;
    // Einteilen der Einteilung, wenn der Bereich noch Platz dafür hat
    for (let i = 0; i < l; i++) {
      const feld = this.content[i];
      const same = feld?.einteilen && feld?.isSame?.(
        tag,
        po_dienst_id,
        this?.dienst?.isFreiEintragbar
          ? false
          : (this.bedarfeintrag_id && bereich_id) || false,
        dienst.hasBedarf ? schichten : false
      );
      const shouldEinteilen = same && feld?.empty;
      if (!shouldEinteilen) continue;
      feld.einteilen(data);
      return feld;
    }
    // Neues Feld für den Bereich erstellen, wenn noch Platz ist
    if (show && this.showAddFeld) {
      return this.createNewEinteilung(schichten, data);
    }
    return false;
  }

  /**
   * Versucht die Einteilung auf einen alternativen Bereich zu verteilen
   * @param {Object} einteilung
   * @param {Boolean} updatedThroughChannel
   * @returns True|Object, wenn eingeteilt wurde
   */
  einteilungAufEinenBereichVerteilen(einteilung, updatedThroughChannel = false) {
    const {
      id,
      show,
      schichten,
      mitarbeiter_id
    } = einteilung;
    let value = "";
    if (show && mitarbeiter_id) {
      value = mitarbeiter_id;
    }
    const data = {
      value,
      einteilungId: id,
      post: false,
      updatedThroughChannel
    };
    // Versuche die Einteilung auf einen anderen Bereich zu verteilen
    for (const bereichId in this.bereiche) {
      const bereich = this.bereiche[bereichId];
      if (bereich === this) continue;
      const feld = bereich.setEinteilung(einteilung);
      if (feld) return feld;
    }
    // Teilt die Einteilung in ein neues Feld des aktuellen Bereiches ein
    if (show) {
      return this.createNewEinteilung(schichten, data);
    } 
    if (einteilung?.remove) {
      einteilung.remove();
      return true;
    }
    return false;
  }

  /**
   * Teilt eine Einteilung ein
   * @param {Object} einteilung
   * @param {Boolean} updatedThroughChannel
   * @returns Object, wenn eingeteilt wurde
  */
  einteilungEinteilen(einteilung, updatedThroughChannel = false) {
    let result = false;
    const feld = einteilung?.doppelteEinteilung;
    if(feld?.value === einteilung?.mitarbeiter_id) {
      feld?.setIsDouble(true);
      return result;
    }
    // Check einfügen, sodass nur bestimmte einteilungen beachtet werden
    if (einteilung?.show) {
      if (einteilung?.po_dienst_id === this.dienstId) {
        result = this.setEinteilung(einteilung, updatedThroughChannel);
        if (!result) {
          result = this.einteilungAufEinenBereichVerteilen(einteilung, updatedThroughChannel);
        }
      }
      if (!result) {
        console.log("Einteilung wurde nicht eingeteilt", einteilung.id, this.content, this, einteilung);
      }
    }
    return result;
  }

  /**
   * Teilt die Einteilungen aus dem Bereich ein
   */
  einteilen() {
    const einteilungen = this?._einteilungen;
    if (einteilungen) {
      const setEinteilung = (eId) => {
        const einteilung = einteilungen?.[eId];
        this.einteilungEinteilen(einteilung, false);
      };
      this.einteilungenIds.forEach(setEinteilung);
    }
  }

  /**
   * Liefert alle leeren Felder und erstellt ggf. eines, wenn keine vorhanden sind
   * @returns array
   */
  getEmptyFelder() {
    const content = this.content.filter((feld) => feld.empty);
    if (content.length) {
      return content;
    } if (this.hidden.length) {
      return this.hidden;
    } if (this.showAddFeld) {
      const feld = this.createFeld("0");
      this.toggleHidden(false, feld);
      return [feld];
    }

    return [];
  }

  /**
   * Entfernt alle gemachten Einteilungen.
   * Nutzt eine Kopie des Arrays, da die einzelnen Elemente teilweise entfernt werden.
   * Ohne Kopie -> Fehler: Array wird verändert, während es durchlaufen wird
   */
  resetEinteilungen() {
    const call = (feld) => {
      feld.remove(false);
      feld.reset();
    };
    [...this.hidden].forEach(call);
    [...this.content].forEach(call);
  }
}

export default ByDienstBereich;
