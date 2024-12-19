import Antragsstatus from "../../models/apimodels/antragsstatus";
import Basic from "../../models/basic";

const antragsstatuse = {
  "1": {
      "id": 1,
      "name": "Offen",
      "color": "#ff0000"
    }
}

describe("Antragsstatus", () => {
  test("Instance of Antragsstatus and Basic", () => {
    const a = new Antragsstatus(antragsstatuse[1]);
    expect(a).toBeInstanceOf(Antragsstatus);
    expect(a).toBeInstanceOf(Basic);
  })
});