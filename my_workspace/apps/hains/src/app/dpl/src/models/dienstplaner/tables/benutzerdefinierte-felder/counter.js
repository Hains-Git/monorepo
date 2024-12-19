import React from "react";
import CounterElement from "../../../../components/dienstplaner/table/customfeld/CounterElement";
import {
  createAbsolutDateId,
  createRelativeDateId,
  getYearMonthDayFromString,
  returnDateStringFromArr
} from "../../../../tools/dates";
import { debounce, wait } from "../../../../tools/debounce";
import Basic from "../../../basic";
import { showConsole } from "../../../../tools/flags";
import { deepClone, keinTeamName, numericLocaleCompare, toFixed } from "../../../../tools/helper";
import { isNumber } from "../../../../tools/types";

/**
 * Klasse für die Zähler im Dienstplaner
 * @class
 */
class Counter extends Basic {
  constructor(
    {
      id = 0,
      name = "Neuer Zähler",
      beschreibung = "Test Zähler",
      cell_id = "name_0_0_0_0_0_0",
      dienstplan_custom_feld_id = 0,
      hidden = false,
      colors = [],
      count = "Einteilungen",
      mitarbeiter_ids = [],
      mitarbeiterteam_ids = [],
      mitarbeiterfunktionen_ids = [],
      currently_in_team = true,
      aktiv = true,
      inaktiv = true,
      date_ids = [],
      wochentage = [0, 1, 2, 3, 4, 5, 6],
      feiertage = "auch",
      dienste_ids = [],
      diensteteam_ids = [],
      mit_bedarf = true,
      ohne_bedarf = true,
      funktion = "",
      add_kein_mitarbeiterteam = false,
      act_as_funktion = false,
      evaluate_seperate = false,
      empty_as_regeldienst = false
    },
    appModel = false
  ) {
    super(appModel);
    this._setArray("countAuswahl", [], false);
    this.addBasicOptions();
    this._set("id", id);
    this._set("dienstplan_custom_feld_id", dienstplan_custom_feld_id);
    this._set("name", name);
    this.setBeschreibung(beschreibung);
    this.setName(name);
    this._set("cell_id", cell_id);
    this.setHidden(hidden);
    this._set("colors", colors);
    this.setCount({ id: count });
    this._setArray("mitarbeiter_ids", mitarbeiter_ids);
    this._setArray("mitarbeiterteam_ids", mitarbeiterteam_ids);
    this._setArray("mitarbeiterfunktionen_ids", mitarbeiterfunktionen_ids);
    this._set("aktiv", aktiv);
    this._set("inaktiv", inaktiv);
    this._set("currently_in_team", currently_in_team);
    this._setArray("date_ids", date_ids);
    this._setArray("wochentage", wochentage);
    this._set("feiertage", feiertage);
    this._setArray("dienste_ids", dienste_ids);
    this._setArray("diensteteam_ids", diensteteam_ids);
    this._set("mit_bedarf", mit_bedarf);
    this._set("ohne_bedarf", ohne_bedarf);
    this._set("empty_as_regeldienst", empty_as_regeldienst);
    this.setActAsFunktion(act_as_funktion && false);
    this.setFunktion(funktion);
    this.setEvaluateSeperate(evaluate_seperate);
    this._set("add_kein_mitarbeiterteam", add_kein_mitarbeiterteam);
    this._setArray("cells", [], false);
    this.setResult();
    this.setIsInitialisiert(false);
    this.setTitle();
    this.setCellId();
    this.setAbsoluteDateIds();
    this.setFunktionWarn();
    this._preventExtension();
    if (showConsole) this._whoAmI();
  }

  /**
   * Liefert das Parent-Feld aus dem Counter
   */
  get parent() {
    const feld = this.getFeldFromUser(this.dienstplan_custom_feld_id);
    return feld;
  }

  /**
   * Gibt den Separator des Farbregel-Codes zurück
   */
  get COLOR_SPLIT() {
    return "_SPLIT_";
  }

  /**
   * Maximale Anzahl an erlaubten Farbregeln
   */
  get COLORS_MAX() {
    return 30;
  }

  /**
   * Bedinungen für die Farbregel
   * ->Wert1 Bedingung(z.B. >) Wert2 => Farbe
   */
  get FARBE_BEDINGUNGEN() {
    return [
      "<=",
      "<",
      ">=",
      ">",
      "=",
      "!="
    ];
  }

  /**
   * Gibt die möglichen Elemente der Zähler zurück
   */
  get FARBE_TYPEN() {
    const result = [
      "Ergebnis",
      "Soll",
      "Ist",
      "Saldo_aktuell",
      "Saldo_verrechnet",
      "BD",
      "RD",
      "BD_vormonat",
      "RD_vormonat",
      "VK",
      "Team_0"
    ];
    this?._teams?._each?.((t) => {
      result.push(`Team_${t.id}`);
    });

    return result;
  }

  /**
   * Maximale Anzahl an Zeichen für eine Funktion
   */
  get funktionMax() {
    return 1000;
  }

  /**
   * Label des Zählers
   */
  get label() {
    return this.name;
  }

  /**
   * True, wenn der Zähler zu einer Zeile gehört
   */
  get row() {
    return this?.parent?.row;
  }

  /**
   * Ansicht-Id des Elternelements
   */
  get ansicht() {
    return this?.parent?.ansicht_id || 0;
  }

  /**
   * Index der Eigenschaft, die gezählt werden soll
   */
  get countIndex() {
    const auswahl = this.countAuswahl.find((item) => this.count === item.id);
    let index = 0;
    if (auswahl) {
      index = auswahl.index;
    } else {
      this.setCount(this.countAuswahl[0].id);
    }

    return index;
  }

  /**
   * Objekt der ausgewählten Statistik
   */
  get currentCount() {
    return this.countAuswahl[this.countIndex];
  }

  /**
   * Soll der Zähler für jede Mitarbeiterin einzeln erstellt werden?
   */
  get evalMitarbeiterSeperate() {
    return this.evaluate_seperate && !this.row && this.ansicht > 0;
  }

  /**
   * Soll der Zähler für jeden Dienst einzeln erstellt werden?
   */
  get evalDiensteSeperate() {
    return this.evaluate_seperate && this.row && [0, 2].includes(this.ansicht);
  }

  /**
   * Soll der Zähler für jeden Tag einzeln erstellt werden?
   */
  get evalTageSeperate() {
    const checkAnsicht = this.row ? 1 : 0;
    return this.evaluate_seperate && this.ansicht === checkAnsicht;
  }

  /**
   * Sollen Mitarbeiter ausgewählt werden können?
   */
  get showMitarbeiter() {
    const checkCount = !this.act_as_funktion && this?.currentCount?.showMitarbeiter;
    return checkCount || this.evalMitarbeiterSeperate;
  }

  /**
   * Sollen Tage ausgewählt werden können?
   */
  get showTage() {
    const checkCount = !this.act_as_funktion && this?.currentCount?.showTage;
    return checkCount || this.evalTageSeperate;
  }

  /**
   * Sollen Dienste ausgewählt werden können?
   */
  get showDienste() {
    const checkCount = !this.act_as_funktion && this?.currentCount?.showDienste;
    return checkCount || this.evalDiensteSeperate;
  }

  /**
   * Sollen Puffer für die Urlaubsstatistik ausgewählt werden können?
   */
  get showTeamPuffer() {
    return this?.currentCount?.showTeamPuffer;
  }

  /**
   * Gibt an, auf wieviele Stellen der Zähler gerundet werden soll
   */
  get decimal() {
    return !this.act_as_funktion && (this?.currentCount?.decimal || 0);
  }

  /**
   * Liefert die zur cellId zugehörigen Objekte
   */
  get objectsFromCellId() {
    const [
      mitarbeiterId,
      dienstId,
      dateId,
      komplementaerFeldId
    ] = this.cellId.split("_");
    return {
      mitarbeiter: this?._mitarbeiter?.[mitarbeiterId] || false,
      dienst: this?._dienste?.[dienstId] || false,
      date: this?._dates?.[dateId] || false,
      feld: this?.parent || false,
      komplementaerFeld: this.getFeldFromUser(komplementaerFeldId) || false
    };
  }

  /**
   * Ermittelt das Label, zu welcher Zeile  und Spalte der Zähler gehört
   */
  get zugehoerigkeit() {
    const {
      mitarbeiter,
      dienst,
      date,
      feld,
      komplementaerFeld
    } = this.objectsFromCellId;
    const cellLabel = date?.label || dienst?.planname || mitarbeiter?.planname || "";
    const kompFeldName = cellLabel || komplementaerFeld?.name || "";
    let title = feld?.name || "";
    if (kompFeldName) {
      if (feld?.row) {
        title = `${title}, ${kompFeldName}`;
      } else {
        title = `${kompFeldName}, ${title}`;
      }
    }
    return title;
  }

  /**
   * Liefert den Index des CustomFeldes
   */
  get index() {
    return this?.parent?.index || 1;
  }

  /**
   * Liefert das Standard-Result-Objekt
   */
  get defaultResult() {
    return {
      mitarbeiter: {},
      dienste: {},
      dates: {},
      all: 0,
      getResult: (value) => this.getResult(value || 0)
    };
  }

