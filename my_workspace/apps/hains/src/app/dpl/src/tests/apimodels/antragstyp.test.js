import Antragstyp from "../../models/apimodels/antragstyp";
import Basic from "../../models/basic";

const antragstypen = {
  "1": {
      "id": 1,
      "name": "Urlaub",
      "po_dienst_id": 1
  }
};

describe("Antragstyp", () => {
  test("Instance of Antragstyp and Basic", () => {
    const a = new Antragstyp(antragstypen[1]);
    expect(a).toBeInstanceOf(Antragstyp);
    expect(a).toBeInstanceOf(Basic);
  })
});