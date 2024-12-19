import DienstplanPfad from "../../models/apimodels/dienstplanpfad";
import Basic from "../../models/basic";

const dienstplanpfade = {
  "1": {
    id: 1,
    path: "test"
  }
}

describe("Whitebox testing", () => {
  describe("Instances", () => {
    test("Dienstverteilung is instanceof DienstplanPfad and Basic", () => {
      const d = new DienstplanPfad(dienstplanpfade[1]);
      expect(d).toBeInstanceOf(DienstplanPfad);
      expect(d).toBeInstanceOf(Basic);
    });
  });

  describe("DienstplanPfad defines Propertys", () => {
    const data = dienstplanpfade[1];
    const properties = [
      {key: "id", expectedValue: data.id},
      {key: "path", expectedValue: data.path}
    ];

    const d = new DienstplanPfad(data);
    properties.forEach(({key, expectedValue}) => {
      test("sets "  + key, () => {
        expect(d[key]).toBe(expectedValue);
      });
    });
  });
});