  /**
   * Erstellt die Cell-Id mit dem absoluten Datum
   */
  get absolutDateCellId() {
    const arr = this.cell_id.split("_");
    arr[2] = createAbsolutDateId(arr[2], this._anfang?.str || "");
    return arr.join("_");
  }

  get isArbeitszeitCounter() {
    return [
      "Arbeitszeiten (Std)", 
      "Ist Arbeitszeit (Std)", 
      "Arbeitszeit Saldo (Std)"
    ].includes(this.count);
  }

  /**
   * Setzt das result Attribut
   * @param {Object} result
   */
  setResult(result = false) {
    this._set("result", result, false);
  }

  /**
   * Erweitert die Farbe_Typen um die Typen für die Teams
   * @returns Array mit Farbtypen
   */
  getFarbTypen() {
    const teams = this._teams;
    return this.FARBE_TYPEN.map((value) => {
      let label = value;
      if (value.indexOf("Team_") === 0) {
        const id = value.split("_")[1];
        if (teams?.[id]) label = teams[id].name;
        else label = keinTeamName;
      }

      return {
        value,
        label
      };
    });
  }

  /**
   * Ordnet der customFeld-Id ein customFeld aus dem User zu.
   * @param {Number} id
   */
  getFeldFromUser(id) {
    return this?._user?.getFeld?.(id);
  }

  /**
   * Setzt das act_as_funktion Attribute
   * @param {String} fkt
   */
  setFunktion(fkt = "") {
    this._set("funktion", fkt);
  }

  /**
   * Setzt das act_as_funktion Attribute
   * @param {Boolean} act_as_funktion
   */
  setActAsFunktion(check = false) {
    this._set("act_as_funktion", check);
  }

  /**
   * Setzt das evaluate_seperate Attribute
   * @param {Boolean} evaluate_seperate
   */
  setEvaluateSeperate(check = false) {
    this._set("evaluate_seperate", check);
  }

  setEmptyAsRegeldienst(check = false) {
    this._set("empty_as_regeldienst", check);
  }

  /**
   * Setzt das absoluteDateIds Attribute
   * @param {Array} dateIds
   */
  setAbsoluteDateIds(dateIds = []) {
    this._setArray("absoluteDateIds", dateIds, false);
  }

  /**
   * Setzt welche Eigenschaft gezählt werden soll
   * @param {Object} item
   */
  setCount(item) {
    this._set("count", item?.id || "");
  }

  /**
   * Setzt welche Eigenschaft gezählt werden soll
   * @param {Boolean} check
   */
  setIsInitialisiert(check = false) {
    this._set("isInitialisiert", check, false);
  }

  /**
   * Erstellt ein Title-Attribut
   * @param {String} title
   */
  setTitle() {
    const hasBeschreibung = typeof this.beschreibung === "string" && this.beschreibung.trim() !== "";
    const title = [
      { txt: `Name: ${this.name}` },
      {
        txt: `${this.act_as_funktion ? `Berechnet: ${this.funktion}` : `Zählt: ${this.count}`}`
        + `${hasBeschreibung ? `\nBeschreibung: ${this.beschreibung}` : ""}`
      }
    ];
    this._set("title", title, false);
    this._update();
  }

  /**
   * Setzt das name Attribute
   * @param {String} name
   */
  setName(name = "") {
    this._set("name", name);
  }

  /**
   * Setzt das beschreibung Attribute
   * @param {String} beschreibung
   */
  setBeschreibung(beschreibung = "") {
    this._set("beschreibung", beschreibung);
  }

  /**
   * Setzt das hidden Attribute
   * @param {Boolean} hidden
   */
  setHidden(check = false) {
    this._set("hidden", check);
  }

  /**
   * Setzt das cellId Attribute
   * @param {String} cellId
   */
  setCellId(cellId = "") {
    this._set("cellId", cellId, false);
  }

  /**
   * Setzt das funktionWarn Attribute
   * @param {String} warn
   */
  setFunktionWarn(warn = []) {
    const warning = [
      `Max. ${this.funktionMax} Zeichen`,
      "Erlaubte Zeichen: Zahlen, +, -, *, /, (, ), ^, Dezimalpunkt = ., Zähler",
      "Zähler auswählen: id:Zahl.Option.Attribut"
    ];
    warn.forEach((txt) => warning.push(txt));
    this._set("funktionWarn", warning, false);
  }

  /**
   * Testet, ob ein bestimmter Dienst (an einem bestimmten Tag)
   * die ausgewählten Bedingungen erfüllt.
   * @param {Object} dienst
   * @param {object/boolean} date
   * @returns Boolean
   */
  checkDiensteBedingungen(dienst, date = false) {
    const isInDienst = !this.dienste_ids.length || this.dienste_ids.includes(dienst.id);
    let isInDienstTeam = !this.diensteteam_ids.length;
    let checkedBedarf = false;
    if (this.mit_bedarf || this.ohne_bedarf) {
      const hasBedarf = date && dienst?.hasBedarfAm
        ? dienst.hasBedarfAm(date.id)
        : dienst?.hasBedarf;
      checkedBedarf = (hasBedarf && this.mit_bedarf) || (!hasBedarf && this.ohne_bedarf);
    }

    if (this.diensteteam_ids.length) {
      isInDienstTeam = this.diensteteam_ids.find((tId) => {
        const team = this?._teams?.[tId];
        return team?.hasDienst && team.hasDienst(dienst.id);
      });
    }
    return isInDienst && isInDienstTeam && checkedBedarf;
  }

  /**
   * Liefert true, wenn der dienst der Zelle in den dienste_ids ist
   * @param {Object} cell
   * @returns true/false
   */
  isInDiensteIds(cell) {
    if (!this._isObject(cell)) return false;
    const {
      dienst
    } = cell;
    if (dienst) {
      return this.checkDiensteBedingungen(dienst);
    }
    return false;
  }

  /**
   * Testet, ob ein Datum die ausgewählten Bedingungen erfüllt
   * @param {Object} date
   * @returns Boolean
   */
  checkTageBedingungen(date) {
    const isInTage = !this.absoluteDateIds.length || this.absoluteDateIds.includes(date.id);
    const hasWochentag = !this.wochentage.length || this.wochentage.includes(date.week_day_nr);
    let onFeiertag = true;
    switch (this.feiertage) {
      case "nicht":
        onFeiertag = !date.isFeiertag;
        break;
      case "nur":
        onFeiertag = date.isFeiertag;
        break;
    }
    return isInTage && hasWochentag && onFeiertag;
  }

  /**
   * Liefert true, wenn das Date der Zelle in den absoluteDateIds ist
   * @param {Object} cell
   * @returns true/false
   */
  isInDateIds(cell) {
    if (!this._isObject(cell)) return false;
    const {
      date
    } = cell;
    if (date) {
      return this.checkTageBedingungen(date);
    }
    return false;
  }

  /**
   * Testet, ob Mitarbeiter (an einem bestimmten Tag) zu den ausgewählten Teams gehören.
   * @param {Object} mitarbeiter
   * @param {Object} date
   * @returns Boolean
   */
  checkMitarbeiterTeam(mitarbeiter, date = false) {
    let isInMitarbeiterTeam = !this.mitarbeiterteam_ids.length;
    if (this.mitarbeiterteam_ids.length) {
      isInMitarbeiterTeam = !!this.mitarbeiterteam_ids.find((tId) => {
        const team = this?._teams?.[tId];
        if (date && this.currently_in_team && team?.hasMitarbeiterTag) {
          return team.hasMitarbeiterTag(mitarbeiter.id, date.id);
        } if (!this.currently_in_team && team?.hasMitarbeiter) {
          return team.hasMitarbeiter(mitarbeiter.id);
        }
        return false;
      });
    }

    if (this.add_kein_mitarbeiterteam && !isInMitarbeiterTeam) {
      if (date && this.currently_in_team && mitarbeiter?.hasTeamAm) {
        isInMitarbeiterTeam = !mitarbeiter.hasTeamAm(date.id);
      } else if (!this.currently_in_team && mitarbeiter?.hasTeam) {
        isInMitarbeiterTeam = !mitarbeiter.hasTeam();
      }
    }
    return isInMitarbeiterTeam;
  }

  /**
   * Testet, ob ein Mitarbeiter die ausgewählten Bedingungen erfüllt
   * @param {Object} mitarbeiter
   * @returns Boolean
   */
  checkMitarbeiterBedingungen(mitarbeiter) {
    const isInMitarbeiter = !this.mitarbeiter_ids.length
      || this.mitarbeiter_ids.includes(mitarbeiter.id);
    const hasFunktion = !this.mitarbeiterfunktionen_ids.length
      || this.mitarbeiterfunktionen_ids.includes(mitarbeiter.funktion_id);
    const isAktiv = this.aktiv && mitarbeiter.aktiv;
    const isInaktiv = this.isInaktiv && !mitarbeiter.aktiv;
    return isInMitarbeiter && hasFunktion && (isAktiv || isInaktiv);
  }

  /**
   * Liefert true, wenn der mitarbeiter der Zelle in den mitarbeiter_ids ist
   * @param {Object} cell
   * @returns true/false
   */
  isInMitarbeiterIds(cell) {
    if (!this._isObject(cell)) return false;
    const {
      mitarbeiter
    } = cell;
    if (mitarbeiter) {
      return this.checkMitarbeiterBedingungen(mitarbeiter)
        && this.checkMitarbeiterTeam(mitarbeiter);
    }

    return false;
  }

