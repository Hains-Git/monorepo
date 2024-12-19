import Einteilungskontext from "../../models/apimodels/einteilungskontext";
import Basic from "../../models/basic";

const einteilungskontexte = {
  "1": {
      "id": 1,
      "name": "Test Kontext",
      "beschreibung": "Eine Beschreibung",
      "color": "#5a69ed"
  }
}

describe("Whitebox testing", () => {
  describe("Instances", () => {
    test("Einteilungskontext is instanceof Einteilungskontext and Basic", () => {
      const e = new Einteilungskontext(einteilungskontexte[1]);
      expect(e).toBeInstanceOf(Einteilungskontext);
      expect(e).toBeInstanceOf(Basic);
    });
  });

  describe("Einteilungskontext defines Propertys", () => {
    const data = einteilungskontexte[1];
    const properties = [
      {key: "color", expectedValue: data.color},
      {key: "beschreibung", expectedValue: data.beschreibung},
      {key: "id", expectedValue: data.id},
      {key: "name", expectedValue: data.name}
    ];

    const e = new Einteilungskontext(data);
    properties.forEach(({key, expectedValue}) => {
      test("sets "  + key, () => {
        expect(e[key]).toBe(expectedValue);
      });
    });
  });
});