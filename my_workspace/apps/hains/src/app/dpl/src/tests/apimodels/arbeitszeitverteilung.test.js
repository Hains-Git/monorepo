import Arbeitszeitverteilung from "../../models/apimodels/arbeitszeitverteilung";
import Basic from "../../models/basic";
import { createAppModel } from "../mockdata/appmodel";

const arbeitszeitverteilungen = {
  "1": {
      "id": 1,
      "name": "Test 1",
      "dauer": 1,
      "verteilung": [
          "2000-01-01T07:15:00.000Z",
          "2000-01-01T12:00:00.000Z",
          "2000-01-01T12:30:00.000Z",
          "2000-01-01T15:30:00.000Z",
          "2000-01-01T15:45:00.000Z",
          "2000-01-01T18:00:00.000Z"
      ],
      "zeittypen": [
          1,
          3,
          1,
          3,
          1
      ],
      "created_at": "2020-10-28T11:52:36.341Z",
      "updated_at": "2022-05-20T08:10:19.694Z",
      "std": "0.0",
      "dienstgruppe_id": null,
      "pre_std": "0.0",
      "pre_dienstgruppe_id": null,
      "pre_ueberschneidung_minuten": null
  },
  "2": {
      "id": 2,
      "name": "Test 2",
      "dauer": 6,
      "verteilung": [
          "2000-01-01T20:30:00.000Z",
          "2000-01-01T00:00:00.000Z"
      ],
      "zeittypen": [
          1
      ],
      "created_at": "2020-10-28T11:52:36.341Z",
      "updated_at": "2022-05-27T11:48:03.873Z",
      "std": "25.3",
      "dienstgruppe_id": 1,
      "pre_std": "21.2",
      "pre_dienstgruppe_id": 2,
      "pre_ueberschneidung_minuten": 30
  }
}

const appModel = createAppModel({data: {
  arbeitszeittypen: {
    1: {},
    2: {},
    3: {},
    4: {}
  },
  dienstgruppen: {
    1: {},
    2: {}
  },
}});

describe("Arbeitszeitverteilung", () => {
  const a = new Arbeitszeitverteilung(arbeitszeitverteilungen[1], appModel);
  const a2 = new Arbeitszeitverteilung(arbeitszeitverteilungen[2], appModel);
  test("Instance of Arbeitszeitverteilung and Basic", () => {
    expect(a).toBeInstanceOf(Arbeitszeitverteilung);
    expect(a).toBeInstanceOf(Basic);
  })
  
  test("get dienstgruppe", () => {
    expect(a.dienstgruppe).toBe(false);
    expect(a2.dienstgruppe).toBe(appModel.data.dienstgruppen[a2.dienstgruppe_id]);
  })

  test("get preDienstgruppe", () => {
    expect(a.preDienstgruppe).toBe(false);
    expect(a2.preDienstgruppe).toBe(appModel.data.dienstgruppen[a2.pre_dienstgruppe_id]);
  })

  test("get arbeitszeittypen", () => {
    const typen = appModel.data.arbeitszeittypen;
    const aTypen = a.arbeitszeittypen;
    expect(aTypen).toEqual([typen[1], typen[3], typen[1], typen[3], typen[1]]);
  })

  test("get zeitverteilung", () => {
    const verteilung = a.zeitverteilung;
    expect(Array.isArray(verteilung)).toBe(true);
    verteilung.forEach(obj => {
      expect(obj).toHaveProperty("date");
      expect(obj).toHaveProperty("datenr");
      expect(obj).toHaveProperty("fullStr");
      expect(obj).toHaveProperty("fullnr");
      expect(obj).toHaveProperty("fullLocal");
      expect(obj).toHaveProperty("local");
      expect(obj).toHaveProperty("time");
      expect(obj).toHaveProperty("timenr");
    });
  })
});