  /**
   * Testet einen Wert gegen die definierte Farbregel.
   * @param {Number} value
   * @param {Number} decimal
   * @param {String} typ
   * @returns Farbe, wenn eine passende Farbregel definiert ist
   */
  checkFarbRegeln(value, decimal = 1, typ = false) {
    const l = this.colors.length;
    if (!l) return false;
    const typen = this.FARBE_TYPEN;
    const checkType = typ || typen[0];
    const bed = this.FARBE_BEDINGUNGEN;
    const split = this.COLOR_SPLIT;
    const reg = new RegExp(`^(${typen.join("|")})${split}(${bed.join("|")})${split}-?\\d*((\\.|e(-|\\+)?)\\d*)?${split}#([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$`);

    for (let i = 0; i < l; i++) {
      const code = this.colors[i];
      if (reg.test(code)) {
        const [thisTyp, thisBed, zahl, farbe] = code.split(split);
        const thisZahl = zahl === "" ? 0.0 : parseFloat(toFixed(zahl, decimal));
        if (checkType !== thisTyp) continue;
        const valueArr = this._isArray(value) ? value : [value];
        const vl = valueArr.length;
        for (let j = 0; j < vl; j++) {
          const thisValue = parseFloat(toFixed(valueArr[j], decimal));
          if((
            (thisBed === bed[0] && thisValue <= thisZahl)
            || (thisBed === bed[1] && thisValue < thisZahl)
            || (thisBed === bed[2] && thisValue >= thisZahl)
            || (thisBed === bed[3] && thisValue > thisZahl)
            || (thisBed === bed[4] && thisValue === thisZahl)
            || (thisBed === bed[5] && thisValue !== thisZahl)
          )) return farbe;
        }
      }
    }

    return false;
  }

  /**
   * @param {Object} cell
   * @returns True, wenn die Zelle passende Eigenschaften hat
   */
  hasCell(cell) {
    this.init();
    const {
      mitarbeiter,
      dienst,
      date,
      komplementaerFeld
    } = this.objectsFromCellId;
    const checkIndex = (index, row) => {
      if (!cell.isHead) return false;
      if (row) {
        return index === cell?.row?.position;
      }
      return index === cell?.position;
    };
    if (this._isObject(cell) && (
      (
        this.evaluate_seperate && (
          this.isInDiensteIds(cell)
          || this.isInDateIds(cell)
          || this.isInMitarbeiterIds(cell)
        )
      ) || (
        !this.evaluate_seperate && (
          (mitarbeiter && mitarbeiter === cell?.mitarbeiter)
          || (dienst && dienst === cell?.dienst)
          || (date && date === cell?.date)
          || (
            checkIndex(this.index, this.row)
            && checkIndex(komplementaerFeld?.index, !this.row)
          )
        )
      )
    )) {
      return true;
    }
    return false;
  }

  /**
   * Führt ein update des Counters aus
   */
  updateThroughFeld = debounce(() => {
    this.setResult();
    this._update();
  }, wait);

  /**
   * Fügt eine auswählbare Statistik als Objekt hinzu
   * @param {Object} obj
   * id, title, fkt, showMitarbeiter, shwoDienste, showTage, showTeamPuffer, decimal
   */
  createAuswahl({
    id = "",
    title = "",
    fkt = () => {},
    showMitarbeiter = true,
    showDienste = true,
    showTage = true,
    showTeamPuffer = false,
    decimal = 1
  }) {
    if (!this._isFunction(fkt)) return;
    const index = this.countAuswahl.length;
    this.countAuswahl.push({
      id,
      index,
      title,
      countFkt: fkt,
      showMitarbeiter,
      showDienste,
      showTage,
      showTeamPuffer,
      decimal
    });
  }

  /**
   * Erstellt die grundlegenden Statistiken, die gezählt werden können
   */
  addBasicOptions() {
    [
      {
        id: "Einteilungen",
        title: "Zählt in wieviele Felder die Mitarbeiter mit den ausgewählten Tagen und Diensten eingeteilt wurden.",
        fkt: () => this.countEinteilungen(),
        showMitarbeiter: true,
        showDienste: true,
        showTage: true,
        decimal: 0
      },
      {
        id: "Arbeitszeiten (Std)",
        title: "Zählt die Arbeitszeiten (Soll, Ist, Saldo, Bereitschaft, Rufbereitschaft und Vormonat in einem Feld) in Stunden",
        fkt: () => this.countArbeitszeiten(),
        showMitarbeiter: true,
        showDienste: true,
        showTage: true,
        decimal: 1
      },
      {
        id: "Urlaubsstatistik",
        title: "Zählt die Verfügbarkeit von Mitarbeitern nach Teams.",
        fkt: () => this.countUrlaubsStatistik(),
        showMitarbeiter: true,
        showDienste: false,
        showTage: true,
        showTeamPuffer: true,
        decimal: 0
      },
      {
        id: "Gesamtbedarf",
        title: "Zählt den Gesamtbedarf der ausgewählten Tage und Dienste.",
        fkt: () => this.countGesamtBedarf(),
        showMitarbeiter: false,
        showDienste: true,
        showTage: true,
        decimal: 0
      },
      {
        id: "Mindestbedarf",
        title: "Zählt den Mindestbedarf der ausgewählten Tage und Dienste.",
        fkt: () => this.countMindestBedarf(),
        showMitarbeiter: false,
        showDienste: true,
        showTage: true,
        decimal: 0
      },
      {
        id: "Optionaler Bedarf",
        title: "Zählt den optionalen Bedarf der ausgewählten Tage und Dienste.",
        fkt: () => this.countOptionalerBedarf(),
        showMitarbeiter: false,
        showDienste: true,
        showTage: true,
        decimal: 0
      },
      {
        id: "Unbesetzter Bedarf",
        title: "Zählt wieviele der Bedarfe der ausgewählten Tage und Dienste unbesetzt geblieben ist.",
        fkt: () => this.countUnbesetzterBedarf(),
        showMitarbeiter: false,
        showDienste: true,
        showTage: true,
        decimal: 0
      },
      {
        id: "Besetzter Bedarf",
        title: "Zählt wieviele der Bedarfe der ausgewählten Tage und Dienste besetzt wurden.",
        fkt: () => this.counBesetzterBedarf(),
        showMitarbeiter: false,
        showDienste: true,
        showTage: true,
        decimal: 0
      },
      {
        id: "Soll Arbeitszeit (Std)",
        title: "Zählt die Soll-Arbeitszeit der Mitarbeiter an ausgewählten Tagen.",
        fkt: () => this.countArbeitszeitSoll(),
        showMitarbeiter: true,
        showDienste: false,
        showTage: true,
        decimal: 1
      },
      {
        id: "Ist Arbeitszeit (Std)",
        title: "Zählt die Ist-Arbeitszeit der Mitarbeiter an ausgewählten Tagen.",
        fkt: () => this.countArbeitszeitIst(),
        showMitarbeiter: true,
        showDienste: true,
        showTage: true,
        decimal: 1
      },
      {
        id: "Arbeitszeit Saldo (Std)",
        title: "Zählt die Ist-Soll Arbeitszeit der Mitarbeiter an ausgewählten Tagen.",
        fkt: () => this.countArbeitszeitSaldo(),
        showMitarbeiter: true,
        showDienste: false,
        showTage: true,
        decimal: 1
      }
    ].forEach((obj) => {
      this.createAuswahl(obj);
    });
  }

  /**
   * Erstellt die Einzel-Statistiken für die Daten aus den Wochenbilanzen des Vormonats
   */
  addVormonatZeiten() {
    if (!this?._wochenbilanzen) return;
    [
      {
        label: "Arbeitszeit (Std)",
        key: "geplante_arbeitszeit",
        beschreibung: "Geplante Arbeitszeit",
        decimal: 1
      },
      {
        label: "Bereitschaftszeit (Std)",
        key: "geplante_bereitschaftszeit",
        beschreibung: "Geplante Bereitschaftszeit",
        decimal: 1
      },
      {
        label: "Rufbereitschaftszeit (Std)",
        key: "geplante_rufbereitschaftszeit",
        beschreibung: "Geplante Rufbereitschaftszeit",
        decimal: 1
      },
      {
        label: "Saldo (Std)",
        key: "plusstunden",
        beschreibung: "Entspricht dem Saldo (= Soll - Ist) der Arbeitszeit",
        decimal: 1
      },
      {
        label: "Überstunden",
        key: "ueberstunden",
        beschreibung: "Eingetragene Überstunden",
        decimal: 1
      },
      {
        label: "Krankstunden",
        key: "krankstunden",
        beschreibung: "Eingetragene Krankstunden",
        decimal: 1
      },
      {
        label: "Wochensoll (Std)",
        key: "wochensoll",
        beschreibung: "Eingetragenes Wochensoll",
        decimal: 1
      },
      {
        label: "Urlaubstage",
        key: "urlaubstage",
        beschreibung: "Eingetragene Urlaubstage",
        decimal: 0
      }
    ].forEach(({
      label, key, beschreibung, decimal
    }) => {
      this.createAuswahl({
        id: `Vormonat ${label}`,
        title: [
          { txt: `Zählt die ${label} aus dem Vormonat` },
          { txt: beschreibung }
        ],
        fkt: () => this.countArbeitszeitVormonat(key),
        showMitarbeiter: true,
        showDienste: false,
        showTage: false,
        decimal
      });
    });
  }

