import Funktion from "../../models/apimodels/funktion";
import Basic from "../../models/basic";
import { createAppModel } from "../mockdata/appmodel";

const funktionen = {
  "1": {
      "id": 1,
      "planname": "TF",
      "name": "Test Funktion",
      "beschreibung": "Eine Beschreibung",
      "color": "#fff",
      "prio": 1,
      "team_id": 1
  }
}

describe("Whitebox testing", () => {
  describe("Instances", () => {
    test("Funktion is instanceof Funktion and Basic", () => {
      const f = new Funktion(funktionen[1]);
      expect(f).toBeInstanceOf(Funktion);
      expect(f).toBeInstanceOf(Basic);
    });
  });

  describe("Funktion defines Propertys", () => {
    const data = funktionen[1];
    const properties = [
      {key: "planname", expectedValue: data.planname},
      {key: "beschreibung", expectedValue: data.beschreibung},
      {key: "color", expectedValue: data.color},
      {key: "prio", expectedValue: data.prio},
      {key: "id", expectedValue: data.id},
      {key: "name", expectedValue: data.name},
      {key: "team_id", expectedValue: data.team_id}
    ];
    const f = new Funktion(data);
    properties.forEach(({key, expectedValue}) => {
      test("sets "  + key, () => {
        expect(f[key]).toBe(expectedValue);
      });
    });
  });

  describe("Funktion Getter", () => {
    const data = funktionen[1];
    const appModel = createAppModel({
      data: {
        teams: {
          1: {
            name: "Test"
          }
        }
      }
    });
    const properties = [
      {key: "team", expectedValue: appModel.data.teams[1]},
      {key: "teamName", expectedValue: appModel.data.teams[1].name},
    ];
    const f = new Funktion(data, appModel);
    properties.forEach(({key, expectedValue}) => {
      test("get "  + key, () => {
        expect(f[key]).toBe(expectedValue);
      });
    });
  });
});