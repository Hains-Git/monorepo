import Vertragsphase from "../../models/apimodels/vertragsphase";
import Basic from "../../models/basic";
import { clearAppModelFromBasic, createAppModel } from "../mockdata/appmodel";

const vertragsphasen = {
  "1": {
      "id": 1,
      "vertrag_id": 2,
      "vertragsstufe_id": 1,
      "von": "2019-05-01",
      "bis": "2022-09-30",
      "created_at": "2022-03-18T10:03:42.829Z",
      "updated_at": "2022-03-18T10:03:42.829Z"
  }
}

beforeAll(() => {
  clearAppModelFromBasic();
});

describe("Whitebox testing", () => {
  describe("Instances", () => {
    test("Vertragsphase is instanceof Vertragsphase and Basic", () => {
      const v = new Vertragsphase(vertragsphasen[1]);
      expect(v).toBeInstanceOf(Vertragsphase);
      expect(v).toBeInstanceOf(Basic);
    });
  });

  describe("Vertragsphase defines Propertys", () => {
    const data = vertragsphasen[1];
    const properties = [
      {key: "id", expectedValue: data.id},
      {key: "vertrag_id", expectedValue: data.vertrag_id},
      {key: "vertragsstufe_id", expectedValue: data.vertragsstufe_id},
      {key: "von", expectedValue: data.von},
      {key: "bis", expectedValue: data.bis}
    ];
    const v = new Vertragsphase(data);
    properties.forEach(({key, expectedValue}) => {
      test(`sets ${key}`, () => {
        expect(v[key]).toBe(expectedValue);
      });
    });
  });

  describe("Vertragsphase Getter undefined appModel", () => {
    const v = new Vertragsphase(vertragsphasen[1]);
    const properties = [
      {key: "vertrag", expectedValue: false}
    ];

    properties.forEach(({key, expectedValue}) => {
      test(`get ${key}`, () => {
        expect(v[key]).toBe(expectedValue);
      })
    });
  })

  describe("Vertragsphase Getter defined appModel", () => {
    const appModel = createAppModel({
      data: {
        vertraege: {
          2: {}
        }
      }
    });

    const v = new Vertragsphase(vertragsphasen[1], appModel);
    const properties = [
      {key: "vertrag", expectedValue: appModel.data.vertraege[v.vertrag_id]},
      {key: "bisZahl", expectedValue: 20220930},
      {key: "vonZahl", expectedValue: 20190501}
    ];

    properties.forEach(({key, expectedValue}) => {
      test(`get ${key}`, () => {
        expect(v[key]).toBe(expectedValue);
      })
    });

    test("get _info", () => {
      expect(v._info).toEqual(expect.any(Object));
    });
  })

  describe("Vertragsphase ohne von und bis", () => {
    const v = new Vertragsphase({});
    test("get vonZahl = 0", () => {
      expect(v.vonZahl).toBe(0);
    });

    const today = new Date();
    const expectedValue = parseInt(today.toISOString().split("T")[0].split("-").join(""), 10) + 10000;
    test(`get bisZahl > ${  expectedValue}`, () => {
      expect(v.bisZahl).toBeGreaterThanOrEqual(expectedValue);
    });
  })
});