import React from "react";
import Feld from "../../helper/feld";
import DienstplanerDataEinteilung from "../einteilung";
import { setPageWarning } from "../../../tools/helper";
import { optionalClass } from "../../../styles/basic";
import { getFontColorByWhite } from "../../../../joomla/helper/util";

/**
 * Erstellt ein spezielles Feld-Objekt für den Dienstplaner
 */
class DienstplanerFeld extends Feld {
  constructor(obj, appModel = false, preventExtension = true) {
    super(obj, appModel, false);
    this._setObject("scores", {});
    this._set("byDienstBereich", obj?.byDienstBereich || false);
    this.setIsFocusedAuswahl();
    if (preventExtension) this._preventExtension();
  }

  /**
   * Liefert false
   */
  get default() {
    return false;
  }

  /**
   * Liefert false
   */
  get isAddFeld() {
    return false;
  }

  /**
   * Liefert true
   */
  get vorschlaege() {
    return true;
  }

  /**
   * Gibt die Position des Feldes im Array zurück
   */
  get index() {
    let i = -1;
    if (this.byDienstBereich?.getIndex) {
      i = this.byDienstBereich.getIndex(this);
    }
    return i;
  }

  /**
   * Erstellt eine ID für das Feld
   */
  get id() {
    return `${this.tag}_${this.dienstId}_${this.bereichId}_${this.index}_${this.counter}`;
  }

  /**
   * True, wenn index >= 0 ist
   */
  get visible() {
    return this.index >= 0;
  }

  /**
   * Testet, ob das Feld außerhalb des Bedarfes liegt
   */
  get exceedsBedarf() {
    const bedarf = this.byDienstBereich?.gesamtBedarf || 0;
    return this.index + 1 > bedarf;
  }

  /**
   * Testet, ob das Feld optional
   */
  get isOptional() {
    const bedarf = this.byDienstBereich?.minBedarf || 0;
    return this.index + 1 > bedarf || this.einteilung?.isOptional;
  }

  get optionalClass() {
    return (this.isOptional && !this.value ? optionalClass : '').trim();
  }

  /**
   * Liefert ob der Einteilungsstatus markiert werden soll
   * @returns {Boolean} Boolean
   */
  get markEinteilungsstatus() {
    return !!this?._user?.dienstplanTableSettings?.mark_einteilungsstatus;
  }

  /**
   * Nur bestimmte Felder sollen überschrieben werden
   */
  get writable() {
    const writableDienst = this?.dienst?.writable;
    const writableDate = this?.date?.writable;
    const writableMitarbeiter = this?.mitarbeiter?.writable
      ? this.mitarbeiter.writable(this.tag, this.dienstId) :  true;
    return writableDienst && writableDate && writableMitarbeiter;
  }

  /**
   * Label für Tag und Dienst
   */
  get dienstTagLabel() {
    const date = `${this?.date?.label || this.tag}`;
    const writable = `${this.writable ? "" : "(X)"}`;
    return `${this?.dienst?.planname || this.dienstId}, ${date} ${writable}`;
  }

  /**
   * Label für Tag und Dienst
   */
  get tagDienstLabel() {
    const date = `${this?.date?.label || this.tag}`;
    const writable = `${this.writable ? "" : "(X)"}`;
    return `${date}, ${this?.dienst?.planname || this.dienstId} ${writable}`;
  }

  /**
   * Label für das Auswahl-Tab
   */
  get label() {
    const date = `${this?.date?.label || this.tag}`;
    const mitarbeiter = this?.mitarbeiter?.planname;
    const planname = mitarbeiter ? `, ${mitarbeiter}` : "";
    const writable = `${this.writable ? "" : "(X)"}`;
    return `${date}, ${this?.dienst?.planname || this.dienstId}${planname} ${writable}`;
  }

  /**
   * Liefert das Label für das Info-Tab
   */
  get infoLabel() {
    const date = `${this?.date?.label || this.tag}`;
    const dienst = `${this?.dienst?.planname || this.dienstId}`;
    const mitarbeiter = `${this.getValue("mitarbeiter")}`;
    const writable = `${this.writable ? "" : "(X)"}`;
    return `${date}, ${dienst}, ${mitarbeiter} ${writable}`;
  }

  /**
   * Liefert die Informationen zu dem Feld
   */
  get _info() {
    const info = this._infoNoByDienstBereich;
    if (this?.byDienstBereich) {
      info.popupInfos.ByDienstBereich = this.byDienstBereich._info;
    }
    return info;
  }

  /**
   * Liefert die Informationen zu dem Feld ohne die Informationen des Dienstbereiches,
   * da der Dienstbereich die Informationen des Feldes enthält und es sonst zu einer
   * Endlosschleife kommt
   */
  get _infoNoByDienstBereich() {
    const info = { ...super._info };
    info.mainInfos.visible = { value: this.visible ? "Ja" : "Nein", label: "Sichtbar" };
    if (this.exceedsBedarf) {
      info.mainInfos.exceeds = { value: "Ja", label: "Übersteigt Bedarf" };
    } else if (this.isOptional) {
      info.mainInfos.optional = { value: "Ja", label: "Optionaler Bedarf" };
    }
    return info;
  }

