import Dienst from "../../models/apimodels/dienst";
import Basic from "../../models/basic";
import { clearAppModelFromBasic, createAppModel } from "../mockdata/appmodel";

const dienste = {
  "29": {
      "id": 29,
      "name": "Test 1",
      "beschreibung": "",
      "planname": "T1",
      "converted_planname": "t1",
      "color": "#60a8fb",
      "freigabetypen_ids": [
          2,
          3
      ],
      "preset": false,
      "sys": false,
      "thema_ids": [
          2,
          3,
          4,
          42,
          48,
          50,
          58
      ],
      "aufwand": 0,
      "aneasy_name": "T11",
      "order": 1,
      "priorisiere_wunsch": false,
      "team_id": 4,
      "kostenstelle_id": 2,
      "stundennachweis_urlaub": false,
      "stundennachweis_krank": false,
      "stundennachweis_sonstig": false,
      "stundennachweis_default_von": "00:00",
      "stundennachweis_default_bis": "00:00",
      "stundennachweis_default_std": "0.0",
      "use_tagessaldo": false,
      "frei_eintragbar": true, 
      "ignore_before": true,
      "oberarzt": false,
      "dpl_all_teams": true,
      "rating_ids": [1, 2],
      "bedarf_ids": [],
      "weak_parallel_conflict": false
  },
  "30": {
      "id": 30,
      "name": "Test 2",
      "beschreibung": "",
      "planname": "T2",
      "converted_planname": "t2",
      "color": "#60a8fb",
      "freigabetypen_ids": [],
      "preset": false,
      "sys": false,
      "thema_ids": [
          2,
          3,
          4,
          42,
          46,
          50,
          58
      ],
      "aufwand": 0,
      "aneasy_name": "T22",
      "order": 2,
      "priorisiere_wunsch": false,
      "team_id": 4,
      "kostenstelle_id": 2,
      "stundennachweis_urlaub": false,
      "stundennachweis_krank": false,
      "stundennachweis_sonstig": false,
      "stundennachweis_default_von": "00:00",
      "stundennachweis_default_bis": "00:00",
      "stundennachweis_default_std": "0.0",
      "use_tagessaldo": false,
      "frei_eintragbar": false,
      "ignore_before": false,
      "oberarzt": true,
      "dpl_all_teams": false,
      "rating_ids": [3, 4],
      "bedarf_ids": [],
      "weak_parallel_conflict": true
  }
}

beforeAll(() => {
  clearAppModelFromBasic();
});

const appModel = createAppModel({
  data: {
    teams: {
      4: {
        name: "Team 4"
      }
    },
    kostenstellen: {
      2: {}
    },
    freigabetypen: {
      2: {},
      3: {}
    },
    themen: {
      2: {},
      3: {},
      4: {},
      42: {},
      46: {},
      48: {},
      50: {},
      58: {}
    },
    ratings: {
      1: {},
      2: {},
      3: {},
      4: {}
    }
  }, 
  page: {
    data: {
      bedarfe: {
        3: {},
        4: {}
      },
      bedarfseintraege: {
        1: {
          po_dienst_id: 29,
          tag: "2023-08-05"
        },
        2: {
          po_dienst_id: 29,
          tag: "2023-08-05"
        },
        4: {
          po_dienst_id: 29,
          tag: "2023-08-05"
        },
        _each: (callback) => {
          Object.values(appModel.page.data.bedarfseintraege).forEach(b => {
            callback(b);
          });
        }
      }
    }
  }
});

