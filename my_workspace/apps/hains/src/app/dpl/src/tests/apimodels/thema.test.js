import Thema from "../../models/apimodels/thema";
import Basic from "../../models/basic";

const themen = {
  "1": {
      "id": 1,
      "name": "Test",
      "beschreibung": "Eine Beschreibung",
      "color": "#000000",
      "created_at": "2020-11-27T17:21:20.506Z",
      "updated_at": "2022-02-14T11:28:55.465Z"
  }
}

describe("Whitebox testing", () => {
  describe("Instances", () => {
    test("Thema is instanceof Thema and Basic", () => {
      const t = new Thema(themen[1]);
      expect(t).toBeInstanceOf(Thema);
      expect(t).toBeInstanceOf(Basic);
    });
  });

  describe("Thema defines Propertys", () => {
    const data = themen[1];
    const properties = [
      {key: "id", expectedValue: data.id},
      {key: "name", expectedValue: data.name},
      {key: "color", expectedValue: data.color},
      {key: "beschreibung", expectedValue: data.beschreibung}
    ];
    const t = new Thema(data);
    properties.forEach(({key, expectedValue}) => {
      test("sets "  + key, () => {
        expect(t[key]).toBe(expectedValue);
      });
    });
  });
});