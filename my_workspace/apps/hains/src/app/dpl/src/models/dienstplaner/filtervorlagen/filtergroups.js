class FilterGroups {
  constructor(vorlage, filter_keys) {
    this.vorlage = vorlage;
    this.FILTER_KEYS = filter_keys;
    this.length = 0;
    this.createGroup(
      "dienstTeam",
      "Dienste (Team)",
      "Sollen Mitarbeiter laut Rotation zum Dienst-Team gehören?",
      [
        { check: false, key: "inDienstTeam" },
        { check: false, key: "notInDienstTeam" }
      ]
    );
    this.createGroup(
      "vorlageTeam",
      "Vorlage (Team)",
      "Sollen Dienste/Mitarbeiter zum Vorlage-Team gehören?",
      [
        { check: false, key: "inVorlageTeam" },
        { check: false, key: "notInVorlageTeam" }
      ]
    );
    this.createGroup(
      "vorlageDienste",
      "Vorlage (Dienste)",
      "Sollen nur Dienste aus der Vorlage gezeigt werden?",
      [
        { check: false, key: "inVorlageDiensten" },
        { check: false, key: "notInVorlageDiensten" }
      ]
    );
    this.createGroup(
      "vorlageFunktionen",
      "Vorlage (Funktionen)",
      "Sollen nur Mitarbeiter mit Funktionen aus der Vorlage gezeigt werden?",
      [
        { check: false, key: "inVorlageFunktionen" },
        { check: false, key: "notInVorlageFunktionen" }
      ]
    );
    this.createGroup(
      "wunschErfuellt",
      "Wunsch Status",
      "Wie soll der Status der Mitarbeiter-Wünsche sein (erfüllt, nicht erfüllt, kein Wunsch)?",
      [
        { check: false, key: "wunschErfuellt" },
        { check: false, key: "wunschNotErfuellt" },
        { check: false, key: "ohneWuensche" }
      ]
    );
    this.createGroup(
      "aktivitaet",
      "Aktivität",
      "Sollen Mitarbeiter aktiv sein?",
      [
        { check: false, key: "aktiv" },
        { check: false, key: "inaktiv" }
      ]
    );
    this.createGroup(
      "anwesenheit",
      "Anwesenheit",
      "Sollen Mitarbeiter anwesend sein?",
      [
        { check: false, key: "anwesend" },
        { check: false, key: "abwesend" }
      ]
    );
    this.createGroup(
      "sonderstatusAnwesenheit",
      "Sonderstatus (Abwesend)",
      "Sollen Mitarbeiter den Sonderstatus (Abwesend) haben?",
      [
        { check: false, key: "anwesendMarkiert" },
        { check: false, key: "abwesendMarkiert" }
      ]
    );
    this.createGroup(
      "freigaben",
      "Freigaben",
      "Wieviele Dienst-Freigaben sollen die Mitarbeiter für einen Dienst besitzen?",
      [
        { check: false, key: "alleFreigaben" },
        { check: false, key: "einigeFreigaben" },
        { check: false, key: "keineFreigaben" }
      ]
    );
    this.createGroup(
      "wuensche",
      "Wünsche",
      "Welche Wünsche sollen angezeigt werden",
      [
        { check: [], key: "wuensche" }
      ],
      true
    );
    this.createGroup(
      "dienste",
      "Dienste",
      "Welche Dienste sollen angezeigt werden?",
      [
        { check: [], key: "dienste" }
      ],
      true
    );
    this.createGroup(
      "mitarbeiter",
      "Mitarbeiter",
      "Welche Mitarbeiter sollen angezeigt werden?",
      [
        { check: [], key: "mitarbeiter" }
      ],
      true
    );
    this.createGroup(
      "dates",
      "Tage",
      "Welche Tage sollen angezeigt werden?",
      [
        { check: [], key: "dates" }
      ]
    );
    this.createGroup(
      "teams",
      "Teams",
      "Welche Teams sollen angezeigt werden?",
      [
        { check: [], key: "teams" }
      ],
      true
    );
    this.createGroup(
      "funktionen",
      "Funktionen",
      "Welche Mitarbeiter-Funktionen sollen angezeigt werden?",
      [
        { check: [], key: "funktionen" }
      ],
      true
    );
    this.createGroup(
      "aktiveMitarbeiter",
      "Aktive Mitarbeiter",
      "Welche aktiven Mitarbeiter sollen angezeigt werden?",
      [
        { check: [], key: "aktiveMitarbeiter" }
      ],
      true
    );
    this.createGroup(
      "diensteAusVorlage",
      "Dienste aus Vorlage",
      "Welche Dienste sollen angezeigt werden?",
      [
        { check: [], key: "diensteAusVorlage" }
      ],
      true
    );
    this.createGroup(
      "uncheckAllButton",
      "Alle Filter abwählen",
      "Sollen alle Filter abgewählt werden?",
      [
        { check: false, key: "uncheckAllButton" }
      ],
      true
    );
    this.createGroup(
      "freigegebeneDienste",
      "Freigegebene Dienste",
      "Filtern nach Mitarbeitern mit/ohne freigegebene Dienste!",
      [
        { check: false, key: "mitFreigegebeneDienste" },
        { check: false, key: "ohneFreigegebeneDienste" }
      ]
    );
    this.createGroup(
      "isWritable",
      "Einteilbar",
      "Filtert nach Diensten/Mitarbeitern/Tagen, die einteilbar sind!",
      [
        { check: false, key: "isWritable" },
        { check: false, key: "notIsWritable" }
      ]
    );
    this.createGroup(
      "resetDefaultParams",
      "Stellt Standard-Filter wieder her",
      "Sollen der Filter auf zurückgesetzt werden?",
      [
        { check: false, key: "resetDefaultParams" }
      ],
      true
    );
  }

  /**
   * Fügt neue Gruppen hinzu
   */
  newGroup() {
    const i = this.length;
    return this.createGroup(
      `customGroup_${i}`,
      `Vorlage nr. ${i}`,
      "",
      [],
      false
    );
  }

  /**
   * Erstellt eine neue Gruppe und fügt diese hinzu.
   * @param {String} name
   * @param {String} label
   * @param {String} title
   * @param {Array} objKeys
   * @param {Boolean} sort
   * @returns Gruppe
   */
  createGroup(
    name = "",
    label = "",
    title = "",
    objKeys = [],
    sort = false
  ) {
    // Nur Gruppen erstellen, deren Keys in den FILTER_KEYS auftaucht
    if (!objKeys.find(({ key }) => this.FILTER_KEYS.includes(key))) {
      return false;
    }
    const index = this.length;
    const gruppe = {
      name,
      label,
      sort,
      title,
      objKeys,
      fkt: (group, obj) => this.getGroupFunktion(group, obj, index)
    };
    this[index] = gruppe;
    this.length++;

    return gruppe;
  }

  /**
   * Sucht in der Gruppe nach einer Funktion, mit der die passenden FilterOptionen erstellt werden.
   * @param {Object} group
   * @param {Object} obj
   * @param {Number} i
   */
  getGroupFunktion(group, obj, i) {
    const me = this[i];
    if (!me) {
      console.log("Diese Gruppe existiert nicht in GRUPPEN", this, i, me);
      return false;
    }
    // group[me.name] sollte eine Array-Funktion in Group sein!!!
    const createOptions = group && group[me.name];
    // Erstellt die FilterOptionen, für obj-Elemente die undefined sind,
    // wird der default-check eingetragen
    if (group && obj && createOptions) {
      createOptions(me.objKeys.map((el) => {
        const newEl = obj[el.key];
        if (newEl !== undefined) el.check = newEl;

        return el;
      }));
    } else console.log("Es fehlt die Gruppe oder das Objekt oder die Funktion existiert nicht in Group", group, obj, createOptions, me);
  }

  /**
   * Gibt die Indizes der Gruppen zurück, welche durch das Objekt referenziert werden.
   * @param {Object} obj
   * @param {Function} callback
   * @returns Array
   */
  getGroups(obj, callback) {
    const result = [];
    for (let i = 0; i < this.length; i++) {
      const gruppenElement = this[i];
      const keys = gruppenElement.objKeys;
      const l = keys.length;
      // Testet, ob im Objekt einer der Keys vorhanden ist.
      for (let j = 0; j < l; j++) {
        const el = keys[j];
        if (obj[el.key] !== undefined) {
          result.push(callback ? callback(gruppenElement) : gruppenElement);
          break;
        }
      }
    }
    if (!result.length) console.log("Objekt enthält keine passenden Keys", this, obj);

    return result;
  }
}

export default FilterGroups;
