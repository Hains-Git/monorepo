import React from "react";
import { BsBorderRight, BsBorderTop, BsBalloon } from "react-icons/bs";
import { debounce, throttle, wait } from "../../../../tools/debounce";
import { showConsole } from "../../../../tools/flags";
import CustomButton from "../../../../components/utils/custom_buttons/CustomButton";
import { whiteBtnClass } from "../../../../styles/basic";
import InfoTab from "../../../helper/info-tab";
import AuswahlRow from "../../../../components/dienstplaner/einteilung-auswahl/AuswahlRow";
import { numericLocaleCompare } from "../../../../tools/helper";

class SharedEinteilungAuswahl extends InfoTab {
  constructor(appModel = false, parent = false, preventExtension = true) {
    super(appModel);
    this.setParent(parent);
    this.init();
    if (preventExtension) this._preventExtension();
    if (showConsole) this._whoAmI();
  }

  /**
   * Liefert die einteilungenHistory aus dem Dienstplaner
   */
  get history() {
    return this?._page?.einteilungenHistory || false;
  }

  /**
   * Liefert die Länge des Filters
   */
  get filterLength() {
    return this?.filter?.length || 0;
  }

  /**
   * Liefert die Länge der benutzerdefinierten Filter
   */
  get customFilterLength() {
    return this?.customFilter?.length || 0;
  }

  /**
   * Liefert die Länge der Vorschläge
   */
  get vorschlaegeLength() {
    return this?.vorschlaege?.length || 0;
  }

  /**
   * Liefert den ausgewählten keyCode
   */
  get keyCode() {
    return this?.nextFieldAuswahl?.[this.keyCodeIndex]?.keyCode || 0;
  }

  /**
   * Liefert die aktuelle Auswahl
   */
  get currentAuswahl() {
    if (this.vorschlaegeLength) {
      return this.vorschlaege;
    }
    return this.keyCode
      ? [(<tr key="next-feld-btn"><td>
        <CustomButton
          spinner={{ show: true }}
          clickHandler={(evt, setLoading) => {
            evt.stopPropagation();
            this.throttledHandleItemClick(setLoading);
          }}
          className="custom-select-button einteilung-auswahl-btn"
        >
          <p className="custom-select-buttons-text">Nächstes Feld</p>
        </CustomButton>
      </td></tr>  
      )] : [(<tr key="hinweis"><td>
          <p
            className="custom-select-hinweis-text"
          >
            Keine passenden Vorschläge gefunden
          </p>
        </td></tr>
      )];
  }

  /**
   * Liefert ein Array mit den möglichen Positionen der Auswahl
   */
  get positions() {
    return [
      <CustomButton
        key="einteilung-auswahl-float"
        title="Auswahl freischwebend."
        className={whiteBtnClass}
        spinner={{ show: true }}
        clickHandler={(evt, setLoading) => {
          this.changeTabPosition(evt, setLoading, 0);
        }}
      >
        <BsBalloon />
      </CustomButton>,
      <CustomButton
        key="einteilung-auswahl-top"
        title="Auswahl oben positionieren."
        className={whiteBtnClass}
        spinner={{ show: true }}
        clickHandler={(evt, setLoading) => {
          this.changeTabPosition(evt, setLoading, 1);
        }}
      >
        <BsBorderTop />
      </CustomButton>,
      <CustomButton
        key="einteilung-auswahl-right"
        title="Auswahl rechts positionieren."
        className={whiteBtnClass}
        spinner={{ show: true }}
        clickHandler={(evt, setLoading) => {
          this.changeTabPosition(evt, setLoading, 2);
        }}
      >
        <BsBorderRight />
      </CustomButton>
    ];
  }

  /**
   * Liefert eine Hinweis, dass die Vorschläge geladen werden
   */
  get loadFelder() {
    return (
      <tr key="hinweis"><td><p
      className="custom-select-hinweis-text"
    >
      Vorschläge werden geladen...
    </p></td></tr>
    );
  }

  get kontextId() {
    return this.kontexte[this.kontextStart]?.id || this._defaultEinteilungsKontextId;
  }

  /**
   * Initialisiert den Filter
   */
  init() {
    this.initKontexte();
    this.setType();
    this.setComment();
    this.setContextComment();
    this.setOptional();
    this.setSearchValue();
    this.setVorschlaege();
    this.setAuswahl();
    this.setFeld();
    this.setInfo();
    this.setFilter();
    this.setFilterVorlage();
    this.setShowVorlage();
    this.setCustomFilter();
    this.setCountOnlyMain();
    this.setNextFieldAuswahl();
    this.setKeyCode(0);
    this.initTabPosition()
  }

  initKontexte() {
    const arr = this._einteilungskontexte?._each?.(false, (k) => k.tagesverteiler)?.arr || [];
    arr.sort((a,b) => {
      if(a.default && !b.default) return -1;
      if(!a.default && b.default) return 1;
      return numericLocaleCompare(a.name, b.name);
    });
    this._setArray("kontexte", arr.map((kontext, i) => ({
        id: kontext.id,
        name: kontext.name,
        index: i,
        default: kontext.default,
        fkt: () => {
          if(this.kontextStart === i) return;
          this.setKontextStart(i);
          this._update();
        }
      })
    ));
    this.setKontextStart();
  }

