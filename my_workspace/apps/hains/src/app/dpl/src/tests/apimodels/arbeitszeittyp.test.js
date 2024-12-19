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

describe("Arbeitszeittyp", () => {
  const a = new Arbeitszeittyp(arbeitszeittypen[1]);
  test("Instanceof Arbeitszeittyp and Basic", () => {
    expect(a).toBeInstanceOf(Arbeitszeittyp);
    expect(a).toBeInstanceOf(Basic);
  });
  
  describe("Getter isArbeitszeit and isFrei", () => {
    for(let id in arbeitszeittypen){
      const data = arbeitszeittypen[id];
      const a = new Arbeitszeittyp(data);
      test("isArbeitszeit", () => {
        expect(a.isArbeitszeit).toBe(data.arbeitszeit && data.dienstzeit);
      });
  
      test("isFrei", () => {
        expect(a.isFrei).toBe(!data.arbeitszeit && !data.dienstzeit);
      });
    }
  });
})