  /**
   * Erweitert die Statistik um das Zählen einzelener Arbeitszeittypen
   */
  addArbeistzeittypen() {
    this._arbeitszeittypen?._each?.((typ) => {
      const id = `Arbeitszeittyp ${typ.name} (Std)`;
      this.createAuswahl({
        id,
        title: [
          { txt: `Zählt die eingeteilte Zeit der Mitarbeiter in ${typ.name} an ausgewählten Tagen. (Ausgleichsschichten werden nicht betrachtet)` },
          { txt: typ.beschreibung ? typ.beschreibung : "" }
        ],
        fkt: () => this.countArbeitszeitTyp(typ),
        showMitarbeiter: true,
        showDienste: true,
        showTage: true,
        decimal: 1
      });
    });
  }

  /**
   * Initialisiert die Attribute, welche erst ermittelt werden können,
   * nachdem das Singleton aufgebaut wurde
   */
  init() {
    if (!this.isInitialisiert) {
      this.setCellId(this.absolutDateCellId);
      this.setAbsoluteDateIds(this.formatDates());
      this.addVormonatZeiten();
      this.addArbeistzeittypen();
      this._update();
      // Zuordnen von Diensten, Dates und Mitarbeitern,
      // Sodass einfach ein Array übergeben werden kann an die Statistik
      this.setIsInitialisiert(true);
    }
  }

  /**
   * Erstellt aus den relativen Dates absolute Dates.
   * @returns Array mit den DateIds für die aktuellen Monate
   */
  formatDates() {
    const dateIds = [];
    const anfang = this._anfang?.str || "";
    this.date_ids?.forEach?.((id) => {
      const dateId = createAbsolutDateId(id, anfang);
      dateIds.push(dateId);
    });

    return dateIds;
  }

  /**
   * Fügt eine Farbregel in colors hinzu
   */
  addFarbe = debounce((addPos) => {
    const l = this.colors.length;
    if (l >= this.COLORS_MAX) return;

    const p = parseInt(addPos, 10);
    const split = this.COLOR_SPLIT;
    const newColor = `${this.FARBE_TYPEN[0]}${split}${this.FARBE_BEDINGUNGEN[0]}${split}0.0${split}#ffffff`;
    if (typeof p === "number" && p >= 0 && p < l) {
      this.colors.splice(p, 0, newColor);
    } else {
      this.colors.push(newColor);
    }
    this.update("farbe", {});
  }, wait);

  /**
   * Entfernt eine Farbe aus den colors
   * @param {Number} pos
   */
  removeFarbe = debounce((pos) => {
    if (pos >= 0 && this.colors[pos]) {
      this.colors.splice(pos, 1);
      this.update("farbe", {});
    }
  }, wait);

  /**
   * Teilt den String einer Farbregel "bedingung_number_hex-color" in seine Bestandteile auf
   * @param {String} color
   * @returns {array} Array
   */
  splitFarbe(pos) {
    if (this.colors[pos]) {
      return this.colors[pos].split(this.COLOR_SPLIT);
    }
    // Team_ID durch Name ersetzen
    return [];
  }

  /**
   * Ändern einer Farbregel
   * @param {String} pos
   * @param {String} key
   * @param {String} bedingung
   * @param {Number} zahl
   * @param {String} farbe
   */
  changeFarbRegel(typ, pos, bedingung, zahl, farbe) {
    if (this.colors[pos]) {
      const split = this.COLOR_SPLIT;
      this.colors[pos] = `${typ}${split}${bedingung}${split}${zahl}${split}${farbe}`;
      this.update(`farbregel_${pos}`, {});
    }
  }

  /**
   * Liefert alle Zähler der Zeile/Spalte
   * @returns Counter
   */
  getAllCounter() {
    return this?.parent?.getAllCounter
      ? this.parent.getAllCounter(false, true)
      : [];
  }

  /**
   * Erstellt ein Objekt, welches im Counter-Formular zu einem bestimmten Feld umgewandelt wird,
   * sodass man z.B. die Checkboxen, Dropdown-Menüs, Radio-Button etc. erhält
   * @param {Object} obj
   * label, key, title, radiogroup, radiovalue, isTitle, isButton, isCheckbox, isRadio, isNumber,
   * getOptions, getChecked, onClick, pull, push, sortnr
   * @returns Object
   */
  createElement({
    label = "",
    key = "",
    title = "",
    radiogroup = "",
    radiovalue = "",
    isTitle = false,
    isButton = false,
    isCheckbox = false,
    isRadio = false,
    isNumber = false,
    getOptions = () => null,
    getChecked = () => true,
    onClick = () => {},
    pull = () => {},
    push = () => {},
    sortnr = 0
  }) {
    return {
      label,
      key,
      title,
      radiogroup,
      sortnr,
      radiovalue,
      isTitle,
      isButton,
      isCheckbox,
      isRadio,
      isNumber,
      getOptions,
      getChecked,
      onClick,
      pull,
      push
    };
  }

  /**
   * Fügt einem Array-Attribut aus dem Zähler z.B. mitarbeiter_ids
   * einen Wert hinzu oder entfernt ihn aus dem Array, je nach Status der Checkbox
   * @param {Boolean} check
   * @param {String} key Attribut-Name
   * @param {string/numeric} value
   */
  check(check, key, value) {
    if (check) {
      if (!this[key].includes(value)) this[key].push(value);
    } else {
      const i = this[key].indexOf(value);
      if (i >= 0) this[key].splice(i, 1);
    }
    this.update(key, {});
  }

  /**
   * @param {String} key
   * @param {Number|String} value
   * @returns True, if value in Array
   */
  isChecked(key, value) {
    return this?.[key]?.includes?.(value);
  }

  /**
   * Erstellt eine typische Checkbox für Array-Attribute
   * z.B. zur Auswahl der Bedingungen für das Zählen.
   * @param {String} label
   * @param {String} key
   * @param {String} id
   * @param {String} thisKey
   * @param {numeric} sortnr
   * @returns object
   */
  createStandardAttributes(label, key, id, thisKey, sortnr = 0) {
    return {
      label,
      key,
      isCheckbox: true,
      getChecked: () => this.isChecked(thisKey, id),
      onClick: (evt) => {
        this.check(evt.target.checked, thisKey, id);
      },
      push: (set) => this.push(thisKey, set),
      pull: (set) => this.pull(thisKey, set),
      sortnr
    };
  }

  /**
   * Erstellt ein Radio-Button für die Auswahl, ob Feiertage berücksichtigt werden sollen oder nicht
   * @param {String} label
   * @param {String} value
   * @returns object
   */
  createFeiertageBtn(label, value) {
    return {
      label,
      key: `tage-bedingungen-feiertage-${value}`,
      isRadio: true,
      radiogroup: "feiertage-bedingung",
      radiovalue: value,
      getChecked: () => this.feiertage === value,
      onClick: () => {
        this._set("feiertage", value);
        this.update("feiertage", {});
      },
      push: (set) => this.push("feiertage", set),
      pull: (set) => this.pull("feiertage", set)
    };
  }

  /**
   * Erstellt eine Checkbox für Boolean-Attribute wie z.B. mit/ohne Bedarf
   * @param {String} label
   * @param {String} title
   * @param {String} key
   * @param {String} thisKey
   * @returns object
   */
  createStandardCheckbox(label, title, key, thisKey) {
    return {
      label,
      key: key + thisKey,
      title,
      isCheckbox: true,
      getChecked: () => !!this?.[thisKey],
      onClick: (evt) => {
        this._set(thisKey, evt.target.checked);
        this.update(thisKey, {});
      },
      push: (set) => this.push(thisKey, set),
      pull: (set) => this.pull(thisKey, set)
    };
  }

  /**
   * Erstellt ein Button, mit dem sich die Dienste aus der Vorlage auswählen lassen
   * @param {Function} callback
   * @param {String} key
   * @returns object
   */
  createDiensteAusVorlage(callback, key) {
    return callback(this.createElement({
      label: "Aus Vorlage",
      key: `${key}-select-from-vorlage`,
      title: `Alle Dienste aus der Vorlage auswählen`,
      isButton: true,
      onClick: (evt, setLoading) => {
        this?._vorlageDiensteIds?.forEach?.((id) => {
          if (!this.dienste_ids.includes(id)) {
            this.dienste_ids.push(id);
          }
        });
        this.update("dienste_ids", {});
        setLoading?.(() => false);
      }
    }));
  }

  /**
   * Erstellt die Auswahl für die Tage
   * @param {Function} callback
   * @param {String} key
   * @returns Array
   */
  createTageAusMonaten(callback, key) {
    const result = [];
    const monate = [];
    const anfang = this._anfang?.str || "";
    const addDate = (d, monat) => {
      if (d._order === monat) {
        const id = createRelativeDateId(d.id, anfang);
        if (!this.date_ids.includes(id)) this.date_ids.push(id);
      }
    };

    this?._dates?._each?.((d) => {
      const monat = d._order;
      const label = d.month;
      if (!monate.includes(monat)) {
        monate.push(monat);
        result.push(callback(this.createElement({
          label,
          key: `${key}-select-from-${label}`,
          title: `Alle Tage aus dem Monat ${label} auswählen`,
          isButton: true,
          onClick: (evt, setLoading) => {
            let addBis31 = 1;
            let lastDate = false;
            this?._dates?._each?.((date) => {
              addDate(date, monat);
              if (date._order > addBis31 && lastDate
                && lastDate._order === addBis31 && lastDate.day < 31) {
                while (lastDate.day < 31) {
                  const arr = getYearMonthDayFromString(lastDate.id);
                  arr[2] = lastDate.day + 1;
                  lastDate = {
                    id: returnDateStringFromArr(arr),
                    _order: lastDate._order,
                    day: arr[2]
                  };
                  addDate(lastDate, monat);
                }
                addBis31++;
              }
              lastDate = date;
            });
            this.update("date_ids", {});
            setLoading?.(() => false);
          }
        })));
      }
    });

    return result;
  }

