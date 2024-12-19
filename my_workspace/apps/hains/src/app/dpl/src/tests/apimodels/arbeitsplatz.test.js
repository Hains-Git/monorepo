import Arbeitsplatz from "../../models/apimodels/arbeitsplatz";
import Basic from "../../models/basic";
import { clearAppModelFromBasic, createAppModel } from "../mockdata/appmodel";

beforeAll(() => {
  clearAppModelFromBasic();
});

const arbeitsplaetze = {
  "1": {
      "id": 1,
      "name": "tbd",
      "bereich_id": 102,
      "created_at": "2022-04-07T12:32:18.232Z",
      "updated_at": "2022-04-07T12:32:18.232Z"
  }
}

const appModel = createAppModel({data: {
  bereiche: {
    102: {}
  }
}});

describe("Arbeitsplatz", () => {
  const a = new Arbeitsplatz(arbeitsplaetze[1], appModel);
  test("Instance of Arbeitsplatz and Basic", () => {
    expect(a).toBeInstanceOf(Arbeitsplatz);
    expect(a).toBeInstanceOf(Basic);
  });

  test("get bereich", () => {
    expect(a.bereich).toBe(appModel.data.bereiche[a.bereich_id]);
  });
});