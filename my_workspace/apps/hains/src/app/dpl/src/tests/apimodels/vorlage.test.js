import Vorlage from "../../models/apimodels/vorlage";
import Basic from "../../models/basic";
import { clearAppModelFromBasic, createAppModel } from "../mockdata/appmodel";
import { vorlagen } from "../mockdata/vorlagen";

beforeAll(() => {
  clearAppModelFromBasic();
});

describe("Whitebox testing", () => {
  describe("Instances", () => {
    test("Vorlage is instanceof Vorlage and Basic", () => {
      const v = new Vorlage(vorlagen[0]);
      expect(v).toBeInstanceOf(Vorlage);
      expect(v).toBeInstanceOf(Basic);
    });
  });

  describe("Vorlage defines Propertys", () => {
    const data = vorlagen[0];
    const properties = [
      {key: "id", expectedValue: data.id},
      {key: "dienste", expectedValue: data.dienste},
      {key: "name", expectedValue: data.name},
      {key: "mitarbeiter_id", expectedValue: data.mitarbeiter_id},
      {key: "team_id", expectedValue: data.team_id},
      {key: "funktionen_ids", expectedValue: data.funktionen_ids},
      {key: "ansicht_id", expectedValue: data.ansicht_id}
    ];
    const v = new Vorlage(data);
    properties.forEach(({key, expectedValue}) => {
      test("sets "  + key, () => {
        expect(v[key]).toBe(expectedValue);
      });
    });

    test("sets title", () => {
      expect(v.title).toEqual(expect.any(Array));
    });

    const v1 = new Vorlage(vorlagen[2]);
    test("sets dienste = [] when data.dienste = null", () => {
      expect(v1.dienste).toEqual([]);
      expect(v1.dienste).toHaveLength(0);
    });

    test("sets funktionen_ids = [] when data.funktionen_ids = null", () => {
      expect(v1.funktionen_ids).toEqual([]);
      expect(v1.funktionen_ids).toHaveLength(0);
    });
  });

  describe("Vorlage Getter undefined appModel", () => {
    const v = new Vorlage(vorlagen[0]);
    const properties = [
      {key: "team", expectedValue: false},
      {key: "funktionen", expectedValue: [], arr: true},
      {key: "ansicht", expectedValue: ""}
    ];

    properties.forEach(({key, expectedValue, arr}) => {
      test("get " + key, () => {
        if(arr){
          expect(v[key]).toEqual(expectedValue);
          expect(v[key]).toHaveLength(0);
        } else {
          expect(v[key]).toBe(expectedValue);
        }
      })
    });
  })

  describe("Vorlage Methods undefined appModel", () => {
    const v = new Vorlage(vorlagen[0]);
    let oldTitle = v.title;
    test("setTitle() -> title to Equal oldTitle", () => {
      expect(oldTitle).toEqual(expect.any(Array));
      v.setTitle(true);
      expect(v.title).toEqual(oldTitle);
    });

    test("getDienste()", () => {
      let arr = v.getDienste();
      expect(arr).toEqual([]);
      expect(arr).toHaveLength(0);
    });
  });

  describe("defined AppModel", () => {
    const ansichten = [{name: "A 1"}, {name: "A 2"}];
    const appModel = createAppModel({
      data: {
        funktionen: {
          1: {}
        },
        teams: {
          4: {}
        }
      },
      page: {
        data: {
          dienste: {
            38: {
              planname: "Test Dienst 1"
            },
            32: {
              planname: "Test Dienst 2"
            },
            40: {
              planname: "Test Dienst 3"
            },
            85: {
              planname: "Test Dienst 4"
            }
          }
        },
        getAnsichtName: jest.fn((i) => ansichten?.[i]?.name || "")
      }
    });
    const data = vorlagen[0];
    const v = new Vorlage(data, appModel);

    describe("Vorlage Getter", () => {
      const properties = [
        {key: "team", expectedValue: appModel.data.teams[v.team_id]},
        {key: "funktionen", expectedValue: [appModel.data.funktionen[1]], arr: true},
        // {key: "ansicht", expectedValue: ansichten[v.ansicht_id].name}
      ];
  
      properties.forEach(({key, expectedValue, arr}) => {
        test("get " + key, () => {
          if(arr){
            expect(v[key]).toEqual(expectedValue);
            expect(v[key]).toHaveLength(1);
          } else {
            expect(v[key]).toBe(expectedValue);
          }
        })
      });
    });
  
    describe("Vorlage Methods", () => {
      let oldTitle = v.title;
      test("setTitle() -> title not to Equal oldTitle", () => {
        expect(oldTitle).toEqual(expect.any(Array));
        v.setTitle(true);
        expect(v.title).not.toEqual(oldTitle);
        expect(v.title).toEqual(expect.any(Array));
      });
  
      test("getDienste()", () => {
        let arr = v.getDienste();
        expect(arr).toEqual(data.dienste.map(id => appModel.page.data.dienste[id]));
        expect(arr).toHaveLength(data.dienste.length);

        arr = v.getDienste((dienste) => dienste.planname);
        expect(arr).toEqual(data.dienste.map(id => appModel.page.data.dienste[id].planname));
        expect(arr).toHaveLength(data.dienste.length);
      });

      test("setTeamId", () => {
        v.setTeamId(5);
        expect(v.team_id).toBe(5);
        v.setTeamId(() => {});
        expect(v.team_id).toBe(0);
        v.setTeamId(false);
        expect(v.team_id).toBe(0);
        v.setTeamId("acdv");
        expect(v.team_id).toBe(0);
        v.setTeamId([]);
        expect(v.team_id).toBe(0);
        v.setTeamId({});
        expect(v.team_id).toBe(0);
      });

      test("setAnsichtId", () => {
        v.setAnsichtId(5);
        expect(v.ansicht_id).toBe(5);
        v.setAnsichtId(() => {});
        expect(v.ansicht_id).toBe(0);
        v.setAnsichtId(false);
        expect(v.ansicht_id).toBe(0);
        v.setAnsichtId([]);
        expect(v.ansicht_id).toBe(0);
        v.setAnsichtId({});
        expect(v.ansicht_id).toBe(0);
        v.setAnsichtId("acdv");
        expect(v.ansicht_id).toBe(0);
      });

      test("includesDienst", () => {
        expect(v.includesDienst("38")).toBe(true);
        expect(v.includesDienst(38)).toBe(true);
        expect(v.includesDienst(100)).toBe(false);
        expect(v.includesDienst("bla")).toBe(false);
        expect(v.includesDienst({id: 38})).toBe(true);
        expect(v.includesDienst({id: "bla"})).toBe(false);
      });
    });
  });
});