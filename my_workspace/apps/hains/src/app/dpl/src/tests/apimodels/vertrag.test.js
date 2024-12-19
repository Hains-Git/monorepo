import Vertrag from "../../models/apimodels/vertrag";
import Basic from "../../models/basic";
import { clearAppModelFromBasic, createAppModel } from "../mockdata/appmodel";

const vertraege = {
  "1": {
      "id": 2,
      "von": null,
      "bis": null,
      "teilzeit_anteil": null,
      "teilzeit_basis": null,
      "rolle": null,
      "mitarbeiter_id": 4,
      "created_at": "2022-03-18T10:02:05.310Z",
      "updated_at": "2022-03-18T10:02:05.310Z",
      "vertragstyp_id": 1,
      "anfang": "2019-05-01",
      "ende": "2022-09-30"
  },
  "2": {
      "id": 3,
      "von": null,
      "bis": null,
      "teilzeit_anteil": null,
      "teilzeit_basis": null,
      "rolle": null,
      "mitarbeiter_id": 455,
      "created_at": "2022-07-06T10:48:58.297Z",
      "updated_at": "2022-07-06T10:48:58.297Z",
      "vertragstyp_id": 1,
      "anfang": "2018-11-01",
      "ende": "2024-09-13"
  }
}

beforeAll(() => {
  clearAppModelFromBasic();
});

describe("Whitebox testing", () => {
  describe("Instances", () => {
    test("Vertrag is instanceof Vertrag and Basic", () => {
      const v = new Vertrag(vertraege[1]);
      expect(v).toBeInstanceOf(Vertrag);
      expect(v).toBeInstanceOf(Basic);
    });
  });

  describe("Vertrag defines Propertys", () => {
    const data = vertraege[1];
    const properties = [
      {key: "id", expectedValue: data.id},
      {key: "mitarbeiter_id", expectedValue: data.mitarbeiter_id},
      {key: "vertragstyp_id", expectedValue: data.vertragstyp_id},
      {key: "anfang", expectedValue: data.anfang},
      {key: "ende", expectedValue: data.ende}
    ];
    const v = new Vertrag(data);
    properties.forEach(({key, expectedValue}) => {
      test(`sets ${key}`, () => {
        expect(v[key]).toBe(expectedValue);
      });
    });
  });

  describe("Vertrag Getter undefined appModel", () => {
    const v = new Vertrag(vertraege[1]);
    const properties = [
      {key: "mitarbeiter", expectedValue: false}
    ];

    properties.forEach(({key, expectedValue}) => {
      test(`get ${key}`, () => {
        expect(v[key]).toBe(expectedValue);
      })
    });
  })

  describe("Vertrag Getter defined appModel", () => {
    const appModel = createAppModel({
      data: {
        mitarbeiters: {
          4: {}
        }
      },
      page: {
        data: {
          mitarbeiter: {
            4: {}
          }
        }
      }
    });
    const v = new Vertrag(vertraege[1], appModel);
    const pagedata = appModel.page.data;
    const properties = [
      {key: "mitarbeiter", expectedValue: appModel.page.data.mitarbeiter[v.mitarbeiter_id]},
      {key: "anfangZahl", expectedValue: 20190501},
      {key: "endeZahl", expectedValue: 20220930}
    ];

    properties.forEach(({key, expectedValue}) => {
      test(`get ${  key}`, () => {
        expect(v[key]).toBe(expectedValue);
      })
    });

    test("get _info", () => {
      expect(v._info).toEqual(expect.any(Object));
    });
  })

  describe("Vertrag ohne anfang und ende", () => {
    const v = new Vertrag({});
    test("get anfangZahl = 0", () => {
      expect(v.anfangZahl).toBe(0);
    });

    const today = new Date();
    const expectedValue = parseInt(today.toISOString().split("T")[0].split("-").join(""), 10) + 10000;
    test(`get endeZahl > ${  expectedValue}`, () => {
      expect(v.endeZahl).toBeGreaterThanOrEqual(expectedValue);
    });
  })
});