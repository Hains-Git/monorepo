import Team from "../../models/apimodels/team";
import Basic from "../../models/basic";

const teams = {
  "1": {
    id: 1,
    name: "Test",
    default: true,
    kostenstelle_id: 1,
    funktionen_ids: [1,2],
    dienste_ids: [1,2,3,4],
    kontingente_ids: [1,2,3,4]
  }
}

describe("Whitebox testing", () => {
  describe("Instances", () => {
    test("Team is instanceof Team and Basic", () => {
      const t = new Team(teams[1]);
      expect(t).toBeInstanceOf(Team);
      expect(t).toBeInstanceOf(Basic);
    });
  });

  describe("Team defines Propertys", () => {
    const data = teams[1];
    const properties = [
      {key: "id", expectedValue: data.id},
      {key: "name", expectedValue: data.name},
      {key: "default", expectedValue: data.default},
      {key: "kostenstelle_id", expectedValue: data.kostenstelle_id},
      {key: "funktionen_ids", expectedValue: data.funktionen_ids},
      {key: "dienste_ids", expectedValue: data.dienste_ids},
      {key: "kontingente_ids", expectedValue: data.kontingente_ids},
      {key: "mitarbeiterNachTag", expectedValue: {}, obj: true},
      {key: "mitarbeiter", expectedValue: [], arr: true}
    ];
    const t = new Team(data);
    properties.forEach(({key, expectedValue, obj, arr}) => {
      test(`sets ${   key}`, () => {
        if(obj || arr){
          expect(t[key]).toEqual(expectedValue);
          if(arr) expect(t[key]).toHaveLength(0);
        } else {
          expect(t[key]).toBe(expectedValue);
        }
      });
    });
  });

  describe("Team Methods", () => {
    const t = new Team(teams[1]);
    describe("Empty Elements", () => {
      const tag = "2022-05-01";
      ["hasDienst", "hasKontingent", "hasMitarbeiter", "hasMitarbeiterTag"].forEach((key, i) => {
        test(`${key  }()`, () => {
          expect(t[key]()).toBe(false);
        });
        if(i < 3){
          test(`${key  }(10)`, () => {
            expect(t[key]()).toBe(false);
          });
        } else {
          test(`${key  }(${  tag  }, 10)`, () => {
            expect(t[key](tag, 10)).toBe(false);
          });
        }
      });
    });
    
    describe("Falsche id", () => {
      ["add", "remove"].forEach(key => {
        const name = "mitarbeiter";
        test(`${key  }(name, id)`, () => {
          t[key](name);
          t[key](name, false);
          t[key](name, []);
          t[key](name, {});
          t[key](name, () => {});
          t[key](name, "abc");
          expect(t[name]).toEqual([]);
          expect(t[name]).toHaveLength(0);
        });
      });

      ["addMitarbeiter", "removeMitarbeiter"].forEach(key => {
        const tag = "2022-05-01";
        test(`${key}(${tag}, id)`, () => {
          t[key](tag);
          t[key](tag, false, 0);
          t[key](tag, [], 0);
          t[key](tag, {}, 0);
          t[key](tag, () => {}, 0);
          t[key](tag, "abc", 0);
          expect(t.mitarbeiter).toEqual([]);
          expect(t.mitarbeiter).toHaveLength(0);
          expect(t.mitarbeiterNachTag).toEqual({});
        });
      });
    });

    describe("Falscher name", () => {
      ["add", "remove"].forEach(key => {
        const name = "mitarbeiter";
        test(`${key  }(name, 10)`, () => {
          t[key](undefined, 10);
          t[key](false, 10);
          t[key]([], 10);
          t[key]({}, 10);
          t[key](() => {}, 10);
          t[key](20, 10);
          expect(t[name]).toEqual([]);
          expect(t[name]).toHaveLength(0);
        });
      });
    });

    describe("Falscher tag", () => {
      ["addMitarbeiter", "removeMitarbeiter"].forEach(key => {
        test(`${key  }(tag, 10)`, () => {
          t[key](undefined, 10, 0);
          t[key](false, 10, 0);
          t[key]([], 10, 0);
          t[key]({}, 10, 0);
          t[key](() => {}, 10, 0);
          t[key](20, 10, 0);
          expect(t.mitarbeiter).toEqual([]);
          expect(t.mitarbeiter).toHaveLength(0);
          expect(t.mitarbeiterNachTag).toEqual({});
        });
      });
    });

    const testMethods = (t, key, param, i, tag, times = 1, checkCallBack = () => {}) => {
      let preMsg = "";
      if(i === 0){
        preMsg = "mitarbeiter, ";
      } else if(i === 1){
        preMsg = `${tag}, `;
      }
      const msg = `(${preMsg}${param})`;
      test(key + msg, () => {
        for(let j = 0; j < times; j++){
          if(i === 0) {
            t[key]("mitarbeiter", param);
          } else if(i === 1){
            t[key](tag, param, 10);
          } else {
            t[key](param);
          }
        }
        checkCallBack(t, tag, i);
      });
    }

    const addCheckValues = (t, tag, i) => {
      switch(i){
        case 0:
          expect(t.mitarbeiter.includes(i)).toBe(true);
          expect(t.mitarbeiter).toHaveLength(1);
          break;
        case 1:
          expect(t.mitarbeiter.includes(i)).toBe(true);
          expect(t.mitarbeiter).toHaveLength(2);
          expect(t.mitarbeiterNachTag[i]).toEqual({[tag]: [10]});
          expect(t.mitarbeiterNachTag[i][tag]).toHaveLength(1);
      }
    }

    const removeCheckValues = (t, tag, i) => {
      switch(i){
        case 0:
          expect(t.mitarbeiter.includes(i)).toBe(false);
          expect(t.mitarbeiter).toHaveLength(1);
          break;
        case 1:
          expect(t.mitarbeiter.includes(i)).toBe(false);
          expect(t.mitarbeiterNachTag[i]).toBeUndefined();
          break;
      }
    }

    const testHasMethods = (t, key, param, i, tag) => {
      const diff = 30;
      const msg = `(${i === 1 ? `${tag  }, ` : ""}${param}), param -> true, param+${diff} -> false`;
      test(key + msg, () => {
        if(i === 1){
          expect(t[key](param, tag)).toBe(true);
          expect(t[key](param+diff, tag)).toBe(false);
        } else {
          expect(t[key](param)).toBe(true);
          expect(t[key](param+diff)).toBe(false);
        }
      });
    }

    describe("richtiger name und richtige id (String)", () => {
      const t = new Team(teams[1]);
      const tag = "2022-05-01";
      ["add", "addMitarbeiter"].forEach((key, i) => {
        testMethods(t, key, i.toString(), i, tag, 2, addCheckValues);
      });

      ["hasMitarbeiter", "hasMitarbeiterTag", "hasDienst", "hasKontingent"].forEach((key, i) => {
        testHasMethods(t, key, "1", i, tag);
      });

      ["remove", "removeMitarbeiter"].forEach((key, i) => {
        testMethods(t, key, i.toString(), i, tag, 1, removeCheckValues);
      });
    });

    describe("richtiger name und richtige id (Number)", () => {
      const t = new Team(teams[1]);
      const tag = "2022-05-01";
      ["add", "addMitarbeiter"].forEach((key, i) => {
        testMethods(t, key, i, i, tag, 1, addCheckValues);
      });

      ["hasMitarbeiter", "hasMitarbeiterTag","hasDienst", "hasKontingent"].forEach((key, i) => {
        testHasMethods(t, key, 1, i, tag);
      });

      ["remove", "removeMitarbeiter"].forEach((key, i) => {
        testMethods(t, key, i, i, tag, 1, removeCheckValues);
      });
    });
  });
});