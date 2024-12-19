import Basic from "../../models/basic";
import User from "../../models/user";
import { userArray, userDienstplanSettings } from "../mockdata/user";
import { vorlagen } from "../mockdata/vorlagen";

const parameters = [
  {
    params: {},
    expected: {
      startVorlage: 0,
      hainsInfo: undefined,
      roles: undefined,
      id: undefined,
      mitarbeiterId: -1,
      name: "",
      vorlagen: 0,
      hasCustomFelder: false,
      customFelder: {},
      isAdmin: undefined,
      isDienstplaner: undefined,
      isRotationsplaner: undefined,
      isUrlaubsplaner: undefined,
      showDienstplaner: false
    }
  },
  {
    params: userArray[0],
    expected: {
      startVorlage: 0,
      hainsInfo: userArray[0].hainsinfo,
      roles: userArray[0].roles,
      id: userArray[0].id,
      mitarbeiterId: userArray[0].hainsinfo.mitarbeiter_id,
      name: `${userArray[0].hainsinfo.vorname} ${userArray[0].hainsinfo.nachname}`,
      vorlagen: 2,
      hasCustomFelder: true,
      isAdmin: true,
      isDienstplaner: true,
      isRotationsplaner: true,
      isUrlaubsplaner: true,
      showDienstplaner: true
    }
  }
];

const createUser = (index = 0) => {
  const user = new User(parameters[index].params);
  user.setSettings(userDienstplanSettings[user.id]);
  return user;
}

describe("Whitebox testing", () => {
  describe("User defines Methods", () => {
    const user = createUser(0);
    const functions = [
      "setStartVorlage",
      "setVorlagen", 
      "getFeld",
      "eachCustomFeld",
      "setCustomFelder",
      "addCounter",
      "addFeld",
      "removeFeld",
      "removeFelder"
    ];
  
    functions.forEach(name => {
      test("defines "  + name, () => {
        expect(typeof user[name]).toBe("function");
      });
    });
  });
  
  describe("User sets Properties", () => {
    const properties = [
      "startVorlage",
      "hainsInfo",
      "roles",
      "id",
      "mitarbeiterId",
      // "name",
      "vorlagen",
      "customFelder",
      "hasCustomFelder"
    ];
    
    // parameters.forEach((p, i) => {
    //   const user = createUser(i);
    //   properties.forEach((prop) => {
    //     test("sets "  + prop, () => {
    //       if(prop == "vorlagen"){
    //         expect(user[prop].length).toBe(p.expected[prop]);
    //       } else if(prop == "customFelder") {
    //         const match = p.expected[prop];
    //         if(match) expect(user[prop]).toEqual(match);
    //         else {
    //           // user.customFelder = {feldId: {counter: counterId: []}}
    //           // customFelder hat eine Eigenschaft mit der Feld-Id als key
    //           p.params.dienstplan_custom_felder.forEach((feld) => {
    //             expect(user[prop]).toHaveProperty(feld.id.toString());
    //           });
  
    //           p.params.dienstplan_custom_counter.forEach((counter) => {
    //             // Die Felder aus CustomFelder hat eine Eigenschaft counter mit der Counter-Id als key
    //             expect(user[prop][counter.dienstplan_custom_feld_id].counter).toHaveProperty(counter.id.toString());
    //           });
    //         }
    //       } else if (prop === "roles") {
    //         expect(user[prop]).toEqual([]);
    //       } else {
    //         expect(user[prop]).toBe(p.expected[prop]);
    //       }
    //     });
    //   });
    // });
  });
  
  describe("Instance", () => {
    test("user is instanceof User and Basic", () => {
      const user = createUser(0);
      expect(user).toBeInstanceOf(User);
      expect(user).toBeInstanceOf(Basic);
    });
  });
  
  describe("User Methods", () => {
    test("setStartVorlage()", () => {
      const user = createUser(1);
      expect(user.startVorlage).toBe(0);
      user.setStartVorlage(1);
      expect(user.startVorlage).toBe(1);
      user.setStartVorlage();
      expect(user.startVorlage).toBe(0);
    });
  
    test("setVorlagen()", () => {
      // const user = createUser(1);
    });
  
    test("getFeld()", () => {
      const user = createUser(1);
      expect(user.getFeld(52)).toBe(user.customFelder[52]);
      expect(user.getFeld(0)).toBeUndefined();
      expect(user.getFeld(53)).toBe(user.customFelder[53]);
      expect(user.getFeld("a")).toBeUndefined();
      expect(user.getFeld(null)).toBeUndefined();
      expect(user.getFeld(() => {})).toBeUndefined();
    });
  
    test("eachCustomFeld()", () => {
      const user = createUser(1);
      
      user.eachCustomFeld((feld) => {
        expect(feld).toBe(user.customFelder[feld.id]);
        expect(feld).not.toBeUndefined();
        expect(feld).not.toBe(false);
        expect(feld).not.toBe(true);
      });
  
      // const callback = jest.fn();
      // user.eachCustomFeld(callback);
      // expect(callback).toHaveBeenCalled();
    });
  
    test("setCustomFelder()", () => {
      // const user = createUser(0);
      // user.setCustomFelder([customFelderArr, customCounterArr]);
      // // customFelder hat eine Eigenschaft mit der Feld-Id als key
      // customFelderArr.forEach((feld) => {
      //   expect(user.customFelder).toHaveProperty(feld.id.toString());
      // });
  
      // customCounterArr.forEach((counter) => {
      //   // Die Felder aus CustomFelder haben eine Eigenschaft counter mit der Counter-Id als key
      //   expect(user.customFelder[counter.dienstplan_custom_feld_id].counter).toHaveProperty(counter.id.toString());
      // });
    });
  
    test("addFeld()", () => {
      // const user = createUser(0);
      // const feld = customFelderArr[0];
      // user.addFeld(feld, false);
      // expect(user.customFelder).toHaveProperty(feld.id.toString());
    });
  
    test("addCounter()", () => {
      // const user = createUser(0);
      // const counter = customCounterArr[0];
      // user.setCustomFelder([customFelderArr]);
      // user.addCounter(counter);
      // expect(user.customFelder[counter.dienstplan_custom_feld_id].counter).toHaveProperty(counter.id.toString());
    });
  
    test("removeFeld()", () => {
      // const user = createUser(1);
      // expect(user.customFelder).not.toEqual({});
      // const feld = customFelderArr[0];
      // const id = feld.id.toString();
      // expect(user.customFelder).toHaveProperty(id);
      // user.removeFeld(feld);
      // expect(user.customFelder).not.toHaveProperty(id);
    });
  
    test("removeFelder() with Ids-Array", () => {
      // const user = createUser(1);
      // expect(user.customFelder).not.toEqual({});
      // user.removeFelder(customFelderArr.map(feld => feld.id));
      // expect(user.customFelder).toEqual({});
    });
  
    test("removeFelder() with Felder-Array", () => {
      // const user = createUser(1);
      // expect(user.customFelder).not.toEqual({});
      // user.removeFelder(customFelderArr);
      // expect(user.customFelder).toEqual({});
    });
  })
});