describe("Whitebox testing", () => {
  describe("Instances", () => {
    test("Dienst is instanceof Dienst and Basic", () => {
      const d = new Dienst(dienste[29]);
      expect(d).toBeInstanceOf(Dienst);
      expect(d).toBeInstanceOf(Basic);
    });
  });

  describe("Dienst defines Propertys", () => {
    const data = dienste[29];
    const properties = [
      {key: "aneasy_name", expectedValue: data.aneasy_name},
      {key: "aufwand", expectedValue: data.aufwand},
      {key: "beschreibung", expectedValue: data.beschreibung},
      {key: "color", expectedValue: data.color},
      {key: "freigabetypen_ids", expectedValue: data.freigabetypen_ids},
      {key: "id", expectedValue: data.id},
      {key: "order", expectedValue: data.order},
      {key: "name", expectedValue: data.name},
      {key: "planname", expectedValue: data.planname},
      {key: "converted_planname", expectedValue: data.converted_planname},
      {key: "preset", expectedValue: data.preset},
      {key: "sys", expectedValue: data.sys},
      {key: "thema_ids", expectedValue: data.thema_ids},
      {key: "team_id", expectedValue: data.team_id},
      {key: "kostenstelle_id", expectedValue: data.kostenstelle_id},
      {key: "priorisiere_wunsch", expectedValue: data.priorisiere_wunsch},
      {key: "frei_eintragbar", expectedValue: data.frei_eintragbar},
      {key: "defaultStd", expectedValue: data.defaultStd ? parseFloat(data.defaultStd) : 0},
      {key: "stundennachweis_urlaub", expectedValue: data.stundennachweis_urlaub},
      {key: "stundennachweis_krank", expectedValue: data.stundennachweis_krank},
      {key: "stundennachweis_sonstig", expectedValue: data.stundennachweis_sonstig},
      {key: "use_tagessaldo", expectedValue: data.use_tagessaldo},
      {key: "ignore_before", expectedValue: data.ignore_before},
      {key: "oberarzt", expectedValue: data.oberarzt},
      {key: "dpl_all_teams", expectedValue: data.dpl_all_teams},
      {key: "rating_ids", expectedValue: data.rating_ids},
      {key: "bedarf_ids", expectedValue: data.bedarf_ids},
      {key: "idsQualifizierterMitarbeiter", expectedValue: [], array: true},
      {key: "customColor", expectedValue: data.color},
      {key: "weak_parallel_conflict", expectedValue: !!data.weak_parallel_conflict}
    ];

    const d = new Dienst(data);
    properties.forEach(({key, expectedValue, array}) => {
      test("sets "  + key, () => {
        if(array){
          expect(d[key]).toEqual(expectedValue);
        } else {
          expect(d[key]).toBe(expectedValue);
        }
      });
    });
  });

  describe("Dienst Getter", () => {
    [29, 30].forEach(id => {
      const data = dienste[id];
      const d = new Dienst(data, appModel);
      const isFreiEintragbar = data.frei_eintragbar && !data.bedarf_ids.length;
      test("get kostenstelle ", () => {
        expect(d.kostenstelle).toBe(appModel.data.kostenstellen[d.kostenstelle_id]);
      });
      test("get hasBedarf ", () => {
        expect(d.hasBedarf).toBe(data.bedarf_ids.length > 0);
      });
      test("get isFreiEintragbar ", () => {
        expect(d.isFreiEintragbar).toBe(isFreiEintragbar);
      });
      test("get countFreigaben ", () => {
        expect(d.countFreigaben).toBe(data.freigabetypen_ids.length);
      });
      test("get bedarfe ", () => {
        const arr = [];
        d.bedarf_ids.forEach(id => {
          arr.push(appModel.page.data.bedarfe[id]);
        });
        expect(d.bedarfe).toEqual(arr);
      });
      test("get freigabeTypen ", () => {
        const arr = [];
        d.freigabetypen_ids.forEach(id => {
          arr.push(appModel.data.freigabetypen[id]);
        });
        expect(d.freigabeTypen).toEqual(arr);
      });
      test("get ratings ", () => {
        const arr = [];
        d.rating_ids.forEach(id => {
          arr.push(appModel.data.ratings[id]);
        });
        expect(d.ratings).toEqual(arr);
      });
      test("get themen ", () => {
        const arr = [];
        d.thema_ids.forEach(id => {
          arr.push(appModel.data.themen[id]);
        });
        expect(d.themen).toEqual(arr);
      });
      test("get team ", () => {
        expect(d.team).toBe(appModel.data.teams[d.team_id]);
      });
      test("get teamName", () => {
        expect(d.teamName).toBe(appModel.data.teams[d.team_id].name);
      });
    });
  })

  describe("Dienst Methods", () => {
    describe("setCustomColor() and getCustomColor()", () => {
      const data = dienste[30];
      const d = new Dienst(data);
      test(`setCustomColor(10) ignores params`, () => {
        d.setCustomColor(10);
        expect(d.customColor).toBe(d.color);
      });
      test(`setCustomColor({}) ignores params`, () => {
        d.setCustomColor({});
        expect(d.customColor).toBe(d.color);
      });
      test(`setCustomColor(true) ignores params`, () => {
        d.setCustomColor(true);
        expect(d.customColor).toBe(d.color);
      });
      test(`setCustomColor("abbcdeh") sets string`, () => {
        d.setCustomColor("abbcdeh");
        expect(d.customColor).toBe("abbcdeh");
      });
      test(`setCustomColor() resets color`, () => {
        d.setCustomColor();
        expect(d.customColor).toBe(d.color);
      });
      test(`setCustomColor(false) resets color`, () => {
        d.setCustomColor();
        expect(d.customColor).toBe(d.color);
      });

      test("getColor", () => {
        expect(d.getColor()).toBe(d.customColor);
      });
    });

    describe("includesFreigabetypenIds()", () => {
      const data = dienste[29];
      const d = new Dienst(data);
      test("True if same Ids", () => {
        expect(d.includesFreigabetypenIds(data.freigabetypen_ids)).toBe(true);
      });
      test("True if dienst.freigabetypen_ids in Freigabetypen-Ids", () => {
        expect(d.includesFreigabetypenIds([...data.freigabetypen_ids, 3000])).toBe(true);
      });
      test("False if dienst.freigabetypen_ids > Freigabetypen-Ids", () => {
        expect(d.includesFreigabetypenIds(data.freigabetypen_ids.slice(1))).toBe(false);
      });
      test("False if dienst.freigabetypen_ids not in Freigabetypen-Ids", () => {
        expect(d.includesFreigabetypenIds([30, 45, 60])).toBe(false);
      });
      test("False Freigabetypen-Ids is not Array", () => {
        expect(d.includesFreigabetypenIds(2)).toBe(false);
      });
      test("True if dienst.freigabetypen_ids is empty", () => {
        const data = dienste[30];
        const d = new Dienst(data);
        expect(d.includesFreigabetypenIds([30, 45, 60])).toBe(true);
      });
    });

    describe("addQualifizierteMitarbeiter() and resetAttributes()", () => {
      const data = dienste[29];
      const d = new Dienst(data);
      test("Add Mitarbeiter if dienst.freigabetypen_ids in Mitarbeiter-Freigabetypen_ids", () => {
        const arr = d.addQualifizierteMitarbeiter({id: 2, freigabetypen_ids: data.freigabetypen_ids});
        expect(arr).toContain(2);
        expect(arr).toHaveLength(1);
        const arr1 = d.addQualifizierteMitarbeiter({id: 3, freigabetypen_ids: data.freigabetypen_ids});
        expect(arr1).toContain(3);
        expect(arr1).toHaveLength(2);
      });
      test("Don't add Mitarbeiter multiple times", () => {
        expect(d.addQualifizierteMitarbeiter({id: 2, freigabetypen_ids: data.freigabetypen_ids})).toBe(false);
      });
      test("Don't add Mitarbeiter if dienst.freigabetypen_ids not in Mitarbeiter-Freigabetypen_ids", () => {
        expect(d.addQualifizierteMitarbeiter({id: 4, freigabetypen_ids: [30, 45, 60]})).toBe(false);
      });
      test("Add Mitarbeiter if dienst.freigabetypen_ids is empty", () => {
        const data = dienste[30];
        const d = new Dienst(data);
        const arr = d.addQualifizierteMitarbeiter({id: 5, freigabetypen_ids: [30, 45, 60]});
        expect(arr).toContain(5);
        expect(arr).toHaveLength(1);
      });
      test("resetAttributes()", () => {
        d.resetAttributes();
        expect(d.idsQualifizierterMitarbeiter).toEqual([]);
      });
    });

    describe("removeQualifizierteMitarbeiter()", () => {
      const data = dienste[29];
      const d = new Dienst(data);
      const mitarbeiter = [{
        id: 2,
        freigabetypen_ids: [30, 45, 60]
      }, {
        id: 3,
        freigabetypen_ids: data.freigabetypen_ids
      }];
      mitarbeiter.forEach(mitarbeiter => {
        d.idsQualifizierterMitarbeiter.push(mitarbeiter.id);
      });
      test("Remove Mitarbeiter if dienst.freigabetypen_ids not in Mitarbeiter-Freigabetypen_ids", () => {
        expect(d.idsQualifizierterMitarbeiter).toEqual([2, 3]);
        expect(d.removeQualifizierteMitarbeiter(mitarbeiter[0])).toEqual([3]);
        expect(d.removeQualifizierteMitarbeiter(mitarbeiter[1])).toBe(false);
      });
    });

    describe("getBedarfAm(), hasBedarfAm()", () => {
      const data = dienste[29];
      const d = new Dienst(data, appModel);
      test("getBedarfAm()", () => {
        expect(d.getBedarfAm("2023-08-05")).toEqual([
          appModel.page.data.bedarfseintraege[1],
          appModel.page.data.bedarfseintraege[2],
          appModel.page.data.bedarfseintraege[4]
        ]);
        expect(d.getBedarfAm("2023-08-10")).toEqual([]);
      });

      test("hasBedarfAm()", () => {
        expect(d.hasBedarfAm("2023-08-05")).toBe(true);
        expect(d.hasBedarfAm("2023-08-10")).toBe(false);
      });
    });

    test("hasThemaId()", () => {
      const data = dienste[29];
      const d = new Dienst(data);
      expect(d.hasThemaId(2)).toBe(true);
      expect(d.hasThemaId(46)).toBe(false);
    });
  })
});