import ArbeitszeitAbsprache from "../../models/apimodels/arbeitszeitabsprache";
import Basic from "../../models/basic";
import { clearAppModelFromBasic, createAppModel } from "../mockdata/appmodel";

beforeAll(() => {
  clearAppModelFromBasic();
});


const absprachen = {
  "1": {
      "id": 1,
      "vertrags_phase_id": 1,
      "zeitraumkategorie_id": 102,
      "pause": 30,
      "mitarbeiter_id": 1,
      "von": "2024-01-10",
      "bis": "2024-30-10",
      "anfang": "2024-01-10",
      "ende": "2024-20-10",
      "arbeitszeit_von": "05:00",
      "arbeitszeit_bis": "17:00"
  }
}

const appModel = createAppModel({data: {
  zeitraumkategorien: {
    102: {}
  },
  vertragsphasen: {
    1: {}
  },
  mitarbeiters: {
    1: {}
  }
}});

describe("ArbeitszeitAbsprache", () => {
  const a = new ArbeitszeitAbsprache(absprachen[1], appModel);
  test("Instance of ArbeitszeitAbsprache and Basic", () => {
    expect(a).toBeInstanceOf(ArbeitszeitAbsprache);
    expect(a).toBeInstanceOf(Basic);
  });

  test("get zeitraumkategorie", () => {
    expect(a.zeitraumkategorie).toBe(appModel.data.zeitraumkategorien[a.zeitraumkategorie_id]);
  });

  test("get vertragsphase", () => {
    expect(a.vertragsphase).toBe(appModel.data.vertragsphasen[a.vertrags_phase_id]);
  });

  test("get mitarbeiter", () => {
    expect(a.mitarbeiter).toBe(appModel.data.mitarbeiters[a.mitarbeiter_id]);
  });
});