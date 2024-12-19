import Dienstverteilung from "../../models/apimodels/dienstverteilung";
import Basic from "../../models/basic";

const dienstverteilungstypen = {
  "1": {
      "id": 1,
      "name": "Test Typ",
      "beschreibung": "Eine Beschreibung",
      "sys": true
  }
}

describe("Whitebox testing", () => {
  describe("Instances", () => {
    test("Dienstverteilung is instanceof Dienstverteilung and Basic", () => {
      const d = new Dienstverteilung(dienstverteilungstypen[1]);
      expect(d).toBeInstanceOf(Dienstverteilung);
      expect(d).toBeInstanceOf(Basic);
    });
  });

  describe("Dienstverteilung defines Propertys", () => {
    const data = dienstverteilungstypen[1];
    const properties = [
      {key: "beschreibung", expectedValue: data.beschreibung},
      {key: "sys", expectedValue: data.sys},
      {key: "id", expectedValue: data.id},
      {key: "name", expectedValue: data.name}
    ];

    const d = new Dienstverteilung(data);
    properties.forEach(({key, expectedValue}) => {
      test("sets "  + key, () => {
        expect(d[key]).toBe(expectedValue);
      });
    });
  });

  describe("Dienstverteilung Getter", () => {
    const data = dienstverteilungstypen[1];
    const d = new Dienstverteilung(data);
  
    test("get _info", () => {
      expect(d._info).toEqual(expect.any(Object));
    })
  });
});