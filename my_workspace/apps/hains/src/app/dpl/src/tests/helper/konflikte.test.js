import Konflikte from "../../models/helper/konflikte";
import { possibleConflict, seriousConflict } from "../../styles/basic";

describe("Whitebox testing", () => {
  const k = new Konflikte();
  describe("createKonfliktSchichtenNachTage()", () => {
    const feld = {};
    const schichten = [
      {
        getTage: () => ["2023-12-01", "2023-12-02", "2023-12-03"]
      },
      {
        getTage: () => ["2023-12-01", "2023-12-02", "2023-12-04"]
      },
      {
        getTage: () => ["2023-12-06", "2023-12-07", "2023-12-08"]
      }
    ];
    test("Keine Schichten liefert leeres Objekt", () => {
      expect(k.createKonfliktSchichtenNachTage()).toEqual({});
    });
    test("Schichten kein Array liefert leeres Objekt", () => {
      expect(k.createKonfliktSchichtenNachTage({}, feld)).toEqual({});
    });
    test("Sortiert Schichten und Feld nach Tagen", () => {
      expect(k.createKonfliktSchichtenNachTage(schichten, feld)).toEqual({
        "2023-12-01": [
          {
            schicht: schichten[0],
            feld
          }, 
          {
            schicht: schichten[1],
            feld
          }
        ],
        "2023-12-02": [
          {
            schicht: schichten[0],
            feld
          }, 
          {
            schicht: schichten[1],
            feld
          }
        ],
        "2023-12-03": [
          {
            schicht: schichten[0],
            feld
          }
        ],
        "2023-12-04": [
          {
            schicht: schichten[1],
            feld
          }
        ],
        "2023-12-06": [
          {
            schicht: schichten[2],
            feld
          }
        ],
        "2023-12-07": [
          {
            schicht: schichten[2],
            feld
          }
        ],
        "2023-12-08": [
          {
            schicht: schichten[2],
            feld
          }
        ]
      });
    });
  });

  describe("wochenendenKonflikt()", () => {
    const wochenenden = [
      [
        {
          dateDienstLabel: "feld1"
        }
      ],
      [
        {
          dateDienstLabel: "feld2"
        },
        {
          dateDienstLabel: "feld3"
        },
        {
          dateDienstLabel: "feld4"
        },
        {
          dateDienstLabel: "feld5"
        }
      ],
      [
        {
          dateDienstLabel: "feld6"
        },
        {
          dateDienstLabel: "feld7"
        }
      ],
      [
        {
          dateDienstLabel: "feld8"
        },
        {
          dateDienstLabel: "feld9"
        },
        {
          dateDienstLabel: "feld10"
        },
        {
          dateDienstLabel: "feld11"
        },
        {
          dateDienstLabel: "feld12"
        },
        {
          dateDienstLabel: "feld13"
        },
        {
          dateDienstLabel: "feld14"
        }
      ],
      [
        {
          dateDienstLabel: "feld15"
        },
        {
          dateDienstLabel: "feld16"
        }
      ]
    ];
    test("Anzahl der Wochenenden < Max-Wochenenden liefert keine Konflikte", () => {
      expect(k.wochenendenKonflikt(wochenenden, 10)).toEqual({
        className: "",
        msg: "",
        check: false,
        filterKey: "wochenenden"
      });
    });
    test("Anzahl der Wochenenden = Max-Wochenenden liefert keine Konflikte", () => {
      expect(k.wochenendenKonflikt(wochenenden, 5)).toEqual({
        className: "",
        msg: "",
        check: false,
        filterKey: "wochenenden"
      });
    });
    test("Anzahl der Wochenenden > Max-Wochenenden liefert Konflikte", () => {
      expect(k.wochenendenKonflikt(wochenenden, 2)).toEqual({
        className: seriousConflict,
        msg: "Überschreiten der maximalen Wochenenden (2)!"
          + "\nfeld1; feld2; feld3; feld4; feld5; "
          + "\nfeld6; feld7; feld8; feld9; feld10; "
          + "\nfeld11; feld12; feld13; feld14; feld15; "
          + "\nfeld16",
        check: true,
        filterKey: "wochenenden"
      });
    });
  });

  describe("checkWunschPrioAbwesend()", () => {
    const felder = [
      {
        dienstId: 1,
        priorisiereWunsch: false
      },
      {
        dienstId: 2,
        priorisiereWunsch: true
      }
    ];
    test("True, bei falschen Eingaben", () => {
      expect(k.checkWunschPrioAbwesend({}, {}, {})).toBe(true);
    });
    test("Felder ohne priorisiere Wunsch, hasDienst true", () => {
      expect(k.checkWunschPrioAbwesend(felder[0], felder[0], {
        hasDienst: () => true
      })).toBe(true);
    });
    test("Felder mit priorisiere Wunsch, aber hasDienst false", () => {
      expect(k.checkWunschPrioAbwesend(felder[1], felder[1], {
        hasDienst: () => false
      })).toBe(true);
    });
    test("Feld1 priorisiere Wunsch, Feld2 ohne priorisiere Wunsch, aber hasDienst true für feld2", () => {
      expect(k.checkWunschPrioAbwesend(felder[1], felder[0], {
        hasDienst: (dienstId) => dienstId === 2
      })).toBe(true);
    });
    test("Feld1 priorisiere Wunsch, feld2 ohne priorisiere Wunsch, aber hasDienst true für feld1", () => {
      expect(k.checkWunschPrioAbwesend(felder[1], felder[0], {
        hasDienst: (dienstId) => dienstId === 1
      })).toBe(false);
    });
    test("Feld1 ohne priorisiere Wunsch, feld2 priorisiere Wunsch, aber hasDienst true für feld1", () => {
      expect(k.checkWunschPrioAbwesend(felder[0], felder[1], {
        hasDienst: (dienstId) => dienstId === 1
      })).toBe(false);
    });
  });

  describe("preDienstgruppeKonflikt()", () => {
    const feld = {};
    const eingeteilteSchichtenNachTage = {};
    const checkBefore = true;
    test("Kein Konflikt, bei leeren Eingaben", () => {
      expect(k.preDienstgruppeKonflikt(feld, eingeteilteSchichtenNachTage, checkBefore)).toEqual({
        className: "",
        msg: "",
        check: false,
        filterKey: "predienstgruppe",
        felder: [feld],
        acceptedUeberschneidung: false
      });
    });
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const sevenDaysBeforeNow = new Date(now.getTime() - 7 * oneDay).toISOString().split("T")[0];
    const sixDaysBeforeNow = new Date(now.getTime() - 6 * oneDay).toISOString().split("T")[0];
    const feld1 = {
      id: 1,
      label: "feld1",
      tag: sevenDaysBeforeNow,
      preDienstgruppeZeitraum: {
        _anfang: {
          date: sevenDaysBeforeNow,
          fullLocal: sevenDaysBeforeNow
        },
        _ende: {
          date: sixDaysBeforeNow,
          fullLocal: sixDaysBeforeNow
        },
        acceptedUeberschneidung: 20.0
      },
      preDienstgruppe: {
        name: "Test preDienstgruppe",
        includesDienst: (dienstId) => dienstId !== 1
      }
    };
    const eingeteilteSchichtenNachTage1 = {
      [sevenDaysBeforeNow]: [
        {
          schicht: {
            isFrei: false,
            checkUeberschneidung: () => true
          },
          feld: {
            dienstId: 1
          }
        },
        {
          schicht: {
            isFrei: true,
            checkUeberschneidung: () => true
          },
          feld: {
            dienstId: 1
          }
        }
      ],
      [sixDaysBeforeNow]: [
        {
          schicht: {
            isFrei: false,
            checkUeberschneidung: () => true
          },
          feld: {
            dienstId: 1
          }
        }
      ]
    };
    const date = `${sevenDaysBeforeNow} - ${sixDaysBeforeNow}`;
    test("Alle Dienste nicht in preDienstgruppe liefert Konflikt", () => {
      expect(k.preDienstgruppeKonflikt(feld1, eingeteilteSchichtenNachTage1, checkBefore)).toEqual({
        check: true,
        acceptedUeberschneidung: 20.0,
        className: possibleConflict,
        felder: [feld1],
        filterKey: "predienstgruppe",
        msg: `feld1: Keine Einteilung aus der Dienstgruppe Test preDienstgruppe zwischen ${  date}`
      });
    });
    test("Kein Konflikt, wenn dienst einer der überschneidenden Schichten in preDienstgruppe", () => {
      const firstSevenDaysBeforeNowField = eingeteilteSchichtenNachTage1[sevenDaysBeforeNow][0].feld;
      firstSevenDaysBeforeNowField.dienstId = 2;
      expect(k.preDienstgruppeKonflikt(feld1, eingeteilteSchichtenNachTage1, checkBefore)).toEqual({
        check: false,
        acceptedUeberschneidung: 20.0,
        className: "",
        felder: [feld1, firstSevenDaysBeforeNowField],
        filterKey: "predienstgruppe",
        msg: ""
      });
    });
    test("Konflikt, wenn keine Überschneidungen", () => {
      eingeteilteSchichtenNachTage1[sevenDaysBeforeNow][0].schicht.checkUeberschneidung = () => false;
      eingeteilteSchichtenNachTage1[sevenDaysBeforeNow][1].schicht.checkUeberschneidung = () => false;
      eingeteilteSchichtenNachTage1[sixDaysBeforeNow][0].schicht.checkUeberschneidung = () => false;
      expect(k.preDienstgruppeKonflikt(feld1, eingeteilteSchichtenNachTage1, checkBefore)).toEqual({
        check: true,
        acceptedUeberschneidung: 20.0,
        className: possibleConflict,
        felder: [feld1],
        filterKey: "predienstgruppe",
        msg: `feld1: Keine Einteilung aus der Dienstgruppe Test preDienstgruppe zwischen ${date}`
      });
    });
  });

  describe("mehrfacheinteilungenKonflikt()", () => {
    const einteilungen = [{
      dienst: {
        planname: "Test",
        weak_parallel_conflict: false
      },
      dienstId: 1,
      priorisiereWunsch: false
    }, {
      dienst: {
        planname: "Test 2",
        weak_parallel_conflict: false
      },
      dienstId: 2,
      priorisiereWunsch: false
    }];
    test("Kein Konflikt ohne Werte", () => {
      expect(k.mehrfacheinteilungenKonflikt()).toEqual({
        className: "",
        msg: "",
        check: false,
        abwesend: false,
        anzahl: 0,
        filterKey: "mehrfacheinteilung"
      });
    });
    test("Kein Konflikt bei einer Einteilung", () => {
      expect(k.mehrfacheinteilungenKonflikt(einteilungen[0], [einteilungen[0]], false)).toEqual({
        className: "",
        msg: "",
        check: false,
        abwesend: false,
        anzahl: 1,
        filterKey: "mehrfacheinteilung"
      });
    });
    test("Konflikt bei min. 2 Einteilungen und abwesend true", () => {
      expect(k.mehrfacheinteilungenKonflikt(einteilungen[0], einteilungen, false)).toEqual({
        className: seriousConflict,
        msg: "Mehrere Einteilungen am selben Tag!\nTest, Test 2",
        check: true,
        abwesend: true,
        anzahl: 2,
        filterKey: "mehrfacheinteilung"
      });
    });
    test("Schwacher Konflikt bei 2 Einteilungen mit dienst.weak_parallel_conflict = true", () => {
      einteilungen[0].dienst.weak_parallel_conflict = true;
      einteilungen[1].dienst.weak_parallel_conflict = true;
      expect(k.mehrfacheinteilungenKonflikt(einteilungen[0], einteilungen, false)).toEqual({
        className: possibleConflict,
        msg: "Mehrere Einteilungen am selben Tag!\nTest, Test 2",
        check: true,
        abwesend: true,
        anzahl: 2,
        filterKey: "mehrfacheinteilung"
      });
    });
    const mockMultiPreDienstgruppeKonflikt = jest.spyOn(Konflikte.prototype, "multiPreDienstgruppeKonflikt");
    const mockcheckWunschPrioAbwesend = jest.spyOn(Konflikte.prototype, "checkWunschPrioAbwesend");
    test("Konflikte bei 2 Einteilungen und abwesend false, wenn durch Wunsch erfüllt", () => {
      einteilungen[1].priorisiereWunsch = true;
      einteilungen[1].dienst.weak_parallel_conflict = false;
      mockMultiPreDienstgruppeKonflikt.mockImplementation(() => ({
        preDienstgruppeErfuellt: false
      }));
      mockcheckWunschPrioAbwesend.mockImplementation(() => false);
      expect(k.mehrfacheinteilungenKonflikt(einteilungen[0], einteilungen, false)).toEqual({
        className: seriousConflict,
        msg: "Mehrere Einteilungen am selben Tag!\nTest, Test 2",
        check: true,
        abwesend: false,
        anzahl: 2,
        filterKey: "mehrfacheinteilung"
      });
    });
    test("Kein Konflikt, wenn bei 2 einteilungen preDienstgruppeKonflikt erfüllt wird", () => {
      mockMultiPreDienstgruppeKonflikt.mockImplementation(() => ({
        preDienstgruppeErfuellt: true
      }));
      mockcheckWunschPrioAbwesend.mockImplementation(() => true);
      expect(k.mehrfacheinteilungenKonflikt(einteilungen[0], einteilungen, false)).toEqual({
        className: "",
        msg: "",
        check: false,
        abwesend: false,
        anzahl: 2,
        filterKey: "mehrfacheinteilung"
      });
    });
    afterAll(() => {
      mockMultiPreDienstgruppeKonflikt.mockRestore();
    });
  });

  describe("arbeitszeittypenKonflikt()", () => {
    test("Kein Konflikt ohne Werte", () => {
      expect(k.arbeitszeittypenKonflikt()).toEqual({
        className: "",
        msg: "",
        check: false,
        anzahl: 0,
        filterKey: "arbeitszeittyp"
      });
    });
    const arbeitszeittyp = {
      name: "Test Arbeitszeittyp",
      min: 2,
      max: 4
    };
    const einteilungen = [
      {
        arbeitszeittypValue: () => 1
      },
      { 
        arbeitszeittypValue: () => 0.5
      }
    ];
    test("Kein Konflikt, wenn arbeitszeitValue < min und < max", () => {
      expect(k.arbeitszeittypenKonflikt(einteilungen, arbeitszeittyp)).toEqual({
        className: "",
        msg: "",
        check: false,
        anzahl: 1.5,
        filterKey: "arbeitszeittyp"
      });
    });
    // Kein Konflikt, wenn arbeitszeitValue.min > 0 and max > 0
    test("Kein Konflikt, wenn arbeitszeitValue.min > 0 and max > 0", () => {
      expect(k.arbeitszeittypenKonflikt(einteilungen, {
        min: 0,
        max: 0
      })).toEqual({
        className: "",
        msg: "",
        check: false,
        anzahl: 1.5,
        filterKey: "arbeitszeittyp"
      });
      expect(k.arbeitszeittypenKonflikt(einteilungen, {
        min: -1,
        max: -3
      })).toEqual({
        className: "",
        msg: "",
        check: false,
        anzahl: 1.5,
        filterKey: "arbeitszeittyp"
      });
    });
    test("Possible Konflikt, wenn arbeitszeitValue > min", () => {
      einteilungen[0].arbeitszeittypValue = () => 2.5;
      expect(k.arbeitszeittypenKonflikt(einteilungen, arbeitszeittyp)).toEqual({
        className: possibleConflict,
        msg: "Überschreiten der minimalen Anzahl für Test Arbeitszeittyp (2)!",
        check: true,
        anzahl: 3,
        filterKey: "arbeitszeittyp"
      });
    });
    test("Serious Konflikt, wenn arbeitszeitValue > max", () => {
      einteilungen[0].arbeitszeittypValue = () => 4.5;
      expect(k.arbeitszeittypenKonflikt(einteilungen, arbeitszeittyp)).toEqual({
        className: seriousConflict,
        msg: "Überschreiten der maximalen Anzahl für Test Arbeitszeittyp (4)!",
        check: true,
        anzahl: 5,
        filterKey: "arbeitszeittyp"
      });
    });
    test("Checkt max zuerst", () => {
      arbeitszeittyp.min = arbeitszeittyp.max + 2;
      expect(k.arbeitszeittypenKonflikt(einteilungen, arbeitszeittyp)).toEqual({
        className: seriousConflict,
        msg: "Überschreiten der maximalen Anzahl für Test Arbeitszeittyp (4)!",
        check: true,
        anzahl: 5,
        filterKey: "arbeitszeittyp"
      });
    });
  });

  describe("abwesenheitKonflikt()", () => {
    test("Kein Konflikt, wenn Mitarbeiter aktiv und nicht abwesend ist", () => {
      expect(k.abwesenheitKonflikt({
          aktiv: true,
          abwesend: false
        })).toEqual({
        className: "",
        msg: "",
        check: false,
        filterKey: "abwesend"
      });
    });
    test("Schwacher Konflikt, wenn Mitarbeiter aktiv und abwesend ist", () => {
      expect(k.abwesenheitKonflikt({
        abwesend: true,
        aktiv: true
      })).toEqual({
        className: possibleConflict,
        msg: "Mitarbeiter hat den Sonderstatus (Abwesend)!",
        check: true,
        filterKey: "abwesend"
      });
    });
    test("Konflikt, wenn Mitarbeiter nicht aktiv und nicht abwesend ist", () => {
      expect(k.abwesenheitKonflikt({
        abwesend: false,
        aktiv: false
      })).toEqual({
        className: seriousConflict,
        msg: "Mitarbeiter ist inaktiv!",
        check: true,
        filterKey: "abwesend"
      });
    });
    test("Konflikt, wenn Mitarbeiter aktiv und abwesend ist", () => {
      expect(k.abwesenheitKonflikt({
        abwesend: true,
        aktiv: false
      })).toEqual({
        className: seriousConflict,
        msg: "Mitarbeiter hat den Sonderstatus (Abwesend)!\nMitarbeiter ist inaktiv!",
        check: true,
        filterKey: "abwesend"
      });
    });
  });

  test("teamKonflikt()", () => {
    const dienstTeam = "Test Dienst Team";
    const mitarbeiterTeam = "Test Mitarbeiter Team";
    expect(k.teamKonflikt(true, dienstTeam, mitarbeiterTeam)).toEqual({
      className: "",
      msg: "",
      isInDienstTeam: true,
      check: false,
      filterKey: "team"
    });
    expect(k.teamKonflikt(false, dienstTeam, mitarbeiterTeam)).toEqual({
      className: possibleConflict,
      msg: "Mitarbeiter-Team (Test Mitarbeiter Team) unterscheidet sich von Team des Dienstes (Test Dienst Team)",
      isInDienstTeam: false,
      check: true,
      filterKey: "team"
    });
  });

  test("freigabeKonflikt()", () => {
    // Kein Konflikt, wenn 100% Freigabe
    expect(k.freigabeKonflikt(1)).toEqual({
      className: "",
      msg: "",
      anteil: 1,
      check: false,
      filterKey: "freigaben"
    });
    // Teilfreigaben
    expect(k.freigabeKonflikt(0.5)).toEqual({
      className: possibleConflict,
      msg: "Mitarbeiter hat für diesen Dienst Sonderfreigaben oder es fehlen Freigaben.",
      anteil: 0.5,
      check: true,
      filterKey: "freigaben"
    });
    // Keine Freigaben
    expect(k.freigabeKonflikt(0)).toEqual({
      className: seriousConflict,
      msg: "Mitarbeiter hat keine Freigabe für diesen Dienst.",
      anteil: 0,
      check: true,
      filterKey: "freigaben"
    });
  });

  describe("dienstgruppeKonflikt()", () => {
    const feld = {
      dienstId: 1,
      dateDienstLabel: "Test Dienst",
      tagZahl: 20231208,
      schichtenWithoutAusgleich: [
        {
          isFrei: false,
          checkUeberschneidung: () => true
        },
        {
          isFrei: false,
          checkUeberschneidung: () => false
        }
      ]
    };
    const dienstgruppen = [
      {
        dateDienstLabel: "Test Dienst 0",
        tagZahl: 20231208,
        dienstgruppe: {
          name: "Test Dienstgruppe 0",
          includesDienst: (dienstId) => dienstId !== 1
        },
        dienstgruppeZeitraum: {
        }
      },
      {
        dateDienstLabel: "Test Dienst 1",
        tagZahl: 20231207,
        dienstgruppe: {
          name: "Test Dienstgruppe 1",
          includesDienst: (dienstId) => dienstId === 1
        },
        dienstgruppeZeitraum: {}
      },
      {
        dateDienstLabel: "Test Dienst 2",
        tagZahl: 20231220,
        dienstgruppe: {
          name: "Test Dienstgruppe 2",
          includesDienst: (dienstId) => dienstId !== 1
        },
        dienstgruppeZeitraum: {}
      }
    ];
    test("Kein Konflikt ohne Werte", () => {
      expect(k.dienstgruppeKonflikt()).toEqual({
        className: "",
        msg: "",
        abwesend: false,
        check: false,
        filterKey: "dienstgruppe"
      });
    });
    test("Kein Konflikt, wenn dienstgruppen nur das Feld enthält", () => {
      expect(k.dienstgruppeKonflikt(feld, [feld])).toEqual({
        className: "",
        msg: "",
        abwesend: false,
        check: false,
        filterKey: "dienstgruppe"
      });
    });
    test("Kein Konflikt, wenn dienstrgruppenFeld.tag nach feld.tag", () => {
      expect(k.dienstgruppeKonflikt(feld, [dienstgruppen[2]])).toEqual({
        className: "",
        msg: "",
        abwesend: false,
        check: false,
        filterKey: "dienstgruppe"
      });
    });
    test("Kein Konflikt, wenn feld.dienstId in dienstgruppen.includesDienst", () => {
      expect(k.dienstgruppeKonflikt(feld, [dienstgruppen[1]])).toEqual({
        className: "",
        msg: "",
        abwesend: false,
        check: false,
        filterKey: "dienstgruppe"
      });
    });
    test("Konflikt, wenn feld.dienstId nicht in dienstgruppen.includesDienst und checkUeberschneidung true für min. eine Schicht", () => {
      expect(k.dienstgruppeKonflikt(feld, [dienstgruppen[0]])).toEqual({
        className: seriousConflict,
        msg: "Test Dienst ist nicht in der Dienstgruppe:\nTest Dienstgruppe 0 von Test Dienst 0",
        abwesend: true,
        check: true,
        filterKey: "dienstgruppe"
      });
    });
    test("Kein Konflikt, bei Überschneidung mit einer isFrei Schicht", () => {
      feld.schichtenWithoutAusgleich[0].isFrei = true;
      expect(k.dienstgruppeKonflikt(feld, [dienstgruppen[0]])).toEqual({
        className: "",
        msg: "",
        abwesend: false,
        check: false,
        filterKey: "dienstgruppe"
      });
    });
  });

  describe("fordertDienstgruppeKonflikt()", () => {
    const feld = {
      dienstId: 2,
      dienstgruppe: {
        name: "Test Dienstgruppe",
        includesDienst: (dienstId) => dienstId !== 1
      },
      dienstgruppeZeitraum: {
        _anfang: {
          date: "2023-12-01"
        },
        _ende: {
          date: "2023-12-02"
        }
      }
    };
    const eingeteilteSchichtenNachTage = {
      "2023-12-01": [
        {
          schicht: {
            isFrei: false,
            checkUeberschneidung: () => true
          },
          feld: {
            dienstId: 2
          }
        },
        {
          schicht: {
            isFrei: false,
            checkUeberschneidung: () => false
          },
          feld: {
            dienstId: 1
          }
        },
        {
          schicht: {
            isFrei: true,
            checkUeberschneidung: () => true
          },
          feld: {
            dienstId: 1
          }
        }
      ],
      "2023-12-02": [
        {
          schicht: {
            isFrei: false,
            checkUeberschneidung: () => true
          },
          feld: {
            dateDienstLabel: "Test Dienst1",
            dienstId: 1
          }
        },
        {
          schicht: {
            isFrei: false,
            checkUeberschneidung: () => true
          },
          feld: {
            dateDienstLabel: "Test Dienst2",
            dienstId: 1
          }
        }
      ]
    };
    test("Kein Konflikt ohne Werte", () => {
      expect(k.fordertDienstgruppeKonflikt()).toEqual({
        className: "",
        msg: "",
        abwesend: false,
        check: false,
        filterKey: "fordertdienstgruppe"
      });
    });
    test("Kein Konflikt bei Überschneidung mit sich selbst", () => {
      expect(k.fordertDienstgruppeKonflikt(feld, {
        "2023-12-01": [
          {
            schicht: {
              isFrei: false,
              checkUeberschneidung: () => true
            },
            feld
          }
        ]
      })).toEqual({
        className: "",
        msg: "",
        abwesend: false,
        check: false,
        filterKey: "fordertdienstgruppe"
      });
    });
    test("Kein Konflikt, wenn dienstId in dienstgruppe.includesDienst, wenn keine Schichtüberschneidung und Schicht isFrei", () => {
      expect(k.fordertDienstgruppeKonflikt(feld, {
        "2023-12-01": eingeteilteSchichtenNachTage["2023-12-01"]
      })).toEqual({
        className: "",
        msg: "",
        abwesend: false,
        check: false,
        filterKey: "fordertdienstgruppe"
      });
    });
    test("Kein Konflikt, wenn Überschneidung mit nicht isFrei und dienst nicht in dienstgruppe.includesDienst", () => {
      expect(k.fordertDienstgruppeKonflikt(feld, eingeteilteSchichtenNachTage)).toEqual({
        className: seriousConflict,
        msg: "Test Dienstgruppe:\nTest Dienst1\nTest Dienst2",
        abwesend: true,
        check: true,
        filterKey: "fordertdienstgruppe"
      });
    });
  });

  describe("ueberschneidungenKonflikt()", () => {
    test("Kein Konflikt ohne Werte", () => {
      const feldEmpty = {};
      expect(k.ueberschneidungenKonflikt(feldEmpty)).toEqual({
        className: "",
        msg: "",
        abwesend: false,
        check: false,
        maxMsgLength: 400,
        filterKey: "ueberschneidung",
        felder: [feldEmpty]
      });
    });
    // Keine Konflikte, mit Ausgleichschichten eines inaktiven Blockes
    test("Kein Konflikt, wenn Ausgleichschichten eines inaktiven Blockes", () => {
      const feldBlock = {
        tagZahl: 20231201,
        isBlock: true,
        blockChecked: false,
        lastBedarfTag: "2023-12-01",
        tag: "2023-12-01",
        dienst: {
          ignore_before: false
        }
      };
      const ausgleichSchichtenBlock = [
        {
          isFrei: false,
          ausgleich: true,
          getTage: () => ["2023-12-01"],
          checkUeberschneidung: () => true
        }
      ];
      const eingeteilteKonfliktSchichtenNachTage = {
        "2023-12-01": [
          {
            schicht: {
              isFrei: false,
              ausgleich: false
            },
            feld: {...feldBlock}
          }
        ]
      };
      expect(k.ueberschneidungenKonflikt(
        feldBlock, 
        ausgleichSchichtenBlock, 
        eingeteilteKonfliktSchichtenNachTage
      )).toEqual({
        className: "",
        msg: "",
        abwesend: false,
        check: false,
        maxMsgLength: 400,
        filterKey: "ueberschneidung",
        felder: [feldBlock]
      });
    });
  });
});