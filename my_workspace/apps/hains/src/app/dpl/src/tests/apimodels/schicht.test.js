import Schicht from "../../models/apimodels/schicht";
import Basic from "../../models/basic";
import { clearAppModelFromBasic, createAppModel } from "../mockdata/appmodel";

const schichten = {
  "300255": [
      {
          "id": 1041136,
          "bedarfs_eintrag_id": 300255,
          "anfang": "2022-06-22T13:30:00.000Z",
          "ende": "2022-06-22T17:30:00.000Z",
          "arbeitszeittyp_id": 1,
          "schicht_nummer": 1,
          "arbeitszeit": 240,
          "created_at": "2022-05-11T13:12:45.289Z",
          "updated_at": "2022-05-11T13:12:45.289Z"
      }
  ]
}

beforeAll(() => {
  clearAppModelFromBasic();
});

describe("Whitebox testing", () => {
  describe("Instances", () => {
    test("Schicht is instanceof Schicht and Basic", () => {
      const s = new Schicht(schichten[300255][0]);
      expect(s).toBeInstanceOf(Schicht);
      expect(s).toBeInstanceOf(Basic);
    });
  });

  describe("Schicht defines Propertys", () => {
    const data = schichten[300255][0];
    const properties = [
      {key: "anfang", expectedValue: data.anfang},
      {key: "arbeitszeit", expectedValue: data.arbeitszeit},
      {key: "arbeitszeittyp_id", expectedValue: data.arbeitszeittyp_id},
      {key: "bedarfs_eintrag_id", expectedValue: data.bedarfs_eintrag_id},
      {key: "ende", expectedValue: data.ende},
      {key: "schicht_nummer", expectedValue: data.schicht_nummer},
      {key: "id", expectedValue: data.id},
      {key: "ausgleich", expectedValue: false}
    ];
    const s = new Schicht(data);
    properties.forEach(({key, expectedValue}) => {
      test("sets "  + key, () => {
        expect(s[key]).toBe(expectedValue);
      });
    });
  });

  describe("Schicht Getter undefined appModel", () => {
    const s = new Schicht(schichten[300255][0]);
    const properties = [
      {key: "bedarfsEintrag", expectedValue: false},
      {key: "arbeitszeittyp", expectedValue: false},
      {key: "isFrei", expectedValue: true},
      {key: "isArbeit", expectedValue: false},
      {key: "isRufdienst", expectedValue: false},
      {key: "isBereitschaftsdienst", expectedValue: false},
      {key: "typ", expectedValue: s.arbeitszeittyp_id},
      {key: "dienstId", expectedValue: 0},
      {key: "dienstName", expectedValue: "Unbekannt"},
      {key: "dienst", expectedValue: false},
      {key: "startBedarf", expectedValue: false}
    ];

    properties.forEach(({key, expectedValue, obj}) => {
      test("get " + key, () => {
        if(obj){
          expect(s[key]).toEqual(expectedValue);
        } else {
          expect(s[key]).toBe(expectedValue);
        }
      })
    });
  })

  describe("Schicht Getter defined appModel", () => {
    const appModel = createAppModel({
      data: {
        arbeitszeittypen: {
          1: {
            isFrei: false,
            isArbeitszeit: true,
            rufbereitschaft: true,
            bereitschaft: false,
            name: "Test Typ",
            _info: {}
          },
        },
        po_dienste: {
          38: {
            planname: "Test PO Dienst 1"
          }
        }
      },
      page: {
        data: {
          bedarfseintraege: {
            300255: {
              po_dienst_id: 38,
              startBedarfsEintrag: {}
            }
          },
          dienste: {
            38: {
              planname: "Test PO Dienst 1"
            }
          }
        }
      }
    });

    const s = new Schicht(schichten[300255][0], appModel);
    const pagedata = appModel.page.data;
    const typ = appModel.data.arbeitszeittypen[s.arbeitszeittyp_id];
    const bedarf = pagedata.bedarfseintraege[s.bedarfs_eintrag_id];
    const properties = [
      {key: "bedarfsEintrag", expectedValue: bedarf},
      {key: "arbeitszeittyp", expectedValue: typ},
      {key: "isFrei", expectedValue: typ.isFrei},
      {key: "isArbeit", expectedValue: typ.isArbeitszeit},
      {key: "isRufdienst", expectedValue: typ.rufbereitschaft},
      {key: "isBereitschaftsdienst", expectedValue: typ.bereitschaft},
      {key: "typ", expectedValue: typ.name},
      {key: "dienstId", expectedValue: bedarf.po_dienst_id},
      {key: "dienstName", expectedValue: appModel.data.po_dienste[bedarf.po_dienst_id].planname},
      {key: "dienst", expectedValue: pagedata.dienste[bedarf.po_dienst_id]},
      {key: "startBedarf", expectedValue: bedarf.startBedarfsEintrag}
    ];

    properties.forEach(({key, expectedValue}) => {
      test("get " + key, () => {
        expect(s[key]).toBe(expectedValue);
      })
    });

    test("get _info", () => {
      expect(s._info).toEqual(expect.any(Object));
    })

    const localDate = new Date("2022-06-22").toLocaleDateString();
    test("get _anfang", () => {
      expect(s._anfang).toEqual({
        local: localDate, 
        time: "13:30 Uhr", 
        date: "2022-06-22", 
        timenr: 133000, 
        datenr: 20220622,
        fullLocal: `${localDate} 13:30`,
        fullnr: 20220622133000,
        fullStr: "2022-06-22T13:30:00.000Z"
      });
    })

    test("get _ende", () => {
      expect(s._ende).toEqual({
        local: localDate, 
        time: "17:30 Uhr", 
        date: "2022-06-22", 
        timenr: 173000, 
        datenr: 20220622,
        fullnr: 20220622173000,
        fullLocal: `${localDate} 17:30`,
        fullStr: "2022-06-22T17:30:00.000Z"
      });
    })
  })
});