import Dienstgruppe from "../../models/apimodels/dienstgruppe";
import Basic from "../../models/basic";
import { clearAppModelFromBasic, createAppModel } from "../mockdata/appmodel";

const dienstgruppen = {
  "1": {
      "id": 1,
      "name": "Test Gruppe",
      "dienste": [
        38,
        32,
        40
      ]
  }
}

beforeAll(() => {
  clearAppModelFromBasic();
});

const appModel = createAppModel({
  page: {
    data: {
      dienste: {
        38: {
          planname: "Test 1"
        },
        32: {
          planname: "Test 2"
        },
        40: {
          planname: "Test 3"
        }
      }
    }
  }
});

describe("Whitebox testing", () => {
  describe("Instances", () => {
    test("Dienstgruppe is instanceof Dienst and Basic", () => {
      const d = new Dienstgruppe(dienstgruppen[1]);
      expect(d).toBeInstanceOf(Dienstgruppe);
      expect(d).toBeInstanceOf(Basic);
    });
  });

  describe("Dienstgruppe defines Propertys", () => {
    const data = dienstgruppen[1];
    const properties = [
      {key: "id", expectedValue: data.id},
      {key: "name", expectedValue: data.name},
      {key: "diensteIds", expectedValue: data.dienste}
    ];

    const d = new Dienstgruppe(data);
    properties.forEach(({key, expectedValue}) => {
      test("sets "  + key, () => {
        expect(d[key]).toBe(expectedValue);
      });
    });
  });

  describe("Dienstgruppe Getter", () => {
    const data = dienstgruppen[1];
    const d = new Dienstgruppe(data, appModel);
    test("Get dienste", () => {
      const dienste = appModel.page.data.dienste;
      expect(d.dienste).toEqual(expect.arrayContaining(Object.values(dienste)));
    })

    test("Get diensteNamen", () => {
      const dienste = appModel.page.data.dienste;
      expect(d.diensteNamen).toEqual(expect.arrayContaining([
        dienste[32].planname, dienste[38].planname, dienste[40].planname
      ]));
    })
  })

  describe("Dienstgruppe Methods", () => {
    const data = dienstgruppen[1];
    const d = new Dienstgruppe(data);
    test("includesDienst", () => {
      expect(d.includesDienst(10)).toBe(false);
      expect(d.includesDienst(() => {})).toBe(false);
      expect(d.includesDienst([15])).toBe(false);
      expect(d.includesDienst(32)).toBe(true);
      expect(d.includesDienst("32")).toBe(true);
    });
  })
});