  /**
   * Erstellt ein Button-Element mit dem alle Elelemnte einer Auswahl aktiviert/ deaktiviert werden.
   * @param {Function} callback
   * @param {String} key
   * @param {String} titleName
   * @param {String} elementsKey
   * @param {String} arrKey
   * @returns Array
   */
  createAllAndNoneButtons(callback, key, titleName, elementsKey, arrKey) {
    const anfang = this._anfang?.str || "";
    const result = [
      callback(this.createElement({
        label: "Alle auswählen",
        key: `${key}-select-all`,
        title: `Alle ${titleName} auswählen`,
        isButton: true,
        onClick: (evt, setLoading) => {
          const arr = [];
          this?.[elementsKey]?._each?.((el) => {
            const id = elementsKey === "_dates" ? createRelativeDateId(el.id, anfang) : el.id;
            arr.push(id);
          });
          if (elementsKey === "_teams") {
            this._set("add_kein_mitarbeiterteam", true);
          }
          this._set(arrKey, arr);
          this.update(arrKey, {});
          setLoading?.(() => false);
        }
      })),
      callback(this.createElement({
        label: "Alle abwählen",
        key: `${key}-select-none`,
        title: `Alle ${titleName} auswählen`,
        isButton: true,
        onClick: (evt, setLoading) => {
          this._set(arrKey, []);
          if (elementsKey === "_teams") {
            this._set("add_kein_mitarbeiterteam", false);
          }
          this.update(arrKey, {});
          setLoading?.(() => false);
        }
      }))
    ];

    if (elementsKey === "_dienste") {
      result.unshift(this.createDiensteAusVorlage(callback, key));
    } else if (elementsKey === "_dates") {
      result.unshift(this.createTageAusMonaten(callback, key));
    }

    return result;
  }

  /**
   * Erstellt die Auswahl der Mitarbeiter
   * @param {Function} callback
   * @returns Object
   */
  getMitarbeiter(callback) {
    if (!this.showMitarbeiter || !this._isFunction(callback)) return null;
    return callback(this.createElement({
      label: "Von Mitarbeitern",
      key: "mitarbeiter-bedingungen",
      title: "Es werden nur Mitarbeiter anhand der ausgewählten Bedingungen berücksichtigt.\n"
      + "Wenn keine bestimmten Mitarbeiter oder Bedingungen ausgewäht werden, werden alle Mitarbeiter berücksichtig.",
      isTitle: true,
      getOptions: () => [
        callback(this.createElement({
          label: "Mitarbeiter",
          key: "mitarbeiter-bedingungen-mitarbeiter",
          title: "Hiermit lassen sich bestimmte Mitarbeiter auswählen.\n"
          + "Wenn hier keine Auswahl getroffen wird, werden alle Mitarbeiter, die die restlichen Bedingungen erfüllen ausgewählt.",
          isTitle: true,
          getOptions: () => {
            const result = [
              this.createAllAndNoneButtons(callback, "mitarbeiter-bedingungen", "Mitarbeiter", "_mitarbeiter", "mitarbeiter_ids"),
              [], []
            ];
            this?._mitarbeiter?._each?.((m) => {
              const i = m.aktiv ? 1 : 2;
              result[i].push(callback(this.createElement(this.createStandardAttributes(
                m.planname,
                `mitarbeiter-bedingungen-mitarbeiter-${m.id}`,
                m.id,
                "mitarbeiter_ids"
              ))));
            });
            result[1].sort((a, b) => numericLocaleCompare(a.props.label, b.props.label));
            result[2].sort((a, b) => numericLocaleCompare(a.props.label, b.props.label));
            return result;
          }
        })),
        callback(this.createElement({
          label: "Funktionen",
          key: "mitarbeiter-bedingungen-funktionen",
          title: "Mitarbeiter werden nur berücksichtigt, wenn sie die entsprechende Funktion haben.",
          isTitle: true,
          getOptions: () => {
            const result = [
              this.createAllAndNoneButtons(callback, "mitarbeiter-bedingungen-funktionen", "Mitarbeiterfunktionen", "_funktionen", "mitarbeiterfunktionen_ids"),
              []
            ];
            this?._funktionen?._each?.((f) => {
              result[1].push(callback(this.createElement(this.createStandardAttributes(
                f.planname,
                `mitarbeiter-bedingungen-funktionen-${f.id}`,
                f.id,
                "mitarbeiterfunktionen_ids"
              ))));
            });
            result[1].sort((a, b) => numericLocaleCompare(a.props.label, b.props.label));
            return result;
          }
        })),
        callback(this.createElement({
          label: "Teams",
          key: "mitarbeiter-bedingungen-teams",
          title: "Mitarbeiter werden nur berücksichtigt, wenn sie zu dem entsprechenden Team gehören."
          + "Wenn kein Team ausgewählt wird, werden nur Mitarbeiter berücksichtigt, die keinem Team angehören",
          isTitle: true,
          getOptions: () => {
            const result = [
              this.createAllAndNoneButtons(callback, "mitarbeiter-bedingungen-teams", "Mitarbeiterteams", "_teams", "mitarbeiterteam_ids"),
              [],
              []
            ];
            this?._teams?._each?.((t) => {
              result[1].push(callback(this.createElement(this.createStandardAttributes(
                t.name,
                `mitarbeiter-bedingungen-teams-${t.id}`,
                t.id,
                "mitarbeiterteam_ids"
              ))));
            });

            result[2].push(callback(this.createElement(this.createStandardCheckbox(
              keinTeamName,
              "Sollen Mitarbeiter ohne Team berücksichtigt werden?",
              "mitarbeiter-bedingungen-teams-",
              "add_kein_mitarbeiterteam"
            ))));

            result[1].sort((a, b) => numericLocaleCompare(a.props.label, b.props.label));
            return result;
          }
        })),
        callback(this.createElement(this.createStandardCheckbox(
          "Aktive Mitarbeiter",
          "Sollen aktive Mitarbeiter berücksichtig werden?",
          "mitarbeiter-bedingungen-mitarbeiter-",
          "aktiv"
        ))),
        callback(this.createElement(this.createStandardCheckbox(
          "Inaktive Mitarbeiter",
          "Sollen inaktive Mitarbeiter berücksichtig werden?",
          "mitarbeiter-bedingungen-mitarbeiter-",
          "inaktiv"
        ))),
        callback(this.createElement(this.createStandardCheckbox(
          "Berücksichtige Team tageweise",
          "Aktiv: Mitarbeiter werden berücksichtig, wenn sie an dem zu zählenden Tag zu einem der gewählten Teams gehören.\n"
          + "Inaktiv: Mitarbeiter werden berücksichtig, wenn sie irgendwann im Dienstplan-Zeitraum zu einem der gewählten Teams gehören.\n",
          "mitarbeiter-bedingungen-mitarbeiter-",
          "currently_in_team"
        )))
      ]
    }));
  }