  /**
   * Liefert true, wenn das Feld fokussiert wurde
   */
  get isFocused() {
    return this?._dienstplanTable?.auswahl?.feld === this;
  }

  /**
   * Liefert true, wenn der Channel online ist
   */
  get isChannelOnline() {
    return this?._appModel?.isChannelOnline;
  }

  get shouldHideOptional() {
    return this.isOptional && (!this.dienst?.hasBedarf || (this.empty && !this.value));
  }

  get mitarbeiterHasRotationen() {
    return true;
  }

  get einteilungsKontextColor() {
    const showEinteilungskontextFarbe = this?._farbgruppen?.showEinteilungskontextFarben;
    if (showEinteilungskontextFarbe) {
      return this?.einteilung?.getColor?.() || '';
    }
    return '';
  }

  /**
   * Setzt das isFocusedAuswahl-Flag
   * @param {Boolean} focused
   */
  setIsFocusedAuswahl(focused = false) {
    this._set("isFocusedAuswahl", focused);
    this._update();
  }

  /**
   * Versteckt das Feld
   */
  hide() {
    this.byDienstBereich?.toggleHidden?.(false, this);
  }

  /**
   * Zeigt das Feld an
   */
  show() {
    this?.byDienstBereich?.toggleHidden?.(true, this);
  }

  hideOptional() {
    if(this.isOptional) {
      this.hide();
    }
  }

  /**
   * Entfernt das Feld.
   * Reset entfernt Referenzen (wichtig!!)
   */
  remove(post = true) {
    if (post) {
      return super.remove(true, {
        shouldHide: this.shouldHideOptional,
        fromRemove: true
      });
    }
    this.removeCurrentEinteilung();
    this.reset();
    if (this.exceedsBedarf) {
      this?.byDienstBereich?.remove?.(this);
    } else if (this.isOptional && !this.dienst?.hasBedarf) {
      this.hideOptional();
    }
  }

  /**
   * erstellt ein neues Einteilung-Objekt
   * @param {Object} response 
   * @returns 
   */
  createNewEinteilung(response) {
    if (!response?.id) return false;
    return new DienstplanerDataEinteilung(response, this?._appModel);
  }

  /**
   * Führt ein Update der Einteilung durch
   * @param {Object} response
   */
  updateEinteilungByResponse(einteilung) {
    if (!einteilung?.id) return false;
    this.setEinteilungId(einteilung.id);
    this.setArbeitzplatzId(einteilung?.arbeitsplatz_id);
    if (einteilung?.show) {
      this.setValue(einteilung?.mitarbeiter_id);
    }
    einteilung.add(this);
    if (!einteilung?.show) {
      this.remove(false);
    } else if (!this.visible) {
      this.show();
    }
    return true;
  }

  /**
   * Führt die Einteilung in einem debounce aus
   * @param {Object} response
   * @param {Object} params
   * @param {Object} oldEntry
   */
  defaultResponseCallback(response, params = {}, oldEntry = {}) {
    const post = params?.post;
    // Aufgrund der Websockets wird ein neu eingeteiltes Feld wieder überschrieben
    // Die soll beim Löschen von Einträgen verhindert werden
    const checkRemove = !params?.fromRemove || !this.value;
    if(checkRemove) {
      if (this._isObject(response)) {
        const einteilung = this.createNewEinteilung(response);
        einteilung?.updateCachedDienstplan?.();
        const doppelteEinteilung = einteilung?.doppelteEinteilungById;
        const hasDoppelteEinteilung = doppelteEinteilung && doppelteEinteilung !== this;
        if (hasDoppelteEinteilung) {
          if(doppelteEinteilung?.value === this.value) {
            this.reset();
          }
        } else if (
          !this.updateEinteilungByResponse(einteilung)
          && post
        ) {
          setPageWarning(this?._page, response?.info || "Fehler beim Einteilen");
          if (!this.updateEinteilungByResponse(
            this.createNewEinteilung(response?.old_einteilung || oldEntry?.einteilung)
          )) {
            this.reset();
          }
        }
      }
      this.setBlockChecked(true, false);
      if(params.shouldHide && this.empty) {
        this.hideOptional();
      }
    }
    this._update();
    if (post || params?.updatedThroughChannel) this.updateFrontend();
  }

  /**
   * Teilt das Feld ein
   * @param {Object} params
   */
  einteilen(params) {
    const {
      post = false,
      value = ""
    } = params;
    params.post = post && this.writable;
    const m = this?._mitarbeiter?.[value];
    if(post && m) {
      const auswahl = this?._dienstplanTable?.auswahl;
      params.einteilungskontext_id = auswahl?.kontextId;
      params.comment = auswahl?.comment;
      params.contextComment = auswahl?.contextComment;
      params.isOptional = auswahl?.isOptional;
    }
    if(!params.fromRemove) params.fromRemove = this.value && !m;
    const mWritable = m?.writable ? m.writable(this.tag, this.dienstId) : true;
    const oldM = this?.mitarbeiter || false;
    const oldMWritable = oldM?.writable ? oldM.writable(this.tag, this.dienstId) : true;
    if (post && !(mWritable && oldMWritable)) {
      return {
        posted: false,
        vorschlaege: []
      };
    }
    params.isChannelOnline = this.isChannelOnline;
    return super.einteilen(params);
  }

