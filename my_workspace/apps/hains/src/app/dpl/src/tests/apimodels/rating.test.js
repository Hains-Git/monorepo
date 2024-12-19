import Rating from "../../models/apimodels/rating";
import Basic from "../../models/basic";
import { clearAppModelFromBasic, createAppModel } from "../mockdata/appmodel";

const ratings = {
  "1": {
      "id": 1,
      "po_dienst_id": 38,
      "mitarbeiter_id": 455,
      "rating": 4,
      "created_at": "2020-08-28T10:49:52.120Z",
      "updated_at": "2020-11-20T12:46:31.701Z"
  }
}

beforeAll(() => {
  clearAppModelFromBasic();
});

describe("Whitebox testing", () => {
  describe("Instances", () => {
    test("Rating is instanceof Rating and Basic", () => {
      const r = new Rating(ratings[1]);
      expect(r).toBeInstanceOf(Rating);
      expect(r).toBeInstanceOf(Basic);
    });
  });

  describe("Rating defines Propertys", () => {
    const data = ratings[1];
    const properties = [
      {key: "mitarbeiter_id", expectedValue: data.mitarbeiter_id},
      {key: "po_dienst_id", expectedValue: data.po_dienst_id},
      {key: "rating", expectedValue: data.rating},
      {key: "id", expectedValue: data.id}
    ];
    const r = new Rating(data);
    properties.forEach(({key, expectedValue}) => {
      test("sets "  + key, () => {
        expect(r[key]).toBe(expectedValue);
      });
    });
  });

  describe("Rating Getter undefined appModel", () => {
    const r = new Rating(ratings[1]);
    const properties = [
      {key: "mitarbeiter", expectedValue: false},
      {key: "dienst", expectedValue: false}
    ];

    properties.forEach(({key, expectedValue}) => {
      test("get " + key, () => {
        expect(r[key]).toBe(expectedValue);
      })
    });
  })

  describe("Rating Getter defined appModel", () => {
    const appModel = createAppModel({
      data: {
        mitarbeiters: {
          455: {}
        },
        po_dienste: {
          38: {}
        }
      }, 
      page: {
        data: {
          dienste: {
            38: {}
          },
          mitarbeiter: {
            455: {}
          }
        }
      }
    });

    const r = new Rating(ratings[1], appModel);
    const properties = [
      {key: "dienst", expectedValue: appModel.page.data.dienste[r.po_dienst_id]},
      {key: "mitarbeiter", expectedValue: appModel.page.data.mitarbeiter[r.mitarbeiter_id]},
    ];

    properties.forEach(({key, expectedValue}) => {
      test("get " + key, () => {
        expect(r[key]).toBe(expectedValue);
      })
    });
  })
});