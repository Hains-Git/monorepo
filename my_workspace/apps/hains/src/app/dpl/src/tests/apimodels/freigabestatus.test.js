import Freigabestatus from "../../models/apimodels/freigabestatus";
import Basic from "../../models/basic";

const freigabestatuse = {
  "1": {
      "id": 1,
      "name": "nicht erteilt",
      "counts_active": false,
      "sys": true,
      "color": "#ff2600",
      "beschreibung": "Eine Beschreibung",
      "qualifiziert": false
  },
  "2": {
      "id": 2,
      "name": "erteilt",
      "counts_active": true,
      "sys": true,
      "color": "#96d35f",
      "beschreibung": "Eine Beschreibung",
      "qualifiziert": true
  }
}

describe("Whitebox testing", () => {
  describe("Instances", () => {
    test("Freigabestatus is instanceof Freigabestatus and Basic", () => {
      const f = new Freigabestatus(freigabestatuse[1]);
      expect(f).toBeInstanceOf(Freigabestatus);
      expect(f).toBeInstanceOf(Basic);
    });
  });

  describe("Freigabestatus defines Propertys", () => {
    const data = freigabestatuse[1];
    const properties = [
      {key: "color", expectedValue: data.color},
      {key: "beschreibung", expectedValue: data.beschreibung},
      {key: "counts_active", expectedValue: data.counts_active},
      {key: "id", expectedValue: data.id},
      {key: "qualifiziert", expectedValue: data.qualifiziert},
      {key: "sys", expectedValue: data.sys},
      {key: "name", expectedValue: data.name}
    ];
    const f = new Freigabestatus(data);
    properties.forEach(({key, expectedValue}) => {
      test("sets "  + key, () => {
        expect(f[key]).toBe(expectedValue);
      });
    });
  });

  describe("Freigabestatus Getter", () => {
    const f1 = new Freigabestatus(freigabestatuse[1]);
    const f2 = new Freigabestatus(freigabestatuse[2]);
    test("get erteilt", () => {
      expect(f1.erteilt).toBe(f1.counts_active);
    });

    test("get erteilt", () => {
      expect(f2.erteilt).toBe(f2.counts_active);
    });
  })
});