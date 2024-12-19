import Freigabetyp from "../../models/apimodels/freigabetyp";
import Basic from "../../models/basic";

const freigabetypen = {
  "2": {
      "id": 2,
      "name": "Test Typ",
      "planname": "TT",
      "beschreibung": "Ein Freigabetyp",
      "sort": 1
  }
}

describe("Whitebox testing", () => {
  describe("Instances", () => {
    test("Freigabetyp is instanceof Freigabestatus and Basic", () => {
      const f = new Freigabetyp(freigabetypen[2]);
      expect(f).toBeInstanceOf(Freigabetyp);
      expect(f).toBeInstanceOf(Basic);
    });
  });

  describe("Freigabetyp defines Propertys", () => {
    const data = freigabetypen[2];
    const properties = [
      {key: "planname", expectedValue: data.planname},
      {key: "beschreibung", expectedValue: data.beschreibung},
      {key: "sort", expectedValue: data.sort},
      {key: "name", expectedValue: data.name},
      {key: "id", expectedValue: data.id}
    ];
    const f = new Freigabetyp(data);
    properties.forEach(({key, expectedValue, obj}) => {
      test("sets "  + key, () => {
        if(obj) {
          expect(f[key]).toEqual(expectedValue);
        } else {
          expect(f[key]).toBe(expectedValue);
        }
      });
    });
  });
});