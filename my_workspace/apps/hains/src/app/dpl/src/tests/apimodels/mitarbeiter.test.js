import Mitarbeiter from "../../models/apimodels/mitarbeiter";
import Basic from "../../models/basic";
import { clearAppModelFromBasic, createAppModel } from "../mockdata/appmodel";

const mitarbeiter = {
  "1": {
      "id": 1,
      "name": "Test Name",
      "planname": "Test",
      "aktiv": true,
      "aktiv_von": null,
      "aktiv_bis": null,
      "platzhalter": false,
      "a_seit": "1994-01-01",
      "anrechenbare_zeit": 0,
      "zeit_kommentar": null,
      "abwesend": false,
      "pass_count": 57,
      "funktion_id": 1,
      "personalnummer": "0780240",
      "accountInfo": {},
      "freigaben_ids": [1,2,5],
      "freigabetypen_ids": [1,2,3],
      "rating_ids": [1,2,3],
      "vertrag_ids": [1],
      "vertragphasen_ids": [1],
      "idsFreigegebenerDienste": [1, 2, 3]
  },
  "2": {
    "id": 2,
    "name": "Test Name",
    "planname": "Test",
    "aktiv": false,
    "aktiv_von": null,
    "aktiv_bis": null,
    "platzhalter": false,
    "a_seit": "1994-01-01",
    "anrechenbare_zeit": 0,
    "zeit_kommentar": null,
    "abwesend": true,
    "pass_count": 57,
    "funktion_id": 1,
    "personalnummer": "0780240",
    "accountInfo": {},
    "freigaben_ids": [1,2,5],
    "freigabetypen_ids": [1,2,3],
    "rating_ids": [1,2,3],
    "vertrag_ids": [1],
    "vertragphasen_ids": [1],
    "idsFreigegebenerDienste": [2, 4, 5]
  }
}

beforeAll(() => {
  clearAppModelFromBasic();
});

