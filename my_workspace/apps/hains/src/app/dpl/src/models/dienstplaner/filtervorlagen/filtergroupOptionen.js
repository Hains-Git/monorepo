import { debounce, wait } from "../../../tools/debounce";
import Basic from "../../basic";

class FilterGroupOptionen extends Basic {
  constructor(appModel = false) {
    super(appModel);
  }

  // Funktionen, um die Felder zu erstellen, diese müssen Array-Funktionen sein,
  // damit das this nicht undefined wird!!!
  // Optionen ####################################################
  /**
   * Erstellt den Filter für den Check auf das Team eines Mitarbeiters gegenüber dem Dienst.
   * @param {Array} arr
   */
  dienstTeam = (arr) => {
    this.addFilter(
      arr[0].key,
      arr[0].key,
      "Mitarbeiter im Dienste-Team",
      "Filtert nach Mitarbeitern aus dem aktuellen Dienst-Teams",
      arr[0].check,
      (obj) => this.getIsInDienstTeam(obj, false)
    );
    this.addFilter(
      arr[1].key,
      arr[1].key,
      "Mitarbeiter außerhalb des Dienste-Teams",
      "Filtert nach Mitarbeitern außerhalb des aktuellen Dienst-Teams",
      arr[1].check,
      (obj) => this.getIsInDienstTeam(obj, true)
    );
  };

  /**
   * @param {Object} param0
   * @returns True, wenn Mitarbeiter im Team des Dienstes ist.
   */
  getIsInDienstTeam({
    mitarbeiter, dienst, date
  }, negate) {
    if (mitarbeiter?.isInDienstTeam && dienst) {
      const result = !!mitarbeiter.isInDienstTeam(dienst?.id, date?.id);
      return negate ? !result : result;
    }

    return true;
  }

  /**
   * Erstellt den Filter für den Check auf das Team eines Mitarbeiters/Dienstes
   * gegenüber dem Vorlage-Team.
   * @param {Array} arr
   */
  vorlageTeam = (arr) => {
    this.addFilter(
      arr[0].key,
      arr[0].key,
      "Dienst/Mitarbeiter/Team aus dem Vorlage-Team",
      "Filtert nach Elementen, die im Team aus der Vorlage sind",
      arr[0].check,
      (obj) => this.getInTeam(obj, this?._team, false)
    );
    this.addFilter(
      arr[1].key,
      arr[1].key,
      "Dienst/Mitarbeiter/Team nicht aus dem Vorlage-Team",
      "Filtert nach Elementen, die nicht im Team aus der Vorlage sind",
      arr[1].check,
      (obj) => this.getInTeam(obj, this?._team, true)
    );
  };

  /**
   * Erstellt den Filter für den Check eines Dienstes innerhalb der Vorlage.
   * @param {Array} arr
   */
  vorlageDienste = (arr) => {
    this.addFilter(
      arr[0].key,
      arr[0].key,
      "Dienste aus der Vorlage",
      "Filtert nach Diensten, welche in der Vorlage auftauchen",
      arr[0].check,
      (obj) => this.getInDiensten(obj, this?._vorlageDiensteIds, false)
    );
    this.addFilter(
      arr[1].key,
      arr[1].key,
      "Dienste außerhalb der Vorlage",
      "Filtert nach Diensten, welche nicht in der Vorlage auftauchen",
      arr[1].check,
      (obj) => this.getInDiensten(obj, this?._vorlageDiensteIds, true)
    );
  };

  /**
   * Erstellt den Filter für den Check auf die Funktion/Mitarbeiter-Funktion innerhalb der Vorlage.
   * @param {Array} arr
   */
  vorlageFunktionen = (arr) => {
    this.addFilter(
      arr[0].key,
      arr[0].key,
      "Mitarbeiter mit Funktion aus Vorlage",
      "Filtert nach Mitarbeitern mit einer Funktion, welche in der Vorlage definiert wurde",
      arr[0].check,
      (obj) => this.getInFunktionen(obj, this?._vorlageFunktionenIds, false)
    );
    this.addFilter(
      arr[1].key,
      arr[1].key,
      "Mitarbeiter ohne Funktion aus Vorlage",
      "Filtert nach Mitarbeitern mit einer Funktion, welche nicht in der Vorlage definiert wurde",
      arr[1].check,
      (obj) => this.getInFunktionen(obj, this?._vorlageFunktionenIds, true)
    );
  };

