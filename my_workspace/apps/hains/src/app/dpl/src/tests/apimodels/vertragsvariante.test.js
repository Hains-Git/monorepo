import Vertragsvariante from "../../models/apimodels/vertragsvariante";
import Basic from "../../models/basic";

const vertragsvarianten = {
  "1": {
      "id": 1,
      "von": "2022-01-01",
      "bis": "2023-01-01",
      "vertragstyp_id": 1,
      "name": "Update 17.3.2022",
      "wochenstunden": 42,
      "tage_monat": 2.5,
      "created_at": "2022-03-17T20:22:16.144Z",
      "updated_at": "2022-03-17T20:22:16.144Z"
  }
}

describe("Whitebox testing", () => {
  describe("Instances", () => {
    test("Vertragsvariante is instanceof Vertragsvariante and Basic", () => {
      const v = new Vertragsvariante(vertragsvarianten[1]);
      expect(v).toBeInstanceOf(Vertragsvariante);
      expect(v).toBeInstanceOf(Basic);
    });
  });

  describe("Vertragsvariante defines Propertys", () => {
    const data = vertragsvarianten[1];
    const properties = [
      {key: "id", expectedValue: data.id},
      {key: "vertragstyp_id", expectedValue: data.vertragstyp_id},
      {key: "name", expectedValue: data.name},
      {key: "wochenstunden", expectedValue: data.wochenstunden},
      {key: "tage_monat", expectedValue: data.tage_monat},
      {key: "von", expectedValue: data.von},
      {key: "bis", expectedValue: data.bis}
    ];
    const v = new Vertragsvariante(data);
    properties.forEach(({key, expectedValue}) => {
      test(`sets ${key}`, () => {
        expect(v[key]).toBe(expectedValue);
      });
    });
  });

  describe("Vertragsvariante Getter", () => {
    const v = new Vertragsvariante(vertragsvarianten[1]);
    const properties = [
      {key: "bisZahl", expectedValue: 20230101},
      {key: "vonZahl", expectedValue: 20220101}
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

  describe("Vertragsvariante ohne von und bis", () => {
    const v = new Vertragsvariante({});
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