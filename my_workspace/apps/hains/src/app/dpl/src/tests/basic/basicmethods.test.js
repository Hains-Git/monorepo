import Basic from "../../models/basic";
import BasicMethods from "../../models/basic-helper/basicmethods";
import DataGetter from "../../models/basic-helper/datagetter";
import Page from "../../models/basic-helper/page";

const getBasic = () => {
  const basic = new Basic();
  test("Basic is Instance of BasicMethods", () => {
    expect(basic).toBeInstanceOf(BasicMethods);
  });

  return basic;
}

describe("Whitebox testing", () => {
  describe("BasicMethods Instances", () => {
    test("BasicMethods is Instance (BasicMethods, Page, DataGetter)", () => {
      const b = new BasicMethods();
      expect(b).toBeInstanceOf(BasicMethods);
      expect(b).toBeInstanceOf(Page);
      expect(b).toBeInstanceOf(DataGetter);
    });  
  });
  
  describe("BasicMethods defines Methods", () => {
    const b = new BasicMethods();
    const functions = [
      "_throwError",
      "_whoAmI",
      "_checkType",
      "_isArray",
      "_isObject",
      "_isArrayOrObject",
      "_isFunction",
      "_hasPropsArray",
      "_hasProperty",
      "_showProps",
      "_getIndex",
      "_getByIndex",
      "_dateZahl",
      "_getIdsObject",
      "_each",
      "_includes",
      "_entries",
      "_set",
      "_setState",
      "_pushToRegister",
      "_pullFromRegister",
      "_preventExtension",
      "_freeze",
      "_capitalFirstLetter",
      "_update",
      "_push",
      "_pull",
      "push",
      "pull",
      "update",
      "_formatTime"
    ];
  
    functions.forEach(key => {
      test(`defines ${  key}`, () => {
        expect(typeof b[key]).toBe("function");
      })
    });
  });
  
  describe("BasicMethods Methods _checkType, _isArray, _isObject, _isArrayOrObject, _isFunction", () => {
    const b = new BasicMethods();
    const params = {
      object: {},
      string: "test",
      number: 123,
      dezinumber: 12.2,
      function(){},
      arrayFunction: () => {},
      undefined,
      null: null,
      true: true,
      false: false,
      classObj: b,
      array: []
    };
  
    for(const key in params){
      test(`_checkType with ${  key}`, () => {
        let exp = "Object";
        switch(key){
          case "string":
            exp = "String";
            break;
          case "number":
          case "dezinumber":
            exp = "Number";
            break;
          case "function":
          case "arrayFunction":
            exp = "Function";
            break;
          case "array":
            exp = "Array";
            break;
          case "undefined":
            exp = "Undefined";
            break;
          case "null":
            exp = "Null";
            break;
          case "true":
          case "false":
            exp = "Boolean";
            break;  
        }
        expect(b._checkType(params[key])).toBe(exp);
      });
    }
  
    const trueKeysArray = ["array"];
    for(const key in params){
      test(`_isArray with ${  key}`, () => {
        const exp = !!trueKeysArray.includes(key);
        expect(b._isArray(params[key])).toBe(exp);
      });
    }
  
    const trueKeysObject = ["object", "classObj"];
    for(const key in params){
      test(`_isObject with ${  key}`, () => {
        const exp = !!trueKeysObject.includes(key);
        expect(b._isObject(params[key])).toBe(exp);
      });
    }
  
    const trueKeysArrayOrObject = ["object", "classObj", "array"];
    for(const key in params){
      test(`_isArrayOrObject with ${  key}`, () => {
        const exp = !!trueKeysArrayOrObject.includes(key);
        expect(b._isArrayOrObject(params[key])).toBe(exp);
      });
    }
  
    const trueKeysFunction = ["function", "arrayFunction"];
    for(const key in params){
      test(`_isFunction with ${  key}`, () => {
        const exp = !!trueKeysFunction.includes(key);
        expect(b._isFunction(params[key])).toBe(exp);
      });
    }
  });
  
  describe("BasicMethods _set", () => {
    const basic = getBasic();
  
    test("Pushes Propertie in this._properties_, and provides Property", () => {
      const key = "Test";
      const value = 10;
      basic._set(key, value, true);
      expect(basic._properties_).toContain(key);
      expect(basic).toHaveProperty(key, value);
      expect(basic._properties_).toHaveLength(1);
  
      const key2 = "Test2";
      const value2 = 16;
      basic._set(key2, value2, false);
      expect(basic._properties_).not.toContain(key2);
      expect(basic).toHaveProperty(key2, value2);
      expect(basic._properties_).toHaveLength(1);
      basic[key2] = 30;
      expect(basic[key2]).toBe(value2);
    })
  });
  
  describe("BasicMethods _whoAmI, _length, _hasPropsArray, _hasProperty, _getIndex, _getByIndex, _showProps", () => {
    const b = new BasicMethods();
    test("_whoAmI", () => {
      b._whoAmI();
      expect(console.log).toHaveBeenCalledWith("I am ", b);
    });
  
    const basic = getBasic();
    test("_hasPropsArray -> this._properties_ existiert und ist ein Array", () => {
      expect(basic._hasPropsArray()).toBe(true);
    });
  
    const l = 10;
    test("Getter _length -> Anzahl der iterablen Properties, _hasProperty -> Existiert ein bestimmter Key als Property?", () => {
      expect(basic._length).toBe(0);
      for(let i = 0; i < l; i++){
        const key = `prop${  i}`;
        expect(basic._hasProperty(key)).toBe(false);
        basic._set(key, i*i);
      }
      expect(basic._length).toBe(l);
  
      for(let i = 0; i < l; i++){
        const key = `prop${  i}`;
        expect(basic._hasProperty(key)).toBe(true);
      }
    });
  
    test("_getIndex, Gibt den Index des Keys aus this._properties_ aus", () => {
      for(let i = 0; i < l; i++){
        const key = `prop${  i}`;
        expect(basic._getIndex(key)).toBe(i);
      }
    });
  
    test("_getByIndex, Gibt den Value für einen bestimmten Index aus this._properties_ aus", () => {
      for(let i = 0; i < l; i++){
        expect(basic._getByIndex(i)).toBe(i*i);
      }
    });
  
    test("_showProps, Zeigt alle iterablen Properies in der Console", () => {
      basic._showProps();
      expect(console.log).toHaveBeenCalledWith("Props durch die iteriert werden kann: ", basic._properties_);
    });
  });
  
  describe("BasicMethods _preventExtension, _freeze, _capitalFirstLetter, _formatTime, _dateZahl", () => {
    const b = new BasicMethods();
    test("Call _preventExtension", () => {
      b._preventExtension();
      expect(Object.isExtensible(b)).toBe(false);
    });

    test("Call _freeze", () => {
      b._freeze();
      expect(Object.isFrozen(b)).toBe(true);
    });

    test("Call _capitalFirstLetter", () => {
      expect(b._capitalFirstLetter()).toBe("");
      expect(b._capitalFirstLetter("")).toBe("");
      expect(b._capitalFirstLetter(2)).toBe("");
      const obj = {};
      expect(b._capitalFirstLetter(obj)).toBe("");
      expect(b._capitalFirstLetter("aaa")).toBe("Aaa");
    });

    test("Call _dateZahl", () => {
      expect(b._dateZahl()).toBe(0);
      expect(b._dateZahl(23)).toBe(0);
      expect(b._dateZahl([])).toBe(0);
      expect(b._dateZahl("")).toBe(0);
      expect(b._dateZahl("2022-02-054")).toBe(0);
      expect(b._dateZahl("2022-02-05")).toBe(20220205);
    });

    test("Call _formatTime", () => {
      expect(b._formatTime()).toEqual({});
      expect(b._formatTime(23)).toEqual({});
      expect(b._formatTime([])).toEqual({});
      expect(b._formatTime("")).toEqual({});
      expect(b._formatTime("2022-02-05")).toEqual({});
      expect(b._formatTime("2022-02-05T12:00:00")).toEqual({});
      const localDate = new Date("2022-07-12").toLocaleDateString();
      expect(b._formatTime("2022-07-12T12:00:00.000Z")).toEqual({
        local: localDate, 
        fullLocal: `${localDate} 12:00`,
        time: "12:00 Uhr", 
        date: "2022-07-12", 
        timenr: 120000, 
        datenr: 20220712,
        fullnr: 20220712120000,
        fullStr: "2022-07-12T12:00:00.000Z"
      });
    });
  }); 
  
  const checkForUnvalidValues = (fkt, register, expectedObj = {}) => {
    // Es wird nichts im Register angefügt und eine Console-Ausgabe ausgeführt
    fkt();
    fkt(12);
    fkt("");
    fkt({});
    fkt([]);
    fkt(null);
    fkt(undefined);
    fkt(false);
    fkt(true);
    expect(console.log).toHaveBeenCalled();
    expect(register).toEqual(expectedObj);
  }
  
  describe("BasicMethods _setState, _pushToRegister, _pullFromRegister", () => {
    const basic = getBasic();
    const register = basic._components_register_;
    const defaultId = basic._default_id_;
    const expectedObj = {};
    const fkt = jest.fn((v, k) => true);
    const fkt1 = jest.fn((v, k) => true);
    const fkt2 = jest.fn((v, k) => true);

    test("Call _pushToRegister", () => {
      checkForUnvalidValues(basic._pushToRegister, register, expectedObj);

      basic._pushToRegister(fkt);
      expectedObj[defaultId] = [fkt];
      expect(register).toEqual(expectedObj);
      // Keine doppelten Einträge
      basic._pushToRegister(fkt);
      expect(register).toEqual(expectedObj);

      // Default_Id, wenn kein String als Parameter übergeben wird
      basic._pushToRegister(fkt1, 20);
      expectedObj[defaultId] = [fkt, fkt1];
      expect(register).toEqual(expectedObj);
      
      basic._pushToRegister(fkt2, () => {});
      expectedObj[defaultId] = [fkt, fkt1, fkt2];
      expect(register).toEqual(expectedObj);

      // Anlegen eines neuen Attributs, wenn String übergeben wird
      basic._pushToRegister(fkt, "");
      expectedObj[defaultId] = [fkt, fkt1, fkt2];
      basic._pushToRegister(fkt, "ab");
      expectedObj.ab = [fkt];
      expect(register).toEqual(expectedObj);
    });

    test("Call _pullFromRegister", () => {
      checkForUnvalidValues(basic._pullFromRegister, register, expectedObj);
      basic._pullFromRegister(() => {});
      expect(register).toEqual(expectedObj);
      basic._pullFromRegister(fkt);
      expectedObj[defaultId] = [fkt1, fkt2];
      expect(register).toEqual(expectedObj);
      basic._pullFromRegister(fkt, "ab");
      delete expectedObj.ab;
      expect(register).toEqual(expectedObj);
    });

    test("Call _setState", () => {
      basic._setState();
      expect(fkt1).toHaveBeenCalledTimes(1);
      expect(fkt2).toHaveBeenCalledTimes(1);
      basic._setState(1);
      expect(fkt1).toHaveBeenCalledTimes(2);
      expect(fkt2).toHaveBeenCalledTimes(2);
      // basic._setState(2, "test");
      // basic._setState(3, "ab");
    });
  });

  describe("BasicMethods _update, _push, _pull", () => {
    const basic = getBasic();
    beforeAll(() => {
      basic._pushToRegister = jest.fn();
      basic._pullFromRegister = jest.fn();
      basic._setState = jest.fn();
    });

    afterAll(() => {
      basic._pushToRegister.mockRestore();
      basic._pullFromRegister.mockRestore();
      basic._setState.mockRestore();
    });

    const fkt = () => {};
    const key = "update";
    test("Call _push", () => {
      basic._push();
      expect(basic._pushToRegister).not.toHaveBeenCalled();
      basic._push(fkt);
      expect(basic._pushToRegister).toHaveBeenCalledWith(fkt, key);
    });

    test("Call _pull", () => {
      basic._pull();
      expect(basic._pullFromRegister).not.toHaveBeenCalled();
      basic._pull(fkt);
      expect(basic._pullFromRegister).toHaveBeenCalledWith(fkt, key);
    });

    test("Call _update", () => {
      basic._update();
      expect(basic._setState).toHaveBeenCalledWith({}, key);
    });
  });

  describe("BasicMethods push, pull, update", () => {
    const basic = getBasic();
    beforeAll(() => {
      basic._pushToRegister = jest.fn();
      basic._pullFromRegister = jest.fn();
      basic._setState = jest.fn();
    });

    afterAll(() => {
      basic._pushToRegister.mockRestore();
      basic._pullFromRegister.mockRestore();
      basic._setState.mockRestore();
    });

    const fkt = () => {};
    const key = "test";
    test("Call push", () => {
      basic.push();
      expect(basic._pushToRegister).not.toHaveBeenCalled();
      basic.push(key, fkt);
      expect(basic._pushToRegister).toHaveBeenCalledWith(fkt, key);
    });

    test("Call pull", () => {
      basic.pull();
      expect(basic._pullFromRegister).not.toHaveBeenCalled();
      basic.pull(key, fkt);
      expect(basic._pullFromRegister).toHaveBeenCalledWith(fkt, key);
    });

    // test("Call update", () => {
    //   basic.update();
    //   expect(basic._setState).not.toHaveBeenCalled();
    //   basic.update(key);
    //   expect(basic._setState).toHaveBeenCalledWith({}, key);
    // });
  });

  describe("BasicMethods _throwError, _getIdsObject, _each, _includes, _entries", () => { 
    const basic = getBasic();
    const props = {a: 1, b: 3, c: 10, d: 23, e: 2, id: "a", testObj: {
      a: {}, b: 10
    }, f: 3, g: "b", h: "c"};
    const arr = [1, 3, 10, 23, 2, "a", props.testObj, 3, "b", "c"];
    const keys = ["a", "b", "c", "d", "e", "id", "testObj", "f", "g", "h"];
    const entries = [
      {key: "a", value: props.a},
      {key: "b", value: props.b},
      {key: "c", value: props.c},
      {key: "d", value: props.d},
      {key: "e", value: props.e},
      {key: "id", value: props.id},
      {key: "testObj", value: props.testObj},
      {key: "f", value: props.f},
      {key: "g", value: props.g},
      {key: "h", value: props.h}
    ];

    beforeAll(() => {
      for(const key in props){
        basic._set(key, props[key], true);
      }
    });
    
    describe("_throwError()", () => {
      test("_throwError()", () => {
        basic._throwError();
      });
  
      test("_throwError(2, a, 20)", () => {
        basic._throwError(2, "a", 20);
      });
  
      test("_throwError(100, false, [30])", () => {
        basic._throwError(100, false, [30]);
      });
    })
    
    test("_getIdsObject()", () => {
      expect(basic._getIdsObject("testObj", "id")).toBe(props.testObj.a);
      expect(basic._getIdsObject("testObj", "c")).toBe(false);
      expect(basic._getIdsObject("hallo", "id")).toBe(false);
    })

    test("_each()", () => {
      // Abbrechen wenn Bedingung erfüllt ist
      expect(basic._each((value, key) => key === "c", false)).toEqual({arr: arr.slice(0, 3), obj: {
        a: props.a,
        b: props.b,
        c: props.c
      }});
      // Alle Werte als Array und als Object zurückgeben
      expect(basic._each(false, false)).toEqual({arr, obj: props});
      // Filtern nach Zahlen
      expect(basic._each(false, (value) => typeof value === "number")).toEqual({
        arr: arr.slice(0, 5).concat([arr[7]]),
        obj: {
          a: props.a,
          b: props.b,
          c: props.c,
          d: props.d,
          e: props.e,
          f: props.f
        }
      });
      // Abbrechen bei g und Filter nach Strings
      expect(basic._each((value, key) => key === "g", (value) => typeof value === "string")).toEqual({
        arr: [arr[5]].concat([arr[8]]),
        obj: {
          id: props.id,
          g: props.g
        }
      });
    })

    test("_includes()", () => {
      // Strict equality
      expect(basic._includes(props.a, false)).toEqual({includes: true, matches: [
        {key: "a", value: props.a}
      ]});
      // Strict equality fail
      expect(basic._includes(props.a.toString(), false)).toEqual({includes: false, matches: []});
      // Multiple values
      expect(basic._includes(props.b, false)).toEqual({includes: true, matches: [
        {key: "b", value: props.b},
        {key: "f", value: props.f}
      ]});
      // Multiple values return first match
      expect(basic._includes(props.b, true)).toEqual({includes: true, matches: [
        {key: "b", value: props.b}
      ]});
    })

    test("_entries()", () => {
      // Key-Value Pairs
      expect(basic._entries()).toEqual(entries);
      // Nur Keys
      expect(basic._entries("keys")).toEqual(keys);
      // Nur Values
      expect(basic._entries("values")).toEqual(arr);
    })
  });
})