  /**
   * Erstellt den Filter für den Check auf einen erfüllten Wunsch durch eine Einteilung.
   * @param {Array} arr
   */
  wunschErfuellt = (arr) => {
    this.addFilter(
      arr[0].key,
      arr[0].key,
      "Mitarbeiterwunsch erfüllt",
      "Filtert nach Mitarbeitern, deren Wunsch durch den aktuellen Dienst erfüllt wird",
      arr[0].check,
      (obj) => this.getWunschErfuellt(obj) === 1
    );
    this.addFilter(
      arr[1].key,
      arr[1].key,
      "Mitarbeiterwunsch nicht erfüllt",
      "Filtert nach Mitarbeitern, deren Wunsch durch den aktuellen Dienst nicht erfüllt wird",
      arr[1].check,
      (obj) => this.getWunschErfuellt(obj) === 0
    );
    this.addFilter(
      arr[2].key,
      arr[2].key,
      "Mitarbeiter ohne Wunsch",
      "Filtert nach Mitarbeitern ohne Wunsch",
      arr[2].check,
      (obj) => this.getWunschErfuellt(obj) === 0.5
    );
  };

  /**
   * Liefert einen Wert, welcher angibt, ob der Wunsch erfüllt wird,
   * nicht erfüllt wird, oder kein Wunsch existiert.
   * @param {Object} param0
   */
  getWunschErfuellt({
    mitarbeiter,
    date,
    dienst,
    wunsch
  }) {
    if (wunsch?.dienstkategorie?.hasDienst && dienst) {
      return wunsch.dienstkategorie.hasDienst(dienst?.id) ? 1 : 0;
    } if (mitarbeiter?.hasFittingDienstWunsch && date && dienst) {
      return mitarbeiter.hasFittingDienstWunsch(date.id, dienst.id);
    }
    return 0.5;
  }

  /**
   * Erstellt den Filter für den Check, ob Mitarbeiter aktiv sind
   * @param {Array} arr
   */
  aktivitaet = (arr) => {
    this.addFilter(
      arr[0].key,
      arr[0].key,
      "Aktive Mitarbeiter",
      "Filtert nach aktiven Mitarbeitern",
      arr[0].check,
      ({ mitarbeiter, feld }) => {
        if(!mitarbeiter) return true;
        if(feld) return !!mitarbeiter?.aktivAm?.(feld?.tag);
        return !!mitarbeiter.aktiv;
      }
    );
    this.addFilter(
      arr[1].key,
      arr[1].key,
      "Inaktive Mitarbeiter",
      "Filtert nach inaktiven Mitarbeitern",
      arr[1].check,
      ({ mitarbeiter, feld }) => {
        if(!mitarbeiter) return true;
        if(feld) return !mitarbeiter?.aktivAm?.(feld?.tag);
        return !mitarbeiter.aktiv;
      }
    );
  };

  /**
   * Erstellt den Filter für den Check, ob Mitarbeiter anwesend sind
   * @param {Array} arr
   */
  anwesenheit = (arr) => {
    this.addFilter(
      arr[0].key,
      arr[0].key,
      "Anwesende Mitarbeiter",
      "Filtert nach anwesenden Mitarbeitern",
      arr[0].check,
      ({
        mitarbeiter,
        feld
      }) => {
        if (mitarbeiter?.isAbwesend && feld) {
          return !mitarbeiter.isAbwesend(feld);
        }
        return true;
      }
    );
    this.addFilter(
      arr[1].key,
      arr[1].key,
      "Abwesende Mitarbeiter",
      "Filtert nach abwesenden Mitarbeitern",
      arr[1].check,
      ({
        mitarbeiter,
        feld
      }) => {
        if (mitarbeiter?.isAbwesend && feld) {
          return !!mitarbeiter.isAbwesend(feld);
        }
        return true;
      }
    );
  };

