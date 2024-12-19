import Einteilungsstatus from "../../models/apimodels/einteilungsstatus";
import Basic from "../../models/basic";

const einteilungsstatuse = {
  "1": {
      "id": 1,
      "name": "Test Status",
      "color": "#4B0082",
      "public": true,
      "counts": true,
      "sys": true,
      "waehlbar": true,
      "vorschlag": false
  }
}

describe("Whitebox testing", () => {
  describe("Instances", () => {
    test("Einteilungsstatus is instanceof Einteilungsstatus and Basic", () => {
      const e = new Einteilungsstatus(einteilungsstatuse[1]);
      expect(e).toBeInstanceOf(Einteilungsstatus);
      expect(e).toBeInstanceOf(Basic);
    });
  });

  describe("Einteilungsstatus defines Propertys", () => {
    const data = einteilungsstatuse[1];
    const properties = [
      {key: "color", expectedValue: data.color},
      {key: "public", expectedValue: data.public},
      {key: "id", expectedValue: data.id},
      {key: "name", expectedValue: data.name},
      {key: "counts", expectedValue: data.counts},
      {key: "sys", expectedValue: data.sys},
      {key: "waehlbar", expectedValue: data.waehlbar},
      {key: "vorschlag", expectedValue: data.vorschlag}
    ];

    const e = new Einteilungsstatus(data);
    properties.forEach(({key, expectedValue}) => {
      test("sets "  + key, () => {
        expect(e[key]).toBe(expectedValue);
      });
    });
  });
});