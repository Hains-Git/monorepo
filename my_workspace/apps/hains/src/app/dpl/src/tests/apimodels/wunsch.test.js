import Wunsch from "../../models/apimodels/wunsch";
import Basic from "../../models/basic";
import { clearAppModelFromBasic, createAppModel } from "../mockdata/appmodel";

const wuensche = {
  "1": {
      "id": 1,
      "mitarbeiter_id": 4,
      "tag": "2022-07-09",
      "dienstkategorie_id": 11,
      "created_at": "2022-03-13T23:05:31.055Z",
      "updated_at": "2022-03-13T23:05:31.055Z"
  }
}

beforeAll(() => {
  clearAppModelFromBasic();
});

describe("Whitebox testing", () => {
  describe("Instances", () => {
    test("Wunsch is instanceof Wunsch and Basic", () => {
      const w = new Wunsch(wuensche[1]);
      expect(w).toBeInstanceOf(Wunsch);
      expect(w).toBeInstanceOf(Basic);
    });
  });

  describe("Wunsch defines Propertys", () => {
    const data = wuensche[1];
    const properties = [
      {key: "id", expectedValue: data.id},
      {key: "dienstkategorie_id", expectedValue: data.dienstkategorie_id},
      {key: "tag", expectedValue: data.tag},
      {key: "mitarbeiter_id", expectedValue: data.mitarbeiter_id}
    ];
    const w = new Wunsch(data);
    properties.forEach(({key, expectedValue}) => {
      test("sets "  + key, () => {
        expect(w[key]).toBe(expectedValue);
      });
    });
  });

  describe("Wunsch Getter undefined appModel", () => {
    const w = new Wunsch(wuensche[1]);
    const properties = [
      {key: "mitarbeiter", expectedValue: false},
      {key: "dienstkategorie", expectedValue: false},
      {key: "date", expectedValue: false}
    ];

    properties.forEach(({key, expectedValue}) => {
      test("get " + key, () => {
        expect(w[key]).toBe(expectedValue);
      })
    });
  });

  describe("Wunsch Getter", () => {
    const w = new Wunsch(wuensche[1]);
    const properties = [
      {key: "tagZahl", expectedValue: 20220709},
      {key: "wunschTag", expectedValue: "09.07.2022"}
    ];

    properties.forEach(({key, expectedValue}) => {
      test("get " + key, () => {
        expect(w[key]).toBe(expectedValue);
      })
    });
  });

  describe("Wunsch Methods undefined AppModel", () => {
    const w = new Wunsch(wuensche[1]);
    test("getInitialien()", () => {
      expect(w.getInitialien()).toBe("");
    });

    test("getName()", () => {
      expect(w.getName()).toBe("");
    });

    test("getColor()", () => {
      expect(w.getColor()).toBe("transparent");
    });
  });

  describe("defined AppModel", () => {
    const color = "#fff";
    const appModel = createAppModel({
      data: {
        dienstkategorien: {
          11: {
            name: "Test kat",
            initialien: "t",
            getColor: jest.fn(() => color)
          }
        },
        mitarbeiters: {
          4: {}
        }
      },
      page: {
        data: {
          dates: {
            "2022-07-09": {}
          },
          mitarbeiter: {
            4: {}
          }
        }
      }
    });
    const w = new Wunsch(wuensche[1], appModel);
    const dienstkategorie = appModel.data.dienstkategorien[w.dienstkategorie_id];
    
    describe("Wunsch Getter", () => {
      const properties = [
        {key: "mitarbeiter", expectedValue: appModel.page.data.mitarbeiter[w.mitarbeiter_id]},
        {key: "dienstkategorie", expectedValue: dienstkategorie},
        {key: "date", expectedValue: appModel.page.data.dates[w.tag]}
      ];
  
      properties.forEach(({key, expectedValue}) => {
        test("get " + key, () => {
          expect(w[key]).toBe(expectedValue);
        })
      });
    });

    describe("Wunsch Methods", () => {
      test("getInitialien()", () => {
        expect(w.getInitialien()).toBe(dienstkategorie.initialien);
      });
  
      test("getName()", () => {
        expect(w.getName()).toBe(dienstkategorie.name);
      });
  
      // test("getColor()", () => {
      //   expect(w.getColor()).toBe(color);
      //   expect(dienstkategorie.getColor).toHaveBeenCalled();
      // });
    });
  });
});