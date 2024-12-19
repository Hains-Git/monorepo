import Freigabe from "../../models/apimodels/freigabe";
import Basic from "../../models/basic";
import { clearAppModelFromBasic, createAppModel } from "../mockdata/appmodel";

const freigaben = {
  "2": {
      "id": 2,
      "freigabetyp_id": 2,
      "mitarbeiter_id": 455,
      "freigabestatus_id": 5,
      "user_id": 422,
      "standort_id": 5
  }
}

beforeAll(() => {
  clearAppModelFromBasic();
});

describe("Whitebox testing", () => {
  describe("Instances", () => {
    test("Freigabe is instanceof Freigabe and Basic", () => {
      const f = new Freigabe(freigaben[2]);
      expect(f).toBeInstanceOf(Freigabe);
      expect(f).toBeInstanceOf(Basic);
    });
  });
  
  describe("Freigabe defines Propertys", () => {
    const data = freigaben[2];
    const properties = [
      {key: "freigabestatus_id", expectedValue: data.freigabestatus_id},
      {key: "freigabetyp_id", expectedValue: data.freigabetyp_id},
      {key: "mitarbeiter_id", expectedValue: data.mitarbeiter_id},
      {key: "standort_id", expectedValue: data.standort_id},
      {key: "id", expectedValue: data.id},
      {key: "user_id", expectedValue: data.user_id}
    ];
    const f = new Freigabe(data);
    properties.forEach(({key, expectedValue}) => {
      test("sets "  + key, () => {
        expect(f[key]).toBe(expectedValue);
      });
    });
  });

  describe("Freigabe defined appModel", () => {
    const appModel = createAppModel({
      data: {
        freigabetypen: {
          2: {}
        },
        freigabestatuse: {
          5: {
            qualifiziert: true,
            erteilt: true,
          }
        },
        mitarbeiters: {
          455: {
            addFreigabe: jest.fn(() => true)
          }
        }
      },
      page: {
        data: {
          mitarbeiter: {
            455: {}
          }
        }
      }
    });
    const data = freigaben[2];
    const f = new Freigabe(data, appModel);
    describe("Getter", () => {
      const properties = [
        {key: "freigabetyp", expectedValue: appModel.data.freigabetypen[f.freigabetyp_id]},
        {key: "freigabestatus", expectedValue: appModel.data.freigabestatuse[f.freigabestatus_id]},
        {key: "mitarbeiter", expectedValue: appModel.page.data.mitarbeiter[f.mitarbeiter_id]},
        {key: "qualifiziert", expectedValue: appModel.data.freigabestatuse[f.freigabestatus_id].qualifiziert},
        {key: "erteilt", expectedValue: appModel.data.freigabestatuse[f.freigabestatus_id].erteilt}
      ];
  
      properties.forEach(({key, expectedValue}) => {
        test("get " + key, () => {
          expect(f[key]).toBe(expectedValue);
        })
      });
    })
  })
})