  /**
   * Erstellt die Informationen zu dem Feld
   */
  setInfo() {
    this._setPageInfoPopup(this.infoLabel, this);
  }

  /**
   * Aktualisiert die Vorschläge für die Tabelle
   * @param {Boolean} execute
   */
  setFocus(execute = false) {
    const auswahl = this?._dienstplanTable?.auswahl;
    auswahl?.setFeld?.(this, execute);
  }

  /**
   * Liefert das erste passende leere Feld zu einem bestimmten Tag und Mitarbeiter
   * @param {Object} date
   * @param {Object} mitarbeiter
   * @returns feld
   */
  getEmptyDateFeld(date = false, mitarbeiter = false) {
    const el = date?.getDienstEl?.(this.dienstId);
    if (el?.getEmptyBestFittingFeld) {
      return el.getEmptyBestFittingFeld(mitarbeiter);
    }
    return false;
  }

  /**
   * Liefert das erste passende leere Feld zu einem bestimmten Dienst und Mitarbeiter
   * @param {Object} date
   * @param {Object} mitarbeiter
   * @returns feld
   */
  getEmptyDienstFeld(dienst = false, mitarbeiter = false) {
    const el = this?.date?.getDienstEl?.(dienst?.id);
    if (el?.getEmptyBestFittingFeld) {
      return el.getEmptyBestFittingFeld(mitarbeiter);
    }
    return false;
  }

  /**
   * Führt ein Update der Komponenten im Frontend aus
   */
  updateFrontend() {
    const table = this?._dienstplanTable;
    table?.updateCounterThroughFeld?.();
    if (table?.auswahl?.feld === this) {
      table?.auswahl?.throttledHandleItemClick?.();
    }
    this?._statistic?.updateFilter?.();
  }

  /**
   * Liefert den aktuell mindestens benötigten Bedarf
   * @returns Number
   */
  getBedarf() {
    return this.byDienstBereich?.byDienst?.currentMinBedarf || 0;
  }

  /**
   * Liefert den aktuell optionalen Bedarf
   * @returns Number
   */
  getBedarfOpt() {
    return this.byDienstBereich?.byDienst?.currentOptBedarf || 0;
  }

  /**
   * Führt das Keydown Event des Feldes aus
   * @param {Object} evt
   * @param {Array} vorschlaege
   * @param {Function} setFocused
   */
  onKeyDown(evt, vorschlaege, setFocused) {
    evt.stopPropagation();
    const keyCode = evt?.key;
    // Beim Anzeigen der Auswahl, soll das erste Element markiert sein
    if (vorschlaege?.length 
      && ["Enter", "ArrowUp", "ArrowDown"].includes(keyCode) 
      && this._isFunction(setFocused)) {
      switch (keyCode) {
        // markierte Auswahl eintragen
        case "Enter": // Enter
          setFocused(true);
          break;
        // Auswahl markieren
        case "ArrowUp": // Hoch
          setFocused(false, -1);
          break;
        case "ArrowDown": // Runter
          setFocused(false, 1);
          break;
      }
    } else {
      this?._page?.handleKeyDown?.(evt);
    }
  }

  /**
   * Fügt die Funktion dem Register des ByDienstBereich hinzu
   * @param {Function} setState
   */
  pushInMitarbeiter = (setState) => {
    this.mitarbeiter?._push?.(setState);
    this.byDienstBereich?.push?.("feld", setState);
    this?._page?.push("colorUpdate", setState);
    this?._page?.push("markEinteilunsstatus", setState);
  };

  /**
   * Entfernt die Funktion aus dem Register des ByDienstBereich
   * @param {Function} setState
   */
  pullFromMitarbeiter = (setState) => {
    this.mitarbeiter?._push && this.mitarbeiter._pull(setState);
    this.byDienstBereich?.pull && this.byDienstBereich.pull("feld", setState);
    this?._page?.pull("colorUpdate", setState);
    this?._page?.pull("markEinteilunsstatus", setState);
  };

  getStyle(type = 'mitarbeiter', mitarbeiter = false) {
    const result = super.getStyle(type, mitarbeiter);
    const bgColor = ["mitarbeiter", "dienst"].includes(type) && this.einteilungsKontextColor;
    if (bgColor && bgColor !== 'transparent') {
      const {color} = getFontColorByWhite(bgColor);
      result.style = this._isObject(result.style) 
      ? {...result.style, backgroundColor: bgColor, backgroundImage: 'none', color } 
      : { backgroundColor: bgColor, backgroundImage: 'none', color };
    }
    return result;
  }
}

export default DienstplanerFeld;