  initTabPosition() {
    const tabPosition = parseInt(localStorage.getItem("DienstplanTabPosition"), 10);
    if(tabPosition >= 0 && tabPosition < 3) this.setTabPosition(tabPosition);
    else this.setTabPosition(0);
  }

  changeTabPosition(evt, setLoading, position) {
    evt.stopPropagation();
    this.setTabPosition(position);
    localStorage.setItem("DienstplanTabPosition", this.tabPosition);
    setLoading?.(() => false);
  }

  setComment(comment = "") {
    this._set("comment", comment);
    this.update("comment", {});
  }

  setContextComment(comment = "") {
    this._set("contextComment", comment);
    this.update("comment", {});
  }

  setOptional(optional = false) {
    this._set("optional", !!optional);
    this.update("optional", {});
  }

  /**
   * Setzt das type Attribut
   * @param {String} type
   */
  setType(type = "mitarbeiter") {
    this._set("type", type);
  }

  setKontextStart(index = 0) {
    const max = (this.kontexte.length || 1) - 1;
    this._setInteger("kontextStart", index, false, 0, max);
  }

  /**
   * Setzt das parent Attribut
   * @param {Object} parent
   */
  setParent(parent = false) {
    if (this._isObject(parent)) {
      this._set("parent", parent);
    } else console.log("Es muss ein parent-Objekt übergeben werden", parent);
  }

  /**
   * Ausgewähltes Feld
   * @param {Object} feld
   */
  setCurrentFeld(feld = false) {
    this._set("feld", feld);
  }

  /**
   * Setzt das filter Attribut
   * @param {Array} filter
   */
  setFilter(filter = []) {
    this._set("filter", filter);
  }

  /**
   * Setzt das filterVorlage Attribut
   * @param {Object} vorlage
   */
  setFilterVorlage(vorlage = false) {
    this._set("filterVorlage", vorlage);
  }

  /**
   * Setzt das showVorlage Attribut
   * @param {true} bool
   */
  setShowVorlage(bool = false) {
    this._set("showVorlage", bool);
  }

  /**
   * Setzt das countOnlyMain Attribut
   */
  setCountOnlyMain(count = true) {
    this._set("countOnlyMain", count);
    this.updateFilter(false);
  }

  /**
   * Setzt die Auswahl des Filters
   * @param {Number} index
   */
  setAuswahl(index = 0) {
    this._set("auswahl", index);
  }

  /**
   * Setzt das searchValue Attribut
   * @param {String} value
   */
  setSearchValue(value = "") {
    this._set("searchValue", typeof value === "string" ? value : "");
  }

  /**
   * Erstellt die Auswahl
   * @param {Object} mitarbeiter
   * @param {Object} feld
   * @param {String} id
   * @returns ReactComponent
   */
  createAuswahlComponent(mitarbeiter, feld, id, oldFeld = false) {
    return (
      <AuswahlRow
        mitarbeiter={mitarbeiter}
        infoParent={this.type === "mitarbeiter" ? mitarbeiter : feld}
        feld={feld}
        type={this.type}
        key={`${id}_${mitarbeiter.id}_${feld?.dienstId}_${feld?.tag}`}
        score={mitarbeiter.getScore(feld)}
        showBedarfe={this.type !== "mitarbeiter"}
        readOnly={false}
        oldFeld={oldFeld?.isAddFeld ? false : oldFeld}
      />
    );
  }

  /**
   * Aktuallisiert die Filter
   * @param {String} value
   */
  updateFilter = (value = false) => {
    if (typeof value === "string") this.setSearchValue(value);
    const i = parseInt(this.auswahl, 10) - this.filterLength;
    const filter = this?.filter?.[this.auswahl] || this?.customFilter?.[i];
    if (filter?.fkt) {
      filter.fkt();
    } else {
      this._update();
    }
  };

  /**
   * debounced Version von updateFilter
   */
  debouncedUpdateFilter = debounce((value = false) => {
    this.updateFilter(value);
  }, wait);

  /**
   * Setzt die parameter des Filter
   * @param {Object} params
   */
  setFilterParams(params = {}) {
    if (this?.filterVorlage?.setChecked && this._isObject(params)) {
      this.filterVorlage.setChecked(params, false, true);
    }
  }

  /**
   * @returns Index des neuen benutzerdefinierten Filters
   */
  getNewCustomFilterIndex() {
    return this.filterLength + this.customFilterLength;
  }

  /**
   * @returns Array mit allen Filtern
   */
  getFilter() {
    let result = [];
    if (this._isArray(this.filter)) result = result.concat(this.filter);
    if (this._isArray(this.customFilter)) result = result.concat(this.customFilter);

    return result;
  }

  /**
   * Erstellt ein Array für benutzerdefinierte Filter
   */
  setCustomFilter() {
    this._setArray("customFilter", []);
  }

