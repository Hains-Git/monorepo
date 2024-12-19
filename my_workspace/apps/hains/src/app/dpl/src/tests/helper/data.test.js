import Basic from "../../models/basic";
import Data from "../../models/helper/data";

describe("Whitebox testing", () => {
  describe("Instances", () => {
    test("Data is instanceof Data and Basic", () => {
      const d = new Data();
      expect(d).toBeInstanceOf(Data);
      expect(d).toBeInstanceOf(Basic);
    });
  });

  describe("Methods", () => {
    describe("initObjOrArray()", () => {
      const d = new Data();
      d._set("CLASSES", {
        object: (obj) => new Basic(obj),
        array: (obj) => new Basic(obj),
        arrayWithArray: (arr) => arr.map(el => new Basic(el)),
        objWithArray: (arr) => arr.map(el => new Basic(el))
      });
      // Arrays und Object auf der ersten Ebene werden zu Basic
      // Objecte auf der zweiten Ebene werden zu Basic
      // Arrays auf der zweiten Ebene bleiben Arrays
      // Objecte innerhalb Arrays der zweiten Ebene werden zu Basic
      const testObject = {
        object: {1: {}, 2:{}},
        array: [{}, {}],
        arrayWithArray: [
          [{}, {}], 
          [{}]
        ],
        objWithArray: {
          1: [{}, {}], 
          2: [{}]
        },
      };

      test("initObjOrArray(object)", () => {
        d.initObjOrArray(testObject.object, "object");
        console.log(d.object)
        expect(d.object).toBeInstanceOf(Basic);
        expect(d.object[1]).toBeInstanceOf(Basic);
        expect(d.object[2]).toBeInstanceOf(Basic);
        expect(d.object[3]).toBeUndefined();
      });

      test("initObjOrArray(array)", () => {
        d.initObjOrArray(testObject.array, "array");
        console.log(d.array)
        expect(d.array).toBeInstanceOf(Basic);
        expect(d.array[0]).toBeInstanceOf(Basic);
        expect(d.array[1]).toBeInstanceOf(Basic);
        expect(d.array[2]).toBeUndefined();
      });

      test("initObjOrArray(arrayWithArray)", () => {
        d.initObjOrArray(testObject.arrayWithArray, "arrayWithArray");
        console.log(d.arrayWithArray)
        expect(d.arrayWithArray).toBeInstanceOf(Basic);
        expect(d.arrayWithArray[0]).toHaveLength(2);
        d.arrayWithArray[0].forEach(el => expect(el).toBeInstanceOf(Basic));
        expect(d.arrayWithArray[1]).toHaveLength(1);
        d.arrayWithArray[1].forEach(el => expect(el).toBeInstanceOf(Basic));
        expect(d.arrayWithArray[2]).toBeUndefined();
      });

      test("initObjOrArray(objWithArray)", () => {
        d.initObjOrArray(testObject.objWithArray, "objWithArray");
        console.log(d.objWithArray)
        expect(d.objWithArray).toBeInstanceOf(Basic);
        expect(d.objWithArray[1]).toHaveLength(2);
        d.objWithArray[1].forEach(el => expect(el).toBeInstanceOf(Basic));
        expect(d.objWithArray[2]).toHaveLength(1);
        d.objWithArray[2].forEach(el => expect(el).toBeInstanceOf(Basic));
        expect(d.objWithArray[3]).toBeUndefined();
      });
    });
  });
})