  /**
   * Erstellt die Auswahl für die Tage
   * @param {Function} callback
   * @returns Object
   */
  getTage(callback) {
    if (!this.showTage || !this._isFunction(callback)) return null;
    const anfang = this._anfang?.str || "";
    return callback(this.createElement({
      label: "An Tagen",
      key: "tage-bedingungen",
      isTitle: true,
      getOptions: () => [
        callback(this.createElement({
          label: "Tage",
          key: "tage-bedingungen-tage",
          title: "Es werden nur ausgewählte Tage berücksichtig.\n"
          + "Wenn keine bestimmten Tage oder Bedingungen ausgewählt werden, werden alle Tage berücksichtig.\n"
          + "Alle Tage werden relativ zum Hauptmonat betrachtet.",
          isTitle: true,
          getOptions: () => {
            const result = [
              this.createAllAndNoneButtons(callback, "tage-bedingungen", "Tage", "_dates", "date_ids"),
              []
            ];
            let addBis31 = 1;
            let lastDate = false;
            this?._dates?._each?.((date) => {
              result[1].push(callback(this.createElement(this.createStandardAttributes(
                `${date.day}. ${date.month}`,
                `tage-bedingungen-tage-${date.id}`,
                createRelativeDateId(date.id, anfang),
                "date_ids",
                date._zahl
              ))));

              if (date._order > addBis31 && lastDate
                && lastDate._order === addBis31 && lastDate.day < 31) {
                while (lastDate.day < 31) {
                  const arr = getYearMonthDayFromString(lastDate.id);
                  arr[2] = lastDate.day + 1;
                  lastDate = {
                    label: `(${lastDate.day + 1}. ${lastDate.month})`,
                    id: returnDateStringFromArr(arr),
                    _zahl: lastDate._zahl + 1,
                    day: arr[2],
                    month: lastDate.month,
                    _order: lastDate._order
                  };

                  result[1].push(callback(this.createElement(this.createStandardAttributes(
                    lastDate.label,
                    `tage-bedingungen-tage-${lastDate.id}`,
                    createRelativeDateId(lastDate.id, anfang),
                    "date_ids",
                    lastDate._zahl
                  ))));
                }
                addBis31++;
              }
              lastDate = date;
            });
            result[1].sort((a, b) => a.props.parent.sortnr - b.props.parent.sortnr);
            return result;
          }
        })),
        callback(this.createElement({
          label: "Wochentage",
          key: "tage-bedingungen-wochentage",
          title: "Es werden nur Tage an den entsprechenden Wochentagen berücksichtigt.",
          isTitle: true,
          getOptions: () => {
            const result = [];
            [
              { name: "Montag", nr: 1, sort: 0 },
              { name: "Dienstag", nr: 2, sort: 1 },
              { name: "Mittwoch", nr: 3, sort: 2 },
              { name: "Donnerstag", nr: 4, sort: 3 },
              { name: "Freitag", nr: 5, sort: 4 },
              { name: "Samstag", nr: 6, sort: 5 },
              { name: "Sontag", nr: 0, sort: 6 }
            ].forEach((el) => {
              result.push(callback(this.createElement(this.createStandardAttributes(
                el.name,
                `tage-bedingungen-wochentage-${el.nr}`,
                el.nr,
                "wochentage",
                el.sort
              ))));
            });
            result.sort((a, b) => a.props.parent.sortnr - b.props.parent.sortnr);
            return result;
          }
        })),
        callback(this.createElement(this.createFeiertageBtn("Auch an Feiertagen", "auch"))),
        callback(this.createElement(this.createFeiertageBtn("Nicht an Feiertagen", "nicht"))),
        callback(this.createElement(this.createFeiertageBtn("Nur an Feiertagen", "nur")))
      ]
    }));
  }

  /**
   * Erstellt die Auswahl für die Dienste
   * @param {Function} callback
   * @returns Object
   */
  getDienste(callback) {
    if (!this.showDienste || !this._isFunction(callback)) return null;
    return callback(this.createElement({
      label: "In Dienste",
      key: "dienste-bedingungen",
      isTitle: true,
      title: "Es werden nur ausgewählte Dienste berücksichtig."
      + "Wenn keine bestimmten Dienste oder Bedingungen ausgewählt werden, werden alle Dienste berücksichtig.",
      getOptions: () => [
        callback(this.createElement({
          label: "Dienste",
          key: "dienste-bedingungen-dienste",
          title: "Es werden nur ausgewählte Dienste berücksichtig.\n"
          + "Wenn keine bestimmten Dienste oder Bedingungen ausgewählt werden, werden alle Dienste berücksichtig.",
          isTitle: true,
          getOptions: () => {
            const result = [
              this.createAllAndNoneButtons(callback, "dienste-bedingungen", "Dienste", "_dienste", "dienste_ids"),
              []
            ];
            this?._dienste?._each?.((d) => {
              result[1].push(callback(this.createElement(this.createStandardAttributes(
                d.planname,
                `dienste-bedingungen-dienste-${d.id}`,
                d.id,
                "dienste_ids"
              ))));
            });
            result[1].sort((a, b) => numericLocaleCompare(a.props.label, b.props.label));
            return result;
          }
        })),
        callback(this.createElement({
          label: "Teams",
          key: "dienste-bedingungen-teams",
          title: "Dienste werden nur berücksichtigt, wenn sie zu dem entsprechenden Team gehören.\n"
          + "Wenn kein Team gewählt wurde, werden alle Dienste berücksichtigt, die die restlichen Bedinungen erfüllen.",
          isTitle: true,
          getOptions: () => {
            const result = [
              this.createAllAndNoneButtons(callback, "dienste-bedingungen-teams", "Diensteteams", "_teams", "diensteteam_ids"),
              []
            ];
            this?._teams?._each?.((t) => {
              result[1].push(callback(this.createElement(this.createStandardAttributes(
                t.name,
                `dienste-bedingungen-teams-${t.id}`,
                t.id,
                "diensteteam_ids"
              ))));
            });
            result[1].sort((a, b) => numericLocaleCompare(a.props.label, b.props.label));
            return result;
          }
        })),
        callback(this.createElement(this.createStandardCheckbox(
          "Mit Bedarf",
          "Sollen Felder mit Bedarf berücksichtigt werden?",
          "dienste-bedingungen-dienste-",
          "mit_bedarf"
        ))),
        callback(this.createElement(this.createStandardCheckbox(
          "Ohne Bedarf",
          "Sollen Felder ohne Bedarf berücksichtigt werden?",
          "dienste-bedingungen-dienste-",
          "ohne_bedarf"
        )))
      ]
    }));
  }

  /**
   * Speichert den Cunter in der API
   */
  save(callback = false) {
    // const [value, warn] = this.validateFunktion(this.funktion);
    // if (warn.length) {
    //   setPageWarning(this?._page, `Ungültige Funktion:\n${value}\n\n${warn.join("\n")}`);
    //   return false;
    // }
    this.setResult();
    if (this.parent) return this.parent.save(this, callback);
    return false;
  }

  /**
   * Entfernt den Counter aus der API
   */
  remove(callback) {
    this.setResult();
    if (this.parent) return this.parent.remove(this, callback);
    return false;
  }

  /**
   * Erstellt das geforderte Objekt für die CountFkt
   * @param {Object|Number} value
   * @param {Function} callback
   * @returns Object
   */
  getResult(value, callback = false) {
    const result = {
      txt: [],
      el: [],
      value: []
    };

    const addToGetResult = this._isFunction(callback)
      ? (value1, result1, key) => callback(value1, result1, key)
      : (value2, result2, key = "el") => {
        const farbe = this.checkFarbRegeln(value2, this.decimal, false);
        result2.value.push(value2);
        if (this.hidden) return;
        result2.txt.push(toFixed(value2, this.decimal));
        result2.el.push(<CounterElement
          label={toFixed(value2, this.decimal)}
          color={farbe}
          key={`count-${key}`}
        />);
      };

    if (this._isObject(value)) {
      for (const key in value) {
        addToGetResult(value[key], result, key);
      }
    } else if(value !== undefined) {
      addToGetResult(value, result);
    }
    return result;
  }

  /**
   * @param {Object} dienst
   * @param {Object} date
   * @returns True, wenn Dienst valide ist
   */
  eachDienstCheck(dienst, date) {
    return dienst && (
      !this.showDienste || this.checkDiensteBedingungen(dienst, date)
    );
  }

  /**
   * Iteriert über alle Dienste bzw. Einteilungen
   * @param {Function} callback
   * @param {Object} date
   */
  eachDienst(callback, date) {
    if (!this._isFunction(callback)) return false;
    const call = (dienst) => {
      if (this.eachDienstCheck(dienst, date)) {
        callback(dienst);
      }
      return false;
    };
    if (this.showDienste && this?._dienste?._each) {
      if (this.dienste_ids.length) {
        return !!this.dienste_ids.find(
          (dId) => call(this._dienste?.[dId])
        );
      }
      return this._dienste._each(call);
    }
    return callback(false);
  }

  /**
   * @param {Object} date
   * @param {Object} m
   * @returns True, wenn Date und Mitarbeiter valide sind
   */
  eachDateCheck(date, m) {
    return date && this.checkTageBedingungen(date)
      && (this.showMitarbeiter && m
        ? this.checkMitarbeiterTeam(m, date)
        : true
      );
  }

  /**
   * Iteriert über die passenden Tage
   * @param {Function} callback
   * @param {Object} m
   */
  eachDate(callback, m) {
    if (!this._isFunction(callback)) return false;
    if (this.showTage && this?._dates?._each) {
      const call = (date) => {
        if (this.eachDateCheck(date, m)) {
          callback(date);
        }
        return false;
      };
      if (this.absoluteDateIds.length) {
        return !!this.absoluteDateIds.find(
          (dId) => call(this?._dates?.[dId])
        );
      }
      return this._dates._each(call);
    }
    return callback(false);
  }

  /**
   * Iteriert über die passenden Mitarbeiter
   * @param {Function} callback
   */
  eachMitarbeiter(callback) {
    if (!this._isFunction(callback)) return false;
    if (this.showMitarbeiter && this?._mitarbeiter?._each) {
      const call = (m) => {
        if (m && this.checkMitarbeiterBedingungen(m)) {
          callback(m);
        }
        return false;
      };
      if (this.mitarbeiter_ids.length) {
        return !!this.mitarbeiter_ids.find(
          (mId) => call(this?._mitarbeiter?.[mId])
        );
      }
      return this._mitarbeiter._each(call);
    }
    return callback(false);
  }

  /**
   * Führt einen Check für Tag, Dienst und Einteilung einer Mitarbeiterin durch
   * @param {Object} feld
   * @returns True, wenn alle Checks erfolgreich sind
   */
  eachEinteilungCheck(feld) {
    const date = feld?.date;
    const dienst = feld?.dienst;
    const mitarbeiter = feld?.mitarbeiter;
    return date && dienst
      && this.eachDienstCheck(dienst, date)
      && this.eachDateCheck(date, mitarbeiter);
  }