  /**
   * Erstellt den Filter für den Check, ob Mitarbeiter freigegebene Dienste haben
   * @param {Array} arr
   */
  freigegebeneDienste = (arr) => {
    this.addFilter(
      arr[0].key,
      arr[0].key,
      "Mitarbeiter mit freigebenen Diensten",
      "Filtert nach Mitarbeitern mit freigebenen Diensten",
      arr[0].check,
      ({ mitarbeiter }) => (mitarbeiter ? !!mitarbeiter?.hasFreigegebeneDienste : true)
    );
    this.addFilter(
      arr[1].key,
      arr[1].key,
      "Mitarbeiter ohne freigebenen Diensten",
      "Filtert nach Mitarbeitern ohne freigebenen Diensten",
      arr[1].check,
      ({ mitarbeiter }) => (mitarbeiter ? !mitarbeiter?.hasFreigegebeneDienste : true)
    );
  };

  /**
   * Erstellt den Filter für den Check, ob ein Tag/Dienst/Mitarbeiter für die Planerin
   * zur Einteilung freigegeben ist.
   * @param {Array} arr
   */
  isWritable = (arr) => {
    this.addFilter(
      arr[0].key,
      arr[0].key,
      "Einteilbare Dienste/Mitarbeiter/Tage",
      "Filtert nach Mitarbeitern/Diensten/Tagen die einteilbar sind",
      arr[0].check,
      (obj) => this.checkIsWritable(obj, false)
    );
    this.addFilter(
      arr[1].key,
      arr[1].key,
      "Nicht einteilbare Dienste/Mitarbeiter/Tage",
      "Filtert nach Mitarbeitern/Diensten die nicht einteilbar sind",
      arr[1].check,
      (obj) => this.checkIsWritable(obj, true)
    );
  };

  /**
   * Erstellt den Filter für den Check, ob die entsprechenden Elemente einteilbar sind.
   * @param {Object} param0
   */
  checkIsWritable({
    mitarbeiter,
    dienst,
    date,
    feld
  }, negate) {
    if (mitarbeiter || dienst || date || feld) {
      let writable = true;
      if (feld) {
        writable = !!feld?.writable;
      } else {
        if (mitarbeiter?.writable) {
          writable = !!mitarbeiter.writable(date?.id || "", dienst?.id || 0);
        }
        if (dienst && writable) {
          writable = !!dienst?.writable;
        }
        if (date && writable) {
          writable = !!date?.writable;
        }
      }
      return negate ? !writable : writable;
    }
    return true;
  }

  /**
   * Erstellt den Filter für den Check, ob Mitarbeiter die Falg abwesend gesetzt haben.
   * @param {Array} arr
   */
  sonderstatusAnwesenheit = (arr) => {
    this.addFilter(
      arr[0].key,
      arr[0].key,
      "Mitarbeiter ohne Abwesend (Sonderstatus)",
      "Filtert nach Mitarbeitern ohne den Sonderstatus abwesend",
      arr[0].check,
      ({ mitarbeiter }) => (mitarbeiter ? !mitarbeiter?.abwesend : true)
    );
    this.addFilter(
      arr[1].key,
      arr[1].key,
      "Mitarbeiter mit Abwesend (Sonderstatus)",
      "Filtert nach Mitarbeitern mit dem Sonderstatus abwesend",
      arr[1].check,
      ({ mitarbeiter }) => (mitarbeiter ? !!mitarbeiter?.abwesend : true)
    );
  };

