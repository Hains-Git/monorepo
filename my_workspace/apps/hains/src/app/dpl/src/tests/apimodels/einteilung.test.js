import Einteilung from "../../models/apimodels/einteilung";
import Basic from "../../models/basic";
import { clearAppModelFromBasic, createAppModel } from "../mockdata/appmodel";

const einteilungen = {
  "134313": {
      "id": 134313,
      "mitarbeiter_id": 455,
      "created_at": "2021-10-07T09:50:49.012Z",
      "updated_at": "2021-10-07T09:50:49.012Z",
      "einteilungsstatus_id": 4,
      "po_dienst_id": 85,
      "dienstplan_id": 2,
      "reason": "",
      "number": null,
      "tag": "2022-05-01",
      "einteilungskontext_id": 8,
      "doppeldienst_id": 0,
      "schicht_nummern": [
          0
      ],
      "arbeitsplatz_id": 1,
      "bereich_id": 68,
      "info_comment": "info",
      "context_comment": "context"
  },
  "134314": {
      "id": 134314,
      "mitarbeiter_id": 455,
      "created_at": "2021-10-07T09:50:49.023Z",
      "updated_at": "2021-10-07T09:50:49.023Z",
      "einteilungsstatus_id": 2,
      "po_dienst_id": 85,
      "dienstplan_id": 2,
      "reason": "",
      "number": null,
      "tag": "2022-08-02",
      "einteilungskontext_id": 8,
      "doppeldienst_id": 0,
      "schicht_nummern": [
          0
      ],
      "arbeitsplatz_id": 1,
      "bereich_id": null,
      "info_comment": "",
      "context_comment": ""
  }
}

beforeAll(() => {
  clearAppModelFromBasic();
});

