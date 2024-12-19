import Dienstkategorie from "../../models/apimodels/dienstkategorie";
import Basic from "../../models/basic";
import { createAppModel, clearAppModelFromBasic } from "../mockdata/appmodel";

const dienstkategorien = {
  "1": {
      "id": 1,
      "name": "Test Name",
      "beschreibung": "Eine Beschreibung",
      "color": "#2c096e",
      "poppix_name": "TM",
      "selectable": true,
      "thema_ids": [1, 2]
  }
}

beforeAll(() => {
  clearAppModelFromBasic();
});

const appModel = createAppModel({
  data: {
    themen: {
      1: {},
      2: {}
    },
    po_dienste: {
      1: {
        id: 1
      },
      2: {
        id: 2
      }
    }
  }
});

describe("Whitebox testing", () => {
  describe("Instances", () => {
    test("Dienstkategorie is instanceof Dienstkategorie and Basic", () => {
      const d = new Dienstkategorie(dienstkategorien[1]);
      expect(d).toBeInstanceOf(Dienstkategorie);
      expect(d).toBeInstanceOf(Basic);
    });
  });

  describe("Dienstkategorie defines Propertys", () => {
    const data = dienstkategorien[1];
    const properties = [
      {key: "poppix_name", expectedValue: data.poppix_name},
      {key: "selectable", expectedValue: data.selectable},
      {key: "beschreibung", expectedValue: data.beschreibung},
      {key: "color", expectedValue: data.color},
      {key: "id", expectedValue: data.id},
      {key: "name", expectedValue: data.name},
      {key: "thema_ids", expectedValue: data.thema_ids},
      {key: "dienste_ids", expectedValue: [], arr: true},
      {key: "customColor", expectedValue: data.color}
    ];

    const d = new Dienstkategorie(data);
    properties.forEach(({key, expectedValue, arr}) => {
      test("sets "  + key, () => {
        if(arr){
          expect(d[key]).toEqual(expectedValue);
        } else {
          expect(d[key]).toBe(expectedValue);
        }
      });
    });
  });

  describe("Dienstkategorie Getter", () => {
    const data = dienstkategorien[1];
    const d = new Dienstkategorie(data, appModel);
    test("get initialien", () => {
      expect(d.initialien).toBe(d.poppix_name);
    })
    test("get themen", () => {
      expect(d.themen).toEqual(expect.arrayContaining(Object.values(appModel.data.themen)));
    })
    describe("setup and teardown", () => {
      beforeAll(() => {
        const dienste = Object.values(appModel.data.po_dienste);
        dienste.forEach(dienst => {
          d.dienste_ids.push(dienst.id);
        });
      });
      afterAll(() => {
        while(d.dienste_ids.length) {
          d.dienste_ids.pop();
        }
      });
      test("get dienste", () => {
        expect(d.dienste).toEqual(expect.arrayContaining(Object.values(appModel.data.po_dienste)));
      })
    })
  })

  describe("Dienstkategorie Methods", () => {
    const data = dienstkategorien[1];
    const d = new Dienstkategorie(data);
    test("setCustomColor", () => {
      d.setCustomColor(10);
      expect(d.customColor).toBe(d.color);
      d.setCustomColor({});
      expect(d.customColor).toBe(d.color);
      d.setCustomColor(true);
      expect(d.customColor).toBe(d.color);
      d.setCustomColor("abbcdeh");
      expect(d.customColor).toBe("abbcdeh");
      d.setCustomColor();
      expect(d.customColor).toBe(d.color);
    });

    test("getColor", () => {
      expect(d.getColor()).toBe(d.customColor);
    });
  });

  describe("includesThemaIds()", () => {
    const data = dienstkategorien[1];
    const d = new Dienstkategorie(data);
    test("includes", () => {
      expect(d.includesThemaIds([...data.thema_ids, 5, 6, 19, 2000])).toBe(true);
    });
    test("not includes", () => {
      expect(d.includesThemaIds([data.thema_ids[0]])).toBe(false);
      expect(d.includesThemaIds([data.thema_ids[0], 20, 80, 900])).toBe(false);
    });
  });

  describe("addDienst(), hasDienst() and resetAttributes()", () => {
    const data = dienstkategorien[1];
    const d = new Dienstkategorie(data);
    test("don't add", () => {
      expect(d.addDienst({
        id: 1,
        thema_ids: [data.thema_ids[0], 20, 80, 900]
      })).toEqual([]);
    });
    test("add", () => {
      expect(d.addDienst({
        id: 1,
        thema_ids: [...data.thema_ids, 5, 6, 19, 2000]
      })).toEqual([1]);
    });
    test("hasDienst()", () => {
      expect(d.hasDienst(1)).toBe(true);
      expect(d.hasDienst(2)).toBe(false);
    });
    test("resetAttributes()", () => {
      d.resetAttributes();
      expect(d.dienste_ids).toEqual([]);
    })
  });
});