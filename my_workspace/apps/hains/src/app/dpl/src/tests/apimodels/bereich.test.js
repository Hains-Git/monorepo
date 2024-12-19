import Bereich from "../../models/apimodels/bereich";
import Basic from "../../models/basic";
import { clearAppModelFromBasic, createAppModel } from "../mockdata/appmodel";

const bereiche = {
  "1": {
      "id": 1,
      "name": "Test 1",
      "name_url": "t1",
      "info": "",
      "standort_id": 4,
      "planname": "T1",
      "bereiches_id": null,
      "converted_planname": "test_1"
  },
  "9": {
      "id": 9,
      "name": "Test 2",
      "name_url": "t2",
      "info": "",
      "standort_id": 2,
      "planname": "T2",
      "bereiches_id": 68,
      "converted_planname": "test_2"
  },
  "20": {
      "id": 20,
      "name": "Test 3",
      "name_url": "t3",
      "info": "",
      "standort_id": 2,
      "planname": "T3",
      "bereiches_id": 9,
      "converted_planname": "test_3"
  }
}

beforeAll(() => {
  clearAppModelFromBasic();
});

describe("Whitebox testing", () => {
  describe("Instances", () => {
    test("Bereich is instanceof Bereich and Basic", () => {
      const b = new Bereich(bereiche[1]);
      expect(b).toBeInstanceOf(Bereich);
      expect(b).toBeInstanceOf(Basic);
    });
  });
  
  describe("Bereich defines Propertys", () => {
    const data = bereiche[1];
    const properties = [
      {key: "name", expectedValue: data.name},
      {key: "name_url", expectedValue: data.name_url},
      {key: "info", expectedValue: data.info},
      {key: "standort_id", expectedValue: data.standort_id},
      {key: "id", expectedValue: data.id},
      {key: "planname", expectedValue: data.planname},
      {key: "bereiches_id", expectedValue: 0},
      {key: "converted_planname", expectedValue: data.converted_planname}
    ];
    const b = new Bereich(data);
    properties.forEach(({key, expectedValue}) => {
      test("sets "  + key, () => {
        expect(b[key]).toBe(expectedValue);
      });
    });
  });

  describe("Bereich Getter", () => {
    const appModel = createAppModel({
      data: {
        bereiche: {
          68: {},
          9: {}
        },
        standorte: {
          2: {},
          4: {}
        }
      }
    });
    
    [1, 9, 20].forEach((id) => {
      const data = bereiche[id];
      const b = new Bereich(data, appModel);
      test(`get bereich ${id} bereiches_id: ${b.bereiches_id}`, () => {
        expect(b.bereich).toBe(id === 1 ? false : appModel.data.bereiche[b.bereiches_id]);
      });
      test(`get standort ${id} standort_id: ${b.standort_id}`, () => {
        expect(b.standort).toBe(appModel.data.standorte[b.standort_id]);
      });
    });
  })
})