  /**
   * Fügt einen neuen benutzerdefinierten Filter hinzu
   * @param {Object} newFilter
   */
  addCustomFilter(newFilter = false) {
    if (this._isArray(this.customFilter) && newFilter) {
      this.customFilter.push(newFilter);
    }
  }

  /**
   * Erstellt einen neuen benutzerdefinierten Filter
   */
  setNewCustomFilter() {
    const index = this.getNewCustomFilterIndex();
    const vorlage = this?.filterVorlage;
    const params = vorlage?.getParams?.() || {};
    const newFilter = {
      id: `Filter nr. ${index}`,
      fkt: () => this.getCustomFilter(index, params),
      index,
      title: ""
    };
    this.addCustomFilter(newFilter);
    newFilter.fkt();
  }

  /**
   * Setzt den Keycode und erstellt ggf. neue Vorschläge, falls keine existieren
   * @param {Number} index
   */
  setKeyCode(index = 0) {
    this._set("keyCodeIndex", index);
    this._update();
  }

  /**
   * Funktion um das nächste Feld auszuwählen
   */
  handleItemClick() {
    if (this?.parent?.throttledNextField && this.keyCode && this.feld) {
      this.parent.throttledNextField(this.keyCode, this.feld);
      this.debouncedUpdateFilter("");
    } else {
      this.debouncedUpdateFilter();
    }
  }

  throttledHandleItemClick = throttle((callback) => {
    this.handleItemClick();
    callback?.();
  }, wait);

  /**
   * Erstellt die Vorschläge
   * @param {Array} vorschlaege
   */
  setVorschlaege(vorschlaege = []) {
    this._set("vorschlaege", this._isArray(vorschlaege) ? vorschlaege : []);
    this.getAnzahlEintraege();
  }

  /**
   * Erstellt die Optionen, ob nach der Auswahl eines Vorschlages zum nächsten Feld
   * gesprungen werden soll
   */
  setNextFieldAuswahl() {
    const auswahl = [
      {
        id: "Aus",
        fkt: () => {
          this.setKeyCode(0);
        },
        index: 4,
        keyCode: "",
        title: "Nach dem Klicken auf eine Auswahl wird das Feld nicht gewechselt"
      },
      {
        id: "Unten",
        fkt: () => {
          this.setKeyCode(1);
        },
        index: 1,
        keyCode: "ArrowDown",
        title: "Nach dem Klicken auf eine Auswahl wird zum unteren Feld gesprungen"
      },
      {
        id: "Rechts",
        fkt: () => {
          this.setKeyCode(2);
        },
        index: 2,
        keyCode: "ArrowRight",
        title: "Nach dem Klicken auf eine Auswahl wird zum rechten Feld gesprungen"
      },
      {
        id: "Oben",
        fkt: () => {
          this.setKeyCode(3);
        },
        index: 3,
        keyCode: "ArrowUp",
        title: "Nach dem Klicken auf eine Auswahl wird zum oberen Feld gesprungen"
      },
      {
        id: "Links",
        fkt: () => {
          this.setKeyCode(4);
        },
        index: 4,
        keyCode: "ArrowLeft",
        title: "Nach dem Klicken auf eine Auswahl wird zum linken Feld gesprungen"
      }
    ];
    this._set("nextFieldAuswahl", auswahl);
  }

  setKontextByEinteilung(feld) {
    const kontext_id = feld?.einteilung?.einteilungskontext_id;
    if(kontext_id) {
      const kontext = this.kontexte.find(k => k.id === kontext_id);
      if(kontext) kontext.fkt();
    } else {
      this.setKontextStart();
    }
  }

  /**
   * Setzt die Überschrift, zu welchem Feld die Vorschläge gehören
   * und speichert das Label der Zelle
   * @param {Object} feld
   * @param {Boolean} execute
   */
  setFeld(feld = false, execute = false) {
    this.setKontextByEinteilung(feld);
    this.setComment(feld?.einteilung?.info_comment || "");
    this.setContextComment(feld?.einteilung?.context_comment || "");
    this.setOptional(!!feld?.einteilung?.isOptional);
    this.setInfoTitle(feld?.label);
    this.setCurrentFeld(feld || false);
    feld && this.updateFilter();
    execute && this.setInfoFkt(feld);
    this._update();
  }

  /**
   * Ermittelt die Anzahl der Vorschläge und setzt die footInfo
   */
  getAnzahlEintraege() {
    const l = this.feld ? this.vorschlaegeLength : 0;
    this.setFootInfo(`${l} ${l === 1 ? "Eintrag" : "Einträge"}`);
  }

  /**
   * Liefert einen Benutzerdefinierten Filter
   * @param {Number} index
   * @param {Object} params
   */
  getCustomFilter(index, params = false) {
    this.setShowVorlage(!params);
    if (this._isObject(params)) this.setFilterParams(params);
    this.initVorschlaege(index);
  }

  /**
  * Initialisiert die neuen Vorschläge
  * @param {Number} index
  * @param {Array} vorschlaege
  */
  initVorschlaege(index, vorschlaege = []) {
    this.setAuswahl(index);
    this.setVorschlaege(this._isArray(vorschlaege) ? vorschlaege : []);
    this._update();
  }
}

export default SharedEinteilungAuswahl;
