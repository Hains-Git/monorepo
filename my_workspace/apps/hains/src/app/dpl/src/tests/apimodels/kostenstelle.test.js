import Kostenstelle from "../../models/apimodels/kostenstelle";
import Basic from "../../models/basic";

const kostenstellen = {
  "1": {
      "id": 1,
      "name": "Test Stelle",
      "nummer": "Test Stelle"
  }
}

describe("Whitebox testing", () => {
  describe("Instances", () => {
    test("Kostenstelle is instanceof Kostenstelle and Basic", () => {
      const k = new Kostenstelle(kostenstellen[1]);
      expect(k).toBeInstanceOf(Kostenstelle);
      expect(k).toBeInstanceOf(Basic);
    });
  });

  describe("Kontingent defines Propertys", () => {
    const data = kostenstellen[1];
    const properties = [
      {key: "id", expectedValue: data.id},
      {key: "name", expectedValue: data.name},
      {key: "nummer", expectedValue: data.nummer}
    ];
    const k = new Kostenstelle(data);
    properties.forEach(({key, expectedValue}) => {
      test("sets "  + key, () => {
        expect(k[key]).toBe(expectedValue);
      });
    });
  });
});