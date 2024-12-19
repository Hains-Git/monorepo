import Basic from "../../models/basic";
import { 
  checkType, 
  isObject, 
  isArray, 
  isDate, 
  isFunction, 
  isNumber 
} from "../../tools/types";

describe("tools types", () => {
  describe("checkTypye", () => {
    test("checkType(string) = String", () => {
      expect(checkType("string")).toBe("String");
    });
    test("checkType(Integer) = Number", () => {
      expect(checkType(10)).toBe("Number");
    });
    test("checkType(Float) = Number", () => {
      expect(checkType(10.0)).toBe("Number");
    });
    test("checkType(Object) = Object", () => {
      expect(checkType({1: "test"})).toBe("Object");
    });
    test("checkType(Array) = Array", () => {
      expect(checkType([1,2])).toBe("Array");
    });
    test("checkType(Array-Funktion) = Function", () => {
      expect(checkType(() => {})).toBe("Function");
    });
    test("checkType(Funktion) = Function", () => {
      expect(checkType(function(){})).toBe("Function");
    });
    test("checkType(Basic) = Object", () => {
      expect(checkType(new Basic)).toBe("Object");
    });
    test("checkType(undefined) = Undefined", () => {
      expect(checkType(undefined)).toBe("Undefined");
    });
    test("checkType(null) = Null", () => {
      expect(checkType(null)).toBe("Null");
    });
    test("checkType(Boolean) = Boolean", () => {
      expect(checkType(true)).toBe("Boolean");
    });
  }); 

  describe("isObject", () => {
    test("isObject(Object) = true", () => {
      expect(isObject({})).toBe(true);
    });
    test("isObject(Array) = false", () => {
      expect(isObject([])).toBe(false);
    });
    test("isObject(String) = false", () => {
      expect(isObject("")).toBe(false);
    });
    test("isObject(Number) = false", () => {
      expect(isObject(10)).toBe(false);
    });
    test("isObject(Boolean) = false", () => {
      expect(isObject(true)).toBe(false);
    });
    test("isObject(Function) = false", () => {
      expect(isObject(() => {})).toBe(false);
    });
    test("isObject(Basic) = true", () => {
      expect(isObject(new Basic)).toBe(true);
    });
  });

  describe("isDate", () => {
    test("isDate(Date) = true", () => {
      expect(isDate(new Date())).toBe(true);
    });
    test("isDate(String) = false", () => {
      expect(isDate("")).toBe(false);
    });
    test("isDate(Number) = false", () => {
      expect(isDate(10)).toBe(false);
    });
    test("isDate(Boolean) = false", () => {
      expect(isDate(true)).toBe(false);
    });
    test("isDate(Function) = false", () => {
      expect(isDate(() => {})).toBe(false);
    });
    test("isDate(Basic) = false", () => {
      expect(isDate(new Basic)).toBe(false);
    });
  });

  describe("isFunction", () => {
    test("isFunction(Function) = true", () => {
      expect(isFunction(function(){})).toBe(true);
    });
    test("isFunction(Array-Function) = true", () => {
      expect(isFunction(() => {})).toBe(true);
    });
    test("isFunction(String) = false", () => {
      expect(isFunction("")).toBe(false);
    });
    test("isFunction(Number) = false", () => {
      expect(isFunction(10)).toBe(false);
    });
    test("isFunction(Boolean) = false", () => {
      expect(isFunction(true)).toBe(false);
    });
    test("isFunction(Date) = false", () => {
      expect(isFunction(new Date())).toBe(false);
    });
    test("isFunction(Basic) = false", () => {
      expect(isFunction(new Basic)).toBe(false);
    });
  });

  describe("isArray", () => {
    test("isArray(Array) = true", () => {
      expect(isArray([])).toBe(true);
    });
    test("isArray(String) = false", () => {
      expect(isArray("")).toBe(false);
    });
    test("isArray(Number) = false", () => {
      expect(isArray(10)).toBe(false);
    });
    test("isArray(Boolean) = false", () => {
      expect(isArray(true)).toBe(false);
    });
    test("isArray(Date) = false", () => {
      expect(isArray(new Date())).toBe(false);
    });
    test("isArray(Function) = false", () => {
      expect(isArray(() => {})).toBe(false);
    });
    test("isArray(Basic) = false", () => {
      expect(isArray(new Basic)).toBe(false);
    });
  });

  describe("isNumber", () => {
    test("isNumber(Number) = true", () => {
      expect(isNumber(10)).toBe(true);
    });
    test("isNumber(Float) = true", () => {
      expect(isNumber(10.0)).toBe(true);
    });
    test("isNumber(Integer-String) = true", () => {
      expect(isNumber("10")).toBe(true);
    });
    test("isNumber(Float-String) = true", () => {
      expect(isNumber("10.0")).toBe(true);
    });
    test("isNumber(String) = false", () => {
      expect(isNumber("")).toBe(false);
    });
    test("isNumber(Boolean) = false", () => {
      expect(isNumber(true)).toBe(false);
    });
    test("isNumber(Date) = false", () => {
      expect(isNumber(new Date())).toBe(false);
    });
    test("isNumber(Function) = false", () => {
      expect(isNumber(() => {})).toBe(false);
    });
    test("isNumber(Basic) = false", () => {
      expect(isNumber(new Basic)).toBe(false);
    });
  });
});