const einteilungenIds = [134313, 134314];
const einteilungenArr = [einteilungen[einteilungenIds[0]], einteilungen[einteilungenIds[1]]];
describe("Whitebox testing", () => {
  describe("Instances", () => {
    test("Einteilung is instanceof Einteilung and Basic", () => {
      const e = new Einteilung(einteilungenArr[0]);
      expect(e).toBeInstanceOf(Einteilung);
      expect(e).toBeInstanceOf(Basic);
    });
  });

  describe("Einteilung defines Propertys", () => {
    const data = einteilungenArr[0];
    const properties = [
      {key: "id", expectedValue: data.id},
      {key: "dienstplan_id", expectedValue: data.dienstplan_id},
      {key: "doppeldienst_id", expectedValue: data.doppeldienst_id},
      {key: "einteilungskontext_id", expectedValue: data.einteilungskontext_id},
      {key: "einteilungsstatus_id", expectedValue: data.einteilungsstatus_id},
      {key: "mitarbeiter_id", expectedValue: data.mitarbeiter_id},
      {key: "number", expectedValue: data.number},
      {key: "po_dienst_id", expectedValue: data.po_dienst_id},
      {key: "reason", expectedValue: data.reason},
      {key: "tag", expectedValue: data.tag},
      {key: "bereich_id", expectedValue: data.bereich_id},
      {key: "reason", expectedValue: data.reason},
      {key: "arbeitsplatz_id", expectedValue: data.arbeitsplatz_id},
      {key: "info_comment", expectedValue: data.info_comment},
      {key: "context_comment", expectedValue: data.context_comment},
      {key: "created_at", expectedValue: data.created_at},
      {key: "updated_at", expectedValue: data.updated_at},
      {key: "feld", expectedValue: false},
    ];

    let e = new Einteilung(data);
    properties.forEach(({key, expectedValue}) => {
      test("sets "  + key, () => {
        expect(e[key]).toBe(expectedValue);
      });
    });

    test("sets schicht_nummern", () => {
      expect(e.schicht_nummern).toEqual([0]);
    });
  });

  describe("Einteilung Methods", () => {
    const data = einteilungenArr[0];
    const e = new Einteilung(data);

    test("setSchichtNummern", () => {
      e.setSchichtNummern(data.schicht_nummern);
      expect(e.schicht_nummern).toEqual([0]);
      // Wenn eine 0 existiert, dann gilt die Einteilung für alle Schichten
      e.setSchichtNummern({schicht_nummern: [0, 1, 4]});
      expect(e.schicht_nummern).toEqual([0]);
      // Korrekte Struktur
      const arr = [1, 4];
      e.setSchichtNummern({schicht_nummern: arr});
      expect(e.schicht_nummern).toBe(arr);

      // Falsche Strukturen -> setzt auf [0]
      e.setSchichtNummern([1, 5]);
      expect(e.schicht_nummern).toEqual([0]);

      e.setSchichtNummern("0,1,2");
      expect(e.schicht_nummern).toEqual([0]);

      e.setSchichtNummern({});
      expect(e.schicht_nummern).toEqual([0]);

      e.setSchichtNummern(() => {});
      expect(e.schicht_nummern).toEqual([0]);

      e.setSchichtNummern(true);
      expect(e.schicht_nummern).toEqual([0]);

      e.setSchichtNummern(false);
      expect(e.schicht_nummern).toEqual([0]);
    });
  })

  describe("Einteilung Getter", () => {
    const appModel = createAppModel({
      data: {
        arbeitsplaetze: {
          1: {}
        },
        bereiche: {
          68: {}
        },
        einteilungsstatuse: {
          4: {
            counts: true,
            vorschlag: true,
            public: true,
            show: true
          }
        },
        einteilungskontexte: {
          8: {}
        }
      }, 
      page: {
        data: {
          dates: {
            "2022-05-01": {}
          },
          dienste: {
            85: {
              hasBedarf: true
            }
          },
          mitarbeiter: {
            455: {
              hasDoppelteEinteilung: () => true
            }
          }
        }
      }
    });
    const data = einteilungenArr[0];
    const e = new Einteilung(data, appModel);
    const appdata = appModel.data;
    const pagedata = appModel.page.data;
    
    const properties = [
      {key: "cacheKey", expectedValue: e.bereich_id + "_" + e.tag + "_" + e.po_dienst_id},
      {key: "einteilungsstatus", expectedValue: appdata.einteilungsstatuse[e.einteilungsstatus_id]},
      {key: "einteilungskontext", expectedValue: appdata.einteilungskontexte[e.einteilungskontext_id]},
      {key: "dienst", expectedValue: pagedata.dienste[e.po_dienst_id]},
      {key: "hasBedarf", expectedValue: pagedata.dienste[e.po_dienst_id].hasBedarf},
      {key: "mitarbeiter", expectedValue: pagedata.mitarbeiter[e.mitarbeiter_id]},
      {key: "date", expectedValue: pagedata.dates[e.tag]},
      {key: "bereich", expectedValue: appdata.bereiche[e.bereich_id]},
      {key: "tagZahl", expectedValue: 20220501},
      {key: "counts", expectedValue: appdata.einteilungsstatuse[e.einteilungsstatus_id].counts},
      {key: "schichten", expectedValue: e.schicht_nummern.join(",")},
      {key: "einteilung_tag", expectedValue: new Date(e.tag).toLocaleDateString("de-DE")},
      {key: "counts", expectedValue: appdata.einteilungsstatuse[e.einteilungsstatus_id].counts},
      {key: "show", expectedValue: appdata.einteilungsstatuse[e.einteilungsstatus_id].show},
      {key: "vorschlag", expectedValue: appdata.einteilungsstatuse[e.einteilungsstatus_id].vorschlag},
      {key: "public", expectedValue: appdata.einteilungsstatuse[e.einteilungsstatus_id].public},
      {key: "arbeitsplatz", expectedValue: appdata.arbeitsplaetze[e.arbeitsplatz_id]},
      {key: "updatedAtZahl", expectedValue: 20211007095049},
      {key: "doppelteEinteilung", expectedValue: pagedata.mitarbeiter[e.mitarbeiter_id].hasDoppelteEinteilung()},
    ];
    
    properties.forEach(({key, expectedValue}) => {
      test("get " + key, () => {
        expect(e[key]).toBe(expectedValue);
      });
    });
  });

  describe("Methods", () => {
    const data = einteilungenArr[0];
    const appModel = createAppModel({ 
      data: {
        einteilungsstatuse: {
          4: {
            counts: true,
            vorschlag: true,
            public: true,
            show: true
          },
          300: {
            show: true
          },
          350: {
            show: false
          }
        }
      },
      page: {
        data: {
          einteilungen: {
            _set: (id, el) => appModel.page.data.einteilungen[id] = el
          },
          mitarbeiter: {
            455: {
              addEinteilung: jest.fn(() => true),
              removeEinteilung: jest.fn(() => true)
            }
          }
        }
      }
    });
    const e = new Einteilung(data, appModel);

    test("deactivate()", () => {
      const e = new Einteilung(data, appModel);
      expect(e.deactivate()).toBe(0);
    });

    describe("setFeld(), updateBereich(), removeFromMitarbeiter(), addToMitarbeiter() and updateMitarbeiter()", () => {
      const mitarbeiter = appModel.page.data.mitarbeiter[e.mitarbeiter_id];
      const einteilungsstatus = appModel.data.einteilungsstatuse[e.einteilungsstatus_id];
      beforeEach(() => {
        mitarbeiter.addEinteilung.mockClear();
        mitarbeiter.removeEinteilung.mockClear();
      });

      test("setFeld()", () => {
        const feld = {
          bereichId: 200
        };
        expect(e.setFeld(feld)).toBe(feld);
      });

      test("updateBereich()", () => {
        expect(e.updateBereich()).toBe(200);
      });

      test("addToMitarbeiter()", () => {
        expect(e.addToMitarbeiter()).toBe(true);
        expect(mitarbeiter.addEinteilung).toBeCalled();
      });

      test("removeFromMitarbeiter()", () => {
        expect(e.removeFromMitarbeiter()).toBe(true);
        expect(mitarbeiter.removeEinteilung).toBeCalled();
      });

      describe("updateMitarbeiter()", () => {
        let mockAddMitarbeiter;
        let mockRemoveMitarbeiter;
        let mockDeactivate;
        beforeEach(() => {
          mockAddMitarbeiter = jest.spyOn(Einteilung.prototype, "addToMitarbeiter");
          mockRemoveMitarbeiter = jest.spyOn(Einteilung.prototype, "removeFromMitarbeiter");
          mockDeactivate = jest.spyOn(Einteilung.prototype, "deactivate");
        });
        afterEach(() => {
          mockAddMitarbeiter.mockRestore();
          mockRemoveMitarbeiter.mockRestore();
          mockDeactivate.mockRestore();
        });

        test("updateMitarbeiter()", () => {
          e.updateMitarbeiter();
          expect(mockAddMitarbeiter).toBeCalled();
          einteilungsstatus.show = false;
          e.updateMitarbeiter();
          expect(mockRemoveMitarbeiter).toBeCalled();
          expect(mockDeactivate).toBeCalled();
          einteilungsstatus.show = true;
        });
      });
    });

    describe("add and remove", () => {
      test("add()", () => {
        e.add({
          bereichId: 200
        });
        expect(e.bereich_id).toBe(200);
        expect(appModel.page.data.einteilungen[e.id]).toBe(e);
      });
      test("remove()", () => {
        e.remove();
        expect(appModel.page.data.einteilungen[e.id]).toBeUndefined();
      });
    });

    test("updateStatus()", () => {
      expect(e.updateStatus(300, 200)).toBe(true);
      expect(e.einteilungsstatus_id).toBe(300);
      expect(e.dienstplan_id).toBe(200);
      expect(e.updateStatus(350, 200)).toBe(false);
      expect(e.einteilungsstatus_id).toBe(300);
    });
  });
});
