import Rotation from "../../models/apimodels/rotation";
import Basic from "../../models/basic";
import { clearAppModelFromBasic, createAppModel } from "../mockdata/appmodel";

const rotationen = {
  "32": {
      "id": 32,
      "kontingent_id": 23,
      "mitarbeiter_id": 4,
      "mitarbeiter_planname": "Test Name",
      "prioritaet": null,
      "von": "2020-12-31",
      "bis": "2022-10-30",
      "kommentar": "Test",
      "created_at": "2021-01-12T13:45:42.404Z",
      "updated_at": "2022-02-24T10:23:28.973Z",
      "published": true,
      "published_by": null,
      "published_at": null,
      "position": null
  }
}

beforeAll(() => {
  clearAppModelFromBasic();
});

describe("Whitebox testing", () => {
  describe("Instances", () => {
    test("Rotation is instanceof Rotation and Basic", () => {
      const r = new Rotation(rotationen[32]);
      expect(r).toBeInstanceOf(Rotation);
      expect(r).toBeInstanceOf(Basic);
    });
  });

  describe("Rotation defines Propertys", () => {
    const data = rotationen[32];
    const properties = [
      {key: "kommentar", expectedValue: data.kommentar},
      {key: "kontingent_id", expectedValue: data.kontingent_id},
      {key: "mitarbeiter_id", expectedValue: data.mitarbeiter_id},
      {key: "id", expectedValue: data.id},
      {key: "bis", expectedValue: data.bis},
      {key: "mitarbeiter_planname", expectedValue: data.mitarbeiter_planname},
      {key: "position", expectedValue: 0},
      {key: "prioritaet", expectedValue: 0},
      {key: "published", expectedValue: data.published},
      {key: "published_at", expectedValue: data.published_at},
      {key: "published_by", expectedValue: data.published_by},
      {key: "von", expectedValue: data.von},
      {key: "vonZahl", expectedValue: 20201231},
      {key: "vonDateString", expectedValue: "31.12.2020"},
      {key: "bisZahl", expectedValue: 20221030},
      {key: "bisDateString", expectedValue: "30.10.2022"}
    ];
    const r = new Rotation(data);
    properties.forEach(({key, expectedValue}) => {
      test(`sets ${   key}`, () => {
        expect(r[key]).toBe(expectedValue);
      });
    });
  });

  describe("Rotation Getter undefined appModel", () => {
    const r = new Rotation(rotationen[32]);
    const properties = [
      {key: "mitarbeiter", expectedValue: false},
      {key: "kontingent", expectedValue: false},
      {key: "name", expectedValue: r.kontingent_id},
      {key: "team", expectedValue: false},
      {key: "teamName", expectedValue: "Kein Team"}
    ];

    properties.forEach(({key, expectedValue}) => {
      test(`get ${  key}`, () => {
        expect(r[key]).toBe(expectedValue);
      })
    });
  })

  describe("Rotation Getter defined appModel", () => {
    const appModel = createAppModel({
      data: {
        mitarbeiters: {
          4: {}
        },
        kontingente: {
          23: {
            team: {
              name: "Test Team"
            },
            name: "Test Kontingent"
          }
        }
      },
      page: {
        data: {
          mitarbeiter: {
            4: {}
          }
        }
      }
    });
    const r = new Rotation(rotationen[32], appModel);
    const kontingent = appModel.data.kontingente[r.kontingent_id];
    const properties = [
      {key: "mitarbeiter", expectedValue: appModel.page.data.mitarbeiter[r.mitarbeiter_id]},
      {key: "kontingent", expectedValue: kontingent},
      {key: "name", expectedValue: kontingent.name},
      {key: "team", expectedValue: kontingent.team},
      {key: "teamName", expectedValue: kontingent.team.name}
    ];

    properties.forEach(({key, expectedValue}) => {
      test(`get ${  key}`, () => {
        expect(r[key]).toBe(expectedValue);
      })
    });
  })
});