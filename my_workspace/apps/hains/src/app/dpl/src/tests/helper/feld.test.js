import Basic from "../../models/basic";
import Feld from "../../models/helper/feld";
import { clearAppModelFromBasic, createAppModel } from "../mockdata/appmodel";

const felder = [
  {
    tag: "2022-06-01",
    dienstId: 1,
    bedarfeintragId: 1,
    bereichId: 1,
    einteilungId: 1,
    schichtnr: "0",
    value: 1
  },
  {
    tag: "2022-06-01",
    dienstId: 2,
    bedarfeintragId: 0,
    bereichId: 0,
    einteilungId: 0,
    schichtnr: "0",
    value: ""
  }
];

beforeAll(() => {
  clearAppModelFromBasic();
})

describe("Whitebox testing", () => {
  describe("Instances", () => {
    test("Feld is instanceof Feld and Basic", () => {
      const f = new Feld();
      expect(f).toBeInstanceOf(Feld);
      expect(f).toBeInstanceOf(Basic);
    });
  });

  describe("Feld defines Propertys", () => {
    const data = felder[0];
    const properties = [
      {key: "tag", expectedValue: data.tag},
      {key: "bedarfeintragId", expectedValue: data.bedarfeintragId},
      {key: "bereichId", expectedValue: data.bereichId},
      {key: "einteilungId", expectedValue: data.einteilungId},
      {key: "schichtnr", expectedValue: data.schichtnr},
      {key: "dienstId", expectedValue: data.dienstId}
    ];
    const f = new Feld(data);
    properties.forEach(({key, expectedValue, obj}) => {
      test("sets "  + key, () => {
        if(obj){
          expect(f[key]).toEqual(expectedValue);
        } else {
          expect(f[key]).toBe(expectedValue);
        }
      });
    });
  });

  describe("Getter undefined AppModel", () => {
    const data = felder[0];
    const properties = [
      {key: "dienst", expectedValue: false},
      {key: "bereich", expectedValue: false},
      {key: "bedarf", expectedValue: false},
      {key: "date", expectedValue: false},
      {key: "tagZahl", expectedValue: 20220601},
      {key: "einteilung", expectedValue: false},
      {key: "mitarbeiter", expectedValue: false},
      {key: "isBlock", expectedValue: false},
      {key: "empty", expectedValue: true}
    ];
    const f = new Feld(data);
    properties.forEach(({key, expectedValue, obj}) => {
      test("get "  + key, () => {
        if (obj) {
          expect(f[key]).toEqual(expectedValue);
        } else {
          expect(f[key]).toBe(expectedValue);
        }
      });
    });
  });

  describe("Defined AppModel", () => {
    const appModel = createAppModel({
      data: {
        po_dienste: {
          1: {
            id: 1,
            planname: "d1"
          }
        },
        bereiche: {
          1: {}
        },
        mitarbeiters: {
          1: {
            id: 1,
            planname: "m1"
          }
        }
      },
      page: {
        data: {
          dienste: {
            1: {
              id: 1,
              planname: "d1"
            }
          },
          einteilungen: {
            1: {
              id: 1,
              show: true,
              mitarbeiter_id: 1,
              add: jest.fn(),
              removeFromMitarbeiter: jest.fn()
            }
          },
          dates: {
            "2022-06-01": {
              label: "01. Jun 22"
            }
          },
          bedarfseintraege: {
            1: {
              id: 1,
              is_block: true
            }
          },
          mitarbeiter: {
            1: {
              id: 1,
              planname: "pm1"
            }
          }
        }
      }
    });
    const data = felder[0];
    const f = new Feld(data, appModel);
    const einteilung = appModel.page.data.einteilungen[1];
    const mitarbeiter = appModel.page.data.mitarbeiter[1];
    const date = appModel.page.data.dates["2022-06-01"];
    const dienst = appModel.page.data.dienste[1];
    describe("Getter", () => {
      const properties = [
        {key: "dienst", expectedValue:dienst},
        {key: "bereich", expectedValue: appModel.data.bereiche[1]},
        {key: "bedarf", expectedValue: appModel.page.data.bedarfseintraege[1]},
        {key: "date", expectedValue: date},
        {key: "einteilung", expectedValue: einteilung},
        {key: "mitarbeiter", expectedValue: mitarbeiter},
        {key: "isBlock", expectedValue: true},
        {key: "empty", expectedValue: false}
      ];
      properties.forEach(({key, expectedValue}) => {
        test("get "  + key, () => {
          expect(f[key]).toBe(expectedValue);
        });
      });
    });
    describe("Methods", () => {
      test("removeFromMitarbeiter()", () => {
        f.removeFromMitarbeiter();
        expect(einteilung.removeFromMitarbeiter).toHaveBeenCalledWith(f);
      });
      test("getValue()", () => {
        expect(f.getValue("mitarbeiter")).toBe(mitarbeiter.planname);
        expect(f.getValue("dienst")).toBe(dienst.planname);
        expect(f.getValue("tag")).toBe(date.label);
        expect(f.getValue("something")).toBe(f.value);
      });
      test("isSame", () => {
        expect(f.isSame(f.tag, f.dienstId, f.bereichId, f.schichtnr)).toBe(true);
        expect(f.isSame(f.tag, f.dienstId, 0, f.schichtnr)).toBe(true);
        expect(f.isSame(f.tag, f.dienstId, f.bereichId, 0)).toBe(true);
        expect(f.isSame(f.tag, f.dienstId+1, f.bereichId, f.schichtnr)).toBe(false);
      });
      test("isSame", () => {
        expect(f.isSame(f.tag, f.dienstId, f.bereichId, f.schichtnr)).toBe(true);
        expect(f.isSame(f.tag, f.dienstId, 0, f.schichtnr)).toBe(true);
        expect(f.isSame(f.tag, f.dienstId, f.bereichId, 0)).toBe(true);
        expect(f.isSame(f.tag, f.dienstId+1, f.bereichId, f.schichtnr)).toBe(false);
      });
    });
  });
});