  /**
   * Erstellt den Filter für den Check, ob Mitarbeiter die vom Dienst geforderten Freigaben haben.
   * @param {Array} arr
   */
  freigaben = (arr) => {
    this.addFilter(
      arr[0].key,
      arr[0].key,
      "Mitarbeiter mit allen Freigaben",
      "Filtert nach Mitarbeitern mit allen Freigaben zu dem aktuellen Dienst",
      arr[0].check,
      (obj) => this.getFreigabeAnteil(obj) === 1
    );
    this.addFilter(
      arr[1].key,
      arr[1].key,
      "Mitarbeiter mit einigen Freigaben/Sonderfreigaben",
      "Filtert nach Mitarbeitern mit einigen Freigaben oder Sonderfreigaben zu dem aktuellen Dienst",
      arr[1].check,
      (obj) => {
        const anteil = this.getFreigabeAnteil(obj);
        return anteil > 0 && anteil < 1;
      }
    );
    this.addFilter(
      arr[2].key,
      arr[2].key,
      "Mitarbeiter ohne Freigabe",
      "Filtert nach Mitarbeitern ohne Freigaben zu dem aktuellen Dienst",
      arr[2].check,
      (obj) => this.getFreigabeAnteil(obj) === 0
    );
  };

  /**
   * Gibt den Anteil der Freigaben der Mitarbeiter zu einem Dienst zurück.
   * @param {Object} param0
   */
  getFreigabeAnteil({
    dienst,
    mitarbeiter
  }) {
    if (mitarbeiter?.anteilFreigaben && dienst) {
      return mitarbeiter.anteilFreigaben(dienst.id);
    }
    return dienst?.countFreigaben ? 0 : 1;
  }

  // Optionen aus Datenmodell #####################################
  /**
   * Erstellt den Filter für den Check, ob ein Wunsch einer bestimmten Dienstkategorie entspricht.
   * @param {Array} arr
   */
  wuensche = (arr) => {
    const _id = "wuensche";
    const key = `${_id}_`;
    this.createAllAndNoneButtons(key, _id, "_dienstkategorien");
    this?._dienstkategorien?._each?.((dk, dkId) => {
      const id = dk.id;
      this.addFilter(
        id,
        key + dkId,
        dk.initialien,
        `Filtert nach Wunsch: ${dk.name}`,
        this.checkFirstArrElement(arr, id, dk),
        ({
          wunsch,
          mitarbeiter,
          date
        }) => {
          if (mitarbeiter?.getWunschAm && date) {
            wunsch = mitarbeiter.getWunschAm(date.id);
          }
          return wunsch ? wunsch?.dienstkategorie_id === id : true;
        },
        id
      );
    });
  };

  /**
   * Erstellt den Filter für den Check, ob ein Dienst einem bestimmten Dienst entspricht.
   * @param {Array} arr
   */
  dienste = (arr) => {
    if (this.isDouble("diensteAusVorlage")) return false;
    const id = "dienste";
    const key = `${id}_`;
    this.createAllAndNoneButtons(key, id, `_${id}`);
    this?._dienste?._each?.((d, dId) => {
      this.createDiensteField(key, d, dId, arr);
    });
  };

  /**
   * Erstellt den Filter für die VorlageDienste
   * @param {Array} arr
   */
  diensteAusVorlage = (arr) => {
    if (this.isDouble("dienste")) return false;
    const id = "diensteAusVorlage";
    const key = `${id}_`;
    this.createAllAndNoneButtons(key, id, "_vorlageDiensteIds");
    this?._vorlageDiensteIds?.forEach?.((dId) => {
      const d = this?._dienste?.[dId];
      d && this.createDiensteField(key, d, dId, arr);
    });
  };

  /**
   * Erstellt ein DienstFeld
   * @param {String} key
   * @param {Object} d
   * @param {Number|String} dId
   * @param {Array} arr
   */
  createDiensteField(key, d, dId, arr) {
    const id = d.id;
    this.addFilter(
      id,
      key + dId,
      d.planname,
      `Filtert nach Dienst: ${d.name}`,
      this.checkFirstArrElement(arr, id, d),
      (obj) => this.getInDiensten(obj, [id]),
      id
    );
  }

  /**
   * Testet, ob ein Dienst in diensten steckt
   * @param {Object} param0
   */
  getInDiensten({
    dienst
  }, dienste = [], negate = false) {
    if (dienste?.length && dienst) {
      const result = !!dienste.find((dId) => dId === dienst.id);
      return negate ? !result : result;
    }
    return true;
  }

