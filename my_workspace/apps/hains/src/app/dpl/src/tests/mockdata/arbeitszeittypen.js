import Arbeitszeittyp from "../../models/apimodels/arbeitszeittyp";
import Basic from "../../models/basic";

const arbeitszeittypen = {
  "1": {
      "id": 1,
      "name": "Volldienst",
      "beschreibung": "Normale Arbeitszeit",
      "sys": true,
      "dienstzeit": true,
      "arbeitszeit": true,
      "count": false,
      "max": 0,
      "min": 0,
      "bereitschaft": false,
      "rufbereitschaft": false
  },
  "2": {
      "id": 2,
      "name": "BD",
      "beschreibung": "Breitschaftsdienst",
      "sys": true,
      "dienstzeit": true,
      "arbeitszeit": true,
      "count": true,
      "max": 7,
      "min": 4,
      "bereitschaft": true,
      "rufbereitschaft": false
  },
  "3": {
      "id": 3,
      "name": "Pause",
      "beschreibung": "Pausenzeit",
      "sys": true,
      "dienstzeit": true,
      "arbeitszeit": false,
      "count": false,
      "max": 0,
      "min": 0,
      "bereitschaft": false,
      "rufbereitschaft": false
  },
  "4": {
      "id": 4,
      "name": "Frei",
      "beschreibung": "Frei",
      "sys": true,
      "dienstzeit": false,
      "arbeitszeit": false,
      "count": false,
      "max": 0,
      "min": 0,
      "bereitschaft": false,
      "rufbereitschaft": false
  },
  "5": {
      "id": 5,
      "name": "Urlaub",
      "beschreibung": "Urlaubstag",
      "sys": true,
      "dienstzeit": false,
      "arbeitszeit": true,
      "count": false,
      "max": 0,
      "min": 0,
      "bereitschaft": false,
      "rufbereitschaft": false
  },
  "6": {
      "id": 6,
      "name": "Freizeitausgleich",
      "beschreibung": "Freizeitausgleich",
      "sys": true,
      "dienstzeit": false,
      "arbeitszeit": false,
      "count": false,
      "max": 0,
      "min": 0,
      "bereitschaft": false,
      "rufbereitschaft": false
  },
  "7": {
      "id": 7,
      "name": "Rufdienst",
      "beschreibung": "Rufdienst",
      "sys": false,
      "dienstzeit": true,
      "arbeitszeit": true,
      "count": true,
      "max": 0,
      "min": 0,
      "bereitschaft": false,
      "rufbereitschaft": true
  }
}

describe("Whitebox testing", () => {
  describe("Instances", () => {
    test("Arbeitszeittyp is instanceof Arbeitszeittyp and Basic", () => {
      const a = new Arbeitszeittyp(arbeitszeittypen[1]);
      expect(a).toBeInstanceOf(Arbeitszeittyp);
      expect(a).toBeInstanceOf(Basic);
    });
  });
  
  describe("Arbeitszeittyp defines Propertys", () => {
    const data = arbeitszeittypen[1];
    const properties = [
      {key: "arbeitszeit", expectedValue: data.arbeitszeit},
      {key: "beschreibung", expectedValue: data.beschreibung},
      {key: "count", expectedValue: data.count},
      {key: "dienstzeit", expectedValue: data.dienstzeit},
      {key: "id", expectedValue: data.id},
      {key: "max", expectedValue: data.max},
      {key: "min", expectedValue: data.min},
      {key: "name", expectedValue: data.name},
      {key: "bereitschaft", expectedValue: data.bereitschaft},
      {key: "rufbereitschaft", expectedValue: data.rufbereitschaft}
    ];
    const a = new Arbeitszeittyp(data);
    properties.forEach(({key, expectedValue}) => {
      test("sets "  + key, () => {
        expect(a[key]).toBe(expectedValue);
      });
    });
  });
  
  describe("Arbeitszeittyp Getter", () => {
    for(let id in arbeitszeittypen){
      const data = arbeitszeittypen[id];
      const a = new Arbeitszeittyp(data);
      test("isArbeitszeit", () => {
        expect(a.isArbeitszeit).toBe(data.arbeitszeit && data.dienstzeit);
      });
  
      test("isFrei", () => {
        expect(a.isFrei).toBe(!data.arbeitszeit && !data.dienstzeit);
      });
  
      test("_info", () => {
        expect(a._info).toEqual(expect.any(Object));
      });
    }
  });
})
