import Kontingent from "../../models/apimodels/kontingent";
import Basic from "../../models/basic";
import { clearAppModelFromBasic, createAppModel } from "../mockdata/appmodel";

const kontingente = {
  "1": {
      "id": 1,
      "name": "Test Kontingent",
      "kommentar": "Ein Kommentar",
      "position": 8900,
      "kurzname": "KOP",
      "thema_ids": [
          43,
          7,
          8
      ],
      "team_id": 4,
      "default": false
  }
}

beforeAll(() => {
  clearAppModelFromBasic();
});

describe("Whitebox testing", () => {
  describe("Instances", () => {
    test("Kontingent is instanceof Kontingent and Basic", () => {
      const k = new Kontingent(kontingente[1]);
      expect(k).toBeInstanceOf(Kontingent);
      expect(k).toBeInstanceOf(Basic);
    });
  });

  describe("Kontingent defines Propertys", () => {
    const data = kontingente[1];
    const properties = [
      {key: "kurzname", expectedValue: data.kurzname},
      {key: "kommentar", expectedValue: data.kommentar},
      {key: "position", expectedValue: data.position},
      {key: "thema_ids", expectedValue: data.thema_ids},
      {key: "id", expectedValue: data.id},
      {key: "name", expectedValue: data.name},
      {key: "team_id", expectedValue: data.team_id}
    ];
    const k = new Kontingent(data);
    properties.forEach(({key, expectedValue}) => {
      test("sets "  + key, () => {
        expect(k[key]).toBe(expectedValue);
      });
    });
  });

  describe("Kontingent Getter", () => {
    const appModel = createAppModel({
      data: {
        teams: {
          4: {
            name: "Test Team"
          }
        },
        themen: {
          43: {},
          7: {},
          8: {},
          _each: (callback) => {
            [43, 7, 8].forEach((id) => {
              callback(appModel.data.themen[id]);
            });
          } 
        }
      }
    });
    const k = new Kontingent(kontingente[1], appModel);
    test("get team", () => {
      expect(k.team).toBe(appModel.data.teams[k.team_id]);
    })

    test("get teamName", () => {
      expect(k.teamName).toBe(appModel.data.teams[k.team_id].name);
    })

    test("get themen", () => {
      const themen = k.thema_ids.map((id) => appModel.data.themen[id]);
      expect(k.themen).toEqual(expect.arrayContaining(themen));
    })
  })
});