  /**
   * Erstellt den Filter für den Check, ob Mitarbeiter zu den ausgewählten Mitarbeitern gehören
   * @param {Array} arr
   */
  mitarbeiter = (arr) => {
    if (this.isDouble("aktiveMitarbeiter")) return false;
    const id = "mitarbeiter";
    const key = `${id}_`;
    this.createAllAndNoneButtons(key, id, `_${id}`);
    this?._mitarbeiter?._each?.((m, mId) => {
      this.createMitarbeiterField(key, m, mId, arr);
    });
  };

  /**
   * Erstellt Felder für die aktiven Mitarbeiter
   * @param {Array} arr
   */
  aktiveMitarbeiter = (arr) => {
    if (this.isDouble("mitarbeiter")) return false;
    const id = "aktiveMitarbeiter";
    const key = `${id}_`;
    this.createAllAndNoneButtons(key, id, `_${id}`);
    this?._aktiveMitarbeiter?.forEach?.((m) => {
      this.createMitarbeiterField(key, m, m.id, arr);
    });
  };

  /**
   * Erstellt ein Mitarbeiter Feld
   * @param {String} key
   * @param {Object} m
   * @param {Number|String} mId
   * @param {Array} arr
   */
  createMitarbeiterField(key, m, mId, arr) {
    const id = m.id;
    this.addFilter(
      id,
      key + mId,
      m.planname,
      `Filtert nach Mitarbeiter: ${m.name}`,
      this.checkFirstArrElement(arr, id, m),
      ({ mitarbeiter }) => (mitarbeiter ? mitarbeiter?.id === id : true),
      id
    );
  }

  /**
   * Erstellt den Filter für den Check, ob ein Tag einem bestimmten Tag entspricht.
   * @param {Array} arr
   */
  dates = (arr) => {
    const _id = "dates";
    const key = `${_id}_`;
    this.createAllAndNoneButtons(key, _id, `_${_id}`);
    this?._dates?._each?.((d, dId) => {
      const id = d.id;
      this.addFilter(
        id,
        key + dId,
        d.label,
        `Filtert nach Tag: ${d.label}`,
        this.checkFirstArrElement(arr, id, d),
        ({ date }) => (date ? date?.id === id : true),
        id
      );
    });
  };

  /**
   * Erstellt den Filter für den Check, ob ein Team ein bestimmtes Team ist.
   * @param {Array} arr
   */
  teams = (arr) => {
    const _id = "teams";
    const key = `${_id}_`;
    this.createAllAndNoneButtons(key, _id, `_${_id}`);
    this?._teams?._each?.((t, tId) => {
      const id = t.id;
      this.addFilter(
        id,
        key + tId,
        t.name,
        `Filtert nach Elementen die zum Team ${t.name} gehören.`,
        this.checkFirstArrElement(arr, id, t),
        (obj) => this.getInTeam(obj, t, false),
        id
      );
    });
  };

  /**
   * Erstellt den Filter für den Check auf das Team eines Mitarbeiters gegenüber dem Dienst.
   * @param {Array} arr
   */
  getInTeam({
    team,
    teams: {
      mitarbeiter,
      date,
      dienst
    } = {}
  }, teamToCheck = false, negate = false) {
    if (team && teamToCheck) {
      const result = teamToCheck === team;
      return negate ? !result : result;
    } if (teamToCheck) {
      let result = teamToCheck?.hasDienst && dienst
        ? !!teamToCheck.hasDienst(dienst.id)
        : true;
      if (result && teamToCheck?.hasMitarbeiterTag && mitarbeiter) {
        if(this._isArray(date)) result = !!date.find((_date) => !!teamToCheck.hasMitarbeiterTag(mitarbeiter.id, _date?.id));
        else if(date) result = !!teamToCheck.hasMitarbeiterTag(mitarbeiter.id, date?.id);
        else result = !!teamToCheck.hasMitarbeiter(mitarbeiter.id);
      }
      return negate ? !result : result;
    }
    return true;
  }