  /**
   * Iteriert über die Mitarbeiter-Einteilungen
   * @param {Object} m
   * @param {Object} date
   * @param {Object} dienst
   * @param {Function} callback
   */
  eachEinteilung(m, date, dienst, callback) {
    if (!this._isFunction(callback) || !m?.getAllEinteilungen) return false;
    const dateId = date?.id;
    const dienstId = dienst?.id;
    let einteilungen = false;
    if (dateId && dienstId) {
      einteilungen = m.getEinteilungenNachTagAndDienst(dateId, dienstId);
    } else if (dienstId) {
      einteilungen = m.getEinteilungenNachDienst(dienstId);
    } else if (dateId) {
      einteilungen = m.getEinteilungenNachTag(dateId);
    } else {
      einteilungen = m.getAllEinteilungen();
    }
    if (this._isArray(einteilungen)) {
      let result = false;
      einteilungen.forEach((feld) => {
        if (this.eachEinteilungCheck(feld)) {
          callback(feld);
          result = true;
        }
      });
      if(result) return true;
    }
    return callback(false);
  }

  /**
   * Fügt dem entsprechenden Key den Value hinzu
   * @param {Object} result
   * @param {Number} value
   * @param {Object} mitarbeiter
   * @param {Object} date
   * @param {Object} dienst
   */
  addToResult(
    result,
    value = 1,
    mitarbeiter = false,
    date = false,
    dienst = false,
    callback = false
  ) {
    const add = (obj, key) => {
      if (!this._isObject(obj) || !key) return false;
      if (obj[key] === undefined) {
        if (this._isFunction(callback)) {
          callback(obj, key, obj[key]);
        } else {
          obj[key] = value;
        }
      } else if (isNumber(obj[key])) {
        obj[key] += value;
      } else if (this._isFunction(callback)) {
        callback(obj, key, obj[key]);
      }
    };
    if (this.evaluate_seperate) {
      add(result?.mitarbeiter, mitarbeiter?.id);
      add(result?.dates, date?.id);
      add(result?.dienste, dienst?.id);
    } else {
      add(result, "all");
    }
    return result;
  }

  /**
   * Zählt die Einteilungen
   * @returns Object
   */
  countEinteilungen() {
    const result = this.defaultResult;
    this.eachMitarbeiter((m) => {
      if (!m?.id) return false;
      this.eachEinteilung(m, false, false, (feld) => {
        this.addToResult(result, feld ? 1 : 0, m, feld?.date, feld?.dienst, false);
      });
    });
    return result;
  }

  /**
   * Zählt die Verfügbaren und verplanten Mitarbeiter
   * @returns Object
   */
  countUrlaubsStatistik() {
    const result = {
      ...this.defaultResult,
      all: false,
      getResult: (sum, cellId) => this.getUrlaubsstatistikResult(sum, cellId)
    };
    const addBedarfe = (teamBedarfe, sum) => {
      if (!this._isObject(teamBedarfe)) return;
      for (const name in teamBedarfe) {
        const teamBedarf = teamBedarfe[name];
        if (!sum[name]) sum[name] = teamBedarf;
        else {
          sum[name].Bedarf += teamBedarf.Bedarf;
          sum[name].Min += teamBedarf.Min;
          sum[name].Opt += teamBedarf.Opt;
        }
      }
    };
    const statistiken = this?._statistiken?.countForUrlaubsstatistik && this?._statistiken;
    if (statistiken) {
      const add = (m, date, teamBedarfe) => {
        this.addToResult(result, 1, m, date, false, (obj, key) => {
          if (this._isObject(teamBedarfe) && key && obj && !obj?.[key]) {
            obj[key] = {};
            addBedarfe(deepClone(teamBedarfe), obj[key]);
          }
          if (!obj?.[key]) return false;
          statistiken.countForUrlaubsstatistik(
            m,
            date,
            m.getEinteilungenNachTag(date?.id),
            keinTeamName,
            obj[key]
          );
        });
      };
      const datesTeamBedarfe = {};
      this.eachMitarbeiter((m) => {
        if (!m?.id) return false;
        this.eachDate((date) => {
          if (!date?.getTeamBedarfe) return false;
          const teamBedarfe = datesTeamBedarfe[date?.id] || date.getTeamBedarfe(keinTeamName);
          if (!teamBedarfe) return false;
          datesTeamBedarfe[date.id] = teamBedarfe;
          add(m, date, teamBedarfe);
        }, m);
      });
    }
    
    return result;
  }

  /**
   * Formatiert das Ergebnis der Urlaubsstatistik
   * @param {Object} sum
   * @param {Any} cellId
   * @returns Object
   */
  getUrlaubsstatistikResult(sum, cellId) {
    const day = cellId?.toString?.() || "";
    if(sum !== undefined) {
      const teams = Object.values(sum);
      this?._statistiken?.verteilenUrlaubsStatistikTeams?.(
        sum,
        teams.find((team) => team.default)?.label || keinTeamName,
        this?._teams,
        day
      );
    }
    
    return this.getResult(sum, (value, res, key) => {
      const statistiken = this?._statistiken?.getUrlaubssaldo && this?._statistiken;
      if (!statistiken) return;
      const { saldo, puffer, teamKrankPuffer } = statistiken.getUrlaubssaldo(value, this?._teams, day);
      res.value.push(saldo);
      const farbe = this.checkFarbRegeln(saldo, this.decimal, `Team_${value.ID}`);
      if (this.hidden) return;
      const title = statistiken.createUrlaubssaldoTitle(value, key, saldo, puffer, this.title, teamKrankPuffer);
      const label = `${key}: ${toFixed(saldo, this.decimal)}`;
      res.txt.push(label);
      res.el.push(<CounterElement
        key={`count-${key}`}
        title={title}
        color={farbe}
        label={label}
      />);
    });
  }

  /**
   * Zählt den Gesamtbedarf
   * @returns Object
   */
  countGesamtBedarf() {
    const result = this.defaultResult;
    this.eachDate((date) => {
      if (!date?.id) return false;
      this.eachDienst((dienst) => {
        if (!dienst?.getBedarfAm) return false;
        const bedarfe = dienst.getBedarfAm(date.id);
        bedarfe.forEach && bedarfe.forEach((b) => {
          const min = b?.min || 0;
          const opt = b?.opt || 0;
          this.addToResult(result, min + opt, false, date, dienst, false);
        });
      }, date);
    });
    return result;
  }

  /**
   * Zählt den Mindestbedarf
   * @returns Object
   */
  countMindestBedarf() {
    const result = this.defaultResult;
    this.eachDate((date) => {
      if (!date?.id) return false;
      this.eachDienst((dienst) => {
        if (!dienst?.getBedarfAm) return false;
        const bedarfe = dienst.getBedarfAm(date.id);
        bedarfe.forEach && bedarfe.forEach((b) => {
          this.addToResult(result, b?.min || 0, false, date, dienst, false);
        });
      }, date);
    });
    return result;
  }

  /**
   * Zählt den optionalen Bedarf
   * @returns Object
   */
  countOptionalerBedarf() {
    const result = this.defaultResult;
    this.eachDate((date) => {
      if (!date?.id) return false;
      this.eachDienst((dienst) => {
        if (!dienst?.getBedarfAm) return false;
        const bedarfe = dienst.getBedarfAm(date.id);
        bedarfe.forEach && bedarfe.forEach((b) => {
          this.addToResult(result, b?.opt || 0, false, date, dienst, false);
        });
      }, date);
    });
    return result;
  }

  /**
   * Zählt Bedarfe, die nicht eingeteilt sind
   * @returns Object
   */
  countUnbesetzterBedarf() {
    const result = this.defaultResult;
    this.eachDate((date) => {
      if (!date?.countUnbesetzt) return false;
      this.eachDienst((dienst) => {
        if (!dienst?.id) return false;
        const value = date.countUnbesetzt(dienst.id) || 0;
        this.addToResult(result, value, false, date, dienst, false);
      }, date);
    });
    return result;
  }

  /**
   * Zählt Einteilungen in Bedarfe
   * @returns Object
   */
  counBesetzterBedarf() {
    const result = this.defaultResult;
    this.eachDate((date) => {
      if (!date?.countBesetzt) return false;
      this.eachDienst((dienst) => {
        if (!dienst?.id) return false;
        const value = date.countBesetzt(dienst.id) || 0;
        this.addToResult(result, value, false, date, dienst, false);
      }, date);
    });
    return result;
  }