describe("Whitebox testing", () => {
  describe("Instances", () => {
    test("Mitarbeiter is instanceof Mitarbeiter and Basic", () => {
      const m = new Mitarbeiter(mitarbeiter[1]);
      expect(m).toBeInstanceOf(Mitarbeiter);
      expect(m).toBeInstanceOf(Basic);
    });
  });

  describe("Mitarbeiter defines Propertys", () => {
    const data = mitarbeiter[1];
    const properties = [
      {key: "a_seit", expectedValue: data.a_seit},
      {key: "abwesend", expectedValue: data.abwesend},
      {key: "aktiv", expectedValue: data.aktiv},
      {key: "aktiv_bis", expectedValue: data.aktiv_bis},
      {key: "id", expectedValue: data.id},
      {key: "aktiv_von", expectedValue: data.aktiv_von},
      {key: "anrechenbare_zeit", expectedValue: data.anrechenbare_zeit},
      {key: "funktion_id", expectedValue: data.funktion_id},
      {key: "pass_count", expectedValue: data.pass_count},
      {key: "personalnummer", expectedValue: data.personalnummer},
      {key: "planname", expectedValue: data.planname},
      {key: "name", expectedValue: data.name},
      {key: "platzhalter", expectedValue: data.platzhalter},
      {key: "zeit_kommentar", expectedValue: data.zeit_kommentar}, 
      {key: "accountInfo", expectedValue: data.accountInfo},
      {key: "freigaben_ids", expectedValue: data.freigaben_ids},
      {key: "freigabetypen_ids", expectedValue: data.freigabetypen_ids},
      {key: "rating_ids", expectedValue: data.rating_ids},
      {key: "vertrag_ids", expectedValue: data.vertrag_ids},
      {key: "vertragphasen_ids", expectedValue: data.vertragphasen_ids},
      {key: "class", expectedValue: ""},
      {key: "idsFreigegebenerDienste", expectedValue: data.idsFreigegebenerDienste, arr: true}
    ];
    const m = new Mitarbeiter(data);
    properties.forEach(({key, expectedValue, arr}) => {
      test(`sets ${key}`, () => {
        if(arr){
          expect(m[key]).toEqual(expect.arrayContaining(expectedValue));
        } else {
          expect(m[key]).toBe(expectedValue);
        }
      });
    });
  });

  describe("Getter", () => {
    const appModel = createAppModel({
      data: {
        arbeitszeit_absprachen: {
          1: {}
        },
        nicht_einteilen_absprachen: {
          1: {}
        },
        funktionen: {
          1: {
            team: {}
          }
        },
        po_dienste: {
          1: {},
          2: {},
          3: {}
        },
        ratings: {
          1: {},
          2: {},
          3: {}
        },
        vertragsphasen: {
          1: {}
        },
        vertraege: {
          1: {}
        }
      },
      page: {
        data: {
          rotationen: {
            1: {},
            2: {}
          }
        }
      }
    });
    const data = mitarbeiter[1];
    const m = new Mitarbeiter(data, appModel);
    test("get funktion", () => {
      expect(m.funktion).toBe(appModel.data.funktionen[m.funktion_id]);
    });

    test("get funktionsTeam", () => {
      expect(m.funktionsTeam).toBe(appModel.data.funktionen[m.funktion_id].team);
    });

    test("get countFreigegebeneDienste", () => {
      expect(m.countFreigegebeneDienste).toBe(data.idsFreigegebenerDienste.length);
    });

    test("get hasFreigegebeneDienste", () => {
      const oldIds = m.idsFreigegebenerDienste;
      expect(m.hasFreigegebeneDienste).toBe(true);
      m._set("idsFreigegebenerDienste", []);
      expect(m.hasFreigegebeneDienste).toBe(false);
      m._set("idsFreigegebenerDienste", oldIds);
    });

    test("get countFreigaben", () => {
      expect(m.countFreigaben).toBe(data.freigabetypen_ids.length);
    });

    test("get ratings", () => {
      const ratings = data.rating_ids.map(id => appModel.data.ratings[id]);
      expect(m.ratings).toEqual(expect.arrayContaining(ratings));
    });

    test("get rotationen", () => {
      m._set("rotationenIds", [1, 2]);
      const rotationen = m.rotationenIds.map(id => appModel.page.data.rotationen[id]);
      expect(m.rotationen).toEqual(expect.arrayContaining(rotationen));
      m._set("rotationenIds", []);
    });

    test("get vertragsphasen", () => {
      const vertragsphasen = data.vertragphasen_ids.map(id => appModel.data.vertragsphasen[id]);
      expect(m.vertragsphasen).toEqual(expect.arrayContaining(vertragsphasen));
    });

    test("get freigegebenDienste", () => {
      const freigegebenDienste = data.idsFreigegebenerDienste.map(id => appModel.data.po_dienste[id]);
      expect(m.freigegebenDienste).toEqual(expect.arrayContaining(freigegebenDienste));
    });

    test("get arbeitszeitAbpsrachen", () => {
      expect(m.arbeitszeitAbpsrachen).toBe(appModel.data.arbeitszeit_absprachen[m.id]);
    });

    test("get nichtEinteilenAbsprachen", () => {
      expect(m.nichtEinteilenAbsprachen).toBe(appModel.data.nicht_einteilen_absprachen[m.id]);
    });

    test("get hasRotationen", () => {
      m._set("rotationenIds", [1, 2]);
      expect(m.hasRotationen).toBe(true);
      m._set("rotationenIds", []);
      expect(m.hasRotationen).toBe(false);
    });
  })

  describe("Methoden", () => {
    const appModel = createAppModel({
    });
    const data = mitarbeiter[1];
    const m = new Mitarbeiter(data, appModel);

    test("hasRotationenAm()", () => {});

    // test("setIdsFreigegebenerDienste()", () => {});

    // test("setRotationenIds()", () => {});

    // test("resetAttributes()", () => {});

    // test("updateFreigaben()", () => {});

    // test("updateRotationen()", () => {});

    // test("checkStatus()", () => {});

    // test("addClass()", () => {});

    // test("addToFreigegebeneDienste()", () => {});

    // test("removeFromFreigegebeneDienste()", () => {});

    // test("addRotationId()", () => {});

    // test("getTeamNamenAm()", () => {});

    // test("getEinteilungsMonat()", () => {});

    // test("initEinteilung()", () => {});

    // test("addEinteilung()", () => {});

    // test("addOneEinteilung()", () => {});

    // test("removeOneEinteilung()", () => {});

    // test("removeEinteilung()", () => {});

    // test("addVorschlag()", () => {});

    // test("checkKonflikte()", () => {});

    // test("getWunschAm()", () => {});

    // test("eachEinteilungsTag()", () => {});

    // test("hasEinteilungenAm()", () => {});

    // test("getEinteilungenNachTag()", () => {});

    // test("getEinteilungenNachDienst()", () => {});

    // test("getEinteilungenNachTagAndDienst()", () => {});

    // test("hasDoppelteEinteilungen()", () => {});

    // test("getAllEinteilungen()", () => {});

    // test("getNachtDienste()", () => {});

    // test("eachEinteilungsMonat()", () => {});

    // test("eachArbeitszeittyp()", () => {});

    // test("isInDienstTeam()", () => {});

    // test("anteilFreigaben()", () => {});

    // test("getFreigaben()", () => {});

    // test("isAbwesend()", () => {});

    // test("getVertragsPhase()", () => {});

    // test("getStundenTag()", () => {});

    // test("getVK()", () => {});

    // test("getSollStunden()", () => {});

    // test("getTeamsWithoutFunktionsTeamAm()", () => {});

    // test("getTeamsAm()", () => {});

    // test("getPrioTeamAm()", () => {});

    // test("getEinteilungenInfo()", () => {});

    // test("getScoreProps()", () => {});

    // test("getScore()", () => {});

    // test("checkRotationen()", () => {});

    // test("getAbsprachenInfos()", () => {});
  })
});