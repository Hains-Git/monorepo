import PlanerDate from "../../models/apimodels/planerdate";
import Basic from "../../models/basic";
import { clearAppModelFromBasic, createAppModel } from "../mockdata/appmodel";

const dates = {
  "2022-06-22": {
      "einteilungen": [],
      "rotationen": [],
      "wuensche": [],
      "bedarf": [],
      "bedarfseintraege": [],
      "zeitraumkategorien": [],
      "by_dienst": {},
      "by_mitarbeiter": {},
      "week_counter": 0,
      "week_day": "Mi",
      "local_date_string": "22.06.2022",
      "id": "2022-06-22",
      "month_nr": 6,
      "month": "Jun",
      "is_weekend": false,
      "weekend": "",
      "full_date": "2022-06-22",
      "week_day_nr": 3,
      "week": 25,
      "day_of_year": 173,
      "feiertag": "",
      "label": "Mi 22. Jun",
      "day": 22,
      "year": 2022,
      "date_id": "2022-06-22",
      "celebrate": "",
      "last_week": 52
  },
  "2022-12-24": {
    "einteilungen": [],
    "rotationen": [],
    "wuensche": [],
    "bedarf": [],
    "bedarfseintraege": [],
    "zeitraumkategorien": [],
    "by_dienst": {},
    "by_mitarbeiter": {},
    "week_counter": 4,
    "week_day": "Sa",
    "local_date_string": "24.12.2022",
    "id": "2022-12-24",
    "month_nr": 12,
    "month": "Dez",
    "is_weekend": true,
    "weekend": "wochenende",
    "full_date": "2022-12-24",
    "week_day_nr": 6,
    "week": 51,
    "day_of_year": 358,
    "feiertag": {
        "name": "Heiligabend",
        "day": 24,
        "month": 12,
        "full_date": "2022-12-24"
    },
    "label": "Sa 24. Dez",
    "day": 24,
    "year": 2022,
    "date_id": "2022-12-24",
    "celebrate": "feiertag",
    "last_week": 52
  }
}

beforeAll(() => {
  clearAppModelFromBasic();
});

const dateIds = ["2022-06-22", "2022-12-24"];
const datesArr = [dates[dateIds[0]], dates[dateIds[1]]];
const dateIdsLength = dateIds.length;

describe("Whitebox testing", () => {
  describe("Instances", () => {
    test("Dateclass is instanceof Dateclass and Basic", () => {
      const d = new PlanerDate(datesArr[0]);
      expect(d).toBeInstanceOf(PlanerDate);
      expect(d).toBeInstanceOf(Basic);
    });
  });

  describe("Dateclass defines Propertys", () => {
    const data = datesArr[0];
    const properties = [
      {key: "bedarfeIds", expectedValue: data.bedarf},
      {key: "bedarfseintraegeIds", expectedValue: data.bedarfseintraege},
      {key: "by_dienst", expectedValue: data.by_dienst},
      {key: "by_mitarbeiter", expectedValue: data.by_mitarbeiter},
      {key: "celebrate", expectedValue: data.celebrate},
      {key: "id", expectedValue: data.id},
      {key: "date_id", expectedValue: data.date_id},
      {key: "day", expectedValue: data.day},
      {key: "day_of_year", expectedValue: data.day_of_year},
      {key: "einteilungen", expectedValue: data.einteilungen},
      {key: "feiertag", expectedValue: false},
      {key: "full_date", expectedValue: data.full_date},
      {key: "is_weekend", expectedValue: data.is_weekend},
      {key: "label", expectedValue: data.label},
      {key: "last_week", expectedValue: data.last_week},
      {key: "local_date_string", expectedValue: data.local_date_string},
      {key: "month", expectedValue: data.month},
      {key: "month_nr", expectedValue: data.month_nr},
      {key: "rotationenIds", expectedValue: data.rotationen},
      {key: "week", expectedValue: data.week},
      {key: "week_counter", expectedValue: data.week_counter},
      {key: "week_day", expectedValue: data.week_day},
      {key: "week_day_nr", expectedValue: data.week_day_nr},
      {key: "weekend", expectedValue: data.weekend},
      {key: "wuenscheIds", expectedValue: data.wuensche},
      {key: "year", expectedValue: data.year},
      {key: "zeitraumkategorien", expectedValue: data.zeitraumkategorien}
    ];

    const d = new PlanerDate(data);
    properties.forEach(({key, expectedValue}) => {
      test("sets "  + key, () => {
        if (Array.isArray(expectedValue)) {
          expect(d[key]).toEqual(expectedValue);
        } else {
          expect(d[key]).toBe(expectedValue);
        }
      });
    });
  });

  describe("PlanerDate Getter with undefined AppModel", () => {  
    const expectedProps = [
      {
        _index: -1,
        isFirstDate: false,
        isLastDate: false,
        _className: "  ",
        _zahl: 20220622,
        isFeiertag: false,
        feiertagName: ""
      }, 
      {
        _index: -1,
        isFirstDate: false,
        isLastDate: false,
        _className: " wochenende feiertag",
        _zahl: 20221224,
        isFeiertag: true,
        feiertagName: "Heiligabend"
      }
    ];
  
    for(let i = 0; i < dateIdsLength; i++){
      const data = datesArr[i];
      const d = new PlanerDate(data);
      const expectedObj = expectedProps[i];
      for(let key in expectedObj){
        test(`undefined appModel date ${d.id} get ${key}`, () => {
          console.log(key, d[key], expectedObj[key])
          expect(d[key]).toBe(expectedObj[key]);
        });
      }
    }
  })
  
  // describe("PlanerDate Getter with defined AppModel", () => {
  //   const appModel = createAppModel({
  //     page: {
  //       data: {
  //         dates: {
  //           _getIndex: jest.fn((str) => dateIds.indexOf(str)),
  //           _length: dateIdsLength
  //         }
  //       }
  //     }
  //   });
    
  //   const expectedProps = [
  //     {
  //       _index: 0,
  //       isFirstDate: true,
  //       isLastDate: false
  //     }, 
  //     {
  //       _index: 1,
  //       isFirstDate: false,
  //       isLastDate: true
  //     }
  //   ];

  //   for(let i = 0; i < dateIdsLength; i++){
  //     const data = datesArr[i];
  //     const d = new PlanerDate(data, appModel);
  //     const expectedObj = expectedProps[i];
  //     for(let key in expectedObj){
  //       test(`defined appModel date ${d.id} get ${key}`, () => {
  //         expect(d[key]).toBe(expectedObj[key]);
  //       });
  //     }
  //   }
  // });
});