  /**
   * Zählt die Arbeitszeiten aus den Einteilungen
   * @param {Object} initObj
   * @param {Boolean} current
   * @param {Boolean} vormonat
   * @returns Object
   */
  countArbeitszeitAll(initObj, current = true, vormonat = true) {
    const statistiken = this?._statistiken?.countArbeitszeit
      && this._statistiken?.countArbeitszeitVormonat
      && this?._statistiken;
    const addDefaultIst = this.empty_as_regeldienst;
    const wochenbilanzen = this?._wochenbilanzen?._each && this?._wochenbilanzen;
    if (statistiken && wochenbilanzen && (vormonat || current)) {
      const add = (m, date, dienst, arbeitszeit, arbeitszeitVormonat) => {
        const hasArbeitszeit = this._isObject(arbeitszeit);
        const hasArbeitszeitVormonat = this._isObject(arbeitszeitVormonat);
        if (!hasArbeitszeit && !hasArbeitszeitVormonat) return false;
        this.addToResult(initObj, 1, m, date, dienst, (obj, key) => {
          if (key) {
            const vk = m?.getVK && date?.id ? m.getVK(date?.id) : -1;
            if (!obj[key]) {
              obj[key] = {
                Saldo_aktuell: 0.0,
                Saldo_verrechnet: 0.0,
                Saldo_vormonat: 0.0,
                Soll: 0.0,
                Ist: 0.0,
                BD: 0.0,
                RD: 0.0,
                BD_vormonat: 0.0,
                RD_vormonat: 0.0,
                VK: []
              };
            }
            if(vk >= 0 && !obj[key].VK.includes(vk)) obj[key].VK.push(vk);
            if (hasArbeitszeit) {
              if (arbeitszeit?.Soll) obj[key].Soll += arbeitszeit.Soll;
              if (arbeitszeit?.Ist) obj[key].Ist += arbeitszeit.Ist;
              if (arbeitszeit?.Bereitschaft) obj[key].BD += arbeitszeit.Bereitschaft;
              if (arbeitszeit?.Rufbereitschaft) obj[key].RD += arbeitszeit.Rufbereitschaft;
            }
            if (hasArbeitszeitVormonat) {
              if (arbeitszeitVormonat?.plusstunden) {
                obj[key].Saldo_vormonat += arbeitszeitVormonat.plusstunden;
              }
              if (arbeitszeitVormonat?.geplante_bereitschaftszeit) {
                obj[key].BD_vormonat += arbeitszeitVormonat.geplante_bereitschaftszeit;
              }
              if (arbeitszeitVormonat?.geplante_rufbereitschaftszeit) {
                obj[key].RD_vormonat += arbeitszeitVormonat.geplante_rufbereitschaftszeit;
              }
            }
            obj[key].Saldo_aktuell = obj[key].Ist - obj[key].Soll;
            obj[key].Saldo_verrechnet = obj[key].Saldo_aktuell + obj[key].Saldo_vormonat;
          }
        });
      };
      const mitarbeiter = {};
      this.eachMitarbeiter((m) => {
        if (!m?.id) return false;
        const arbeitszeitVormonat = vormonat
          ? statistiken.countArbeitszeitVormonat(
            wochenbilanzen,
            m,
            [
              "plusstunden",
              "geplante_bereitschaftszeit",
              "geplante_rufbereitschaftszeit"
            ]
          ) : false;
        mitarbeiter[m.id] = {
          arbeitszeitVormonat,
          dates: {},
          dienste: {}
        };
        add(m, false, false, false, arbeitszeitVormonat);
        if (current) {
          this.eachDate((date) => {
            if (!date?.id) return false;
            const soll = statistiken.countArbeitszeit(m, date, false, addDefaultIst);
            if (this.evaluate_seperate && !mitarbeiter[m.id].dates[date.id]) {
              add(false, date, false, false, arbeitszeitVormonat);
            }
            add(m, date, false, soll, false);
            mitarbeiter[m.id].dates[date.id] = {};
            this.eachEinteilung(m, date, false, (feld) => {
              const dienst = feld?.dienst;
              if (!dienst?.id) return false;
              add(m, date, dienst, statistiken.countArbeitszeit(false, false, feld, addDefaultIst), false);
              if (this.evaluate_seperate) {
                add(
                  false,
                  false,
                  dienst,
                  !mitarbeiter[m.id].dates[date.id][dienst.id] && soll,
                  !mitarbeiter[m.id].dienste[dienst.id] && arbeitszeitVormonat
                );
                mitarbeiter[m.id].dienste[dienst.id] = true;
                mitarbeiter[m.id].dates[date.id][dienst.id] = true;
              }
            });
          }, m);
        }
      });
    }
    return initObj;
  }

  /**
   * Zählt die Arbeitszeiten
   * @param {Object} cell
   */
  countArbeitszeiten() {
    return this.countArbeitszeitAll({
      ...this.defaultResult,
      all: false,
      getResult: (sum) => this.getArbeitszeitenResult(sum)
    }, true, true);
  }

  /**
   * Formatiert das Ergebnis aus countArbeitszeiten
   * @param {Object} sum
   * @returns Object
   */
  getArbeitszeitenResult(sum) {
    const decimal = this.decimal;
    const hideOnNullKeys = ["Ist", "BD", "RD", "BD_vormonat", "RD_vormonat", "Saldo_vormonat, VK"];
    return this.getResult(sum, (value, result, key) => {
      const vkKey = key === "VK";
      const farbe = this.checkFarbRegeln(value, decimal, key);
      result.value.push(vkKey ? value.join(", ") : value);
      const hide = this.hidden || (hideOnNullKeys.includes(key) && value === 0) || (vkKey && !value.length);
      if (hide) return;
      const title = [...this.title];
      switch (key) {
        case "Saldo_aktuell":
          title.push({ txt: "Saldo_aktuell = Ist - Soll" });
          title.push({ txt: `Saldo_aktuell: ${toFixed(sum.Ist, decimal)} - ${toFixed(sum.Soll, decimal)} = ${toFixed(sum.Saldo_aktuell, decimal)}` });
          break;
        case "Saldo_verrechnet":
          title.push({ txt: "Saldo_verrechnet = Saldo_vormonat + Saldo_aktuell" });
          title.push({ txt: `Saldo_verrechnet: ${toFixed(sum.Saldo_vormonat, decimal)} + ${toFixed(sum.Saldo_aktuell, decimal)} = ${toFixed(sum.Saldo_verrechnet, decimal)}` });
          break;
      }
      const label = `${key}: ${vkKey ? value.join(", ") : toFixed(value, decimal)}`;
      result.txt.push(label);
      result.el.push(<CounterElement
        key={`count-${key}`}
        title={title}
        color={farbe}
        label={label}
      />);
    });
  }

  /**
   * Zählt das Arbeitszeiten-Soll
   * @returns Object
   */
  countArbeitszeitSoll() {
    const result = this.defaultResult;
    this.eachMitarbeiter((m) => {
      if (!m?.getSollStunden) return false;
      this.eachDate((date) => {
        const soll = m.getSollStunden(date.id, true) || 0.0;
        this.addToResult(result, soll, m, date, false, false);
      });
    });
    return result;
  }

  /**
   * Zählt das Arbeitszeiten-Ist
   * @returns Object
   */
  countArbeitszeitIst() {
    return this.countArbeitszeitAll({
      ...this.defaultResult,
      all: false,
      getResult: (sum) => this.getResult(sum?.Ist || 0)
    }, true, false);
  }

  /**
   * Zählt das Arbeitszeiten-Saldo
   * @returns Object
   */
  countArbeitszeitSaldo() {
    return this.countArbeitszeitAll({
      ...this.defaultResult,
      all: false,
      getResult: (sum) => this.getResult(sum?.Saldo_aktuell || 0)
    }, true, false);
  }

  /**
   * Zählt die Arbeitszeit des Vormonats
   * @param {String} key
   * @returns Object
   */
  countArbeitszeitVormonat(key) {
    const result = this.defaultResult;
    const wochenbilanzen = this?._wochenbilanzen?._each && this?._wochenbilanzen;
    const statistiken = this._statistiken?.countArbeitszeitVormonat && this._statistiken;
    if (wochenbilanzen && statistiken) {
      this.eachMitarbeiter((m) => {
        if (!m?.id) return false;
        const wb = statistiken.countArbeitszeitVormonat(wochenbilanzen, m, [key])?.[key] || 0.0;
        this.addToResult(result, wb, m, false, false, false);
      });
    }
    return result;
  }

  /**
   * Zählt die Arbeitszeit eines bestimmten Arbeitszeittyps
   * @param {Object} typ
   * @returns Object
   */
  countArbeitszeitTyp(typ) {
    const result = this.defaultResult;
    this.eachMitarbeiter((m) => {
      if (!m?.id) return false;
      this.eachEinteilung(m, false, false, (feld) => {
        const arbeitszeittyp = feld?.countArbeitszeitTyp?.(typ);
        this.addToResult(result, arbeitszeittyp || 0, m, feld?.date, feld?.dienst, false);
      });
    });
    return result;
  }

  /**
   * Berechnet die Statistik anhand einer definierten Funktion
   * @param {Object} cell
   */
  evaluateFunktion(cell) {
    return {
      txt: "",
      el: null,
      value: 0
    };
  }

  /**
   * Analysiert die passende Statistik.
   * @param {Object} cell
   * @returns Objekt
   */
  countFkt(cell = false) {
    const auswahl = this.currentCount;
    if (this.act_as_funktion) {
      return this.evaluateFunktion(cell);
    }
    if (auswahl?.countFkt) {
      if (!this?.result) {
        this.setResult(auswahl.countFkt());
      }
      let cellId = false;
      let result = this.result?.all;
      if (this.evalMitarbeiterSeperate) {
        result = this.result?.mitarbeiter?.[cell?.mitarbeiterId];
        cellId = cell?.mitarbeiterId;
      } else if (this.evalDiensteSeperate) {
        result = this.result?.dienste?.[cell?.dienstId];
        cellId = cell?.dienstId;
      } else if (this.evalTageSeperate) {
        result = this.result?.dates?.[cell?.dateId];
        cellId = cell?.dateId;
      }
      if (this._isFunction(this.result?.getResult)) {
        return this.result.getResult(result, cellId);
      }
    }
    
    return {
      txt: [],
      el: [],
      value: []
    };
  }
}

export default Counter;