  /**
   * Erstellt den Filter für den Check auf die Funktion.
   * @param {Array} arr
   */
  funktionen = (arr) => {
    const _id = "funktionen";
    const key = `${_id}_`;
    this.createAllAndNoneButtons(key, _id, `_${_id}`);
    this?._funktionen?._each?.((f, fId) => {
      const id = f.id;
      this.addFilter(
        id,
        key + fId,
        f.name,
        `Filtert nach Funktion: ${f.name}`,
        this.checkFirstArrElement(arr, id, f),
        (obj) => this.getInFunktionen(obj, [id], false),
        id
      );
    });
  };

  /**
   * Testet, ob die zugehörigen Elemente eine bestimmte Funktions-ID haben.
   * @param {Object} param0
   */
  getInFunktionen({
    mitarbeiter,
    funktion
  }, funktionenIds = [], negate = false) {
    if (funktionenIds?.length && (funktion || mitarbeiter)) {
      const result = !!funktionenIds.find(
        (fId) => fId === (funktion?.id || mitarbeiter?.funktion_id)
      );
      return negate ? !result : result;
    }
    return true;
  }

  /**
   * Testet, ob das erste Element des Arrays die ID-beinhaltet
   * @param {Array} arr
   * @param {String|Number} id
   * @param {Object} obj
   */
  checkFirstArrElement(arr, id, obj) {
    return arr[0].check.includes(id) || arr[0].check.includes(obj);
  }

  /**
   * Erstellt ein Button, mit dem alle Elemente abgewählt werden können.
   * @param {Array} arr
   */
  uncheckAllButton = (arr) => {
    const key = arr[0].key;
    this.setShowAlways(true);
    this.setLabel(false);
    this.addFilter(
      key,
      key,
      "Alles abwählen",
      `Wählt alle Filter ab`,
      false,
      false,
      false,
      () => this.debouncedUncheckAll(),
      true
    );
  };

  /**
   * Setzt die Parameter eines Filters auf die Default-Werte zurück
   * @param {Array} arr
   */
  resetDefaultParams = (arr) => {
    const key = arr[0].key;
    this.setShowAlways(true);
    this.setLabel(false);
    this.addFilter(
      key,
      key,
      "Standard-Filterung",
      `Stellt den Standard-Filter wieder ein`,
      false,
      false,
      false,
      () => this.debouncedResetDefaultFilter(),
      true
    );
  };

  /**
   * Debounced die resetDefaultFilter Funktion
   */
  debouncedResetDefaultFilter = debounce(() => {
    this.resetDefaultFilter();
  }, wait);

  /**
   * Debounced die uncheckAll Funktion
   */
  debouncedUncheckAll = debounce(() => {
    this.uncheckAll();
  }, wait);
  // Ende Optionen ####################################################

  /**
   * Erstellt sowohl ein All-Button, als auch einen None-Buttone,
   * die alle Elemente einer Gruppe aktivieren oder deaktivieren.
   * @param {String} key
   * @param {String} id
   * @param {String} model
   */
  createAllAndNoneButtons(key, id, model) {
    if (key && id !== undefined && model) {
      this.createAllButton(key, "allButton", "Alle", () => {
        this.debouncedSetAll(true, id, model);
      }, true);
      this.createAllButton(key, "noneButton", "Keine", () => {
        this.debouncedSetAll(false, id, model);
      }, false);
    } else {
      console.log("Es fehlt eine Angabe", key, id, model);
    }
  }

  /**
   * Debounced setAll
   * @param {Boolean} check
   * @param {String} id
   * @param {String} model
   */
  debouncedSetAll = debounce((check, id, model) => {
    this.setAll(id, check, model);
  }, wait);

  /**
   * Erstellt ein Feld, mit dem alle Felder einer Gruppe aktiviert/deaktiviert werden.
   * @param {String} key
   * @param {String|Number} id
   * @param {String} label
   * @param {Function} callback
   * @param {Boolean} check
   */
  createAllButton(key, id, label, callback = false, check = false) {
    this.addFilter(
      id,
      key + id,
      label,
      `Setzt alle Felder dieser Gruppe auf ${check ? "aktiv" : "inaktiv"}`,
      false,
      false,
      false,
      callback,
      true
    );
  }
}

export default FilterGroupOptionen;
